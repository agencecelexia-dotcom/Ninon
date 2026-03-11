import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";
import { SOLEIL_SYSTEM_PROMPT } from "@/lib/soleil-prompt";
import { MCP_TOOLS } from "@/lib/mcp-tools";
import { handleToolCall } from "@/lib/mcp-handlers";

export const runtime = "nodejs";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60_000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Max 20 requests per minute." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Format messages for Anthropic API
    const formattedMessages = messages.map(
      (m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })
    );

    // Create SSE stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Initial call to Claude with tools
          let currentMessages: MessageParam[] = [...formattedMessages];
          let continueLoop = true;

          while (continueLoop) {
            const response = await anthropic.messages.create({
              model: "claude-sonnet-4-5-20250514",
              max_tokens: 4096,
              system: SOLEIL_SYSTEM_PROMPT,
              messages: currentMessages,
              tools: MCP_TOOLS,
            });

            // Check if Claude wants to use tools
            const toolUseBlocks = response.content.filter(
              (block) => block.type === "tool_use"
            );

            if (toolUseBlocks.length > 0) {
              // Process tool calls
              const toolResults = [];
              for (const toolBlock of toolUseBlocks) {
                if (toolBlock.type === "tool_use") {
                  const result = await handleToolCall(
                    toolBlock.name,
                    toolBlock.input as Record<string, unknown>
                  );
                  toolResults.push({
                    type: "tool_result" as const,
                    tool_use_id: toolBlock.id,
                    content: result,
                  });
                }
              }

              // Add assistant response and tool results to messages
              currentMessages = [
                ...currentMessages,
                { role: "assistant" as const, content: response.content as MessageParam["content"] },
                { role: "user" as const, content: toolResults as MessageParam["content"] },
              ] as MessageParam[];

              // Stream any text blocks that came with tool use
              for (const block of response.content) {
                if (block.type === "text" && block.text) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ type: "text", text: block.text })}\n\n`)
                  );
                }
              }

              // If stop_reason is "end_turn", we're done
              if (response.stop_reason === "end_turn") {
                continueLoop = false;
              }
              // Otherwise continue the loop for Claude to process tool results
            } else {
              // No tool use — stream the final text response
              for (const block of response.content) {
                if (block.type === "text") {
                  // Send in chunks for streaming effect
                  const text = block.text;
                  const chunkSize = 20;
                  for (let i = 0; i < text.length; i += chunkSize) {
                    const chunk = text.slice(i, i + chunkSize);
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ type: "text", text: chunk })}\n\n`
                      )
                    );
                    // Small delay for streaming effect
                    await new Promise((r) => setTimeout(r, 15));
                  }
                }
              }
              continueLoop = false;
            }
          }

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
          );
          controller.close();
        } catch (error) {
          console.error("[SOLEIL API Error]", error);
          let errMsg = "Unknown error";
          if (error instanceof Anthropic.APIError) {
            errMsg = `API Anthropic: ${error.status} — ${error.message}`;
          } else if (error instanceof Error) {
            errMsg = error.message;
          }
          try {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "error", error: errMsg })}\n\n`
              )
            );
          } catch {
            // Stream already closed
          }
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errMsg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
