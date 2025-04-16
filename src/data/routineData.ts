
export type RoutineItem = {
  time: string;
  activity: string;
  description: string;
  icon: string;
}

export type DoshaRoutine = {
  dosha: string;
  description: string;
  morning: RoutineItem[];
  afternoon: RoutineItem[];
  evening: RoutineItem[];
}

export const routines: Record<string, DoshaRoutine> = {
  vata: {
    dosha: "Vata",
    description: "This routine is designed to create stability and warmth for Vata types. Consistency and grounding practices help balance Vata's natural tendency toward variability.",
    morning: [
      {
        time: "6:30 AM",
        activity: "Wake Up",
        description: "Wake up gently after sunrise.",
        icon: "alarm-clock"
      },
      {
        time: "6:45 AM",
        activity: "Warm Water",
        description: "Drink a glass of warm water with lemon.",
        icon: "cup"
      },
      {
        time: "7:00 AM",
        activity: "Self-Massage",
        description: "Perform abhyanga with warm sesame oil.",
        icon: "hand-heart"
      },
      {
        time: "7:30 AM",
        activity: "Gentle Yoga",
        description: "Practice gentle, grounding yoga asanas.",
        icon: "yoga"
      },
      {
        time: "8:00 AM",
        activity: "Meditation",
        description: "10-15 minutes of mindfulness meditation.",
        icon: "brain"
      },
      {
        time: "8:30 AM",
        activity: "Breakfast",
        description: "Warm, nourishing breakfast like oatmeal with spices.",
        icon: "utensils"
      }
    ],
    afternoon: [
      {
        time: "12:30 PM",
        activity: "Lunch",
        description: "Largest meal of the day, warm and well-spiced.",
        icon: "utensils"
      },
      {
        time: "1:15 PM",
        activity: "Short Walk",
        description: "Take a gentle walk to aid digestion.",
        icon: "footprints"
      },
      {
        time: "2:00 PM",
        activity: "Focused Work",
        description: "Schedule complex tasks when your energy is stable.",
        icon: "brain"
      },
      {
        time: "4:00 PM",
        activity: "Herbal Tea",
        description: "Enjoy warming herbal tea like ginger or cinnamon.",
        icon: "cup"
      }
    ],
    evening: [
      {
        time: "6:30 PM",
        activity: "Dinner",
        description: "Light, warm dinner that's easy to digest.",
        icon: "utensils"
      },
      {
        time: "7:30 PM",
        activity: "Relaxation",
        description: "Calming activities like reading or gentle stretching.",
        icon: "book"
      },
      {
        time: "9:00 PM",
        activity: "Warm Milk",
        description: "Drink spiced milk with nutmeg for sleep.",
        icon: "cup"
      },
      {
        time: "10:00 PM",
        activity: "Sleep",
        description: "Go to bed for restorative rest.",
        icon: "moon"
      }
    ]
  },
  pitta: {
    dosha: "Pitta",
    description: "This routine is designed to cool and moderate Pitta's natural intensity. Cooling practices and avoiding overheating helps maintain balance.",
    morning: [
      {
        time: "6:00 AM",
        activity: "Wake Up",
        description: "Wake up before the sun gets too intense.",
        icon: "alarm-clock"
      },
      {
        time: "6:15 AM",
        activity: "Cool Water",
        description: "Drink a glass of room temperature water.",
        icon: "cup"
      },
      {
        time: "6:30 AM",
        activity: "Exercise",
        description: "Moderate exercise in the cool morning air.",
        icon: "running"
      },
      {
        time: "7:15 AM",
        activity: "Cool Shower",
        description: "Take a refreshing cool shower.",
        icon: "shower"
      },
      {
        time: "7:45 AM",
        activity: "Meditation",
        description: "Practice cooling breath meditation.",
        icon: "brain"
      },
      {
        time: "8:15 AM",
        activity: "Breakfast",
        description: "Cooling breakfast like fruit with coconut.",
        icon: "utensils"
      }
    ],
    afternoon: [
      {
        time: "12:00 PM",
        activity: "Lunch",
        description: "Main meal with balanced flavors, not too spicy.",
        icon: "utensils"
      },
      {
        time: "1:00 PM",
        activity: "Rest",
        description: "Take 10-15 minutes to rest after eating.",
        icon: "bed"
      },
      {
        time: "2:00 PM",
        activity: "Focused Work",
        description: "Schedule demanding tasks during your productive hours.",
        icon: "brain"
      },
      {
        time: "4:30 PM",
        activity: "Cooling Drink",
        description: "Enjoy mint or rose tea to cool down.",
        icon: "cup"
      }
    ],
    evening: [
      {
        time: "7:00 PM",
        activity: "Dinner",
        description: "Moderate, cooling dinner with plenty of vegetables.",
        icon: "utensils"
      },
      {
        time: "8:00 PM",
        activity: "Evening Walk",
        description: "Gentle walk in the cool evening air.",
        icon: "footprints"
      },
      {
        time: "9:00 PM",
        activity: "Relaxation",
        description: "Engage in cooling, calming activities.",
        icon: "book"
      },
      {
        time: "10:30 PM",
        activity: "Sleep",
        description: "Go to bed for restorative rest.",
        icon: "moon"
      }
    ]
  },
  kapha: {
    dosha: "Kapha",
    description: "This routine is designed to stimulate and energize Kapha's naturally steady energy. Regular activity and variety help prevent stagnation.",
    morning: [
      {
        time: "5:30 AM",
        activity: "Wake Up",
        description: "Wake up early to avoid Kapha's tendency to oversleep.",
        icon: "alarm-clock"
      },
      {
        time: "5:45 AM",
        activity: "Warm Water",
        description: "Drink warm water with honey and ginger.",
        icon: "cup"
      },
      {
        time: "6:00 AM",
        activity: "Vigorous Exercise",
        description: "Engage in stimulating, energetic exercise.",
        icon: "running"
      },
      {
        time: "7:00 AM",
        activity: "Dry Brushing",
        description: "Exfoliate skin with dry brushing before shower.",
        icon: "brush"
      },
      {
        time: "7:15 AM",
        activity: "Warm Shower",
        description: "Take an invigorating warm shower.",
        icon: "shower"
      },
      {
        time: "8:00 AM",
        activity: "Light Breakfast",
        description: "Light, warm breakfast like spiced grains.",
        icon: "utensils"
      }
    ],
    afternoon: [
      {
        time: "12:00 PM",
        activity: "Lunch",
        description: "Moderate lunch with spices and variety.",
        icon: "utensils"
      },
      {
        time: "1:00 PM",
        activity: "Active Break",
        description: "Take a brisk walk after eating.",
        icon: "footprints"
      },
      {
        time: "2:00 PM",
        activity: "Stimulating Work",
        description: "Engage in varied, stimulating tasks.",
        icon: "brain"
      },
      {
        time: "4:00 PM",
        activity: "Spiced Tea",
        description: "Enjoy ginger or cinnamon tea to stay energized.",
        icon: "cup"
      }
    ],
    evening: [
      {
        time: "6:00 PM",
        activity: "Dinner",
        description: "Light, early dinner with minimal oils.",
        icon: "utensils"
      },
      {
        time: "7:00 PM",
        activity: "Activity",
        description: "Engage in light physical or mental activity.",
        icon: "activity"
      },
      {
        time: "8:30 PM",
        activity: "Wind Down",
        description: "Begin preparing for sleep with gentle activity.",
        icon: "book"
      },
      {
        time: "10:00 PM",
        activity: "Sleep",
        description: "Go to bed for restorative rest.",
        icon: "moon"
      }
    ]
  },
  "vata-pitta": {
    dosha: "Vata-Pitta",
    description: "This routine balances both Vata's need for grounding and Pitta's need for cooling. It provides structure with moderate pacing.",
    morning: [
      {
        time: "6:00 AM",
        activity: "Wake Up",
        description: "Wake up at a consistent time each day.",
        icon: "alarm-clock"
      },
      {
        time: "6:15 AM",
        activity: "Warm Water",
        description: "Drink room temperature water with lemon.",
        icon: "cup"
      },
      {
        time: "6:30 AM",
        activity: "Gentle Exercise",
        description: "Moderate, rhythmic exercise like swimming or yoga.",
        icon: "yoga"
      },
      {
        time: "7:15 AM",
        activity: "Self-Massage",
        description: "Brief self-massage with coconut oil.",
        icon: "hand-heart"
      },
      {
        time: "7:30 AM",
        activity: "Meditation",
        description: "Calming meditation practice.",
        icon: "brain"
      },
      {
        time: "8:00 AM",
        activity: "Breakfast",
        description: "Balanced breakfast with moderate spices.",
        icon: "utensils"
      }
    ],
    afternoon: [
      {
        time: "12:15 PM",
        activity: "Lunch",
        description: "Main meal with balanced tastes and nutrients.",
        icon: "utensils"
      },
      {
        time: "1:00 PM",
        activity: "Short Walk",
        description: "Gentle walk in the shade.",
        icon: "footprints"
      },
      {
        time: "2:00 PM",
        activity: "Focused Work",
        description: "Alternate focused work with short breaks.",
        icon: "brain"
      },
      {
        time: "4:15 PM",
        activity: "Herbal Tea",
        description: "Enjoy mint or licorice tea.",
        icon: "cup"
      }
    ],
    evening: [
      {
        time: "6:45 PM",
        activity: "Dinner",
        description: "Light, easy-to-digest dinner.",
        icon: "utensils"
      },
      {
        time: "7:45 PM",
        activity: "Relaxation",
        description: "Calming, cooling activities.",
        icon: "book"
      },
      {
        time: "9:30 PM",
        activity: "Wind Down",
        description: "Begin preparing for sleep.",
        icon: "moon"
      },
      {
        time: "10:15 PM",
        activity: "Sleep",
        description: "Go to bed for restorative rest.",
        icon: "moon"
      }
    ]
  },
  "pitta-kapha": {
    dosha: "Pitta-Kapha",
    description: "This routine balances Pitta's intensity with Kapha's need for stimulation. It provides structure with moderate pacing.",
    morning: [
      {
        time: "5:45 AM",
        activity: "Wake Up",
        description: "Wake up early to avoid Kapha stagnation.",
        icon: "alarm-clock"
      },
      {
        time: "6:00 AM",
        activity: "Warm Water",
        description: "Drink warm water with lime.",
        icon: "cup"
      },
      {
        time: "6:15 AM",
        activity: "Exercise",
        description: "Moderately vigorous exercise like jogging.",
        icon: "running"
      },
      {
        time: "7:15 AM",
        activity: "Cool Shower",
        description: "Refreshing shower, not too cold.",
        icon: "shower"
      },
      {
        time: "7:45 AM",
        activity: "Meditation",
        description: "Balanced meditation practice.",
        icon: "brain"
      },
      {
        time: "8:15 AM",
        activity: "Breakfast",
        description: "Light breakfast with warming herbs.",
        icon: "utensils"
      }
    ],
    afternoon: [
      {
        time: "12:00 PM",
        activity: "Lunch",
        description: "Main meal with variety and moderate spices.",
        icon: "utensils"
      },
      {
        time: "1:00 PM",
        activity: "Active Break",
        description: "Take a brief walk after eating.",
        icon: "footprints"
      },
      {
        time: "2:00 PM",
        activity: "Varied Work",
        description: "Mix mentally challenging tasks with physical activity.",
        icon: "brain"
      },
      {
        time: "4:00 PM",
        activity: "Herbal Tea",
        description: "Enjoy cooling but stimulating herbs like mint.",
        icon: "cup"
      }
    ],
    evening: [
      {
        time: "6:30 PM",
        activity: "Dinner",
        description: "Light dinner with vegetables and spices.",
        icon: "utensils"
      },
      {
        time: "7:30 PM",
        activity: "Evening Walk",
        description: "Take a leisurely walk in cool air.",
        icon: "footprints"
      },
      {
        time: "8:30 PM",
        activity: "Light Activity",
        description: "Engage in mild mental or social activity.",
        icon: "users"
      },
      {
        time: "10:00 PM",
        activity: "Sleep",
        description: "Go to bed for restorative rest.",
        icon: "moon"
      }
    ]
  },
  "vata-kapha": {
    dosha: "Vata-Kapha",
    description: "This routine balances Vata's need for grounding with Kapha's need for stimulation. It provides both stability and variety.",
    morning: [
      {
        time: "6:00 AM",
        activity: "Wake Up",
        description: "Wake up at a consistent time each day.",
        icon: "alarm-clock"
      },
      {
        time: "6:15 AM",
        activity: "Warm Water",
        description: "Drink warm water with ginger and honey.",
        icon: "cup"
      },
      {
        time: "6:30 AM",
        activity: "Exercise",
        description: "Regular, moderate exercise like brisk walking.",
        icon: "walking"
      },
      {
        time: "7:15 AM",
        activity: "Dry Brushing",
        description: "Followed by self-massage with sesame oil.",
        icon: "brush"
      },
      {
        time: "7:45 AM",
        activity: "Meditation",
        description: "Grounding yet uplifting meditation.",
        icon: "brain"
      },
      {
        time: "8:15 AM",
        activity: "Breakfast",
        description: "Warm, light breakfast with spices.",
        icon: "utensils"
      }
    ],
    afternoon: [
      {
        time: "12:15 PM",
        activity: "Lunch",
        description: "Main meal with a variety of tastes and textures.",
        icon: "utensils"
      },
      {
        time: "1:00 PM",
        activity: "Active Break",
        description: "Take a moderate walk after eating.",
        icon: "footprints"
      },
      {
        time: "2:00 PM",
        activity: "Varied Work",
        description: "Alternate between different types of activities.",
        icon: "brain"
      },
      {
        time: "4:00 PM",
        activity: "Herbal Tea",
        description: "Enjoy warming, stimulating herbs like ginger.",
        icon: "cup"
      }
    ],
    evening: [
      {
        time: "6:30 PM",
        activity: "Dinner",
        description: "Light, warm dinner without heavy oils.",
        icon: "utensils"
      },
      {
        time: "7:30 PM",
        activity: "Light Activity",
        description: "Engage in gentle movement or creative pursuits.",
        icon: "palette"
      },
      {
        time: "9:00 PM",
        activity: "Wind Down",
        description: "Begin preparing for sleep with consistent routine.",
        icon: "book"
      },
      {
        time: "10:00 PM",
        activity: "Sleep",
        description: "Go to bed for restorative rest.",
        icon: "moon"
      }
    ]
  },
  "tridosha": {
    dosha: "Tridosha",
    description: "This balanced routine works well for those with relatively equal amounts of all three doshas. It adapts to seasonal changes.",
    morning: [
      {
        time: "6:00 AM",
        activity: "Wake Up",
        description: "Wake up with natural light when possible.",
        icon: "alarm-clock"
      },
      {
        time: "6:15 AM",
        activity: "Warm Water",
        description: "Drink room temperature water with lemon.",
        icon: "cup"
      },
      {
        time: "6:30 AM",
        activity: "Exercise",
        description: "Balanced exercise like yoga or walking.",
        icon: "yoga"
      },
      {
        time: "7:15 AM",
        activity: "Self-Care",
        description: "Brief self-massage with seasonal appropriate oil.",
        icon: "hand-heart"
      },
      {
        time: "7:45 AM",
        activity: "Meditation",
        description: "Balanced meditation practice.",
        icon: "brain"
      },
      {
        time: "8:15 AM",
        activity: "Breakfast",
        description: "Seasonal, balanced breakfast.",
        icon: "utensils"
      }
    ],
    afternoon: [
      {
        time: "12:30 PM",
        activity: "Lunch",
        description: "Main meal with all six tastes represented.",
        icon: "utensils"
      },
      {
        time: "1:15 PM",
        activity: "Moderate Break",
        description: "Brief rest or gentle activity after eating.",
        icon: "footprints"
      },
      {
        time: "2:00 PM",
        activity: "Productive Work",
        description: "Focus on primary work with regular short breaks.",
        icon: "brain"
      },
      {
        time: "4:30 PM",
        activity: "Herbal Tea",
        description: "Enjoy seasonal appropriate herbs.",
        icon: "cup"
      }
    ],
    evening: [
      {
        time: "7:00 PM",
        activity: "Dinner",
        description: "Light, seasonal dinner.",
        icon: "utensils"
      },
      {
        time: "8:00 PM",
        activity: "Relaxation",
        description: "Wind down with pleasant, calming activities.",
        icon: "book"
      },
      {
        time: "9:30 PM",
        activity: "Preparation",
        description: "Prepare for the next day, reflect on the current day.",
        icon: "list"
      },
      {
        time: "10:15 PM",
        activity: "Sleep",
        description: "Go to bed for restorative rest.",
        icon: "moon"
      }
    ]
  }
};

export const getRoutineByDosha = (dosha: string): DoshaRoutine => {
  const normalizedDosha = dosha.toLowerCase();
  return routines[normalizedDosha] || routines.tridosha;
};
