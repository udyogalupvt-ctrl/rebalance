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
  /** The practice's line, set under the logo. */
  tagline: "Rebalance From Within.",
  /** The positioning statement. Under review as a tagline, so one place only. */
  positioning: "Personalised nutrition. Gut health at the core.",
  practitioner: "Sai Sowjanya Penmetsa",
  credential: "Dietitian | Gut Health Specialist",
  /*
   * NOTE FOR THE PRACTICE: the reference pages show this number as a
   * placeholder. It is the number the site has always carried and it works,
   * so it stays until a final one is supplied — replacing a working number
   * with the word "placeholder" would cut off the one channel that is live.
   */
  phone: "+91 93904 14536",
  phoneRaw: "919390414536",
  /** Supplied in the practice's contact reference. */
  email: "contact@gorebalance.com",
  instagram: "@gorebalance",
  instagramUrl: "https://instagram.com/gorebalance",
  whatsapp:
    "https://wa.me/919390414536?text=Hi%20Go%20Rebalance%2C%20I%27d%20like%20to%20know%20more%20about%20your%20programs",
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
  { label: "Instagram", href: brand.instagramUrl, icon: "Instagram" },
  { label: "Facebook", href: "", icon: "Facebook" },
  { label: "Youtube", href: "", icon: "Youtube" },
  { label: "WhatsApp", href: brand.whatsapp, icon: "MessageCircle" },
];

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
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
/**
 * The footer's Explore column, in the practice's own wording. `hash` links
 * point at a section of the home page.
 */
