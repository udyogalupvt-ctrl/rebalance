import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { AssessmentProvider, useAssessment } from "@/context/AssessmentContext";
import StepDetails from "@/components/assessment/steps/StepDetails";
import StepPayment from "@/components/assessment/steps/StepPayment";
import StepHealth from "@/components/assessment/steps/StepHealth";
import StepNutrition from "@/components/assessment/steps/StepNutrition";
import StepReview from "@/components/assessment/steps/StepReview";
import StepComplete from "@/components/assessment/steps/StepComplete";
import { AssessmentHeader, AssessmentFooter } from "@/components/assessment/AssessmentChrome";
import { StepProgress } from "@/components/assessment/StepProgress";
import "@/styles/assessment.css";

/**
 * The assessment flow.
 *
 * Lifted out of the route file so the route can import it dynamically: the
 * six steps, their zod schemas, the Cloudinary uploader and a 2,500-line
 * stylesheet are a large payload, and nobody reading the marketing pages
 * needs a byte of it.
 */
export default function AssessmentPage() {
  return (
    <AssessmentProvider>
      <AssessmentShell />
    </AssessmentProvider>
  );
}

function AssessmentShell() {
  const navigate = useNavigate();
  const { currentStep, completedSteps, goToStep } = useAssessment();

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

  // Nothing to track once the form is submitted.
  const showProgress = currentStep !== "complete";

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <AssessmentHeader onSaveExit={handleSaveExit} />

      <main className="flex-grow pb-20 pt-10 md:pt-14">
        {/*
          The stepper sits in the left margin from lg and above the form below
          it. The grid is what makes that possible without the form column
          shifting: the form keeps its own max-width and stays optically
          centred, and the rail occupies space that was previously empty.
        */}
        <div className="container-x">
          <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-8 lg:flex-row lg:items-start lg:gap-14">
            {showProgress && (
              <aside className="w-full shrink-0 lg:sticky lg:top-[calc(var(--header-h)+40px)] lg:w-[232px]">
                <StepProgress
                  currentStep={currentStep}
                  completedSteps={completedSteps}
                  onJump={goToStep}
                />
              </aside>
            )}

            <div className="min-w-0 flex-1">
              <div className="mx-auto w-full" style={{ maxWidth }}>
                {currentStep === "details" && <StepDetails />}
                {currentStep === "payment" && <StepPayment />}
                {currentStep === "health" && <StepHealth />}
                {currentStep === "nutrition" && <StepNutrition />}
                {currentStep === "review" && <StepReview />}
                {currentStep === "complete" && <StepComplete />}
              </div>
            </div>
          </div>
        </div>
      </main>

      <AssessmentFooter />
    </div>
  );
}
