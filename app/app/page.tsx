import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AssistantWizard } from "@/components/AssistantWizard";

export const metadata: Metadata = {
  title: "Get your plan — Saans",
  description:
    "Enter your city and household details to get a live, personalized air-quality action plan.",
};

export default function AssistantPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <h1 className="sr-only">Get your personalized air quality plan</h1>
        <AssistantWizard />
      </main>
      <SiteFooter />
    </>
  );
}
