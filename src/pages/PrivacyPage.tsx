import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LegalPage } from "@/pages/Legal";

export default function Privacy() {
  return (
    <>
      <Header overHero={false} />
      <main>
        <LegalPage
          eyebrow="Privacy"
          title="What we collect, and why."
          intro="This describes exactly what this website stores about you, where it goes, and how to have it removed."
          updated="11 September 2026"
          sections={[
            {
              heading: "What the assessment collects",
              body: [
                "The assessment form asks for your name, age, gender, phone number, email address, postal address, city, state and pincode, along with your preferred consultation mode.",
                "It also asks for health information: your weight and height, recent weight change, your goals, past medical history, current symptoms, supplement history and current medications, plus a record of what you ate on a recent day.",
                "This is clinical information. It is collected so the practitioner can prepare for your consultation, and for no other purpose.",
              ],
            },
            {
              heading: "Payment screenshots",
              body: [
                "To confirm a consultation you upload a screenshot of your payment. The image is stored with Cloudinary, a media hosting service, and the link to it is kept alongside your assessment.",
                "We do not collect or store card numbers, UPI PINs or bank credentials. The payment happens in your own banking or UPI app; we only ever see the screenshot you choose to upload.",
              ],
            },
            {
              heading: "The contact form",
              body: [
                "The contact form collects your name, phone number, email address, city, the topic you choose and your message. It is used to reply to you.",
              ],
            },
            {
              heading: "Where it is stored, and who can see it",
              body: [
                "Submissions are stored in Google Cloud Firestore. Access to read them is restricted to the practice's admin accounts.",
                "We do not sell your data, and we do not share it with advertisers. It is not used to build a marketing profile.",
              ],
            },
            {
              heading: "Tracking your application",
              body: [
                "If you use the tracking page, it reads a separate minimal record that holds only your first name, the last four digits of your phone number and the status of your application. Your medical history, address and payment screenshot are never readable from that page.",
              ],
            },
            {
              heading: "Cookies and analytics",
              body: [
                "The site stores a small amount of information in your browser to remember your theme choice, keep your progress through the assessment if you leave and come back, and remember your reference number for the tracking page. This stays on your device.",
              ],
            },
            {
              heading: "Your choices",
              body: [
                "You can ask what is held about you, ask for it to be corrected, or ask for it to be deleted. Contact the practice using the details below and we will act on it.",
                "Deleting your assessment removes the record and its tracking entry.",
              ],
            },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
