import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AssessmentProvider, useAssessment } from "@/context/AssessmentContext";
import StepDetails from "@/components/assessment/steps/StepDetails";
import StepPayment from "@/components/assessment/steps/StepPayment";
import StepHealth from "@/components/assessment/steps/StepHealth";
import StepNutrition from "@/components/assessment/steps/StepNutrition";
import StepReview from "@/components/assessment/steps/StepReview";
import StepComplete from "@/components/assessment/steps/StepComplete";
import { AssessmentHeader, AssessmentFooter } from "@/components/assessment/AssessmentChrome";
import "@/styles/assessment.css";

export const Route = createFileRoute("/assessment")({
  head: () => ({
    title: "Gut Health Assessment | GoRebalance",
    meta: [
      {
        name: "description",
        content:
          "A ten-minute root-cause assessment covering your symptoms, history, lifestyle and food habits — reviewed personally by Dt. N. Sai Sowjanya.",
      },
    ],
  }),
  component: AssessmentPage,
});

function AssessmentPage() {
  return (
    <AssessmentProvider>
      <AssessmentShell />
    </AssessmentProvider>
  );
}

function AssessmentShell() {
  const navigate = useNavigate();
  const { currentStep } = useAssessment();

  // Progress is already persisted to localStorage on every change, so
  // "Save & exit" only needs to confirm and leave.
  const handleSaveExit = React.useCallback(() => {
    const ok = window.confirm(
      "Your answers are saved. You can pick up where you left off next time you open the assessment.\n\nLeave the form now?",
    );
    if (ok) navigate({ to: "/" });
  }, [navigate]);

  // The payment step runs a two-column layout and needs more room; the
  // completion screen is a short confirmation.
  const maxWidth = currentStep === "payment" ? 860 : currentStep === "complete" ? 620 : 680;

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <AssessmentHeader onSaveExit={handleSaveExit} />

      <main className="flex-grow pt-12 pb-20 md:pt-16">
        <div className="container-x" style={{ maxWidth }}>
          {currentStep === "details" && <StepDetails />}
          {currentStep === "payment" && <StepPayment />}
          {currentStep === "health" && <StepHealth />}
          {currentStep === "nutrition" && <StepNutrition />}
          {currentStep === "review" && <StepReview />}
          {currentStep === "complete" && <StepComplete />}
        </div>
      </main>

      <AssessmentFooter />
    </div>
  );
}