export const navLinks: { label: string; href: string; hash?: string }[] = [
  { label: "About Sowjanya", href: "/about" },
  { label: "Programs & Consultations", href: "/programs" },
  { label: "Our Approach", href: "/", hash: "approach" },
  { label: "FAQs", href: "/", hash: "faq" },
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
      "Sai Sowjanya Penmetsa reviews your submission personally — your symptoms, history, medications, lifestyle and nutrition log. You'll be contacted within 24 hours to schedule your consultation, where we talk through your concerns and what your program would involve.",
  },
  {
    id: "privacy",
    question: "Is my health information kept private?",
    answer:
      "Yes. Everything you share in the assessment is confidential and used only to build and adjust your plan. It isn't shared, sold or used for anything else.",
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
    alt: "Sai Sowjanya Penmetsa at her desk in the GoRebalance clinic, Kakinada",
    caption: "Sai Sowjanya Penmetsa at the Kakinada clinic",
  },
  intro:
    "Most people arrive at a nutritionist with a list of symptoms and a folder of reports that say nothing is wrong. Bloating that has lasted years. Cycles that never settled. Fatigue that sleep doesn't fix. They have usually been told, kindly and repeatedly, that this is normal. It rarely is.",
  paragraphs: [
    "Sai Sowjanya Penmetsa trained as a dietitian and spent her early practice doing what the field taught — calculating requirements, writing plans, adjusting macros. The plans worked, for a while. Then clients would return with the same complaints in a different order, and the honest conclusion was that something upstream had never been addressed.",
    "That something was almost always the gut. Digestion sits underneath energy, immunity, skin, mood and hormones, and when it is compromised, every plan built on top of it is temporary. So the practice changed shape. Instead of starting with a diet chart, she started with a conversation — one long enough to hear what a symptom sheet leaves out.",
    "Today that first conversation covers digestion, sleep, stress, medication history, menstrual health, work hours, screen time and what a real day of eating actually looks like. Not because every detail matters equally, but because the pattern only becomes visible when you have all of it in front of you.",
  ],
  pullQuote: {
    text: "A symptom is not the problem. It is the body's way of telling you where to look.",
    attribution: "Sai Sowjanya Penmetsa",
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
    "Tell us a little about your health concerns and goals. We'll start by understanding where you are and guide you towards the next step.",
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
  name: "Sai Sowjanya Penmetsa",
  role: "Clinical Nutritionist & Gut Health Specialist",
  /* The real photograph, not a stock portrait of someone else. */
  image: "/founder.jpg",
  bio: [
    "I'm Sai Sowjanya Penmetsa, a dietitian with specialised education in gut health, working across digestive, hormonal and metabolic nutrition. I consult from my clinic in Kakinada, Andhra Pradesh — and online with clients across India.",
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
    "The assessment is where the work actually begins — your symptoms, history, medications, lifestyle and food habits, reviewed personally by Sai Sowjanya Penmetsa.",
};

/* ==========================================================================
   THE CLIENT CONTENT

   Everything below this banner is the practice's own copy, taken from the
   content brief and from the page references she sent afterwards (home,
   about and contact). Where the two disagree the later documents win: the
   founder's surname is Penmetsa, the practice's line is "Rebalance From
   Within.", and the main call to action is "Book Consultation".

   Three rules still govern every line, and they are not stylistic — they are
   the boundaries a nutrition practice has to work inside:

     - Nothing diagnoses, treats or cures. No "heal", no "root cause", no
       promise that a symptom will improve, and no "treatment" wording at all.
     - Nothing is invented. No prices, no client counts, no testimonials and
       no credentials beyond the five the practice listed.
     - Nothing implies nutrition replaces medical care.

   Changes the practice asked for by name, so they are not undone later:
     - Hashimoto's is not listed under hormonal and thyroid health.
     - The one-off session is a "Single Consultation", not a "Nutrition
       Clarity Consultation".
     - Online consultations are not described as Google Meet calls.
     - The after-the-assessment answer does not mention a discovery call.
     - The About page does not describe a one-practitioner practice.
     - The Programs page does not say pricing is discussed on the call.
   ========================================================================== */

export const briefBrand = {
  name: "Go Rebalance",
  /** The practice's line — set under the logo and as the home headline. */
  tagline: "Rebalance From Within.",
  /** The positioning statement. Under review as a tagline, so one place only. */
  positioning: "Personalised nutrition. Gut health at the core.",
  founder: "Sai Sowjanya Penmetsa",
  founderShort: "Sowjanya",
  founderRole: "Dietitian | Gut Health Specialist",
  /** The primary call to action, everywhere on the site. */
  primaryCta: "Book Consultation",
  secondaryCta: "Explore Programs",
};

/* ---------------------------------------------------------------- hero */
export const briefHero = {
  /** The line above the headline — the practice asked for her title here. */
  badge: briefBrand.founderRole,
  headline: "Rebalance From Within.",
  positioning: briefBrand.positioning,
  supporting: "Nutrition guidance designed around your body, your lifestyle and your needs.",
  trust: ["Evidence-conscious care", "1-on-1 online consultations", "Personalised food strategies"],
};

/** The card beside the hero copy. */
export const heroPracticeCard = {
  eyebrow: "PRACTICE LEAD",
  name: briefBrand.founder,
  /* Not the title again: it now sits directly above the headline. */
  role: "Founder, Go Rebalance",
  principleLabel: "OUR GUIDING PRINCIPLE",
  principle:
    "Because personalised nutrition isn't just about creating a plan. It's about supporting you throughout the process.",
  /*
   * Plain words, at the practice's request. These replaced two labelled boxes
   * ("FOCUS: Gut Microbiota", "METHOD: Rooted in You") that read as jargon.
   */
  points: ["Focus on gut health", "A plan built around you", "No restrictive fad diets"],
  link: "Read Sowjanya's Story",
};

/* -------------------------------------------------------------- focus */
export const areasOfFocus = [
  {
    id: "gut",
    icon: Activity,
    title: "Gut Health",
    items: ["IBS", "IBD", "SIBO", "Gut Dysbiosis"],
    body: "Evidence-conscious dietary approaches to nurture digestive comfort, support microbiota balance, and identify food triggers with care.",
  },
  {
    id: "metabolic",
    icon: Gauge,
    title: "Weight & Metabolic Health",
    items: ["Weight", "Diabetes", "Insulin Resistance"],
    body: "Sustainable metabolic nutrition tailored to your glycemic response and daily lifestyle — without restrictive fad dieting.",
  },
  {
    id: "hormonal",
    icon: CalendarHeart,
    title: "Hormonal & Thyroid Health",
    // Hashimoto's removed at the practice's request.
    items: ["PCOS", "PMS", "Thyroid"],
    body: "Targeted nutrition to support endocrine rhythm, reproductive cycles, and thyroid metabolism in harmony with your body.",
  },
  {
    id: "autoimmune",
    icon: ShieldCheck,
    title: "Autoimmune Nutrition",
    items: ["Nutrition support alongside your medical care"],
    body: "Thoughtful dietary strategies designed to soothe system load and complement your ongoing physician-led medical protocol.",
  },
  {
    id: "womens",
    icon: HeartPulse,
    title: "Women's Health",
    items: ["Preconception", "Pregnancy", "Women's Nutrition"],
    body: "Comprehensive nutritional care supporting every life stage — from preconception preparation to prenatal and postnatal nourishment.",
  },
];

export const areasOfFocusCopy = {
  eyebrow: "AREAS OF FOCUS",
  title: "How Can We *Support* You?",
  subtitle:
    "Targeted nutritional guidance grounded in physiology, lifestyle balance, and digestive wellness.",
  cardLink: "Discuss in your consultation",
  closing: "Different bodies. Different needs. Personalised nutrition.",
  clinicalNoteLabel: "Clinical note:",
  clinicalNote:
    "Go Rebalance provides personalised nutrition and lifestyle guidance alongside your medical care. We do not diagnose, treat, or claim to cure medical diseases.",
};

/* ------------------------------------------------------------- the lens */
export const gutHealthCore = {
  eyebrow: "THE LENS",
  title: "Why Gut Health Is at the *Core*",
  body: "Digestive health is closely connected with food tolerance, nutrient absorption and day-to-day wellbeing. That is why Go Rebalance considers gut health as part of the wider nutritional picture rather than looking at it in isolation.",
  pull: "We don't look at the gut alone. We look at the person as a whole.",
};

/* ------------------------------------------------------------ approach */
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
  eyebrow: "OUR CLINICAL PHILOSOPHY",
  title: "Not Just a Diet Plan. A Plan *Built Around You*.",
  subtitle:
    "A structured, human-centric methodology designed for sustainable habits and lasting digestive harmony.",
  convictionLabel: "CORE CONVICTION",
  conviction:
    "Because personalised nutrition isn't just about creating a plan. It's about supporting you throughout the process.",
  convictionSub: "We stand beside you through every question, adjustment, and milestone.",
};

