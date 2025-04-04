
export type Remedy = {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  preparation: string[];
  usage: string;
  benefits: string[];
  cautions: string;
  suitableFor: string[];
  image: string;
  category: string;
};

export const remedies: Remedy[] = [
  {
    id: "1",
    name: "Turmeric Golden Milk",
    description: "A traditional Ayurvedic drink that combines the healing properties of turmeric with the nourishing qualities of milk.",
    ingredients: [
      "1 cup milk (dairy or plant-based)",
      "1/2 teaspoon turmeric powder",
      "1/4 teaspoon cinnamon",
      "Small pinch of black pepper",
      "1/2 teaspoon honey or maple syrup (optional)",
      "Small piece of ginger, grated (optional)"
    ],
    preparation: [
      "Heat the milk in a small saucepan over medium heat until it's warm but not boiling.",
      "Add turmeric, cinnamon, black pepper, and ginger if using.",
      "Whisk well to combine and prevent clumping.",
      "Let it simmer for 5-10 minutes on low heat.",
      "Strain if desired and sweeten with honey if needed."
    ],
    usage: "Drink warm before bedtime for optimal benefits.",
    benefits: [
      "Reduces inflammation",
      "Supports immunity",
      "Aids digestion",
      "Promotes sleep",
      "Cleanses the liver"
    ],
    cautions: "Not recommended for those with milk allergies. Using black pepper increases turmeric absorption but may be heating for Pitta types.",
    suitableFor: ["Vata", "Kapha", "Pitta (in moderation with cooling spices)"],
    image: "https://images.unsplash.com/photo-1578520046912-d44eb6294f90?auto=format&fit=crop&q=80&w=400&h=300",
    category: "Digestive Health"
  },
  {
    id: "2",
    name: "Triphala Digestive Tonic",
    description: "A powerful Ayurvedic formula composed of three fruits that support digestive health and gentle detoxification.",
    ingredients: [
      "1/2 teaspoon Triphala powder",
      "1 cup warm water",
      "1 teaspoon honey (optional)",
      "Slice of lemon (optional)"
    ],
    preparation: [
      "Bring water to a warm temperature (not boiling).",
      "Add Triphala powder and stir well.",
      "Let it steep for 5 minutes.",
      "Add honey and lemon if desired."
    ],
    usage: "Take on an empty stomach before bed or first thing in the morning.",
    benefits: [
      "Supports digestive function",
      "Gentle detoxification",
      "Improves elimination",
      "Provides antioxidants",
      "Balances all three doshas"
    ],
    cautions: "Start with a small dose and gradually increase. May have a laxative effect initially.",
    suitableFor: ["Vata", "Pitta", "Kapha"],
    image: "https://images.unsplash.com/photo-1554631232-110654975786?auto=format&fit=crop&q=80&w=400&h=300",
    category: "Digestive Health"
  },
  {
    id: "3",
    name: "CCF Tea (Cumin, Coriander, Fennel)",
    description: "A simple yet effective digestive tea that helps balance all three doshas and supports digestive function.",
    ingredients: [
      "1/4 teaspoon cumin seeds",
      "1/4 teaspoon coriander seeds",
      "1/4 teaspoon fennel seeds",
      "2 cups water"
    ],
    preparation: [
      "Lightly crush the seeds to release their oils.",
      "Bring water to a boil in a small pot.",
      "Add the seeds and reduce heat to low.",
      "Simmer for 5-10 minutes.",
      "Strain and serve warm."
    ],
    usage: "Sip throughout the day, especially after meals to aid digestion.",
    benefits: [
      "Reduces bloating and gas",
      "Improves digestion and absorption",
      "Balances agni (digestive fire)",
      "Gentle detoxification",
      "Reduces inflammation in the digestive tract"
    ],
    cautions: "Generally safe for most people. Excessive consumption may reduce pitta too much in some individuals.",
    suitableFor: ["Vata", "Pitta", "Kapha"],
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=400&h=300",
    category: "Digestive Health"
  },
  {
    id: "4",
    name: "Neem Face Mask",
    description: "A purifying face mask that helps clear acne, reduce excess oil, and soothe inflamed skin.",
    ingredients: [
      "1 tablespoon neem powder",
      "1 tablespoon sandalwood powder",
      "1 teaspoon turmeric powder (a small pinch)",
      "Sufficient rose water or plain water to make a paste"
    ],
    preparation: [
      "Combine neem powder, sandalwood powder, and turmeric in a small bowl.",
      "Gradually add rose water to form a smooth paste.",
      "Adjust consistency as needed—it should be thick enough to apply but not runny."
    ],
    usage: "Apply to clean face, leave for 15-20 minutes until almost dry, then rinse with cool water. Use 1-2 times weekly.",
    benefits: [
      "Purifies and detoxifies skin",
      "Reduces acne and breakouts",
      "Balances excess oil production",
      "Soothes inflamed skin",
      "Has natural antibacterial properties"
    ],
    cautions: "Patch test first. Turmeric may temporarily stain the skin. Not recommended for very dry skin types.",
    suitableFor: ["Pitta skin with inflammation", "Kapha skin with excess oil", "Combination skin"],
    image: "https://images.unsplash.com/photo-1551446591-142875a901a1?auto=format&fit=crop&q=80&w=400&h=300",
    category: "Skin Care"
  },
  {
    id: "5",
    name: "Coconut-Aloe Hair Mask",
    description: "A nourishing hair treatment that moisturizes dry scalp and hair while promoting growth and shine.",
    ingredients: [
      "2 tablespoons cold-pressed coconut oil",
      "2 tablespoons pure aloe vera gel",
      "5-10 drops rosemary or lavender essential oil (optional)",
      "1 teaspoon honey (optional, for extra moisture)"
    ],
    preparation: [
      "Melt coconut oil gently until just liquid (not hot).",
      "Combine with aloe vera gel and whisk until well blended.",
      "Add optional essential oils and honey if using.",
      "Mix thoroughly until smooth."
    ],
    usage: "Apply to dry hair from roots to ends. Leave for 30-60 minutes or overnight. Shampoo thoroughly afterward.",
    benefits: [
      "Deeply moisturizes dry hair and scalp",
      "Reduces frizz and adds shine",
      "Soothes irritated scalp",
      "Promotes hair growth",
      "Strengthens hair follicles"
    ],
    cautions: "Use essential oils sparingly and never directly on the scalp without dilution.",
    suitableFor: ["Vata dry hair types", "Sunburned or irritated scalp", "Damaged or color-treated hair"],
    image: "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?auto=format&fit=crop&q=80&w=400&h=300",
    category: "Skin Care"
  },
  {
    id: "6",
    name: "Ashwagandha Sleep Tonic",
    description: "A calming nighttime drink that helps reduce stress, anxiety, and promotes restful sleep.",
    ingredients: [
      "1/2 teaspoon ashwagandha powder",
      "1 cup milk (dairy or plant-based)",
      "1/4 teaspoon cardamom powder",
      "Pinch of nutmeg",
      "1/2 teaspoon honey or maple syrup (optional)"
    ],
    preparation: [
      "Heat milk in a small saucepan over medium heat.",
      "Add ashwagandha, cardamom, and nutmeg.",
      "Whisk to combine and prevent clumping.",
      "Simmer on low heat for 5 minutes.",
      "Remove from heat and add sweetener if desired."
    ],
    usage: "Drink 30-60 minutes before bedtime for optimal sleep benefits.",
    benefits: [
      "Reduces stress and anxiety",
      "Supports adrenal health",
      "Promotes deeper sleep",
      "Calms the nervous system",
      "Provides adaptogenic support"
    ],
    cautions: "Ashwagandha may interact with certain medications. Not recommended during pregnancy without medical supervision.",
    suitableFor: ["Vata imbalances with anxiety", "Individuals with stress-related sleep issues", "Those with adrenal fatigue"],
    image: "https://images.unsplash.com/photo-1455371577600-3370ceb4f1a7?auto=format&fit=crop&q=80&w=400&h=300",
    category: "Mental Wellness"
  },
  {
    id: "7",
    name: "Brahmi Brain Tonic",
    description: "A rejuvenating herb preparation that supports cognitive function, memory, and mental clarity.",
    ingredients: [
      "1 teaspoon Brahmi powder (Bacopa monnieri)",
      "1 cup warm water or milk",
      "1/4 teaspoon ghee",
      "Small pinch of black pepper",
      "Honey to taste (optional)"
    ],
    preparation: [
      "If using water, bring to a gentle simmer.",
      "Add Brahmi powder and black pepper.",
      "Stir well and simmer on low for 3-5 minutes.",
      "Remove from heat and add ghee.",
      "Add honey if desired once the mixture has cooled slightly."
    ],
    usage: "Take once daily, preferably in the morning. Can be consumed regularly for cognitive benefits.",
    benefits: [
      "Enhances memory and concentration",
      "Reduces anxiety and mental fatigue",
      "Supports nervous system health",
      "Provides neuroprotective effects",
      "Balances neurotransmitters"
    ],
    cautions: "May increase secretions in some people. Start with a small amount and increase gradually.",
    suitableFor: ["Students and professionals needing mental clarity", "Older adults concerned about cognitive health", "Those with high stress affecting memory"],
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400&h=300",
    category: "Mental Wellness"
  },
  {
    id: "8",
    name: "Nasya Oil Therapy",
    description: "An ancient Ayurvedic practice of administering herbal oils into the nasal passages to clear the sinuses and promote mental clarity.",
    ingredients: [
      "5 drops sesame oil or specialized nasya oil",
      "Optional: 1-2 drops of eucalyptus or peppermint essential oil (for congestion)"
    ],
    preparation: [
      "Warm the oil slightly by placing the bottle in warm water (oil should be warm, not hot).",
      "If adding essential oils, mix thoroughly with the base oil."
    ],
    usage: "Lie back with your head tilted backward. Place 2-3 drops in each nostril, sniff gently, and remain in position for 1 minute. Best performed in the morning after cleaning the face.",
    benefits: [
      "Clears sinus congestion",
      "Improves mental clarity",
      "Reduces headaches",
      "Moisturizes nasal passages",
      "Promotes prana flow to the brain"
    ],
    cautions: "Avoid during acute sinus infections or if mucus is colored. Not for children under 7 years.",
    suitableFor: ["Vata types with dry nasal passages", "Those experiencing seasonal allergies", "People seeking mental clarity"],
    image: "https://images.unsplash.com/photo-1598483957461-e547e58f31bc?auto=format&fit=crop&q=80&w=400&h=300",
    category: "Detoxification"
  }
];

export const remedyCategories = [
  "All Remedies",
  "Digestive Health", 
  "Skin Care", 
  "Mental Wellness", 
  "Detoxification"
];

export const getRemediesByCategory = (category: string) => {
  if (category === "All Remedies") {
    return remedies;
  }
  return remedies.filter(remedy => remedy.category === category);
};

export const getRemedyById = (id: string) => {
  return remedies.find(remedy => remedy.id === id);
};
