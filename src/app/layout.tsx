import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SOLEIL — Voyage piloté par Claude",
  description:
    "Trouve, planifie et réserve ton voyage parfait avec l'IA Claude. Destinations off-track, meilleurs prix, itinéraires personnalisés.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="font-nunito antialiased">
        {children}
      </body>
    </html>
  );
}
