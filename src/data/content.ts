import {
  ShieldCheck,
  Microscope,
  Salad,
  HeartPulse,
  Activity,
  Video,
  MapPin,
  Wind,
  Flame,
  Timer,
  BatteryLow,
  Scale,
  Sparkles,
  CalendarHeart,
  Candy,
  ClipboardList,
  Search,
  NotebookPen,
  TrendingUp,
  Gauge,
  MessageCircle,
  RefreshCw,
  FileText,
  Users,
  CheckCircle2,
  MinusCircle,
  Info,
  Phone,
  Building2,
  Navigation,
  CalendarCheck,
  Clock,
  Plus,
  ArrowRight,
  ShieldCheck as Shield,
  FileCheck,
  UserCheck,
  Ban,
  Lock,
  AlertCircle,
  Send,
  Loader2,
  AlertTriangle,
  MapPin as Pin,
} from "lucide-react";

import type { Testimonial } from "@/types/content";

export const brand = {
  name: "Go Rebalance",
  /*
   * The positioning line, NOT a tagline. The brief says the tagline is under
   * review and the design must not be locked around one, so this is the line
   * the practice is sure of and it lives in exactly one place.
   */
  tagline: "Personalised nutrition. Gut health at the core.",
  practitioner: "Sai Sowjanya Nallimpalli",
  credential: "Dietitian | Gut Health Specialist",
  phone: "+91 93904 14536",
  phoneRaw: "919390414536",
  email: "hello@gorebalance.in",
  whatsapp:
    "https://wa.me/919390414536?text=Hi%20GoRebalance%2C%20I%27d%20like%20to%20know%20more%20about%20your%20gut%20health%20programs",
  hours: "Mon – Sat · 10:00 AM – 7:00 PM",
};

export const locations = [
  {
    id: "kakinada",
    city: "Kakinada",
    state: "Andhra Pradesh",
    label: "Kakinada, Andhra Pradesh",
    addressLines: ["Consultation Clinic", "Kakinada, Andhra Pradesh 533001"],
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d122046.22384214589!2d82.16488344933994!3d16.95874284895697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a382841300ad8c7%3A0x11cc714d6423377b!2sKakinada%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1709123456790!5m2!1sen!2sin",
    mapDirectionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Kakinada%2C%20Andhra%20Pradesh",
    hours: ["Mon – Sat · 10:00 AM – 7:00 PM", "Sunday · Closed"],
    note: "Consultation Clinic",
  },
];

/**
 * Social profiles.
 *
 * An empty `href` means "the practice has not given us this account yet", and
 * the footer SKIPS those rather than rendering an icon that goes nowhere.
 * They were previously all `href="#"`, so three of the four buttons in the
 * footer looked live, invited a click, and did nothing.
 *
 * TO ENABLE: paste the profile URL in place of the empty string.
 */
export const socials = [
  { label: "Instagram", href: "", icon: "Instagram" },
  { label: "Facebook", href: "", icon: "Facebook" },
  { label: "Youtube", href: "", icon: "Youtube" },
  { label: "WhatsApp", href: brand.whatsapp, icon: "MessageCircle" },
];

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

