import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LegalPage } from "@/pages/Legal";

export default function Terms() {
  return (
    <>
      <Header overHero={false} />
      <main>
        <LegalPage
          eyebrow="Terms"
          title="How working together works."
          intro="The terms that apply when you submit an assessment or book a consultation."
          updated="6 September 2026"
          sections={[
            {
              heading: "What the service is",
              body: [
                "GoRebalance provides clinical nutrition consultations and personalised nutrition programs, delivered in person in Kakinada or online.",
                "Submitting an assessment is a request for a consultation. It is confirmed once the practice has reviewed your submission and verified your payment, and has contacted you to schedule.",
              ],
            },
            {
              heading: "Accurate information",
              body: [
                "The plan you receive is built from what you tell us. Please give accurate information about your medical history, medications and symptoms — an incomplete history can make a nutrition plan unsuitable for you.",
                "Tell the practice promptly if your medication or diagnosis changes during a program.",
              ],
            },
            {
              heading: "Payments",
              body: [
                "The consultation fee is payable in advance and is confirmed by uploading a payment screenshot with your assessment.",
                "If a payment cannot be matched to a record, the practice will contact you. Your assessment is not lost while that is resolved.",
              ],
            },
            {
              heading: "Rescheduling and refunds",
              body: [
                "If you need to reschedule, contact the practice as early as you can and an alternative time will be arranged where possible.",
                "Refund arrangements are agreed directly with the practice. Contact the details below.",
              ],
            },
            {
              heading: "Your plan is yours",
              body: [
                "Plans and materials prepared for you are for your personal use. Please do not redistribute or resell them.",
              ],
            },
            {
              heading: "Limits",
              body: [
                "Nutrition guidance supports medical care; it does not replace it. See the disclaimer for what that means in practice.",
                "Outcomes vary between individuals. Nothing on this site is a guarantee of a specific result.",
              ],
            },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
