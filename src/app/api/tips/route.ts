import type { Tip } from "@/types/soleil";

// In-memory tips store (would be Vercel Edge Config in production)
const tipsStore: Map<string, Tip[]> = new Map();

// Seed some initial tips
const seedTips: Tip[] = [
  {
    id: "tip-seed-1",
    destination: "seville-espagne",
    text: "Le quartier de Triana est bien plus authentique que le centre touristique. Les tapas bars sur Calle Betis sont incroyables et moitié prix !",
    tag: "bon-plan",
    votes: 47,
    author_id: "anon-seed-1",
    created_at: "2026-02-10T10:00:00Z",
  },
  {
    id: "tip-seed-2",
    destination: "lisbonne-portugal",
    text: "Ne prenez pas le tram 28 aux heures de pointe — c'est blindé de touristes. Allez-y avant 9h ou après 18h.",
    tag: "piege",
    votes: 35,
    author_id: "anon-seed-2",
    created_at: "2026-02-15T14:00:00Z",
  },
  {
    id: "tip-seed-3",
    destination: "lisbonne-portugal",
    text: "La Praia da Ursa est l'une des plus belles plages secrètes d'Europe. 20 min de marche depuis Cabo da Roca.",
    tag: "cache",
    votes: 62,
    author_id: "anon-seed-3",
    created_at: "2026-03-01T09:00:00Z",
  },
];

// Initialize store
seedTips.forEach((tip) => {
  const existing = tipsStore.get(tip.destination) || [];
  existing.push(tip);
  tipsStore.set(tip.destination, existing);
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get("destination");

  if (!destination) {
    // Return all tips
    const allTips: Tip[] = [];
    tipsStore.forEach((tips) => allTips.push(...tips));
    return Response.json({ tips: allTips.sort((a, b) => b.votes - a.votes) });
  }

  const tips = tipsStore.get(destination) || [];
  return Response.json({ tips: tips.sort((a, b) => b.votes - a.votes) });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { destination, text, tag, author_id } = body;

    if (!destination || !text || !tag) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const tip: Tip = {
      id: `tip-${Date.now()}`,
      destination,
      text,
      tag,
      votes: 0,
      author_id: author_id || "anonymous",
      created_at: new Date().toISOString(),
    };

    const existing = tipsStore.get(destination) || [];
    existing.push(tip);
    tipsStore.set(destination, existing);

    return Response.json({ tip });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { tip_id, destination, vote } = await request.json();

    if (!tip_id || !destination) {
      return Response.json({ error: "Missing tip_id or destination" }, { status: 400 });
    }

    const tips = tipsStore.get(destination);
    if (!tips) {
      return Response.json({ error: "Destination not found" }, { status: 404 });
    }

    const tip = tips.find((t) => t.id === tip_id);
    if (!tip) {
      return Response.json({ error: "Tip not found" }, { status: 404 });
    }

    tip.votes += vote === "up" ? 1 : -1;
    return Response.json({ tip });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}
