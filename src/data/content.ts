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

export const brand = {
  name: "GoRebalance",
  tagline: "Gut Health · Nutrition · Balance",
  practitioner: "Dt. N. Sai Sowjanya",
  credential: "Clinical Nutritionist & Gut Health Specialist",
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
    mapPoster:
      "https://images.unsplash.com/photo-1786640442878-0c216561af21?auto=format&fit=crop&q=80&w=1400",
    hours: ["Mon – Sat · 10:00 AM – 7:00 PM", "Sunday · Closed"],
    note: "Consultation Clinic",
  },
];

export const credibilityItems = [
  { icon: ShieldCheck, label: "Certified Clinical Nutritionist" },
  { icon: Microscope, label: "Root-Cause Gut Protocols" },
  { icon: Salad, label: "Personalised Indian Meal Plans" },
  { icon: HeartPulse, label: "PCOS & Hormonal Support" },
  { icon: Activity, label: "IBS · Bloating · Acidity" },
  { icon: Video, label: "Online Consultations Pan-India" },
  { icon: MapPin, label: "Kakinada Clinic" },
];

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
    title: "Root-Cause Analysis",
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

export const practitioner = {
  name: "Dt. N. Sai Sowjanya",
  role: "Clinical Nutritionist & Gut Health Specialist",
  image:
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800",
  bio: [
    "I'm Dt. N. Sai Sowjanya, a clinical nutritionist specialising in gut health, digestive disorders and hormonal balance. I consult from my clinic in Kakinada, Andhra Pradesh — and online with clients across India.",
    "My approach is simple: symptoms are messages, not problems to be silenced. Before I build a single meal plan, I want to understand your digestion, your sleep, your stress, your cycle and what your day actually looks like. That's where the real answers live.",
    "Every plan I create is built around real Indian food — your kitchen, your family's meals, your schedule and your budget. No exotic ingredients, no crash diets, no protocols you'll abandon in three weeks.",
  ],
  quote:
    "Nutrition isn't about restriction. It's about giving your body the right environment to heal itself.",
};

export const stats = [
  { value: "500+", label: "Clients Rebalanced" },
  { value: "8+", label: "Years of Practice" },
  { value: "15+", label: "Conditions Treated" },
  { value: "4.9", label: "Client Rating", hasStar: true },
];

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
      "Dt. Sai Sowjanya reviews your submission personally — your symptoms, history, medications, lifestyle and nutrition log. You'll be contacted within 24 hours to schedule your consultation, where we go through what's actually driving your symptoms and what your plan will look like.",
  },
  {
    id: "privacy",
    question: "Is my health information kept private?",
    answer:
      "Yes. Everything you share in the assessment is confidential and used only to build and adjust your plan. It isn't shared, sold or used for anything else.",
  },
];