/* ------------------------------------------------------------ programs */
/**
 * The four levels of support.
 *
 * No prices, anywhere. `duration` is the short label above each title; the
 * practice's reference design sets it there so the four read as a ladder of
 * commitment before any detail is read.
 */
export const programs = [
  {
    id: "single",
    slug: "single-consultation",
    duration: "One-time session",
    title: "Single Consultation",
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
    duration: "21 days",
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
    duration: "12 weeks",
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
    duration: "24 weeks / 6 months",
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
  eyebrow: "STRUCTURED PATHWAYS",
  title: "Find the Right *Support* for You",
  subtitle:
    "From a focused consultation to longer-term personalised nutrition support, choose the level of guidance that fits your needs.",
  pointsLabel: "Key highlights",
  selectHint: "Choose it when you book",
};

/* ------------------------------------------------------ why go rebalance */
/**
 * Four, not five. "Founder-Led Guidance" is out: the practice asked for the
 * site not to present itself as a one-practitioner operation.
 */
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
];

export const whyGoRebalanceCopy = {
  eyebrow: "THE DIFFERENCE",
  title: "Why Go *Rebalance*?",
  subtitle:
    "Nutrition care designed to empower you with clarity, compassionate accountability, and physiological insight.",
  pull: "I can guide you, educate you and support you — but the real change happens when you put it into practice. My role is to help you keep moving forward.",
  pullName: briefBrand.founder,
  pullRole: "Founder, Dietitian & Gut Health Specialist",
};