/**
 * The site's navigation.
 *
 * Programs and FAQs come from the content brief; Treatments, Gallery and
 * Testimonials were already here and the brief never asked for them to go, so
 * they stay. FAQs is an anchor rather than a page, because the brief puts the
 * questions on the homepage in an accordion and inventing a page to justify a
 * nav entry would be the wrong way round.
 */
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Treatments", href: "/treatments" },
  { label: "Gallery", href: "/gallery" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

export const clinics = [
  {
    id: "kakinada",
    city: "Kakinada",
    state: "ANDHRA PRADESH",
    // NOTE FOR CLIENT: exact street address to be supplied by the client.
    address: "Consultation Clinic — Kakinada, Andhra Pradesh",
    hours: brand.hours,
    // NOTE FOR CLIENT: replace with the exact Google Maps pin for the clinic.
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Kakinada%2C%20Andhra%20Pradesh",
    image: {
      src: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?auto=format&fit=crop&q=80&w=1400",
      alt: "Seasoning a pot of vegetables on the stove in a home kitchen",
    },
  },
];

export const contactMethods = [
  {
    id: "whatsapp",
    type: "WhatsApp",
    label: "FASTEST",
    value: "+91 93904 14536",
    subLine:
      "Message the clinic directly. Typically answered within a few hours during working days.",
    action: "Open WhatsApp",
    href: brand.whatsapp,
    color: "var(--whatsapp)",
    icon: MessageCircle,
  },
  {
    id: "phone",
    type: "Phone",
    label: "CALL",
    value: "+91 93904 14536",
    subLine:
      "Mon – Sat, 10:00 AM – 7:00 PM. If we're mid-consultation, leave a message and we'll return the call.",
    action: "Call now",
    href: `tel:${brand.phoneRaw}`,
    color: "var(--primary)",
    icon: Phone,
  },
  {
    id: "email",
    type: "Email",
    label: "EMAIL",
    value: brand.email,
    subLine:
      "Best for detailed questions, existing reports or anything you'd rather write out at length.",
    action: "Send an email",
    href: `mailto:${brand.email}`,
    color: "var(--accent)",
    icon: FileText,
  },
];

/* ==========================================================================
   THE CONDITION-LED CONTENT

   Restored. These power the treatments, testimonials, gallery and about
   pages, which the brief does not mention and therefore does not remove.

   Two things ARE changed, because the brief's copy boundaries are explicit
   and they override the wording rather than the existence of this content:

     - No "root cause", no "treat" or "cure", no promise that a symptom will
       improve. These are areas the practice SUPPORTS.
     - No invented client results. The testimonials array is empty until the
       practice publishes real, consented stories through the admin panel;
       the pages show an honest empty state until then.
   ========================================================================== */

export const faqs = [
  {
    id: "regular-food",
    question: "Do I have to give up my regular Indian food?",
    answer:
      "No — and you shouldn't have to. Your plan is built around the food already cooked in your kitchen: rice, rotis, dals, curd, sabzis. What usually changes is the timing, the combinations and the portions, not the cuisine. If a plan doesn't fit your family's meals, you won't follow it, and it won't work.",
  },
  {
    id: "how-soon",
    question: "How soon will I see results?",
    answer:
      "Most clients notice changes in digestion, bloating and energy within two to four weeks. Deeper rebalancing — cycles regulating, skin clearing, weight moving steadily — usually takes three to six months, because that's how long it takes the gut and hormones to actually repair rather than just quieten down.",
  },
  {
    id: "online-person",
    question: "Are consultations online or in person?",
    answer:
      "Both. We consult in person at our clinic in Kakinada, Andhra Pradesh, and online with clients across India. Online consultations follow exactly the same protocol — the assessment, the plan and the follow-ups are identical.",
  },
  {
    id: "supplements",
    question: "Will I be put on a long list of supplements?",
    answer:
      "Only where they're genuinely needed, and only for as long as they're needed. Food comes first, always. If a specific deficiency shows up in your history or reports, we address it directly — but the goal is a body that doesn't depend on a shelf of bottles.",
  },
  {
    id: "what-happens",
    question: "What happens after I submit the assessment?",
    answer:
      "Sai Sowjanya Nallimpalli reviews your submission personally — your symptoms, history, medications, lifestyle and nutrition log. You'll be contacted within 24 hours to schedule your consultation, where we talk through your concerns and what your program would involve.",
  },
  {
    id: "privacy",
    question: "Is my health information kept private?",
    answer:
      "Yes. Everything you share in the assessment is confidential and used only to build and adjust your plan. It isn't shared, sold or used for anything else.",
  },
];

/**
 * The programs the practice actually runs.
 *
 * Rewritten from the practice's own list of treatments, with the conditions
 * named the way a clinician would write them (the brief carried a few
 * transcription slips: "Gred" -> GERD, "PMOS" -> PCOS, "Sibo" -> SIBO,
 * "Diabetics" -> Diabetes).
 *
 * Grouped into seven programs rather than listed as ten loose conditions:
 * someone arriving with reflux does not want to choose between "acid reflux"
 * and "GERD", and someone with IBS and irregular stools has one problem, not
 * two. Every condition on the practice's list appears in exactly one
 * program's `conditions` array, so nothing is lost to the grouping.
 */
export const treatments = [
  {
    id: "gut-health",
    slug: "gut-health",
    category: "Gut & Digestion",
    icon: Activity,
    title: "Gut Health & Digestion",
    shortTitle: "Gut Health & Digestion",
    summary:
      "H. pylori, IBS, SIBO and stool irregularities — treated by rebuilding the gut lining and the microbiome, not by silencing the symptom.",
    description:
      "H. pylori, IBS, SIBO, bloating and irregular stools, treated by rebuilding the gut lining and microbiome rather than masking symptoms.",
    conditions: [
      "H. pylori — nutritional support alongside treatment",
      "IBS (constipation and diarrhoea predominant)",
      "SIBO — small intestinal bacterial overgrowth",
      "Stool irregularities — constipation, urgency, incomplete evacuation",
      "Chronic bloating and flatulence",
      "Food intolerances and sensitivities",
      "Leaky gut and dysbiosis",
      "Post-antibiotic gut recovery",
    ],
    involves: [
      "A staged elimination and reintroduction protocol built around your regular meals",
      "Meal timing and portion restructuring before any food is removed",
      "Targeted gut-repair nutrition, with supplements only where a gap is clear",
      "Fortnightly reviews to track stool, bloating and symptom shifts",
    ],
    timeline:
      "Digestive symptoms usually ease within 3–5 weeks. Full gut repair and stable tolerance typically takes 4–6 months.",
    tags: ["H. pylori", "IBS", "SIBO", "Bloating", "Constipation"],
  },
  {
    id: "acid-reflux-gerd",
    slug: "acid-reflux-gerd",
    category: "Gut & Digestion",
    icon: Flame,
    title: "Acid Reflux & GERD",
    shortTitle: "Acid Reflux & GERD",
    summary:
      "Closing the antacid drawer by fixing what drives the reflux — meal timing, meal composition and the pressure underneath it.",
    description:
      "Acid reflux, GERD, gastritis and chronic hyperacidity addressed through meal timing, composition and gut repair.",
    conditions: [
      "Acid reflux and heartburn",
      "GERD — gastro-oesophageal reflux disease",
      "Gastritis and chronic hyperacidity",
      "Sour burps, throat burn and night-time reflux",
      "Long-term antacid and PPI dependence",
      "Reflux alongside hiatus hernia (supportive nutrition)",
    ],
    involves: [
      "Rebuilding meal timing and portion size before any food is taken away",
      "Identifying your specific triggers rather than removing the usual suspects",
      "Nutrition to repair the stomach lining and restore digestive capacity",
      "A structured, physician-coordinated taper off long-term antacids",
    ],
    timeline:
      "Night-time reflux usually settles in 2–4 weeks. Coming off long-term antacids safely takes 3–4 months.",
    tags: ["Acid Reflux", "GERD", "Gastritis", "Hyperacidity"],
  },
  {
    id: "ibd-support",
    slug: "ibd-support",
    category: "Gut & Digestion",
    icon: ShieldCheck,
    title: "IBD Nutrition Support",
    shortTitle: "IBD Support",
    summary:
      "Nutrition through flares and remission for Crohn's and ulcerative colitis — alongside your gastroenterologist, never instead of them.",
    description:
      "Crohn's disease and ulcerative colitis: flare-phase nutrition, remission maintenance and correction of the deficiencies IBD causes.",
    conditions: [
      "Crohn's disease",
      "Ulcerative colitis",
      "Indeterminate colitis",
      "Flare-phase and low-residue nutrition",
      "Remission maintenance",
      "IBD-related anaemia and nutrient deficiencies",
      "Weight and muscle loss during active disease",
    ],
    involves: [
      "Phase-aware plans: what to eat during a flare is not what to eat in remission",
      "Correcting the iron, B12, D and protein gaps that active disease creates",
      "Rebuilding tolerance food by food as inflammation settles",
      "Working to your gastroenterologist's plan — medication is never adjusted here",
    ],
    timeline:
      "Flare-phase nutrition is adjusted weekly. Remission plans are reviewed monthly and held long-term.",
    tags: ["Crohn's", "Ulcerative Colitis", "Flare Care", "Remission"],
  },
  {
    id: "pcos-pcod",
    slug: "pcos-pcod",
    category: "Women's Health",
    icon: CalendarHeart,
    title: "PCOS & PCOD",
    shortTitle: "PCOS & PCOD",
    summary:
      "Cycle regulation and insulin support through nutrition that works with your hormones rather than overriding them.",
    description:
      "PCOS and PCOD: cycle regulation, insulin resistance and fertility-supportive nutrition, built around how your hormones actually behave.",
    conditions: [
      "PCOS — polycystic ovary syndrome",
      "PCOD — polycystic ovarian disease",
      "Irregular or absent cycles",
      "Painful periods and PMS",
      "Insulin resistance and unexplained weight gain",
      "Hirsutism and hormonal acne",
      "Fertility-supportive nutrition",
    ],
    involves: [
      "Insulin-first meal structuring to stabilise blood sugar across the day",
      "Cycle-aware nutrition adjusted to your phase where relevant",
      "Gut and liver support, since hormone clearance depends on both",
      "Monthly cycle tracking to measure real progress, not just weight",
    ],
    timeline:
      "Energy and PMS often improve in 4–6 weeks. Cycle regularity typically returns between months 3 and 6.",
    tags: ["PCOS", "PCOD", "Irregular Cycles", "Fertility"],
  },
  {
    id: "pregnancy-nutrition",
    slug: "pregnancy-nutrition",
    category: "Women's Health",
    icon: HeartPulse,
    title: "Pregnancy Nutrition",
    shortTitle: "Pregnancy Nutrition",
    summary:
      "Trimester-by-trimester nutrition through pregnancy and after it — including the nausea, reflux and constipation nobody warns you about.",
    description:
      "Pre-conception, trimester-wise and postnatal nutrition, including gestational diabetes and the digestive symptoms of pregnancy.",
    conditions: [
      "Pre-conception nutrition",
      "Trimester-wise pregnancy nutrition",
      "Gestational diabetes",
      "Pregnancy nausea, reflux and constipation",
      "Anaemia and deficiencies in pregnancy",
      "Healthy weight gain in pregnancy",
      "Postnatal recovery and lactation nutrition",
    ],
    involves: [
      "Plans built around what you can actually keep down this trimester",
      "Blood-sugar structuring where gestational diabetes is diagnosed",
      "Iron, calcium, folate and B12 addressed through food first",
      "Coordination with your obstetrician throughout",
    ],
    timeline:
      "Reviewed every 3–4 weeks through pregnancy, then monthly for as long as you are feeding.",
    tags: ["Pregnancy", "Gestational Diabetes", "Postnatal", "Lactation"],
  },
  {
    id: "diabetes-metabolic",
    slug: "diabetes-metabolic",
    category: "Metabolic",
    icon: Gauge,
    title: "Diabetes & Metabolic Health",
    shortTitle: "Diabetes & Metabolic",
    summary:
      "Blood sugar, thyroid and fatty liver — the three that usually travel together, worked on as one problem rather than three.",
    description:
      "Type 2 diabetes, pre-diabetes, insulin resistance, thyroid dysfunction and fatty liver, supported through nutrition alongside your physician.",
    conditions: [
      "Type 2 diabetes — nutritional management and reversal support",
      "Pre-diabetes and insulin resistance",
      "Hypothyroidism and Hashimoto's thyroiditis",
      "Fatty liver (NAFLD)",
      "High cholesterol and triglycerides",
      "Diabetes prevention where it runs in the family",
    ],
    involves: [
      "Blood sugar stabilisation through meal composition, order and timing",
      "Nutrient repletion for the cofactors thyroid function depends on",
      "Gut support, since absorption and hormone conversion both depend on it",
      "Coordination with your physician's prescribed medication — never replacing it",
    ],
    timeline:
      "Energy and post-meal crashes usually improve within 4–8 weeks. HbA1c and lipids are best reassessed at 3–6 months.",
    tags: ["Diabetes", "Pre-diabetes", "Thyroid", "Fatty Liver"],
  },
  {
    id: "weight-loss",
    slug: "weight-loss",
    category: "Metabolic",
    icon: Scale,
    title: "Weight Loss & Management",
    shortTitle: "Weight Loss",
    summary:
      "Fat loss built on metabolic repair and real Indian meals — not restriction your body eventually undoes.",
    description:
      "Sustainable weight loss, plateau-breaking and healthy weight gain that works with your metabolism instead of starving it into shutdown.",
    conditions: [
      "Weight loss and stubborn plateaus",
      "Post-pregnancy weight",
      "Underweight and healthy weight gain",
      "Yo-yo dieting recovery",
      "Metabolic adaptation from prolonged dieting",
      "Emotional and stress eating",
      "Visceral fat reduction",
    ],
    involves: [
      "A metabolic assessment before any calorie change is considered",
      "Adequate protein and fibre structured into the meals you already cook",
      "Habit and hunger work alongside the plan, not after it",
      "Progress tracked through measurements, energy and adherence — not the scale alone",
    ],
    timeline:
      "Consistent, sustainable change appears from week 6 onward. Most clients work over 4–6 months to make it hold.",
    tags: ["Weight Loss", "Plateaus", "Healthy Gain", "Metabolism"],
  },
];

export const testimonials: Testimonial[] = [
  /*
   * EMPTY, deliberately.
   *
   * This held fifteen invented client stories — names, quotes, before-and-after
   * lists and star ratings for people who do not exist. The practice's brief
   * says in as many words that there are no client results to publish yet and
   * that placeholders must not be created to fill the gap.
   *
   * So the array stays and the data comes from Firestore. The moment the
   * practice adds a real, consented story through the admin panel it appears
   * on the site; until then every surface that reads this shows an empty state
   * that says so plainly.
   */
];

export const testimonialsFull: Testimonial[] = testimonials;
export * from "./gallery";

// === ABOUT PAGE — PRACTITIONER STORY ===
export const practitionerStory = {
  portrait: {
    // Was a stock photograph of a stranger, captioned with the practitioner's
    // name — a false attribution on the page that introduces her.
    src: "/founder.jpg",
    alt: "Sai Sowjanya Nallimpalli at her desk in the GoRebalance clinic, Kakinada",
    caption: "Sai Sowjanya Nallimpalli at the Kakinada clinic",
  },
  intro:
    "Most people arrive at a nutritionist with a list of symptoms and a folder of reports that say nothing is wrong. Bloating that has lasted years. Cycles that never settled. Fatigue that sleep doesn't fix. They have usually been told, kindly and repeatedly, that this is normal. It rarely is.",
  paragraphs: [
    "Sai Sowjanya Nallimpalli trained as a dietitian and spent her early practice doing what the field taught — calculating requirements, writing plans, adjusting macros. The plans worked, for a while. Then clients would return with the same complaints in a different order, and the honest conclusion was that something upstream had never been addressed.",
    "That something was almost always the gut. Digestion sits underneath energy, immunity, skin, mood and hormones, and when it is compromised, every plan built on top of it is temporary. So the practice changed shape. Instead of starting with a diet chart, she started with a conversation — one long enough to hear what a symptom sheet leaves out.",
    "Today that first conversation covers digestion, sleep, stress, medication history, menstrual health, work hours, screen time and what a real day of eating actually looks like. Not because every detail matters equally, but because the pattern only becomes visible when you have all of it in front of you.",
  ],
  pullQuote: {
    text: "A symptom is not the problem. It is the body's way of telling you where to look.",
    attribution: "Sai Sowjanya Nallimpalli",
  },
  pillars: [
    {
      icon: "Ear",
      title: "Listen before prescribing",
      body: "The first consultation is mostly questions. The plan comes after the pattern is clear, not before.",
    },
    {
      icon: "Utensils",
      title: "Food you already eat",
      body: "Plans are built from your kitchen and your family's meals. Nothing exotic, nothing unsustainable.",
    },
    {
      icon: "Microscope",
      title: "Cause over symptom",
      body: "Suppressing a symptom is easy. Finding why it appeared is the actual work.",
    },
    {
      icon: "HeartHandshake",
      title: "Honest timelines",
      body: "Real rebalancing takes months, not days. You will be told that upfront.",
    },
  ],
  // NOTE FOR CLIENT: the credentials below are INDICATIVE placeholders.
  // Replace with the exact certifications, registration numbers and focus areas.
  credentials: [
    "Clinical Nutritionist — Registered Dietitian",
    "Specialisation in Gut Health & Digestive Disorders",
    "Functional & Personalised Nutrition Approach",
    "PCOS, Thyroid & Hormonal Nutrition",
    "Therapeutic Diet Planning for Lifestyle Disorders",
    "Clinical Consultation Practice",
  ],
};

// === ABOUT PAGE — WHO WE HELP ===
export const whoWeHelp = [
  {
    icon: "Activity",
    title: "Living with daily digestive symptoms",
    body: "Bloating, acidity, irregular bowels or discomfort after almost every meal, managed with antacids rather than answers.",
  },
  {
    icon: "CalendarHeart",
    title: "Cycles and hormones that won't settle",
    body: "PCOS, irregular or painful periods, unexplained weight gain, or being told to simply wait it out.",
  },
  {
    icon: "BatteryLow",
    title: "Tired despite doing everything right",
    body: "Sleeping enough, eating reasonably, still exhausted by afternoon and foggy through the day.",
  },
  {
    icon: "Scale",
    title: "Weight that refuses to move",
    body: "Years of dieting and exercise with nothing to show, or the opposite — unable to gain weight healthily.",
  },
  {
    icon: "Sparkles",
    title: "Skin, hair and immunity issues",
    body: "Persistent acne, hair fall, allergies or infections that keep returning after every course of treatment.",
  },
  {
    icon: "ShieldCheck",
    title: "Wanting to prevent, not react",
    body: "A family history of diabetes, thyroid or heart conditions, and a decision to get ahead of it now.",
  },
];

export const whoWeHelpCopy = {
  eyebrow: "WHO WE WORK WITH",
  title: "You don't need a diagnosis to *begin*.",
  subtitle:
    "Most clients arrive with reports that came back normal and symptoms that never did. If any of these describe you, there is usually something in your nutrition worth looking at properly.",
  closing: "If none of these fit exactly, that's fine — the assessment is built to find what does.",
};

// === ABOUT PAGE — CLINIC LOCATIONS ===
// NOTE FOR CLIENT: exact street addresses and exact Google Maps pins to be supplied.
export const clinicsCopy = {
  eyebrow: "WHERE TO FIND US",
  title: "One clinic. One *standard of care*.",
  subtitle:
    "In-person consultations in Kakinada, and online consultations for clients anywhere in India. The protocol is identical either way.",
  online: {
    title: "Not in Kakinada?",
    body: "Online consultations available across India — same assessment, same plan, same follow-ups.",
    ctaLabel: "Start Online →",
    ctaHref: "/assessment",
  },
  bookLabel: "Book a Consultation →",
  bookHref: "/assessment",
  directionsLabel: "Get Directions",
};

// === TREATMENTS PAGE — WHAT'S INCLUDED ===
export const programInclusions = [
  {
    icon: ClipboardList,
    title: "A full case assessment",
    description:
      "Symptoms, medical history, medications, cycle, sleep, stress, lifestyle and a real nutrition log — reviewed before anything is prescribed.",
  },
  {
    icon: NotebookPen,
    title: "A personalised plan document",
    description:
      "Written for your kitchen and your schedule, with meals, portions, timing and swaps you can actually cook.",
  },
  {
    icon: MessageCircle,
    title: "Direct follow-up access",
    description:
      "Questions between consultations get answered by the clinic, not deferred to your next appointment.",
  },
  {
    icon: RefreshCw,
    title: "Scheduled plan revisions",
    description:
      "Plans are adjusted as your symptoms shift. A protocol that never changes isn't being monitored.",
  },
  {
    icon: FileText,
    title: "Report interpretation",
    description:
      "Existing blood work and reports are read in context — what the numbers mean for your nutrition, not a diagnosis.",
  },
  {
    icon: Users,
    title: "Family-aware planning",
    description:
      "Plans are designed to fit into shared household meals, so you're not cooking separately every day.",
  },
];

export const consultationTiers = [
  {
    id: "single",
    name: "Single Consultation",
    description: "A one-time deep-dive to understand what's driving your symptoms.",
    // PRICING PLACEHOLDER — replace `price` in consultationTiers with the client's confirmed fees.
    // The layout must accommodate a real value like "₹2,500" without reflow.
    price: "₹ —",
    priceSubtitle: "Fee shared during booking",
    included: [
      "Full case assessment",
      "45–60 minute consultation",
      "Root-cause explanation",
      "Initial dietary direction",
      "Report interpretation",
    ],
    excluded: ["Written plan document", "Follow-up consultations", "Between-session support"],
    cta: "Book a Single Consultation",
    isFeatured: false,
  },
  {
    id: "complete",
    name: "Complete Program",
    description: "The full protocol, monitored and adjusted until results hold.",
    // PRICING PLACEHOLDER — replace `price` in consultationTiers with the client's confirmed fees.
    price: "₹ —",
    priceSubtitle: "Fee shared during booking",
    included: [
      "Everything in Single Consultation",
      "Personalised written plan",
      "Scheduled follow-up consultations",
      "Plan revisions as symptoms shift",
      "Direct follow-up access",
      "Family-aware meal planning",
    ],
    excluded: [],
    cta: "Start the Complete Program",
    isFeatured: true,
  },
  {
    id: "extended",
    name: "Extended Program",
    description: "For complex or long-standing conditions that need longer monitoring.",
    // PRICING PLACEHOLDER — replace `price` in consultationTiers with the client's confirmed fees.
    price: "₹ —",
    priceSubtitle: "Fee shared during booking",
    included: [
      "Everything in Complete Program",
      "Extended monitoring period",
      "Quarterly reassessment",
      "Coordination with your physician",
      "Priority scheduling",
    ],
    excluded: [],
    cta: "Start the Extended Program",
    isFeatured: false,
  },
];

// === TREATMENTS PAGE — JOURNEY ===
export const programJourney = [
  {
    phase: "WEEK 0",
    title: "Assessment & Review",
    description:
      "You complete the two-stage assessment. Your symptoms, history, medications, cycle, lifestyle and nutrition log are reviewed personally before the consultation — so the session starts with questions, not paperwork.",
    chips: ["Online form", "Reviewed in 24 hrs"],
  },
  {
    phase: "WEEK 1",
    title: "The First Consultation",
    description:
      "A 45–60 minute conversation covering what's driving your symptoms, what the reports do and don't show, and what the plan will realistically involve. You leave understanding the why, not just the what.",
    chips: ["45–60 minutes", "In-clinic or online"],
  },
  {
    phase: "WEEKS 1–2",
    title: "Your Plan Arrives",
    description:
      "A written protocol built around your kitchen: meals, portions, timing, swaps and any targeted supplementation. Designed to fit the food your household already cooks.",
    chips: ["Written document", "Indian home cooking"],
  },
  {
    phase: "WEEKS 3–12",
    title: "Adjustment & Monitoring",
    description:
      "Scheduled follow-ups track what's shifting and what isn't. Plans are revised as digestion, energy and cycles respond — this is where most of the actual work happens.",
    chips: ["Regular follow-ups", "Plan revisions"],
  },
  {
    phase: "MONTHS 4–6",
    title: "Stabilising Without the Plan",
    description:
      "The protocol loosens deliberately. The goal is a body that holds its results on ordinary food, without needing to be managed.",
    chips: ["Reassessment", "Long-term habits"],
  },
];

// === TREATMENTS PAGE — FAQ (independent from the home page `faqs`) ===
export const treatmentsFaqs = [
  {
    id: "multiple-programs",
    question: "What if my symptoms fit more than one program?",
    answer:
      "That's the norm rather than the exception. Gut issues, hormonal symptoms and fatigue are usually the same problem showing up in three places. The assessment identifies which one is driving the others, and the plan addresses that first — you don't need to pick correctly upfront.",
  },
  {
    id: "blood-reports",
    question: "Do I need blood reports before starting?",
    answer:
      "No. If you have recent reports, bring them and they'll be read in context. If you don't, the assessment and consultation are enough to begin. Any testing that would genuinely change the plan will be suggested — nothing is ordered routinely.",
  },
  {
    id: "medication",
    question: "Can I continue my prescribed medication?",
    answer:
      "Yes, and you should. Nutrition supports medical treatment, it does not replace it. Medications are never stopped or altered here — any change to a prescription is your physician's decision, and plans are built to work alongside what you're already taking.",
  },
  {
    id: "timeline",
    question: "How long before I actually see something change?",
    answer:
      "Digestion and energy usually shift first, often within three to five weeks. Cycles, skin and weight follow their own biological timelines and typically take three to six months. You'll be told a realistic timeline for your condition at the first consultation, not an optimistic one.",
  },
  {
    id: "travel",
    question: "What if I travel, or my schedule is unpredictable?",
    answer:
      "The plan is built around your actual week, including irregular hours, travel and eating out. A protocol that only works on ideal days isn't a working protocol. Tell us what your schedule really looks like and it gets designed around that.",
  },
  {
    id: "diet-preferences",
    question: "Are the plans vegetarian-friendly? Vegan? Jain?",
    answer:
      "Yes to all three. Plans are built from whatever you already eat — vegetarian, vegan, Jain, eggetarian or non-vegetarian. Restrictions are worked around, not argued with, and protein and nutrient adequacy are handled within your preference.",
  },
  {
    id: "doesnt-work",
    question: "What if the program doesn't work for me?",
    answer:
      "Then something in the assessment was incomplete, or the concern sits outside the scope of nutrition care — and you'll be told that directly rather than sold another package. In some cases the right next step is a referral to a physician or specialist, and that recommendation will be made honestly.",
  },
];

export const treatmentsFaqCopy = {
  eyebrow: "BEFORE YOU CHOOSE",
  title: "Questions people ask about the *programs*.",
  subtitle:
    "Practical answers about conditions, medications, duration and what happens if your situation doesn't fit neatly into one program.",
  strip: {
    title: "Still not sure which program fits?",
    body: "Message the clinic directly — you'll get a real answer, not a sales reply.",
    ctaLabel: "Chat on WhatsApp",
  },
};

export const treatmentsCtaCopy = {
  title: "Found your program? Let's confirm the *cause*.",
  subtitle:
    "The assessment helps us understand your concerns and which level of support may suit you — reviewed personally by Sai Sowjanya Nallimpalli within 24 hours.",
};

// PLACEHOLDER VIDEOS — replace poster images and videoUrl values with the client's real footage. If no video is available at launch, leave this array empty and the section will not render.
// NOTE: when real footage is added, captions/subtitles (WebVTT tracks or platform captions) must be provided for accessibility.
export interface VideoHighlight {
  id: string;
  title: string;
  description: string;
  poster: string;
  videoUrl: string;
  duration: string;
  category: string;
}

export const videoHighlights: VideoHighlight[] = [
  {
    id: "first-consultation",
    title: "How a first consultation runs",
    description: "What the 45 minutes actually cover, and why the questions come before the plan.",
    poster:
      "https://images.unsplash.com/photo-1644704170910-a0cdf183649b?auto=format&fit=crop&q=80&w=1200",
    videoUrl: "",
    duration: "2:14",
    category: "Consultations",
  },
  {
    id: "personalised-plan",
    title: "What a personalised plan looks like",
    description: "A walkthrough of a real plan document — meals, timing, portions and swaps.",
    poster:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1200",
    videoUrl: "",
    duration: "3:02",
    category: "Meal Plans",
  },
  {
    id: "bloating",
    title: "Bloating: why it isn't just what you ate",
    description: "The three most common causes seen in clinic, and what actually resolves them.",
    poster:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1200",
    videoUrl: "",
    duration: "4:18",
    category: "Nutrition",
  },
  {
    id: "indian-plate",
    title: "Building a gut-friendly Indian plate",
    description:
      "Assembling a normal home-cooked meal that supports digestion rather than straining it.",
    poster:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=1200",
    videoUrl: "",
    duration: "2:47",
    category: "Nutrition",
  },
  {
    id: "pcos",
    title: "PCOS: where nutrition genuinely helps",
    description:
      "What can be improved through food and what needs medical support — stated plainly.",
    poster:
      "https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&q=80&w=1200",
    videoUrl: "",
    duration: "5:06",
    category: "Nutrition",
  },
  {
    id: "kakinada-clinic",
    title: "Inside the Kakinada clinic",
    description: "A short tour of the consultation space and how sessions are structured.",
    poster:
      "https://images.unsplash.com/photo-1636647511729-6703539ba71f?auto=format&fit=crop&q=80&w=1200",
    videoUrl: "",
    duration: "1:38",
    category: "Clinic",
  },
];

export const galleryCtaCopy = {
  title: "Seen enough? The next step is *yours*.",
  subtitle:
    "The assessment covers your symptoms, history, lifestyle and food habits — reviewed personally by Sai Sowjanya Nallimpalli within 24 hours.",
};

export const symptoms = [
  {
    id: "wind",
    icon: Wind,
    label: "Bloating & Heaviness",
    detail: "Your stomach feels tight or swollen an hour after eating.",
  },
  {
    id: "flame",
    icon: Flame,
    label: "Acidity & Reflux",
    detail: "Burning, sour burps, or reaching for antacids too often.",
  },
  {
    id: "timer",
    icon: Timer,
    label: "Irregular Bowels",
    detail: "Constipation, urgency, or never feeling fully emptied.",
  },
  {
    id: "batteryLow",
    icon: BatteryLow,
    label: "Fatigue & Brain Fog",
    detail: "Tired after 8 hours of sleep, foggy by afternoon.",
  },
  {
    id: "scale",
    icon: Scale,
    label: "Weight That Won't Move",
    detail: "Eating less, exercising more, and nothing changes.",
  },
  {
    id: "sparkles",
    icon: Sparkles,
    label: "Acne, Hair Fall & Dull Skin",
    detail: "Skin and hair reacting to what's happening inside.",
  },
  {
    id: "calendarHeart",
    icon: CalendarHeart,
    label: "Irregular Cycles & PCOS",
    detail: "Delayed periods, cramps, mood swings, unwanted hair.",
  },
  {
    id: "candy",
    icon: Candy,
    label: "Cravings & Energy Crashes",
    detail: "Sugar hits at 4 PM and after every meal.",
  },
];

export const practitioner = {
  name: "Sai Sowjanya Nallimpalli",
  role: "Clinical Nutritionist & Gut Health Specialist",
  /* The real photograph, not a stock portrait of someone else. */
  image: "/founder.jpg",
  bio: [
    "I'm Sai Sowjanya Nallimpalli, a dietitian with specialised education in gut health, working across digestive, hormonal and metabolic nutrition. I consult from my clinic in Kakinada, Andhra Pradesh — and online with clients across India.",
    "My approach is simple: symptoms are messages, not problems to be silenced. Before I build a single meal plan, I want to understand your digestion, your sleep, your stress, your cycle and what your day actually looks like. That's where the real answers live.",
    "Every plan I create is built around real Indian food — your kitchen, your family's meals, your schedule and your budget. No exotic ingredients, no crash diets, no protocols you'll abandon in three weeks.",
  ],
  quote:
    "Nutrition isn't about restriction. It's about giving your body the support it needs, in a way you can keep up.",
};

export const stats = [
  /*
   * EMPTY, deliberately.
   *
   * This held "500+ Clients Rebalanced", "8+ Years of Practice", "15+
   * Conditions Treated" and a "4.9 Client Rating". None came from the
   * practice, and the brief forbids inventing client results or credentials
   * in as many words. Anything that reads this shows nothing rather than a
   * number nobody can stand behind.
   */
] as { value: string; label: string; hasStar?: boolean }[];

export const credibilityItems = [
  { icon: ShieldCheck, label: "Certified Clinical Nutritionist" },
  { icon: Microscope, label: "Personalised Gut Protocols" },
  { icon: Salad, label: "Personalised Indian Meal Plans" },
  { icon: HeartPulse, label: "PCOS & Hormonal Support" },
  { icon: Activity, label: "IBS · Bloating · Acidity" },
  { icon: Video, label: "Online Consultations Pan-India" },
  { icon: MapPin, label: "Kakinada Clinic" },
];

export const processSteps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Share Your Story",
    description:
      "A detailed assessment captures your symptoms, medical history, medications, food habits, sleep, stress and cycle. Nothing gets skipped, because nothing is irrelevant.",
    meta: "10 minutes · Online form",
  },
  {
    number: "02",
    icon: Search,
    title: "Careful Assessment",
    description:
      "I map your symptoms against what's actually happening in your gut, hormones and daily routine — then find the pattern connecting them.",
    meta: "Reviewed personally",
  },
  {
    number: "03",
    icon: NotebookPen,
    title: "Your Personalised Plan",
    description:
      "A realistic, food-first protocol built around your kitchen: meals, portions, timing, and supplements only where they're genuinely needed.",
    meta: "Built around Indian food",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Guided Rebalancing",
    description:
      "Regular check-ins, honest course-corrections and accountability — until the results hold on their own, without the plan.",
    meta: "Ongoing support",
  },
];

