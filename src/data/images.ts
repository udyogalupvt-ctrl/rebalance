/**
 * The site's photography, in one auditable place.
 *
 * Every photograph used anywhere on the marketing site resolves through this
 * file. That is deliberate: the imagery had drifted into a scatter of ad-hoc
 * URLs pasted into components, and the results showed — a symptom card for
 * "irregular bowels" was illustrated with a plate of roast vegetables, the
 * hero ran a dark, murky kitchen photograph nobody could identify, and the
 * founder's own biography was illustrated with a stock portrait of somebody
 * else entirely.
 *
 * Two rules for anything added here:
 *
 *   1. It must be BRIGHT. The practice's palette is warm porcelain and blush;
 *      a dim, heavily-shadowed photograph fights it and reads as cheap.
 *   2. It must be TRUE. The caption and the alt text have to describe what is
 *      genuinely in the frame, not what we wish were in it.
 *
 * The two real photographs — the practitioner at her desk — are local files
 * and are always preferred over anything stock.
 */

const unsplash = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=75&w=${w}`;

/** The practice's own photography. Never replace these with stock. */
export const OWN = {
  practitioner: "/founder.jpg",
  practitionerSmall: "/founder-sm.jpg",
};

/**
 * One image per treatment program, chosen for what is actually in the frame:
 * green produce for the gut work, a warm soothing bowl for reflux, gentle
 * yoghurt and fruit for IBD, and so on.
 */
export const TREATMENT_IMAGES: Record<string, string> = {
  "gut-health": unsplash("photo-1543362906-acfc16c67564"), // green vegetables, laid out on a pale green ground
  "acid-reflux-gerd": unsplash("photo-1547592166-23ac45744acd"), // a soothing bowl of tomato soup
  "ibd-support": unsplash("photo-1654923064926-be7e64267a31"), // yoghurt with berries and oats — gentle food
  "pcos-pcod": unsplash("photo-1602881916963-5daf2d97c06e"), // a bright salad bowl on a blush ground
  "pregnancy-nutrition": unsplash("photo-1494390248081-4e521a5940db"), // fruit and yoghurt bowls, soft morning light
  "diabetes-metabolic": unsplash("photo-1512621776951-a57141f2eefd"), // a balanced wholegrain bowl
  "weight-loss": unsplash("photo-1547592180-85f173990554"), // a portioned grain bowl on linen
};

export const FALLBACK_TREATMENT_IMAGE = TREATMENT_IMAGES["gut-health"]!;

export function treatmentImage(slug: string | undefined): string {
  if (!slug) return FALLBACK_TREATMENT_IMAGE;
  return TREATMENT_IMAGES[slug] ?? FALLBACK_TREATMENT_IMAGE;
}

/** Wide, bright supporting photography for section backgrounds and cards. */
export const SUPPORTING = {
  /** A market stall of fresh produce — used behind the clinic map card. */
  produceMarket: unsplash("photo-1591586116988-62fe65164f8d", 1400),
  /** Hands offering a bowl of grains and vegetables. */
  handsWithBowl: unsplash("photo-1644704170910-a0cdf183649b", 1200),
  /** Two women cooking flatbreads together. */
  cookingTogether: unsplash("photo-1556911220-e15b29be8c8f", 1200),
};

/**
 * The hero's photographic ground and its floating detail chips.
 *
 * Kept here rather than inline in the component for the same reason as
 * everything else in this file: so the whole set of photographs the site uses
 * can be reviewed in one place and swapped for the practice's own.
 */
/**
 * The hero's background carousel.
 *
 * Four frames, cycled slowly behind the copy on the home page.
 *
 * They are chosen for how they behave as GROUND, which is a different test
 * from whether they are good photographs. The set used to open on a market
 * crate of radishes: a fine picture, and wrong here — magenta against a warm
 * porcelain palette, with detail edge to edge, so the moment it was turned up
 * far enough to see it started fighting the headline. What works is bright,
 * low-contrast, and carrying its own empty space: pale grounds, soft greens,
 * warm neutrals, one subject rather than forty.
 *
 * The set is deliberately small. A longer loop means more to download for
 * something a visitor is not meant to stare at.
 */
export const HERO_SLIDES = [
  {
    src: unsplash("photo-1547592180-85f173990554", 1600),
    alt: "A grain and vegetable bowl on a linen cloth",
  },
  {
    src: unsplash("photo-1543362906-acfc16c67564", 1600),
    alt: "Green vegetables arranged on a pale green ground",
  },
  {
    src: unsplash("photo-1494390248081-4e521a5940db", 1600),
    alt: "Fruit, yoghurt and coffee laid out in soft morning light",
  },
  {
    src: unsplash("photo-1490645935967-10de6ba17061", 1600),
    alt: "A balanced bowl of vegetables, egg and avocado",
  },
] as const;

/**
 * The opening photographs for every page that is not the home page.
 *
 * Each page hero used to be gradients only — no photograph at all above the
 * fold, and on a phone none at all, because the one framed picture the layout
 * had was hidden below lg. Five of the six pages therefore opened on flat
 * colour and a paragraph, which is what makes a site read as a blog rather
 * than as a practice.
 *
 * Each set leads with a frame that survives the crop. A page hero is a short
 * wide band, so a square flat-lay arrives magnified into an unreadable green
 * blur; photographs with a wide subject and depth — a market table, a kitchen
 * — still read as themselves. The home hero is nearly full height and takes
 * flat-lays happily, which is why the two sets differ.
 *
 * The sets are chosen for what the page is actually about, not for what
 * happens to be pretty: produce and plans behind the programs, the kitchen
 * and the clinic behind the gallery and the contact page, meals in somebody's
 * hands behind the client stories. No stock photographs of clinicians — the
 * practice has one practitioner and she has her own portrait, and a hired
 * model standing in for her is the one thing that would undo the trust the
 * rest of the page is building.
 */
export const PAGE_BACKDROPS = {
  about: [
    {
      src: unsplash("photo-1596040033229-a9821ebd058d", 1600),
      alt: "Whole spices and fresh produce laid out on pale wood",
    },
    {
      src: unsplash("photo-1494390248081-4e521a5940db", 1600),
      alt: "Fruit, yoghurt and coffee laid out in soft morning light",
    },
    {
      src: unsplash("photo-1591586116988-62fe65164f8d", 1600),
      alt: "Cauliflower, broccoli and radishes on a market table",
    },
  ],
  treatments: [
    {
      src: unsplash("photo-1591586116988-62fe65164f8d", 1600),
      alt: "Cauliflower, broccoli and radishes on a market table",
    },
    {
      src: unsplash("photo-1494390248081-4e521a5940db", 1600),
      alt: "Fruit, yoghurt and coffee laid out in soft morning light",
    },
    {
      src: unsplash("photo-1547592180-85f173990554", 1600),
      alt: "A grain and vegetable bowl on a linen cloth",
    },
  ],
  gallery: [
    {
      src: unsplash("photo-1556912999-8cd7c2582a5e", 1600),
      alt: "Herbs on a bright kitchen windowsill",
    },
    {
      src: unsplash("photo-1556911220-e15b29be8c8f", 1600),
      alt: "A woman cooking at the stove in a bright kitchen",
    },
    {
      src: unsplash("photo-1596040033229-a9821ebd058d", 1600),
      alt: "Whole spices and fresh produce laid out on pale wood",
    },
  ],
  testimonials: [
    {
      src: unsplash("photo-1494390248081-4e521a5940db", 1600),
      alt: "Fruit, yoghurt and coffee laid out in soft morning light",
    },
    {
      src: unsplash("photo-1644704170910-a0cdf183649b", 1600),
      alt: "Hands holding a bowl of grains and roasted vegetables",
    },
    {
      src: unsplash("photo-1490645935967-10de6ba17061", 1600),
      alt: "A balanced bowl of vegetables, egg and avocado",
    },
  ],
  contact: [
    {
      src: unsplash("photo-1556911220-e15b29be8c8f", 1600),
      alt: "A woman cooking at the stove in a bright kitchen",
    },
    {
      src: unsplash("photo-1556912999-8cd7c2582a5e", 1600),
      alt: "Herbs on a bright kitchen windowsill",
    },
    {
      src: unsplash("photo-1547592166-23ac45744acd", 1600),
      alt: "A warm bowl of tomato soup",
    },
  ],
} as const;

/**
 * The framed photograph beside the copy in a page hero.
 *
 * Deliberately never the same picture as that page's backdrop. The two sit
 * within a few hundred pixels of each other, so repeating one reads as a
 * loading fault rather than as a motif — the treatments page showed the same
 * market table twice, once sharp in the frame and once soft behind it.
 *
 * These were pasted inline in the page components as raw Unsplash URLs, which
 * is the drift this file exists to stop.
 */
export const PAGE_PANELS = {
  treatments: {
    src: unsplash("photo-1543362906-acfc16c67564", 1200),
    alt: "Green vegetables arranged on a pale green ground",
  },
  gallery: {
    src: unsplash("photo-1490645935967-10de6ba17061", 1200),
    alt: "A balanced bowl of vegetables, egg and avocado",
  },
  testimonials: {
    src: unsplash("photo-1556911220-e15b29be8c8f", 1200),
    alt: "Whole spices and fresh produce laid out on pale wood",
  },
  contact: {
    src: unsplash("photo-1494390248081-4e521a5940db", 1200),
    alt: "Fruit, yoghurt and coffee laid out in soft morning light",
  },
} as const;

/**
 * One photograph per phase of the program journey, on the treatments page.
 *
 * The timeline alternates its cards left and right of a spine, which left
 * half of a 860px column empty beside every entry — five large blanks down
 * the middle of the page. The pictures fill the side the card is not on, so
 * the eye has somewhere to go on each step and the section reads as five
 * moments rather than five paragraphs.
 *
 * Keyed by index, matching programJourney in src/data/content.ts.
 */
export const JOURNEY_IMAGES = [
  {
    src: unsplash("photo-1494390248081-4e521a5940db", 800),
    alt: "A morning meal laid out, the kind the assessment asks about",
  },
  {
    src: unsplash("photo-1547592180-85f173990554", 800),
    alt: "A grain and vegetable bowl on a linen cloth",
  },
  {
    src: unsplash("photo-1543362906-acfc16c67564", 800),
    alt: "Vegetables sorted into groups, as a plan sets them out",
  },
  {
    src: unsplash("photo-1556911220-e15b29be8c8f", 800),
    alt: "A woman cooking at the stove in a bright home kitchen",
  },
  {
    src: unsplash("photo-1556912999-8cd7c2582a5e", 800),
    alt: "Herbs growing on a sunlit kitchen windowsill",
  },
] as const;

/**
 * A photograph for each of the six "who we help" cards on the about page.
 *
 * These were an icon tile and two lines of text, six times over — the section
 * where a visitor is meant to recognise themselves, and the one carrying the
 * least to look at. Keyed by the card's icon name, which is what the CMS
 * stores, so a card edited in the admin still finds its picture.
 *
 * The pairings are loose on purpose. There is no honest photograph of
 * "fatigue"; what there is, is the food each of these is worked on through,
 * and that is what the practice actually does about them.
 */
export const WHO_WE_HELP_IMAGES: Record<string, { src: string; alt: string }> = {
  Activity: {
    src: unsplash("photo-1543362906-acfc16c67564", 640),
    alt: "Green vegetables laid out on a pale ground",
  },
  CalendarHeart: {
    src: unsplash("photo-1602881916963-5daf2d97c06e", 640),
    alt: "A bright salad bowl on a blush ground",
  },
  BatteryLow: {
    src: unsplash("photo-1494390248081-4e521a5940db", 640),
    alt: "Fruit, yoghurt and coffee in soft morning light",
  },
  Scale: {
    src: unsplash("photo-1547592180-85f173990554", 640),
    alt: "A portioned grain bowl on a linen cloth",
  },
  Sparkles: {
    src: unsplash("photo-1654923064926-be7e64267a31", 640),
    alt: "Yoghurt with berries and oats",
  },
  ShieldCheck: {
    src: unsplash("photo-1512621776951-a57141f2eefd", 640),
    alt: "A balanced wholegrain bowl",
  },
};

/**
 * The photograph beside the home page's FAQ.
 *
 * Chosen to answer the first question in the list — whether any of this means
 * giving up the food people actually eat — rather than to decorate a column.
 */
export const FAQ_IMAGE = {
  src: unsplash("photo-1556912999-8cd7c2582a5e", 800),
  alt: "Whole spices and fresh produce laid out on pale wood",
};

/**
 * The home hero's carousel, chosen against the brief's imagery rules.
 *
 * The brief rules out the obvious nutrition-site pictures by name: measuring
 * tapes, weighing scales, fitness models and generic salad bowls. That is not
 * a style preference — those images are the visual vocabulary of the diet
 * industry, and this practice is deliberately not that. It also names the
 * palette it wants: warm off-white and cream, muted greens, earthy neutrals.
 *
 * So this set is ingredients and kitchens rather than plated meals, and real
 * people cooking rather than models posing. The first frame is whole Indian
 * spices and produce on pale wood, which says where the practice is and what
 * it actually works with before a word is read.
 */
export const HOME_HERO_SLIDES = [
  {
    src: unsplash("photo-1596040033229-a9821ebd058d", 1600),
    alt: "Whole spices, ginger and fresh produce laid out on pale wood",
  },
  {
    src: unsplash("photo-1556912999-8cd7c2582a5e", 1600),
    alt: "Tending herbs on a sunlit kitchen windowsill",
  },
  {
    src: unsplash("photo-1490818387583-1baba5e638af", 1600),
    alt: "Fresh fruit and rhubarb arranged on a pale ground",
  },
  {
    src: unsplash("photo-1556911220-e15b29be8c8f", 1600),
    alt: "Cooking at the stove in a bright home kitchen",
  },
] as const;

/**
 * Supporting photography for the homepage sections.
 *
 * Same rules as the hero: ingredients, kitchens and real hands. Each one is
 * tied to the section it sits in rather than chosen for prettiness.
 */
export const HOME_SECTION_IMAGES = {
  /** Beside "Who We Work With" — a household cooking together. */
  whoWeWorkWith: {
    src: unsplash("photo-1556911220-e15b29be8c8f", 1200),
    alt: "Cooking an everyday meal at home",
  },
  /** Behind the gut-health statement — whole ingredients, nothing plated. */
  gutHealth: {
    src: unsplash("photo-1471193945509-9ad0617afabf", 1400),
    alt: "Fresh vegetables in crates at a market stall",
  },
  /** Beside the FAQ column — the everyday cooking the questions are about. */
  faq: {
    src: unsplash("photo-1556911220-e15b29be8c8f", 900),
    alt: "Cooking at the stove in a bright home kitchen",
  },
} as const;

/**
 * One photograph per area of focus, on the homepage.
 *
 * These were an icon tile and a list of conditions, five times over — the
 * section where somebody scans for their own problem, and the one carrying
 * nothing to look at. Each picture is the food the area is worked on through,
 * because that is the honest pairing: there is no photograph of "PCOS", and a
 * stock shot of somebody clutching their stomach would be worse than none.
 *
 * Keyed by the area's id in src/data/content.ts.
 */
export const AREA_IMAGES: Record<string, { src: string; alt: string }> = {
  gut: {
    src: unsplash("photo-1543362906-acfc16c67564", 640),
    alt: "Green vegetables laid out on a pale ground",
  },
  metabolic: {
    src: unsplash("photo-1547592180-85f173990554", 640),
    alt: "A portioned grain and vegetable bowl on linen",
  },
  hormonal: {
    src: unsplash("photo-1494390248081-4e521a5940db", 640),
    alt: "Fruit, yoghurt and coffee in soft morning light",
  },
  autoimmune: {
    src: unsplash("photo-1596040033229-a9821ebd058d", 640),
    alt: "Whole spices, ginger and turmeric on pale wood",
  },
  womens: {
    src: unsplash("photo-1490645935967-10de6ba17061", 640),
    alt: "A balanced bowl of vegetables, egg and avocado",
  },
};

export const HERO_CHIPS = [
  {
    src: unsplash("photo-1543362906-acfc16c67564", 320),
    alt: "Fresh green vegetables laid out",
    caption: "Real food",
  },
  {
    src: unsplash("photo-1512621776951-a57141f2eefd", 320),
    alt: "A balanced wholegrain bowl",
    caption: "Your kitchen",
  },
];

/**
 * One photograph per step of the method, on the home page.
 *
 * The four steps were icon-and-text only. People recognise a picture before
 * they read a heading, so each step now leads with an image — and the four
 * together tell the story in sequence, from the market to the finished plan
 * being cooked at home. Keyed by the step number in src/data/content.ts.
 */
export const PROCESS_STEP_IMAGES: Record<string, { src: string; alt: string }> = {
  "01": {
    src: unsplash("photo-1591586116988-62fe65164f8d", 640),
    alt: "Fresh vegetables laid out on a market table",
  },
  "02": {
    src: unsplash("photo-1543362906-acfc16c67564", 640),
    alt: "Green vegetables arranged in a grid, ready to be sorted",
  },
  "03": {
    src: unsplash("photo-1547592180-85f173990554", 640),
    alt: "A portioned grain and vegetable bowl on a linen cloth",
  },
  "04": {
    src: unsplash("photo-1556911220-e15b29be8c8f", 640),
    alt: "A woman cooking at the stove in a bright home kitchen",
  },
};
