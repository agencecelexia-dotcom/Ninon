import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SOLEIL — Planifie ton voyage parfait",
  description:
    "Trouve, planifie et reserve ton voyage parfait avec l'IA. Destinations, vols, hotels, restos, activites — tout sur mesure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
