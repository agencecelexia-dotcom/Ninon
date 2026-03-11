import Anthropic from "@anthropic-ai/sdk";

type Tool = Anthropic.Tool;

export const MCP_TOOLS: Tool[] = [
  {
    name: "search_flights",
    description:
      "Recherche les 5 meilleurs vols depuis/vers une destination. Retourne prix, durée, compagnie, escales, badge (moins cher / plus rapide / meilleur rapport).",
    input_schema: {
      type: "object" as const,
      properties: {
        origin: {
          type: "string",
          description: "Code IATA de l'aéroport de départ (ex: CDG, ORY)",
        },
        destination: {
          type: "string",
          description: "Code IATA ou nom de la ville de destination",
        },
        departure_date: {
          type: "string",
          description: "Date de départ au format YYYY-MM-DD",
        },
        return_date: {
          type: "string",
          description: "Date de retour au format YYYY-MM-DD",
        },
        max_price: {
          type: "number",
          description: "Prix maximum en EUR",
        },
        passengers: {
          type: "number",
          description: "Nombre de passagers",
        },
      },
      required: ["origin", "destination", "departure_date", "return_date"],
    },
  },
  {
    name: "search_hotels",
    description:
      "Recherche les 5 meilleurs hôtels avec prix/nuit, note, distance plage, distance centre, photos, lien de réservation.",
    input_schema: {
      type: "object" as const,
      properties: {
        destination: {
          type: "string",
          description: "Nom de la ville de destination",
        },
        checkin_date: {
          type: "string",
          description: "Date de check-in au format YYYY-MM-DD",
        },
        checkout_date: {
          type: "string",
          description: "Date de check-out au format YYYY-MM-DD",
        },
        max_price_per_night: {
          type: "number",
          description: "Prix maximum par nuit en EUR",
        },
        guests: {
          type: "number",
          description: "Nombre de personnes",
        },
      },
      required: ["destination", "checkin_date", "checkout_date"],
    },
  },
  {
    name: "get_activities",
    description:
      "Retourne les activités disponibles sur la destination pour les dates données. Utilisé pour alimenter l'itinéraire jour par jour.",
    input_schema: {
      type: "object" as const,
      properties: {
        destination: {
          type: "string",
          description: "Nom de la ville",
        },
        date_start: {
          type: "string",
          description: "Date de début au format YYYY-MM-DD",
        },
        date_end: {
          type: "string",
          description: "Date de fin au format YYYY-MM-DD",
        },
        categories: {
          type: "array",
          items: { type: "string" },
          description:
            "Catégories d'activités (culture, plage, gastronomie, aventure, nature)",
        },
      },
      required: ["destination"],
    },
  },
  {
    name: "get_weather",
    description:
      "Prévisions météo pour la période de séjour. Température, ensoleillement, risque de pluie.",
    input_schema: {
      type: "object" as const,
      properties: {
        destination: {
          type: "string",
          description: "Nom de la ville",
        },
        period: {
          type: "string",
          description: "Mois ou période (ex: juin, juillet, été 2026)",
        },
      },
      required: ["destination", "period"],
    },
  },
  {
    name: "convert_currency",
    description:
      "Conversion en temps réel de n'importe quelle devise vers EUR.",
    input_schema: {
      type: "object" as const,
      properties: {
        amount: {
          type: "number",
          description: "Montant à convertir",
        },
        from_currency: {
          type: "string",
          description: "Code devise source (ex: USD, GBP)",
        },
        to_currency: {
          type: "string",
          description: "Code devise cible (ex: EUR)",
        },
      },
      required: ["amount", "from_currency", "to_currency"],
    },
  },
  {
    name: "get_photos",
    description:
      "Retourne 12 photos HD de la destination, catégorisées (plage, architecture, food, vie locale).",
    input_schema: {
      type: "object" as const,
      properties: {
        destination: {
          type: "string",
          description: "Nom de la ville ou destination",
        },
        categories: {
          type: "array",
          items: { type: "string" },
          description: "Catégories de photos souhaitées",
        },
      },
      required: ["destination"],
    },
  },
  {
    name: "get_crowd_score",
    description:
      "Calcule le score d'affluence touristique 0–100. < 40 = off-track (peu touristique).",
    input_schema: {
      type: "object" as const,
      properties: {
        destination: {
          type: "string",
          description: "Nom de la ville",
        },
        period: {
          type: "string",
          description: "Mois ou période de visite",
        },
      },
      required: ["destination"],
    },
  },
  {
    name: "get_tips",
    description:
      "Lit les tips communauté pour une destination. Triés par votes.",
    input_schema: {
      type: "object" as const,
      properties: {
        destination: {
          type: "string",
          description: "Nom de la destination",
        },
        tag: {
          type: "string",
          description:
            "Filtre par tag (bon-plan, piege, cache, transport, food)",
        },
      },
      required: ["destination"],
    },
  },
];