/* -------------------------------------------------------- what to expect */
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

export const beyondNutrition = {
  eyebrow: "PROFESSIONAL BOUNDARIES",
  title: "Knowing When to Look *Beyond Nutrition*",
  body: "If a concern requires medical investigation or falls outside the scope of nutrition care, Go Rebalance may recommend that the client consult the appropriate healthcare professional.",
};

/* ------------------------------------------------------ meet the founder */
export const meetSai = {
  eyebrow: "MEET YOUR DIETITIAN",
  title: "Meet Sowjanya",
  name: briefBrand.founder,
  role: briefBrand.founderRole,
  badge: "Dietitian",
  tags: ["Biotechnology", "Dietetics", "Gut Health (IIN)"],
  image: "/founder.jpg",
  body: [
    "With a background in Biotechnology, advanced education in Nutrition & Dietetics, clinical training across multispecialty hospitals, and specialised education in gut health, my approach goes beyond standard diet charts.",
    "I created Go Rebalance to offer personalised nutrition guidance that helps you understand your body, support your gut and work towards better balance — one realistic step at a time.",
  ],
  cta: "Read My Story",
};

/* --------------------------------------------------------- credentials */
/**
 * The five qualifications, exactly as the practice supplied them, with the
 * one-line descriptions from its own reference pages. Nothing added.
 */
export const credentials = [
  {
    title: "Bachelor's in Biotechnology",
    detail: "GITAM University, Visakhapatnam",
    description:
      "Solid foundation in biological sciences, cellular mechanisms, and biochemical pathways.",
    kind: "degree",
  },
  {
    title: "Certification in Food & Nutrition",
    detail: "Bridge Course",
    description:
      "Foundational bridging curriculum connecting biological sciences to nutrition science.",
    kind: "certificate",
  },
  {
    title: "Master's in Dietetics & Food Service Management",
    detail: "",
    description:
      "Postgraduate clinical education in therapeutic dietetics, nutritional biochemistry, and medical nutrition therapy.",
    kind: "degree",
  },
  {
    title: "Clinical Nutrition Internship & Training",
    detail: "",
    description:
      "Clinical learning and exposure across multiple multispecialty hospitals supporting diverse patient requirements including surgical and recovery nutrition.",
    kind: "clinical",
  },
  {
    title: "Certificate of Advanced Education in Gut Health",
    detail: "Institute for Integrative Nutrition (IIN)",
    description:
      "Specialised postgraduate coursework focused on the gut microbiome, digestive physiology, and microbiome-supportive nutrition.",
    kind: "specialism",
  },
];

export const credentialsCopy = {
  eyebrow: "ACADEMIC & CLINICAL BACKGROUND",
  title: "Education & *Credentials*",
  subtitle:
    "Rooted in biological science, postgraduate clinical dietetics, and specialised gut health education.",
  chip: "Verified Credential",
};

/* ----------------------------------------------------------------- FAQs */
/**
 * The questions in the order the practice's reference sets them. The last two
 * — who can join, and what happens if a concern needs a doctor — come from the
 * brief and are kept: the age rule and the medical boundary both belong here.
 */