export const aboutCtaCopy = {
  title: "You've read the approach. Now let's apply it to *you*.",
  subtitle:
    "The assessment is where the work actually begins — your symptoms, history, medications, lifestyle and food habits, reviewed personally by Sai Sowjanya Nallimpalli.",
};

/* ==========================================================================
   THE CONTENT BRIEF

   Everything below this banner comes from the practice's own "Complete
   Website Content & Developer Brief", and it SUPERSEDES the older exports
   above wherever the two disagree. The old ones survive only because the
   treatments, testimonials and gallery pages still read from them; they come
   out once the homepage draft is signed off.

   Three rules from the brief govern every line of copy below, and they are
   not stylistic — they are the boundaries a nutrition practice has to work
   inside:

     - Nothing diagnoses, treats or cures. No "heal your gut", no "root
       cause", no promise that a symptom will improve.
     - Nothing is invented. No prices, no testimonials, no client counts, no
       credentials or awards beyond the five the practice listed.
     - Nothing implies nutrition replaces medical care.

   The tagline is UNDER REVIEW. It lives in one constant so it can be swapped
   without touching a layout, and no section is built around its length.
   ========================================================================== */

export const briefBrand = {
  name: "Go Rebalance",
  /** Under review. One line, one place, swappable. */
  positioning: "Personalised nutrition. Gut health at the core.",
  founder: "Sai Sowjanya Nallimpalli",
  founderRole: "Dietitian | Gut Health Specialist",
  /** The primary call to action, everywhere on the site. */
  primaryCta: "Start Your Assessment",
  secondaryCta: "Explore Programs",
};