export const treatments = [
  {
    id: "gut-health",
    slug: "gut-health",
    category: "Gut & Digestion",
    icon: Activity,
    title: "Gut Health & Digestion",
    shortTitle: "Gut Health & Digestion",
    summary:
      "Rebuilding the gut lining, digestive capacity and microbiome balance — so food stops being something you brace for.",
    description:
      "IBS, bloating, acidity, constipation and food intolerances — treated by rebuilding the gut lining and microbiome, not by masking symptoms.",
    conditions: [
      "IBS (constipation & diarrhoea predominant)",
      "Chronic bloating & flatulence",
      "Acid reflux & GERD",
      "Constipation",
      "Food intolerances",
      "Leaky gut & dysbiosis",
      "H. pylori support",
      "Post-antibiotic gut recovery",
    ],
    involves: [
      "A staged elimination and reintroduction protocol built around your regular meals",
      "Meal timing and portion restructuring before any food is removed",
      "Targeted gut-repair nutrition, with supplements only where a gap is clear",
      "Fortnightly reviews to track symptom shifts and adjust",
    ],
    timeline:
      "Digestive symptoms usually ease within 3–5 weeks. Full gut repair and stable tolerance typically takes 4–6 months.",
    tags: ["IBS", "Bloating", "Acid Reflux", "Constipation", "Intolerances"],
  },
  {
    id: "pcos-hormonal",
    slug: "pcos-hormonal",
    category: "Hormonal",
    icon: CalendarHeart,
    title: "PCOS & Hormonal Balance",
    shortTitle: "PCOS & Hormonal Balance",
    summary:
      "Cycle regulation and insulin support through nutrition that works with your hormones rather than overriding them.",
    description:
      "Cycle regulation, insulin resistance and fertility-supportive nutrition, built around how your hormones actually behave.",
    conditions: [
      "PCOS & PCOD",
      "Irregular or absent cycles",
      "Painful periods & PMS",
      "Insulin resistance",
      "Unexplained weight gain",
      "Hirsutism & hormonal acne",
      "Fertility-supportive nutrition",
      "Perimenopause support",
    ],
    involves: [
      "Insulin-first meal structuring to stabilise blood sugar across the day",
      "Cycle-aware nutrition adjusted to your phase where relevant",
      "Gut and liver support, since hormone clearance depends on both",
      "Monthly cycle tracking to measure real progress, not just weight",
    ],
    timeline:
      "Energy and PMS often improve in 4–6 weeks. Cycle regularity typically returns between months 3 and 6.",
    tags: ["PCOS", "Irregular Cycles", "Insulin Resistance", "Fertility"],
  },
  {
    id: "weight-management",
    slug: "weight-management",
    category: "Metabolic",
    icon: Scale,
    title: "Weight Management",
    shortTitle: "Weight Management",
    summary:
      "Fat loss or healthy weight gain built on metabolic repair — not restriction that your body eventually undoes.",
    description:
      "Sustainable fat loss and healthy weight gain that works with your metabolism instead of starving it into shutdown.",
    conditions: [
      "Stubborn weight plateaus",
      "Post-pregnancy weight",
      "Underweight & healthy weight gain",
      "Yo-yo dieting recovery",
      "Metabolic adaptation from prolonged dieting",
      "Emotional & stress eating",
      "Visceral fat reduction",
    ],
    involves: [
      "Metabolic assessment before any calorie change is considered",
      "Adequate protein and fibre structured into your existing meals",
      "Habit and hunger work alongside the plan, not after it",
      "Progress tracked through measurements, energy and adherence — not the scale alone",
    ],
    timeline:
      "Consistent, sustainable change appears from week 6 onward. Most clients work over 4–6 months to make it hold.",
    tags: ["Fat Loss", "Healthy Gain", "Plateaus", "Metabolism"],
  },
  {
    id: "thyroid-metabolic",
    slug: "thyroid-metabolic",
    category: "Metabolic",
    icon: Gauge,
    title: "Thyroid & Metabolic Health",
    shortTitle: "Thyroid & Metabolic Health",
    summary:
      "Nutrition support for thyroid function, insulin sensitivity and the fatigue that comes with both.",
    description:
      "Hypothyroidism, insulin resistance and pre-diabetes — nutrition that supports energy, mood and metabolic repair.",
    conditions: [
      "Hypothyroidism",
      "Hashimoto's thyroiditis",
      "Subclinical thyroid dysfunction",
      "Insulin resistance & pre-diabetes",
      "Type 2 diabetes support",
      "Fatty liver (NAFLD)",
      "High cholesterol & triglycerides",
    ],
    involves: [
      "Nutrient repletion for the cofactors thyroid function depends on",
      "Blood sugar stabilisation through meal composition and timing",
      "Gut support, since absorption and conversion both depend on it",
      "Coordination with your physician's prescribed medication — never replacing it",
    ],
    timeline:
      "Energy and digestion usually improve within 4–8 weeks. Metabolic markers are best reassessed at 3–6 months.",
    tags: ["Thyroid", "Insulin Resistance", "Fatty Liver", "Cholesterol"],
  },
  {
    id: "skin-hair-immunity",
    slug: "skin-hair-immunity",
    category: "Skin & Immunity",
    icon: Sparkles,
    title: "Skin, Hair & Immunity",
    shortTitle: "Skin, Hair & Immunity",
    summary:
      "Treating acne, hair fall and recurring infections through the gut–skin axis and the nutrient gaps underneath them.",
    description:
      "Acne, hair fall, eczema and recurring infections addressed through the gut–skin axis and targeted nutrient repletion.",
    conditions: [
      "Hormonal & inflammatory acne",
      "Diffuse hair fall & thinning",
      "Eczema & psoriasis support",
      "Chronic urticaria & skin allergies",
      "Recurrent infections",
      "Low immunity & frequent illness",
      "Nutritional deficiencies (iron, B12, D, zinc)",
    ],
    involves: [
      "Identifying dietary and gut triggers before removing anything broadly",
      "Anti-inflammatory nutrition adapted to Indian home cooking",
      "Correcting the specific deficiencies your history and reports point to",
      "Photographic and symptom tracking across the plan",
    ],
    timeline:
      "Skin often responds between weeks 6 and 10. Hair growth cycles mean visible change usually takes 3–5 months.",
    tags: ["Acne", "Hair Fall", "Allergies", "Immunity"],
  },
  {
    id: "lifestyle-preventive",
    slug: "lifestyle-preventive",
    category: "Preventive",
    icon: ShieldCheck,
    title: "Lifestyle & Preventive Nutrition",
    shortTitle: "Preventive Nutrition",
    summary:
      "Getting ahead of a family history, or building nutrition into a household before anything goes wrong.",
    description:
      "Diabetes reversal support, cholesterol management, and family or corporate nutrition plans for long-term prevention.",
    conditions: [
      "Diabetes prevention & reversal support",
      "Cardiovascular risk reduction",
      "Family nutrition planning",
      "Corporate & workplace nutrition",
      "Elderly nutrition support",
      "Sports & active-lifestyle nutrition",
      "General wellness optimisation",
    ],
    involves: [
      "A risk review across family history, current markers and lifestyle",
      "Practical household-level changes rather than individual restriction",
      "Sustainable habit design built around how your week actually runs",
      "Quarterly reviews to keep the plan current",
    ],
    timeline:
      "Habits stabilise within 6–8 weeks. Preventive programs are usually reviewed quarterly over a year.",
    tags: ["Diabetes", "Cholesterol", "Family Plans", "Corporate"],
  },
];

