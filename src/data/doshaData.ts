
export type DoshaType = 'vata' | 'pitta' | 'kapha' | 'vata-pitta' | 'pitta-kapha' | 'vata-kapha' | 'tridosha';

export type DoshaQuestion = {
  id: number;
  question: string;
  options: {
    vata: string;
    pitta: string;
    kapha: string;
  };
};

export const doshaQuestions: DoshaQuestion[] = [
  {
    id: 1,
    question: "How would you describe your body frame?",
    options: {
      vata: "Thin, light, difficult to gain weight",
      pitta: "Medium build, moderate weight",
      kapha: "Larger build, gains weight easily",
    },
  },
  {
    id: 2,
    question: "How is your skin typically?",
    options: {
      vata: "Dry, rough, or thin",
      pitta: "Warm, reddish, prone to rashes",
      kapha: "Smooth, thick, oily, cool to touch",
    },
  },
  {
    id: 3,
    question: "Which best describes your appetite?",
    options: {
      vata: "Variable, sometimes forget to eat",
      pitta: "Strong, irritable when hungry",
      kapha: "Steady, can skip meals easily",
    },
  },
  {
    id: 4,
    question: "How would you describe your sleep pattern?",
    options: {
      vata: "Light sleeper, tendency to wake up",
      pitta: "Moderate sleep, usually sufficient",
      kapha: "Deep, heavy sleep, hard to wake up",
    },
  },
  {
    id: 5,
    question: "How do you typically respond to stress?",
    options: {
      vata: "Anxious, worried, overthinking",
      pitta: "Irritable, frustrated, angry",
      kapha: "Calm initially, but can become withdrawn",
    },
  },
];

export type DoshaProfile = {
  dosha: DoshaType;
  description: string;
  characteristics: string[];
  recommendedFoods: string[];
  foodsToAvoid: string[];
  idealRoutine: {
    morning: string[];
    afternoon: string[];
    evening: string[];
  };
  exercises: string[];
  practices: string[];
};

