export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: string;
  orientation?: "portrait" | "landscape" | "square" | "tall";
}

const U = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${w}`;

/**
 * PLACEHOLDER IMAGERY — to be replaced with the practice's own photography
 * before launch. Until then every caption and alt text describes what is
 * actually in the picture: the previous set described a clinic interior over a
 * photograph of curry, which is both misleading and useless to a screen reader.
 */
export const galleryItems: GalleryItem[] = [
  {
    id: "thali",
    src: U("photo-1786222084052-fb6f27bfb135"),
    alt: "A South Indian meal of fish on banana leaf served with curry, greens and rice",
    caption: "A balanced South Indian plate",
    category: "Nutrition",
  },
  {
    id: "consultation",
    src: U("photo-1644704170910-a0cdf183649b"),
    alt: "A woman holding a bowl of grains, broccoli and roasted vegetables",
    caption: "Portions built around real meals",
    category: "Consultation",
  },
  {
    id: "meal-plans",
    src: U("photo-1546069901-ba9599a7e63c"),
    alt: "A bowl of mixed salad leaves, grains and vegetables photographed from above",
    caption: "Personalised meal plans",
    category: "Plans",
  },
  {
    id: "indian-meals",
    src: U("photo-1606491956689-2ea866880c84"),
    alt: "Freshly fried puris served with bowls of curry and chutney",
    caption: "Gut-friendly Indian meals",
    category: "Nutrition",
  },
  {
    id: "spices",
    src: U("photo-1781332143666-5d02f0fe7865"),
    alt: "A curry in a steel bowl surrounded by fresh vegetables and herbs",
    caption: "Cooking with whole ingredients",
    category: "Community",
  },
  {
    id: "ingredients",
    src: U("photo-1490645935967-10de6ba17061"),
    alt: "A colourful bowl of vegetables, egg and avocado on a wooden table",
    caption: "Fresh, whole ingredients",
    category: "Nutrition",
  },
];

export const galleryFull: GalleryItem[] = [
  // --- Kitchen & clinic settings -------------------------------------------
  {
    id: "clinic-1",
    src: U("photo-1761051970492-0d54d728e3e3"),
    alt: "Samosas and small plates laid out on a kitchen counter",
    caption: "Snacks prepared for a group session",
    category: "Clinic",
    orientation: "landscape",
  },
  {
    id: "clinic-2",
    src: U("photo-1636647511729-6703539ba71f"),
    alt: "Hands chopping fresh vegetables on a wooden board",
    caption: "Prep work behind every plan",
    category: "Clinic",
    orientation: "square",
  },
  {
    id: "clinic-3",
    src: U("photo-1556908289-84da46520347"),
    alt: "A woman cooking at a freestanding range in a bright kitchen",
    caption: "Cooking in natural light",
    category: "Clinic",
    orientation: "portrait",
  },
  {
    id: "clinic-4",
    src: U("photo-1556911220-e15b29be8c8f"),
    alt: "A woman stirring a pot at the stove in a home kitchen",
    caption: "Everyday cooking, not special occasions",
    category: "Clinic",
    orientation: "portrait",
  },

  // --- Consultations --------------------------------------------------------
  {
    id: "cons-1",
    src: U("photo-1784984639349-65b693df010d"),
    alt: "Flatbreads, a bowl of dip and fresh flowers arranged on a table",
    caption: "Talking through a week of meals",
    category: "Consultations",
    orientation: "landscape",
  },
  {
    id: "cons-2",
    src: U("photo-1543352634-a1c51d9f1fa7"),
    alt: "Two prepared bowls of salad photographed from above on a pale surface",
    caption: "Reviewing portions together",
    category: "Consultations",
    orientation: "square",
  },
  {
    id: "cons-3",
    src: U("photo-1573497019940-1c28c88b4f3e"),
    alt: "A woman smiling warmly to camera",
    caption: "Clients who found their answer",
    category: "Consultations",
    orientation: "portrait",
  },
  {
    id: "cons-4",
    src: U("photo-1768729340731-85e386e62529"),
    alt: "Elderly hands grinding whole spices in a stone mortar and pestle",
    caption: "The food traditions we build on",
    category: "Consultations",
    orientation: "landscape",
  },

  // --- Meal plans -----------------------------------------------------------
  {
    id: "plan-1",
    src: U("photo-1602881916963-5daf2d97c06e"),
    alt: "A white bowl of corn, tomato and fresh greens",
    caption: "A fortnight's plan, one bowl at a time",
    category: "Meal Plans",
    orientation: "square",
  },
  {
    id: "plan-2",
    src: U("photo-1467453678174-768ec283a940"),
    alt: "A breakfast spread of fruit, avocado, juice and wholegrain toast",
    caption: "Breakfasts that hold until lunch",
    category: "Meal Plans",
    orientation: "landscape",
  },
  {
    id: "plan-3",
    src: U("photo-1494390248081-4e521a5940db"),
    alt: "Yoghurt bowls with berries and seeds on a wooden board",
    caption: "Cycle-aware nutrition planning",
    category: "Meal Plans",
    orientation: "landscape",
  },
  {
    id: "plan-4",
    src: U("photo-1547496502-affa22d38842"),
    alt: "A dark bowl of grains, avocado and roasted vegetables",
    caption: "Tracking how symptoms shift",
    category: "Meal Plans",
    orientation: "square",
  },

  // --- Nutrition ------------------------------------------------------------
  {
    id: "nut-1",
    src: U("photo-1512621776951-a57141f2eefd"),
    alt: "A bowl of chickpeas, avocado, tomato and salad leaves",
    caption: "Diverse fibres for gut health",
    category: "Nutrition",
    orientation: "square",
  },
  {
    id: "nut-2",
    src: U("photo-1767114915936-745dd372f1d8"),
    alt: "Spinach curry served with warm flatbread and pickles",
    caption: "A balanced Indian plate",
    category: "Nutrition",
    orientation: "landscape",
  },
  {
    id: "nut-3",
    src: U("photo-1543353071-873f17a7a088"),
    alt: "Bowls of chickpeas, greens and grains laid out on a dark surface",
    caption: "Plant-based protein sources",
    category: "Nutrition",
    orientation: "landscape",
  },
  {
    id: "nut-4",
    src: U("photo-1550989460-0adf9ea622e2"),
    alt: "A market stall stacked with fresh fruit and vegetables",
    caption: "Shopping the season",
    category: "Nutrition",
    orientation: "landscape",
  },
  {
    id: "nut-5",
    src: U("photo-1498837167922-ddd27525d352"),
    alt: "Fresh vegetables, herbs and pulses arranged in a grid",
    caption: "Anti-inflammatory ingredients",
    category: "Nutrition",
    orientation: "landscape",
  },
  {
    id: "nut-6",
    src: U("photo-1610348725531-843dff563e2c"),
    alt: "A wooden board surrounded by colourful raw vegetables and fruit",
    caption: "Micronutrients and healthy fats",
    category: "Nutrition",
    orientation: "square",
  },
  {
    id: "nut-7",
    src: U("photo-1654923064926-be7e64267a31"),
    alt: "A breakfast bowl of grains topped with berries and banana",
    caption: "Slow-release breakfasts",
    category: "Nutrition",
    orientation: "portrait",
  },
  {
    id: "nut-8",
    src: U("photo-1591586116988-62fe65164f8d"),
    alt: "Cauliflower, broccoli, radishes and onions on a market table",
    caption: "Whole vegetables, minimally processed",
    category: "Nutrition",
    orientation: "landscape",
  },

  // --- Community ------------------------------------------------------------
  {
    id: "comm-1",
    src: U("photo-1783245255807-cdc7ccb20942"),
    alt: "Two women rolling dough and cooking flatbreads together on a griddle",
    caption: "Cooking together, learning together",
    category: "Community",
    orientation: "landscape",
  },
  {
    id: "comm-2",
    src: U("photo-1576181456177-2b99ac0aa1ef"),
    alt: "Women choosing vegetables at a busy local market",
    caption: "Where the week's food starts",
    category: "Community",
    orientation: "landscape",
  },
  {
    id: "comm-3",
    src: U("photo-1485637701894-09ad422f6de6"),
    alt: "Ripe tomatoes stacked in blue crates at a market",
    caption: "Sourcing from local growers",
    category: "Community",
    orientation: "square",
  },
  {
    id: "comm-4",
    src: U("photo-1471193945509-9ad0617afabf"),
    alt: "Bunches of carrots and leeks displayed on a market stall",
    caption: "Seasonal produce workshops",
    category: "Community",
    orientation: "landscape",
  },
  {
    id: "comm-5",
    src: U("photo-1489450278009-822e9be04dff"),
    alt: "A vegetable stand loaded with fresh greens and root vegetables",
    caption: "Kitchen-first, market-first",
    category: "Community",
    orientation: "landscape",
  },
];