export const briefHero = {
  headline: "Go Rebalance",
  positioning: briefBrand.positioning,
  supporting: "Nutrition guidance designed around your body, your lifestyle and your needs.",
};

/** Section 2 — How Can We Support You? */
export const areasOfFocus = [
  {
    id: "gut",
    icon: Activity,
    title: "Gut Health",
    items: ["IBS", "IBD", "SIBO", "Gut Dysbiosis"],
  },
  {
    id: "metabolic",
    icon: Gauge,
    title: "Weight & Metabolic Health",
    items: ["Weight", "Diabetes", "Insulin Resistance"],
  },
  {
    id: "hormonal",
    icon: CalendarHeart,
    title: "Hormonal & Thyroid Health",
    items: ["PCOS", "PMS", "Thyroid", "Hashimoto's"],
  },
  {
    id: "autoimmune",
    icon: ShieldCheck,
    title: "Autoimmune Nutrition",
    note: "Nutrition support alongside your medical care.",
    items: [],
  },
  {
    id: "womens",
    icon: HeartPulse,
    title: "Women's Health",
    items: ["Preconception", "Pregnancy", "Women's Nutrition"],
  },
];

export const areasOfFocusCopy = {
  eyebrow: "AREAS OF FOCUS",
  title: "How Can We *Support* You?",
  closing: "Different bodies. Different needs. Personalised nutrition.",
};