export const socials = [
  { label: "Instagram", href: "#", icon: "Instagram" },
  { label: "Facebook", href: "#", icon: "Facebook" },
  { label: "Youtube", href: "#", icon: "Youtube" },
  { label: "WhatsApp", href: brand.whatsapp, icon: "MessageCircle" },
];

export const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];
export const testimonials = [
  {
    id: "sravani-r",
    quote:
      "I'd stopped eating out entirely because every meal ended with me unbuttoning my jeans and lying down. Six weeks into the plan, the bloating was just… gone. I ate at a wedding last month and felt completely normal afterwards.",
    name: "Sravani R.",
    initials: "SR",
    location: "Kakinada, Andhra Pradesh",
    condition: "Bloating & IBS",
    category: "Gut & Digestion",
    duration: "4 months",
    rating: 5,
    fullStory:
      "It was debilitating. I'd avoid social gatherings because I knew I'd be in pain by the end of the night. After the assessment, we didn't just 'remove foods', we rebalanced the timing and portions. It felt manageable from day one.",
    before: ["Chronic bloating", "IBS-D"],
    after: ["Normal digestion", "Stable meals"],
    featured: true,
  },
  {
    id: "harika-m",
    quote:
      "My cycles had been irregular for almost three years and I was told to just take the pill. Dt. Sowjanya actually asked about my sleep, my stress and my food timing. By month four my periods came on their own, and they've been regular since.",
    name: "Harika M.",
    initials: "HM",
    location: "Kakinada, Andhra Pradesh",
    condition: "PCOS",
    category: "PCOS & Hormonal",
    duration: "6 months",
    rating: 5,
    before: ["Irregular cycles", "Hormonal acne"],
    after: ["Regular cycle", "Clear skin"],
  },
  {
    id: "praveen-k",
    quote:
      "I'd been on antacids nearly every night for four years. She rebuilt my meal timing before touching anything else. I haven't opened that medicine drawer in five months and my sleep improved on its own.",
    name: "Praveen K.",
    initials: "PK",
    location: "Kakinada, Andhra Pradesh",
    condition: "Acid Reflux",
    category: "Gut & Digestion",
    duration: "5 months",
    rating: 5,
    before: ["Daily antacids", "Poor sleep"],
    after: ["No reflux", "Deep sleep"],
    featured: true,
  },
  {
    id: "deepthi-v",
    quote:
      "Eleven kilos down, but honestly the bigger change is that I'm not exhausted at 4 PM anymore. Nothing in the plan was exotic — it was my mother's cooking, just organised properly.",
    name: "Deepthi V.",
    initials: "DV",
    location: "Kakinada, Andhra Pradesh",
    condition: "Weight Management",
    category: "Weight",
    duration: "5 months",
    rating: 5,
    before: ["Constant fatigue", "Weight plateau"],
    after: ["Stable energy", "Weight loss"],
    featured: true,
  },
  {
    id: "anusha-t",
    quote:
      "I came for hair fall and ended up fixing my digestion, which I didn't even know was the problem. My skin cleared up as a side effect. Nobody had connected those things for me before.",
    name: "Anusha T.",
    initials: "AT",
    location: "Kakinada, Andhra Pradesh",
    condition: "Hair Fall & Gut Health",
    category: "Skin & Hair",
    duration: "3 months",
    rating: 5,
  },
  {
    id: "v1",
    quote: "PCOS symptoms gone.",
    name: "A.",
    initials: "A",
    location: "Online consultation",
    condition: "PCOS",
    category: "PCOS & Hormonal",
    duration: "3m",
    rating: 5,
  },
  {
    id: "v2",
    quote: "Weight is finally moving.",
    name: "B.",
    initials: "B",
    location: "Kakinada",
    condition: "Weight",
    category: "Weight",
    duration: "4m",
    rating: 5,
  },
  {
    id: "v3",
    quote: "Thyroid levels stable.",
    name: "C.",
    initials: "C",
    location: "Online consultation",
    condition: "Thyroid",
    category: "Thyroid & Metabolic",
    duration: "6m",
    rating: 5,
  },
  {
    id: "v4",
    quote: "Bloating decreased.",
    name: "D.",
    initials: "D",
    location: "Online consultation",
    condition: "Gut",
    category: "Gut & Digestion",
    duration: "2m",
    rating: 5,
  },
  {
    id: "v5",
    quote: "Energy is back.",
    name: "E.",
    initials: "E",
    location: "Kakinada",
    condition: "Metabolic",
    category: "Thyroid & Metabolic",
    duration: "5m",
    rating: 5,
  },
  {
    id: "v6",
    quote: "Cravings vanished.",
    name: "F.",
    initials: "F",
    location: "Online consultation",
    condition: "PCOS",
    category: "PCOS & Hormonal",
    duration: "4m",
    rating: 5,
  },
  {
    id: "v7",
    quote: "Skin is glowing.",
    name: "G.",
    initials: "G",
    location: "Kakinada",
    condition: "Weight",
    category: "Weight",
    duration: "3m",
    rating: 5,
  },
  {
    id: "v8",
    quote: "Digestion is perfect.",
    name: "H.",
    initials: "H",
    location: "Online consultation",
    condition: "Gut",
    category: "Gut & Digestion",
    duration: "2m",
    rating: 5,
  },
  {
    id: "v9",
    quote: "Hormones balanced.",
    name: "I.",
    initials: "I",
    location: "Online consultation",
    condition: "PCOS",
    category: "PCOS & Hormonal",
    duration: "4m",
    rating: 5,
  },
  {
    id: "v10",
    quote: "Felt so supported.",
    name: "J.",
    initials: "J",
    location: "Kakinada",
    condition: "Gut",
    category: "Gut & Digestion",
    duration: "3m",
    rating: 5,
  },
];

