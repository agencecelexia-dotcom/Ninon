import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages";
import { SOLEIL_SYSTEM_PROMPT, DESTINATION_PROMPT, OPTIONS_PROMPT } from "@/lib/soleil-prompt";
import { MCP_TOOLS } from "@/lib/mcp-tools";
import { handleToolCall } from "@/lib/mcp-handlers";

export const runtime = "nodejs";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60_000;

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

function buildUserPrompt(body: Record<string, unknown>): string {
  const action = body.action as string | undefined;

  if (action === "get_destinations") {
    return DESTINATION_PROMPT(
      (body.vibe as string) || "plage",
      (body.budget as string) || "confort",
      (body.travelers as number) || 2,
      (body.dates as { from: string; to: string })?.from || "2026-06-01",
      (body.dates as { from: string; to: string })?.to || "2026-06-07"
    );
  }

  if (action === "get_options") {
    return OPTIONS_PROMPT(
      (body.destination as string) || "",
      (body.country as string) || "",
      (body.budget as string) || "confort",
      (body.travelers as number) || 2,
      (body.dates as { from: string; to: string })?.from || "2026-06-01",
      (body.dates as { from: string; to: string })?.to || "2026-06-07"
    );
  }

  // Legacy chat mode
  return "";
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
    const body = await request.json();

    // Build messages based on request type
    let formattedMessages: MessageParam[];

    if (body.action) {
      // Step-by-step wizard mode
      const userPrompt = buildUserPrompt(body);
      formattedMessages = [{ role: "user" as const, content: userPrompt }];
    } else if (body.messages && Array.isArray(body.messages)) {
      // Legacy chat mode
      formattedMessages = body.messages.map(
        (m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid request format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create SSE stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let currentMessages: MessageParam[] = [...formattedMessages];
          let continueLoop = true;

          while (continueLoop) {
            const response = await anthropic.messages.create({
              model: "claude-sonnet-4-20250514",
              max_tokens: 4096,
              system: SOLEIL_SYSTEM_PROMPT,
              messages: currentMessages,
              tools: MCP_TOOLS,
            });

            const toolUseBlocks = response.content.filter(
              (block) => block.type === "tool_use"
            );

            if (toolUseBlocks.length > 0) {
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

              currentMessages = [
                ...currentMessages,
                { role: "assistant" as const, content: response.content as MessageParam["content"] },
                { role: "user" as const, content: toolResults as MessageParam["content"] },
              ] as MessageParam[];

              for (const block of response.content) {
                if (block.type === "text" && block.text) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ type: "text", text: block.text })}\n\n`)
                  );
                }
              }

              if (response.stop_reason === "end_turn") {
                continueLoop = false;
              }
            } else {
              for (const block of response.content) {
                if (block.type === "text") {
                  const text = block.text;
                  const chunkSize = 50;
                  for (let i = 0; i < text.length; i += chunkSize) {
                    const chunk = text.slice(i, i + chunkSize);
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ type: "text", text: chunk })}\n\n`
                      )
                    );
                    await new Promise((r) => setTimeout(r, 10));
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