/** Section 3 — Who We Work With. */
export const whoWeWorkWith = {
  eyebrow: "WHO WE WORK WITH",
  title: "Personalised Nutrition Support for Ages *15–50*",
  body: [
    "Go Rebalance currently works with clients aged 15 to 50. Support may include teenage nutrition, digestive concerns, hormonal and thyroid health, metabolic health, women's nutrition and individual nutrition goals.",
    "Recommendations are adapted to the person's stage of life, health needs, food habits, lifestyle and goals.",
  ],
  /* Stated once here, once on the assessment, once in the FAQs. The brief is
     explicit that it should be visible but not repeated across the site. */
  guardianNote:
    "For clients under 18, a parent or legal guardian should be involved in the consultation and consent process.",
};

/** Section 4 — Why Gut Health Is at the Core. Deliberately short. */
export const gutHealthCore = {
  eyebrow: "THE LENS",
  title: "Why Gut Health Is at the *Core*",
  body: "Digestive health is closely connected with food tolerance, nutrient absorption and day-to-day wellbeing. That is why Go Rebalance considers gut health as part of the wider nutritional picture rather than looking at it in isolation.",
  pull: "We don't look at the gut alone. We look at the person as a whole.",
};

/** Section 5 — The Go Rebalance Approach. */
export const approachSteps = [
  {
    number: "01",
    icon: Search,
    title: "Understand",
    body: "We begin with your health history, symptoms, lifestyle, food habits and goals.",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Assess",
    body: "We review relevant health reports and blood work to better understand your nutritional needs.",
  },
  {
    number: "03",
    icon: NotebookPen,
    title: "Personalise",
    body: "Your nutrition strategy is designed around you — with supplement guidance where appropriate.",
  },
  {
    number: "04",
    icon: RefreshCw,
    title: "Support & Rebalance",
    body: "Through regular follow-ups, we track progress, make adjustments and support you throughout your journey.",
  },
];