export const testimonialsFull = testimonials;
export * from "./gallery";
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Treatments", href: "#treatments" },
  { label: "Gallery", href: "#gallery" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

// === ABOUT PAGE — PRACTITIONER STORY ===
export const practitionerStory = {
  portrait: {
    // Was a stock photograph of a stranger, captioned with the practitioner's
    // name — a false attribution on the page that introduces her.
    src: "/founder.jpg",
    alt: "Dt. N. Sai Sowjanya at her desk in the GoRebalance clinic, Kakinada",
    caption: "Dt. N. Sai Sowjanya at the Kakinada clinic",
  },
  intro:
    "Most people arrive at a nutritionist with a list of symptoms and a folder of reports that say nothing is wrong. Bloating that has lasted years. Cycles that never settled. Fatigue that sleep doesn't fix. They have usually been told, kindly and repeatedly, that this is normal. It rarely is.",
  paragraphs: [
    "Dt. N. Sai Sowjanya trained as a clinical nutritionist and spent her early practice doing what the field taught — calculating requirements, writing plans, adjusting macros. The plans worked, for a while. Then clients would return with the same complaints in a different order, and the honest conclusion was that something upstream had never been addressed.",
    "That something was almost always the gut. Digestion sits underneath energy, immunity, skin, mood and hormones, and when it is compromised, every plan built on top of it is temporary. So the practice changed shape. Instead of starting with a diet chart, she started with a conversation — one long enough to hear what a symptom sheet leaves out.",
    "Today that first conversation covers digestion, sleep, stress, medication history, menstrual health, work hours, screen time and what a real day of eating actually looks like. Not because every detail matters equally, but because the pattern only becomes visible when you have all of it in front of you.",
  ],
  pullQuote: {
    text: "A symptom is not the problem. It is the body's way of telling you where to look.",
    attribution: "Dt. N. Sai Sowjanya",
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
    "Functional & Root-Cause Nutrition Approach",
    "PCOS, Thyroid & Hormonal Nutrition",
    "Therapeutic Diet Planning for Lifestyle Disorders",
    "8+ Years of Clinical Consultation Practice",
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
    "Most clients arrive with reports that came back normal and symptoms that never did. If any of these describe you, there is usually a root cause worth finding.",
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

export const aboutCtaCopy = {
  title: "You've read the approach. Now let's apply it to *you*.",
  subtitle:
    "The assessment is where the work actually begins — your symptoms, history, medications, lifestyle and food habits, reviewed personally by Dt. Sai Sowjanya.",
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
      "Then something in the assessment was incomplete or the root cause sits outside nutrition — and you'll be told that directly rather than sold another package. In some cases the right next step is a referral to a physician or specialist, and that recommendation will be made honestly.",
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
    "The assessment identifies which root cause is driving your symptoms and which program fits — reviewed personally by Dt. Sai Sowjanya within 24 hours.",
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
    "The assessment covers your symptoms, history, lifestyle and food habits — reviewed personally by Dt. Sai Sowjanya within 24 hours.",
};

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