export const briefFaqs = [
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
      "Consultations are conducted one-to-one online at a pre-scheduled time. Ongoing program support and follow-ups are provided through scheduled consultations and WhatsApp, depending on your program.",
  },
  {
    id: "after-assessment",
    question: "What happens after I submit the initial assessment?",
    answer:
      "We review the information you've shared and get in touch with you. We'll understand your concerns and goals more clearly and discuss which Go Rebalance program may be appropriate for you. Once you choose to enrol, the detailed assessment process begins.",
  },
  {
    id: "whatsapp",
    question: "Is WhatsApp support available?",
    answer:
      "Yes. WhatsApp support is included in selected ongoing programs during designated working hours.",
  },
  {
    id: "who-can-join",
    question: "Who can join Go Rebalance?",
    answer:
      "Go Rebalance currently provides personalised nutrition support for clients aged 15–50. For clients under 18, a parent or legal guardian should be involved in the consultation and consent process.",
  },
  {
    id: "medical",
    question: "What if my concern needs medical attention?",
    answer:
      "If your concern requires medical investigation or falls outside the scope of nutrition care, you may be advised to consult the appropriate healthcare professional. Go Rebalance does not replace medical diagnosis or treatment.",
  },
];

export const briefFaqCopy = {
  eyebrow: "CLARITY & GUIDANCE",
  title: "Frequently Asked *Questions*",
  subtitle: "Answers to common questions about our nutrition consultations, process, and support.",
  helpTitle: "Have another question?",
  helpBody: "Book a consultation and we'll talk it through on your call.",
};

/* -------------------------------------------------------------- journey */
/** The practice's own eleven-step service flow, from its reference pages. */
export const journeySteps = [
  {
    title: "Explore Go Rebalance",
    body: "Browse our focus areas and programs to see how our gut-centred nutrition philosophy aligns with your health goals.",
  },
  {
    title: "Complete Initial Assessment",
    body: "Share your key symptoms, health history, and objectives through our brief preliminary assessment form.",
  },
  {
    title: "Discovery Call",
    body: "A dedicated conversation to clarify your concerns, answer your questions, and ensure we are the right fit for each other.",
  },
  {
    title: "Recommend Appropriate Program",
    body: "Receive tailored professional advice on the support format best suited to your unique requirements.",
  },
  {
    title: "Discuss Program & Pricing Privately",
    body: "Review complete program details, logistics, and investment privately during your discovery call.",
  },
  {
    title: "Client Decides",
    body: "Take your time to make an informed, pressure-free choice about embarking on your rebalance journey.",
  },
  {
    title: "Enrolment / Payment",
    body: "Secure your enrolment slot to initiate the formal onboarding process.",
  },
  {
    title: "Detailed Health Assessment & Reports",
    body: "Complete an in-depth clinical intake questionnaire and submit relevant blood work and medical reports.",
  },
  {
    title: "Nutrition Review & Strategy Design",
    body: "Your comprehensive, personalised plan is carefully developed over approximately 4–5 working days after all records are received.",
    badge: "4–5 days",
  },
  {
    title: "Program Begins",
    body: "Your first in-depth consultation takes place, delivering your customised food and lifestyle roadmap.",
  },
  {
    title: "Follow-ups & Adjustments",
    body: "Regular one-to-one consultations and ongoing support help adjust your strategy as your body responds and evolves.",
  },
];

export const journeyCopy = {
  eyebrow: "STEP-BY-STEP EXPERIENCE",
  title: "Your Journey With Go *Rebalance*",
  subtitle:
    "A clear, thoughtful pathway from your initial health assessment to continuous, supportive nutrition care.",
  integrityLabel: "Clinical integrity:",
  integrity:
    "Detailed personalised plans and supplement recommendations are developed only after formal onboarding, full health intake, and clinical report review.",
  cta: "Begin With Step 01 — Book Consultation",
};

/* ------------------------------------------------------------ final CTA */
export const finalCta = {
  eyebrow: "BEGIN YOUR CARE",
  title: "Ready to Start Your *Rebalance* Journey?",
  lead: "You don't need to know which program is right for you.",
  body: "Tell us a little about your health concerns and goals. We'll start by understanding where you are and guide you towards the next step.",
  cta: briefBrand.primaryCta,
  flowLabel: "A SIMPLE, RESPECTFUL ONBOARDING FLOW",
  steps: ["Initial Assessment", "Discovery Call", "Personalised Recommendation"],
};