export const approachCopy = {
  eyebrow: "THE APPROACH",
  title: "Not Just a Diet Plan. A Plan *Built Around You*.",
  closing:
    "Because personalised nutrition isn't just about creating a plan. It's about supporting you throughout the process.",
};

/**
 * Section 6 — Programs.
 *
 * No prices, anywhere. The brief routes pricing through a discovery call, and
 * a card's action is always "explore", never "buy".
 */
export const programs = [
  {
    id: "clarity",
    slug: "nutrition-clarity-consultation",
    title: "Nutrition Clarity Consultation",
    summary:
      "One focused consultation to understand where you are, what your nutrition needs and what your next steps could look like.",
    points: [
      "Personalised nutrition assessment",
      "Review of relevant health reports",
      "Clear, practical next steps",
    ],
    cta: "Explore Consultation",
    signature: false,
  },
  {
    id: "gut-reset",
    slug: "21-day-gut-reset",
    title: "21-Day Gut Reset",
    summary:
      "A guided 21-day experience to understand your gut, simplify your nutrition and begin building better digestive habits.",
    points: [
      "Gut-focused nutrition guidance",
      "Personalised food & lifestyle strategies",
      "Guided support for 21 days",
    ],
    cta: "Explore Gut Reset",
    signature: false,
  },
  {
    id: "rebalance-3",
    slug: "3-month-rebalance",
    title: "3-Month Rebalance Program",
    summary:
      "A 12-week personalised nutrition journey where we assess, plan, follow up and adapt your strategy as you progress.",
    points: [
      "In-depth personalised assessment",
      "12 weekly consultations",
      "Ongoing nutrition & WhatsApp support",
    ],
    note: "Your plan. Your progress. Your support.",
    cta: "Explore Rebalance",
    signature: true,
  },
  {
    id: "rebalance-6",
    slug: "6-month-rebalance",
    title: "6-Month Rebalance Program",
    summary:
      "Longer-term personalised nutrition support for those who need more time, deeper guidance and continuity of care.",
    points: [
      "Long-term personalised strategy",
      "Regular progress reviews & adjustments",
      "Consistent professional support",
    ],
    cta: "Explore 6-Month Rebalance",
    signature: false,
  },
];

export const programsCopy = {
  eyebrow: "PROGRAMS",
  title: "Find the Right *Support* for You",
  subtitle:
    "From a focused consultation to longer-term personalised nutrition support, choose the level of guidance that fits your needs.",
};

/** Section 7 — Why Go Rebalance? */
export const whyGoRebalance = [
  {
    icon: UserCheck,
    title: "Personalised, Not Prescribed",
    body: "Your plan starts with understanding you — your symptoms, health history, lifestyle, food habits and goals.",
  },
  {
    icon: Search,
    title: "Always Asking “Why?”",
    body: "When something isn't progressing as expected, we reassess, ask why and adjust the approach instead of simply repeating the same plan.",
  },
  {
    icon: TrendingUp,
    title: "Consistency Over Perfection",
    body: "Knowing what to do is only the beginning. We help you work through challenges and turn recommendations into habits you can realistically follow.",
  },
  {
    icon: RefreshCw,
    title: "Support That Evolves With You",
    body: "Your needs may change throughout the journey. Regular follow-ups help us understand your progress and adapt your nutrition strategy along the way.",
  },
  {
    icon: HeartPulse,
    title: "Founder-Led Guidance",
    body: "Go Rebalance is a personal practice. Clients receive guidance directly from Sai rather than being passed through a large coaching team.",
  },
];

export const whyGoRebalanceCopy = {
  eyebrow: "WHY GO REBALANCE",
  title: "Guidance That Stays *With You*",
  pull: "I can guide you, educate you and support you — but the real change happens when you put it into practice. My role is to help you keep moving forward.",
};

