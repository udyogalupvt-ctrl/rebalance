import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LegalPage } from "@/pages/Legal";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    title: "Medical Disclaimer | GoRebalance",
    meta: [
      {
        name: "description",
        content:
          "Nutrition guidance from GoRebalance supports medical care and does not replace diagnosis or treatment from a physician.",
      },
    ],
  }),
  component: Disclaimer,
});

function Disclaimer() {
  return (
    <>
      <Header overHero={false} />
      <main>
        <LegalPage
          eyebrow="Disclaimer"
          title="Nutrition care, not medical treatment."
          intro="What this practice does and does not do, stated plainly."
          updated="6 September 2026"
          sections={[
            {
              heading: "This is not a diagnosis",
              body: [
                "Nutrition and lifestyle guidance provided by GoRebalance is intended to support, not replace, medical care. It is not a diagnosis and it is not a prescription.",
                "Always consult your physician about medical conditions, medications, and before making changes to prescribed treatment.",
              ],
            },
            {
              heading: "Do not stop prescribed medication",
              body: [
                "Nothing in a nutrition plan is a reason to stop or change a medication your doctor has prescribed. If a plan seems to conflict with your treatment, speak to your doctor and tell the practice.",
              ],
            },
            {
              heading: "If you are unwell, seek care",
              body: [
                "This site is not for emergencies. If you have severe pain, bleeding, difficulty breathing, chest pain, sudden weight loss, or any symptom that worries you, contact a doctor or emergency services rather than waiting for a consultation.",
              ],
            },
            {
              heading: "Results vary",
              body: [
                "Client stories and timelines shown on this site describe individual experiences. They are not a promise of the same outcome for you: results depend on your history, adherence, and factors outside anyone's control.",
              ],
            },
            {
              heading: "Particular care",
              body: [
                "If you are pregnant or breastfeeding, managing a chronic condition such as diabetes or kidney disease, or caring for a child, tell the practice before starting so the plan can account for it — and keep your treating doctor involved.",
              ],
            },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