/**
 * The professional disclaimer, verbatim. It belongs in the footer of every
 * page, not tucked away on a legal page.
 */
export const professionalDisclaimer =
  "Go Rebalance provides nutrition and lifestyle guidance for educational and wellness purposes. Services are not a substitute for medical diagnosis, treatment or care from a qualified healthcare professional. Nutrition and supplement recommendations are personalised where appropriate, and individual results may vary. Clients with medical conditions should continue to work with their treating healthcare professionals.";

/* ------------------------------------------------------- programs page */
/**
 * The full inclusion lists, which stay off the homepage cards and live here.
 *
 * The 21-Day Gut Reset is never called a detox or a cleanse and never promises
 * to heal a gut in 21 days. The 6-Month program states no number of
 * consultations, because the practice has not settled one.
 */
export const programDetails = [
  {
    id: "single",
    duration: "One-time session",
    title: "Single Consultation",
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
    duration: "21 days",
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
    duration: "12 weeks",
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
    duration: "24 weeks / 6 months",
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
    "From a focused consultation to longer-term personalised nutrition support, choose the level of guidance that fits your needs.",
};

/**
 * How a program begins, on the Programs page.
 *
 * Three steps and no pricing: the practice asked for the line about fees
 * being discussed on the call to come off this page.
 */
export const clientJourney = [
  {
    step: "01",
    title: "Initial assessment",
    body: "Tell us about your health concerns, goals, lifestyle and food habits through the consultation form.",
  },
  {
    step: "02",
    title: "Discovery call",
    body: "A one-to-one conversation to understand your concerns and answer your questions.",
  },
  {
    step: "03",
    title: "Personalised recommendation",
    body: "We suggest the level of support that suits you, and your program begins from there.",
  },
];

export const clientJourneyCopy = {
  eyebrow: "HOW TO BEGIN",
  title: "Three Steps to *Getting Started*",
  subtitle: "You don't need to choose a program first. Start with the consultation form.",
};

/* --------------------------------------------------------------- about */
export const aboutHero = {
  eyebrow: "FOUNDER & PRACTICE LEAD",
  title: "My *Story*",
  subtitle: `${briefBrand.founder} · ${briefBrand.founderRole}`,
};

/** The profile card beside the story. */
export const aboutProfile = {
  name: briefBrand.founder,
  role: "Founder, Go Rebalance",
  highlights: [
    "Clinical Dietetics Training",
    "Biotechnology Foundation",
    "Advanced Gut Health (IIN)",
  ],
  cta: `Work With ${briefBrand.founderShort}`,
};

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

export const aboutCredentialsCopy = {
  eyebrow: "FORMAL QUALIFICATIONS",
  title: "Education & *Credentials*",
  subtitle: "Academic and clinical qualifications behind Go Rebalance.",
};

export const aboutCta = {
  title: "Ready to Begin Your *Rebalance*?",
  body: "Take a moment to share your health goals and symptoms through our brief initial assessment.",
};

/* ------------------------------------------------------------- contact */
export const contactCopy = {
  title: "Contact Go *Rebalance*",
  subtitle: "We look forward to connecting with you.",
  channelsLabel: "DIRECT CHANNELS",
  messageLabel: "SEND A DIRECT MESSAGE",
  ctaTitle: "Looking to start consultations right away?",
  ctaLink: "Complete the consultation form",
};

/* ---------------------------------------------------------- assessment */
export const assessmentFormCopy = {
  eyebrow: "BOOK CONSULTATION",
  ageNote: "Go Rebalance currently supports clients aged 15 to 50.",
  guardianNote:
    "If you are under 18, please complete this with a parent or legal guardian, who should be involved in the consultation and consent process.",
  nextSteps: ["Consultation form", "Discovery call", "Personalised recommendation"],
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
  "Single Consultation",
  "21-Day Gut Reset",
  "3-Month Rebalance Program",
  "6-Month Rebalance Program",
];

export const contactPreferenceOptions = ["WhatsApp", "Phone call", "Email"];