/**
 * Section 8 — What You Can Expect.
 *
 * The most important section on the page, and the one most practices skip. It
 * is a list of things Go Rebalance will NOT claim, which is precisely what
 * makes the things it does claim believable.
 */
export const whatToExpect = [
  {
    title: "No One-Size-Fits-All Plans",
    body: "Your nutrition strategy is built around your individual needs rather than a standard diet chart.",
  },
  {
    title: "No Guaranteed Outcomes",
    body: "Every body and every health journey responds differently. Individual results can vary.",
  },
  {
    title: "No Unnecessary Supplements",
    body: "Supplement guidance is considered only where appropriate for the individual.",
  },
  {
    title: "No Replacing Medical Care",
    body: "Nutrition support is not a substitute for medical diagnosis or treatment and should work alongside appropriate healthcare when needed.",
  },
];

export const whatToExpectCopy = {
  eyebrow: "WHAT YOU CAN EXPECT",
  title: "No Quick Fixes. No *False Promises*.",
  promise:
    "What we do promise is thoughtful assessment, personalised guidance, honest communication, regular reassessment and support throughout your journey.",
};

/** Section 9 — When Nutrition Isn't Enough. Small, but visible. */
export const beyondNutrition = {
  eyebrow: "PROFESSIONAL BOUNDARIES",
  title: "Knowing When to Look *Beyond Nutrition*",
  body: "If a concern requires medical investigation or falls outside the scope of nutrition care, Go Rebalance may recommend that the client consult the appropriate healthcare professional.",
};

/** Section 10 — Meet Sai. */
export const meetSai = {
  eyebrow: "MEET SAI",
  name: briefBrand.founder,
  role: briefBrand.founderRole,
  image: "/founder.jpg",
  body: [
    "With a background in Biotechnology, advanced education in Nutrition & Dietetics, clinical training across multispecialty hospitals, and specialised education in gut health, my approach goes beyond standard diet charts.",
    "I created Go Rebalance to offer personalised nutrition guidance that helps you understand your body, support your gut and work towards better balance — one realistic step at a time.",
  ],
  cta: "Read My Story",
};

/**
 * Section 11 — Education & Credentials.
 *
 * These five, exactly as the practice supplied them. Nothing added, no years
 * inferred, no honorifics invented.
 */
export const credentials = [
  { title: "Bachelor's in Biotechnology", detail: "GITAM University, Visakhapatnam" },
  { title: "Certification in Food & Nutrition", detail: "Bridge Course" },
  { title: "Master's in Dietetics & Food Service Management", detail: "" },
  {
    title: "Clinical Nutrition Internship & Training",
    detail: "Clinical learning and exposure across multiple multispecialty hospitals.",
  },
  {
    title: "Certificate of Advanced Education in Gut Health",
    detail: "Institute for Integrative Nutrition (IIN)",
  },
];

export const credentialsCopy = {
  eyebrow: "EDUCATION & CREDENTIALS",
  title: "The Training Behind the *Practice*",
};

/** Section 12 — FAQs. */
export const briefFaqs = [
  {
    id: "who-can-join",
    question: "Who can join Go Rebalance?",
    answer:
      "Go Rebalance currently provides personalised nutrition support for clients aged 15–50. For clients under 18, a parent or legal guardian should be involved in the consultation and consent process.",
  },
  {
    id: "only-gut",
    question: "Is Go Rebalance only for gut problems?",
    answer:
      "No. Gut health is an important part of our approach, but Go Rebalance also provides personalised nutrition support for weight, metabolic health, hormonal and thyroid concerns, autoimmune health and women's nutrition.",
  },
  {
    id: "which-program",
    question: "Which program is right for me?",
    answer:
      "You don't have to decide on your own. We consider your goals, symptoms, health concerns and initial assessment to help determine the level of support that may suit you best.",
  },
  {
    id: "blood-tests",
    question: "Do I need blood tests before starting?",
    answer:
      "Relevant recent blood work can help us better understand your nutritional needs. If appropriate reports aren't available, additional tests may be suggested based on your health history and symptoms.",
  },
  {
    id: "personalised",
    question: "Will my nutrition plan be personalised?",
    answer:
      "Yes. Your nutrition strategy is created around your health needs, symptoms, food habits, lifestyle and goals — not a standard diet chart.",
  },
  {
    id: "supplements",
    question: "Do you recommend supplements?",
    answer:
      "When appropriate. Supplements may be recommended based on individual nutritional needs, relevant reports and identified deficiencies. They are not automatically included for everyone.",
  },
  {
    id: "online",
    question: "How do online consultations work?",
    answer:
      "Consultations are conducted one-to-one online through Google Meet at a pre-scheduled time. Ongoing program support and follow-ups are provided through scheduled consultations and WhatsApp, depending on your program.",
  },
  {
    id: "after-assessment",
    question: "What happens after I submit the initial assessment?",
    answer:
      "We review the information you've shared and schedule a discovery call. During the call, we'll understand your concerns and goals more clearly and discuss which Go Rebalance program may be appropriate for you. Once you choose to enrol, the detailed assessment process begins.",
  },
  {
    id: "whatsapp",
    question: "Is WhatsApp support available?",
    answer:
      "Yes. WhatsApp support is included in selected ongoing programs during designated working hours.",
  },
  {
    id: "medical",
    question: "What if my concern needs medical attention?",
    answer:
      "If your concern requires medical investigation or falls outside the scope of nutrition care, you may be advised to consult the appropriate healthcare professional. Go Rebalance does not replace medical diagnosis or treatment.",
  },
];

export const briefFaqCopy = {
  eyebrow: "FREQUENTLY ASKED QUESTIONS",
  title: "Everything You're *Wondering*",
  subtitle: "The questions clients ask before they begin — answered plainly.",
};

/** Section 13 — Final CTA. */
export const finalCta = {
  title: "Ready to Start Your *Rebalance* Journey?",
  lead: "You don't need to know which program is right for you.",
  body: "Tell us a little about your health concerns and goals. We'll start by understanding where you are and guide you towards the next step.",
  cta: briefBrand.primaryCta,
  steps: ["Initial Assessment", "Discovery Call", "Personalised Program Recommendation"],
};

/**
 * The professional disclaimer, verbatim from the brief.
 *
 * It belongs in the footer of every page, not tucked away on a legal page.
 */
export const professionalDisclaimer =
  "Go Rebalance provides nutrition and lifestyle guidance for educational and wellness purposes. Services are not a substitute for medical diagnosis, treatment or care from a qualified healthcare professional. Nutrition and supplement recommendations are personalised where appropriate, and individual results may vary. Clients with medical conditions should continue to work with their treating healthcare professionals.";

/**
 * Section 7 — Program detail content.
 *
 * The full inclusion lists, which the brief keeps OFF the homepage cards and
 * puts here. Two copy notes from the brief are load-bearing and are the reason
 * some obvious words are missing:
 *
 *   - The 21-Day Gut Reset is never called a detox or a cleanse, and never
 *     promises to heal or rebalance a gut in 21 days.
 *   - The 6-Month program does not state a number of consultations, because
 *     the practice has not settled one. "Scheduled one-to-one follow-ups" is
 *     the honest phrasing until it does.
 *
 * Still no prices. Cost is discussed on the discovery call.
 */
