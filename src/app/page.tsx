"use client";

import { Header } from "@/components/soleil/Header";
import { WelcomeStep } from "@/components/soleil/WelcomeStep";
import { DestinationStep } from "@/components/soleil/DestinationStep";
import { FlightStep } from "@/components/soleil/FlightStep";
import { HotelStep } from "@/components/soleil/HotelStep";
import { ActivityStep } from "@/components/soleil/ActivityStep";
import { RestaurantStep } from "@/components/soleil/RestaurantStep";
import { SummaryStep } from "@/components/soleil/SummaryStep";
import { useWizardStore } from "@/stores/wizard-store";

function StepRenderer() {
  const { step } = useWizardStore();

  switch (step) {
    case "welcome":
      return <WelcomeStep />;
    case "destinations":
      return <DestinationStep />;
    case "flights":
      return <FlightStep />;
    case "hotels":
      return <HotelStep />;
    case "activities":
      return <ActivityStep />;
    case "restaurants":
      return <RestaurantStep />;
    case "summary":
      return <SummaryStep />;
    default:
      return <WelcomeStep />;
  }
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      <Header />
      <main className="flex-1">
        <StepRenderer />
      </main>
    </div>
  );
}