export const doshaProfiles: Record<DoshaType, DoshaProfile> = {
  vata: {
    dosha: 'vata',
    description: "Vata is characterized by the qualities of air and space. People with vata predominance are typically creative, energetic, and quick-thinking, but can be prone to worry and anxiety when out of balance.",
    characteristics: [
      "Light, thin body frame",
      "Dry skin and hair",
      "Variable appetite and digestion",
      "Quick to learn and quick to forget",
      "Tendency toward cold hands and feet",
      "Light and interrupted sleep",
    ],
    recommendedFoods: [
      "Warm, cooked foods",
      "Sweet, sour, and salty tastes",
      "Dairy products",
      "Nuts and seeds",
      "Warm spices like ginger and cinnamon",
      "Ghee and oils",
    ],
    foodsToAvoid: [
      "Raw vegetables",
      "Dry foods like crackers",
      "Bitter and astringent tastes",
      "Cold drinks and foods",
      "Beans and legumes in excess",
      "Caffeine",
    ],
    idealRoutine: {
      morning: [
        "Wake up by 6:30 AM",
        "Self-massage with warm sesame oil",
        "Gentle yoga or stretching",
        "Warm breakfast",
      ],
      afternoon: [
        "Regular, warm lunch at noon",
        "Short walk after lunch",
        "Limit screen time",
        "Stay hydrated with warm drinks",
      ],
      evening: [
        "Eat dinner by 6:30 PM",
        "Wind down activities by 9 PM",
        "Gentle stretching",
        "Sleep by 10 PM",
      ],
    },
    exercises: [
      "Gentle yoga",
      "Walking in nature",
      "Swimming in warm water",
      "Tai chi",
      "Dancing",
    ],
    practices: [
      "Oil massage (Abhyanga)",
      "Regular meditation",
      "Establishing consistent routines",
      "Using warming essential oils",
      "Staying warm and protected",
    ],
  },
  pitta: {
    dosha: 'pitta',
    description: "Pitta is characterized by the qualities of fire and water. Pitta types are typically passionate, intelligent, and driven, but can become irritable and overly competitive when out of balance.",
    characteristics: [
      "Medium build with good musculature",
      "Warm skin, often reddish",
      "Strong appetite and digestion",
      "Sharp intellect and good concentration",
      "Moderate to heavy perspiration",
      "Strong leadership qualities",
    ],
    recommendedFoods: [
      "Cool or warm (not hot) foods",
      "Sweet, bitter, and astringent tastes",
      "Basmati rice, wheat, oats",
      "Sweet fruits like mangoes and melons",
      "Cooling herbs like coriander and fennel",
      "Moderate dairy consumption",
    ],
    foodsToAvoid: [
      "Hot, spicy foods",
      "Fermented foods",
      "Sour tastes and acidic foods",
      "Red meat",
      "Hot spices like cayenne and chili",
      "Alcohol",
    ],
    idealRoutine: {
      morning: [
        "Wake up by 6:00 AM",
        "Cool shower or splash cool water",
        "Moderate exercise in cool hours",
        "Refreshing breakfast",
      ],
      afternoon: [
        "Substantial lunch at midday",
        "Short rest after lunch",
        "Creative work in cooler spaces",
        "Cold drinks with lime or mint",
      ],
      evening: [
        "Eat dinner by 7:00 PM",
        "Cooling activities after dinner",
        "Relaxation practices",
        "Sleep by 10:30 PM",
      ],
    },
    exercises: [
      "Swimming",
      "Walking in cool environments",
      "Moderate hiking",
      "Cycling",
      "Team sports (without becoming too competitive)",
    ],
    practices: [
      "Cooling oil massages (coconut oil)",
      "Moonlight walks",
      "Relaxation and meditation",
      "Cooling pranayama",
      "Being in nature, especially near water",
    ],
  },
  kapha: {
    dosha: 'kapha',
    description: "Kapha is characterized by the qualities of earth and water. Kapha types are typically calm, stable, and supportive, but can become lethargic and stubborn when out of balance.",
    characteristics: [
      "Solid, heavier build",
      "Smooth, oily skin",
      "Steady appetite, slow digestion",
      "Excellent long-term memory",
      "Tendency toward cold and congestion",
      "Deep, heavy sleep",
    ],
    recommendedFoods: [
      "Light, warm, dry foods",
      "Pungent, bitter, and astringent tastes",
      "Beans and legumes",
      "Light fruits like apples and pears",
      "Heating spices like pepper and ginger",
      "Honey in moderation",
    ],
    foodsToAvoid: [
      "Heavy, cold, oily foods",
      "Dairy products",
      "Sweet and salty tastes",
      "Nuts and seeds in excess",
      "Refrigerated foods and drinks",
      "Sweeteners and desserts",
    ],
    idealRoutine: {
      morning: [
        "Wake up by 5:30 AM",
        "Vigorous exercise in the morning",
        "Dry brush massage",
        "Light, warm breakfast",
      ],
      afternoon: [
        "Moderate lunch",
        "Mental stimulation and activity",
        "Avoid napping",
        "Warm, stimulating teas",
      ],
      evening: [
        "Light dinner by 6:00 PM",
        "Evening walk",
        "Stimulating conversation",
        "Sleep by 10:00 PM",
      ],
    },
    exercises: [
      "Vigorous yoga",
      "Cardio exercises",
      "Weight training",
      "Running",
      "High-intensity interval training",
    ],
    practices: [
      "Dry brushing",
      "Steam sauna",
      "Dynamic meditation",
      "New activities and learning",
      "Regular detoxification practices",
    ],
  },
  "vata-pitta": {
    dosha: 'vata-pitta',
    description: "Vata-Pitta is a dual dosha constitution combining the elements of air, space, and fire. People with this constitution are typically creative, energetic, and intellectually sharp, but may experience both anxiety and irritability when imbalanced.",
    characteristics: [
      "Light to medium build",
      "Skin tends to be dry and warm",
      "Variable digestion and appetite",
      "Quick thinking and creative",
      "Enthusiastic but can burn out",
      "Sleep varies from light to moderate",
    ],
    recommendedFoods: [
      "Warm, moderately moist foods",
      "Sweet, slightly sour tastes",
      "Warming grains like rice and oats",
      "Moderate spices",
      "Cooked sweet fruits",
      "Moderate oils and ghee",
    ],
    foodsToAvoid: [
      "Very spicy foods",
      "Very cold foods and drinks",
      "Excessive raw vegetables",
      "Caffeine and stimulants",
      "Very sour or fermented foods",
      "Processed foods",
    ],
    idealRoutine: {
      morning: [
        "Wake up between 6:00-6:30 AM",
        "Self-massage with moderate oils",
        "Gentle to moderate yoga",
        "Nourishing, warm breakfast",
      ],
      afternoon: [
        "Substantial lunch",
        "Short walk after eating",
        "Balance work with breaks",
        "Stay hydrated with room temperature water",
      ],
      evening: [
        "Dinner by 7:00 PM",
        "Calming activities by 8:30 PM",
        "Cooling down routine",
        "Sleep by 10:00-10:30 PM",
      ],
    },
    exercises: [
      "Moderate yoga",
      "Swimming",
      "Hiking in pleasant temperatures",
      "Dancing",
      "Cycling",
    ],
    practices: [
      "Alternating warming and cooling activities",
      "Regular meditation",
      "Nature walks",
      "Creative outlets",
      "Balancing social time with solitude",
    ],
  },
  "pitta-kapha": {
    dosha: 'pitta-kapha',
    description: "Pitta-Kapha is a dual dosha constitution combining the elements of fire, water, and earth. People with this constitution tend to be grounded, determined, and methodical, but may experience both inflammatory conditions and lethargy when imbalanced.",
    characteristics: [
      "Medium to heavier build with good muscle",
      "Skin tends to be warm and somewhat oily",
      "Strong digestion with steady appetite",
      "Methodical thinking with good focus",
      "Determined and stable energy",
      "Moderate to heavy sleep",
    ],
    recommendedFoods: [
      "Moderately warm, light foods",
      "Bitter and astringent tastes",
      "Leafy greens and vegetables",
      "Beans and legumes",
      "Cooling spices like coriander",
      "Lighter grains like barley",
    ],
    foodsToAvoid: [
      "Very heavy, oily foods",
      "Excessive dairy",
      "Very hot spices",
      "Red meat",
      "Excessive sweet foods",
      "Fried foods",
    ],
    idealRoutine: {
      morning: [
        "Wake up by 6:00 AM",
        "Moderate to vigorous exercise",
        "Cool or lukewarm shower",
        "Light to moderate breakfast",
      ],
      afternoon: [
        "Moderate lunch with variety",
        "Short active break after eating",
        "Productive work with frequent short breaks",
        "Cool herbal teas",
      ],
      evening: [
        "Light dinner by 6:30 PM",
        "Evening walk",
        "Relaxing but somewhat stimulating activities",
        "Sleep by 10:00 PM",
      ],
    },
    exercises: [
      "Moderately intense yoga",
      "Swimming",
      "Weight training",
      "Hiking",
      "Competitive sports in moderation",
    ],
    practices: [
      "Alternating cooling and stimulating activities",
      "Dry brushing followed by cooling oils",
      "Regular detoxification",
      "Goal-setting and achievement practices",
      "Balance between work and relaxation",
    ],
  },
  "vata-kapha": {
    dosha: 'vata-kapha',
    description: "Vata-Kapha is a dual dosha constitution combining the elements of air, space, earth, and water. People with this constitution tend to be creative, adaptable, and nurturing, but may experience both anxiety and sluggishness when imbalanced.",
    characteristics: [
      "Variable build, often with uneven features",
      "Skin tends to be dry but can be oily in places",
      "Variable digestion and irregular appetite",
      "Creative thinking with good memory",
      "Energy fluctuates between high and low",
      "Sleep can be either very light or very heavy",
    ],
    recommendedFoods: [
      "Warm, light, somewhat dry foods",
      "Mildly spiced dishes",
      "Cooked vegetables",
      "Warming grains like quinoa",
      "Moderate use of healthy oils",
      "Warming herbs and spices",
    ],
    foodsToAvoid: [
      "Very cold foods and drinks",
      "Heavy, dense foods",
      "Excessive dairy",
      "Too many sweet tastes",
      "Very dry foods like crackers",
      "Cold desserts",
    ],
    idealRoutine: {
      morning: [
        "Wake up by 6:00 AM",
        "Energizing yoga or exercise",
        "Dry brushing followed by light oil",
        "Warm, light breakfast",
      ],
      afternoon: [
        "Regular lunch with variety",
        "Short active break after eating",
        "Maintain activity to prevent stagnation",
        "Warm spiced teas",
      ],
      evening: [
        "Light dinner by 6:30 PM",
        "Evening activity or gentle walking",
        "Consistent bedtime routine",
        "Sleep by 10:00 PM",
      ],
    },
    exercises: [
      "Varied routine combining gentle and vigorous",
      "Walking at a good pace",
      "Dancing",
      "Yoga with both calming and energizing poses",
      "Light weights with higher repetitions",
    ],
    practices: [
      "Regular routine with some flexibility",
      "Alternating stimulating and calming activities",
      "Creative expression",
      "Social connection balanced with solitude",
      "Regular, gentle detoxification",
    ],
  },
  "tridosha": {
    dosha: 'tridosha',
    description: "Tridosha or balanced constitution has relatively equal amounts of Vata, Pitta, and Kapha. People with this constitution tend to be adaptable, balanced, and resilient, but need to be attentive to whichever dosha tends to go out of balance first for them.",
    characteristics: [
      "Balanced, proportional build",
      "Clear, radiant skin",
      "Regular, good digestion",
      "Balanced cognitive abilities",
      "Steady, sustainable energy",
      "Regular, restful sleep",
    ],
    recommendedFoods: [
      "Fresh, seasonal, local foods",
      "Balanced meals with all six tastes",
      "Moderate variety in diet",
      "Freshly cooked foods",
      "Appropriate foods for the season",
      "Mindful eating practices",
    ],
    foodsToAvoid: [
      "Processed foods",
      "Excessive amounts of any food",
      "Foods inappropriate for the current season",
      "Skipping meals",
      "Overeating",
      "Eating while distracted",
    ],
    idealRoutine: {
      morning: [
        "Wake up around 6:00 AM",
        "Gentle movement or yoga",
        "Self-care practices",
        "Balanced breakfast",
      ],
      afternoon: [
        "Regular, moderate lunch",
        "Brief rest or walk after eating",
        "Focused, productive work",
        "Hydration appropriate to weather",
      ],
      evening: [
        "Moderate dinner by 7:00 PM",
        "Evening unwinding activities",
        "Reflection or meditation",
        "Sleep by 10:00-10:30 PM",
      ],
    },
    exercises: [
      "Varied routine adjusted to seasons",
      "Moderate intensity with good consistency",
      "Combination of strength, flexibility, and endurance",
      "Outdoor activity when possible",
      "Attention to form and proper technique",
    ],
    practices: [
      "Regular, moderate routine",
      "Seasonal adjustments to lifestyle",
      "Balanced social and solitary time",
      "Regular but gentle cleansing practices",
      "Mindfulness and presence",
    ],
  },
};

export const calculateDosha = (answers: Record<number, 'vata' | 'pitta' | 'kapha'>) => {
  // Count the number of each dosha type
  const counts = {
    vata: 0,
    pitta: 0,
    kapha: 0
  };
  
  Object.values(answers).forEach(answer => {
    counts[answer]++;
  });
  
  // Determine dominant dosha(s)
  const max = Math.max(counts.vata, counts.pitta, counts.kapha);
  
  if (counts.vata === max && counts.pitta === max && counts.kapha === max) {
    return 'tridosha';
  } else if (counts.vata === max && counts.pitta === max) {
    return 'vata-pitta';
  } else if (counts.pitta === max && counts.kapha === max) {
    return 'pitta-kapha';
  } else if (counts.vata === max && counts.kapha === max) {
    return 'vata-kapha';
  } else if (counts.vata === max) {
    return 'vata';
  } else if (counts.pitta === max) {
    return 'pitta';
  } else {
    return 'kapha';
  }
};