export const programDetails = [
  {
    id: "clarity",
    title: "Nutrition Clarity Consultation",
    intro:
      "Designed for someone who wants professional guidance on a specific nutrition concern without committing to a longer program.",
    includes: [
      "Health, nutrition & lifestyle assessment",
      "Review of relevant reports, where appropriate",
      "One-to-one nutrition consultation",
      "Personalised nutrition recommendations",
      "Guidance on practical next steps",
      "Supplement guidance, where appropriate",
    ],
    bestFor:
      "Someone looking for professional nutrition guidance, a second look at their current approach, or clarity about their next steps.",
    signature: false,
  },
  {
    id: "gut-reset",
    title: "21-Day Gut Reset",
    intro:
      "A focused starting point for people who want to better understand their digestive health and build supportive food and lifestyle habits.",
    includes: [
      "Gut health & symptom assessment",
      "Review of food and lifestyle patterns",
      "Personalised gut-supportive nutrition guidance",
      "Meal and food guidance",
      "Lifestyle recommendations",
      "Supplement guidance where appropriate",
      "Progress review during the program",
      "Support throughout the 21-day journey",
    ],
    bestFor: "",
    signature: false,
  },
  {
    id: "rebalance-3",
    title: "3-Month Rebalance Program",
    intro:
      "This is the heart of Go Rebalance. A structured 12-week personalised nutrition journey designed for people who need more than a one-time plan.",
    includes: [
      "Comprehensive health & symptom assessment",
      "Review of relevant blood work and health reports",
      "Personalised nutrition strategy",
      "Individualised meal guidance",
      "Supplement guidance where appropriate",
      "12 weekly one-to-one consultations",
      "Regular progress reviews",
      "Nutrition plan adjustments as needed",
      "WhatsApp support during working hours, Monday–Saturday",
    ],
    bestFor:
      "People looking for structured ongoing support for gut health, weight and metabolic health, hormonal health or other nutrition-related goals.",
    note: "Your plan. Your progress. Your support.",
    signature: true,
  },
  {
    id: "rebalance-6",
    title: "6-Month Rebalance Program",
    intro:
      "Longer-term personalised nutrition support for people who may benefit from more time, continuity and gradual adjustment.",
    includes: [
      "Comprehensive health & symptom assessment",
      "Review of relevant blood work and health reports",
      "Personalised nutrition strategy",
      "Individualised meal guidance",
      "Supplement guidance where appropriate",
      "Scheduled one-to-one follow-ups",
      "Ongoing progress and symptom reviews",
      "Nutrition plan adjustments",
      "WhatsApp support during working hours, Monday–Saturday",
    ],
    bestFor: "",
    note: "A longer journey, with support that evolves with you.",
    signature: false,
  },
];

export const programsPageCopy = {
  eyebrow: "PROGRAMS",
  title: "Find the Right *Support* for You",
  subtitle:
    "From a focused consultation to longer-term personalised nutrition support, choose the level of guidance that fits your needs. Pricing is discussed personally on your discovery call, once we understand what you actually need.",
};

/**
 * The client journey, from the brief's Section 5.
 *
 * Published because it answers the question the programs page creates: if
 * there are no prices, what happens if I press the button? Showing the whole
 * sequence — including that pricing comes after a conversation and that
 * nothing detailed is reviewed before enrolment — is what makes a page with no
 * prices feel considered rather than evasive.
 */
export const clientJourney = [
  {
    step: "01",
    title: "Initial assessment",
    body: "A short form about your health concerns and goals. Not a medical intake — that comes later, and only if you enrol.",
  },
  {
    step: "02",
    title: "Discovery call",
    body: "We talk through your concerns and goals, and discuss which program may be appropriate for you.",
  },
  {
    step: "03",
    title: "Program & pricing",
    body: "The recommended program and its cost are discussed with you privately. You decide from there.",
  },
  {
    step: "04",
    title: "Enrolment",
    body: "Once you choose to enrol, the detailed health assessment begins and relevant reports are collected.",
  },
  {
    step: "05",
    title: "Your nutrition strategy",
    body: "Your personalised plan follows, usually within 4–5 working days of receiving everything needed.",
  },
  {
    step: "06",
    title: "Follow-ups & adjustments",
    body: "Your program begins, with reviews and adjustments as you progress.",
  },
];

export const clientJourneyCopy = {
  eyebrow: "WHAT HAPPENS NEXT",
  title: "How a Program *Actually Starts*",
  subtitle:
    "No prices on this page is deliberate. Which program suits you depends on what we find, so the cost is discussed once there is something to discuss.",
};

/**
 * Section 6 — the About page's story, in the founder's own words.
 *
 * Verbatim from the brief, including its emphases. It replaces a version that
 * was written for her rather than by her, and that carried claims about
 * root causes and years of practice which the practice never made.
 */
export const myStory = {
  eyebrow: "MY STORY",
  title: "I Didn't Always Know I Would Become a *Dietitian*.",
  paragraphs: [
    "Growing up, I dreamed of becoming a doctor, but life took me in a different direction — first into Biotechnology and eventually into the world of nutrition.",
    "Along the way, my own experiences with health changed the way I looked at food and wellbeing. They taught me something textbooks alone cannot: what it feels like to be on the other side — to want answers, to want to feel better, and to want someone who truly listens.",
    "That curiosity led me to pursue advanced studies in Food & Nutrition and Dietetics. My journey then moved beyond the classroom into clinical training, where I gained hands-on exposure across multispecialty hospitals and learned about supporting different nutritional needs, including recovery and post-surgical nutrition.",
    "The more I worked with people, the clearer one thing became: I didn't want nutrition care to be just another standard diet chart.",
    "I wanted to understand the person behind it — their body, symptoms, food habits, lifestyle and individual needs.",
    "My further education in gut health strengthened that belief. I learned how important balance within the gut can be and how personalised nutrition and appropriate guidance can support overall wellbeing.",
    "That idea became the heart of Go Rebalance.",
    "For me, Go Rebalance is more than a name. It is an invitation to understand your body, support your gut and take meaningful steps towards finding your balance again.",
  ],
  closing: "Because your nutrition should be as individual as you are.",
};

/**
 * Section 4 — the initial assessment form.
 *
 * A SHORT pre-enrolment form, and the word short is the specification. The
 * brief is explicit that this is "not the full clinical/medical intake form
 * and should not request detailed blood reports or extensive medical records",
 * and that nothing may imply a plan or a blood-work analysis happens before
 * somebody enrols.
 *
 * What it replaced was a five-step clinical questionnaire that collected
 * medical history, a nutrition log and a payment screenshot before anyone had
 * spoken to the practice. That is the opposite of this flow, and it also meant
 * the site was holding medical data for people who never became clients.
 */
export const assessmentFormCopy = {
  eyebrow: "INITIAL ASSESSMENT",
  title: "Tell Us Where You're *Starting From*",
  subtitle:
    "A few questions about your health concerns and goals. It takes about three minutes, and there is nothing to pay.",
  ageNote: "Go Rebalance currently supports clients aged 15 to 50.",
  guardianNote:
    "If you are under 18, please complete this with a parent or legal guardian, who should be involved in the consultation and consent process.",
  privacyNote:
    "Your answers are used to prepare for your discovery call and are never shared. This form is not a medical assessment.",
  submit: "Submit Assessment",
  nextSteps: ["Initial Assessment", "Discovery Call", "Personalised Program Recommendation"],
};

export const assessmentSuccessCopy = {
  title: "Thank You — We've Received Your *Assessment*.",
  body: "We'll review the information you've shared and get in touch to schedule your discovery call.",
  detail:
    "This is where we'll understand your concerns and goals better and discuss the next step in your Go Rebalance journey.",
};

/** The program a visitor can express interest in, from the brief's field list. */
export const programInterestOptions = [
  "Not sure yet",
  "Nutrition Clarity Consultation",
  "21-Day Gut Reset",
  "3-Month Rebalance Program",
  "6-Month Rebalance Program",
];

export const contactPreferenceOptions = ["WhatsApp", "Phone call", "Email"];

/** Footer navigation, exactly the set the brief lists. */
export const briefNavLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "FAQs", href: "/#faq" },
  { label: "Contact", href: "/contact" },
];
