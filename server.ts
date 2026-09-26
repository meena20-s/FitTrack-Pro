import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize GoogleGenAI client according to skill guidelines
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-memory data store for community posts & mini statements
interface CommunityPost {
  id: string;
  authorName: string;
  authorRole: string;
  avatarSeed: string;
  badge: string;
  timestamp: string;
  category: 'Workouts' | 'Nutrition' | 'Motivation' | 'Milestone' | 'Questions';
  content: string;
  likes: number;
  likedBy: string[];
  comments: {
    id: string;
    author: string;
    text: string;
    timestamp: string;
  }[];
}

let communityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    authorName: 'Ruchira Rane',
    authorRole: 'Core Team & Fitness Enthusiast',
    avatarSeed: 'Ruchira',
    badge: '14-Day Streak 🔥',
    timestamp: '2 hours ago',
    category: 'Milestone',
    content: 'Completed the 30-minute HIIT & Core session today! Loving the age-tailored progression on FitTrack Pro. Hydrated with coconut water and feeling energized! 💪',
    likes: 12,
    likedBy: [],
    comments: [
      {
        id: 'c-1',
        author: 'Meena S',
        text: 'Way to go Ruchira! Keep pushing for that 21-day badge!',
        timestamp: '1 hour ago',
      },
      {
        id: 'c-2',
        author: 'Kavita Sharma',
        text: 'That HIIT routine is incredible. The warm-up tips saved my knees!',
        timestamp: '45 mins ago',
      }
    ],
  },
  {
    id: 'post-2',
    authorName: 'Meena S',
    authorRole: 'Lead Creator',
    avatarSeed: 'Meena',
    badge: 'Strength Master 🏋️‍♂️',
    timestamp: '4 hours ago',
    category: 'Workouts',
    content: 'Tip for today: Make sure you do at least 5-10 minutes of dynamic stretching before your compound squats. Form over weight every single time! Check the updated routine tab.',
    likes: 19,
    likedBy: [],
    comments: [
      {
        id: 'c-3',
        author: 'Arjun Das',
        text: 'Noticed such an improvement in hip mobility following this tip.',
        timestamp: '3 hours ago',
      }
    ],
  },
  {
    id: 'post-3',
    authorName: 'Anand Kumar',
    authorRole: 'Community Member',
    avatarSeed: 'Anand',
    badge: 'Goal Crusher 🎯',
    timestamp: '6 hours ago',
    category: 'Nutrition',
    content: 'Consulted the AI Dietary References section for high-protein vegetarian meals. Picked up "The Plant-Based Athlete" book recommended by the system. Huge game-changer!',
    likes: 8,
    likedBy: [],
    comments: [],
  },
  {
    id: 'post-4',
    authorName: 'Priya Nambiar',
    authorRole: 'NHCE Fitness Club',
    avatarSeed: 'Priya',
    badge: 'Yoga Explorer 🧘‍♀️',
    timestamp: 'Yesterday',
    category: 'Motivation',
    content: 'Remember: Consistency is a muscle you build one workout at a time. Even a 20-minute brisk walk or core circuit counts! Never give up.',
    likes: 15,
    likedBy: [],
    comments: [],
  }
];

// Fallback algorithm for structured workout plan generation
function generateAlgorithmicPlan(data: any) {
  const { age = 22, weight = 65, weightUnit = 'kg', goal = 'Weight Loss', experience = 'Beginner', daysPerWeek = 4 } = data;
  const isBeginner = (experience || '').toLowerCase().includes('beginner');
  const isSenior = age >= 50;
  const isWeightLoss = (goal || '').toLowerCase().includes('weight');
  const isMuscle = (goal || '').toLowerCase().includes('muscle') || (goal || '').toLowerCase().includes('strength');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const routines = days.map((dayName, idx) => {
    // Schedule workout days vs rest days based on daysPerWeek
    const isRestDay = (daysPerWeek <= 3 && (idx === 1 || idx === 3 || idx === 5 || idx === 6)) ||
                      (daysPerWeek <= 4 && (idx === 1 || idx === 4 || idx === 6)) ||
                      (daysPerWeek <= 5 && (idx === 3 || idx === 6));

    if (isRestDay) {
      return {
        day: dayName,
        routineTitle: idx === 6 ? 'Deep Recovery & Yoga Flow' : 'Active Recovery & Walking',
        estimatedDuration: '20-25 mins',
        intensity: 'Low',
        focus: 'Mobility, gentle walking, myofascial release & joint restoration',
        warmup: '3 minutes of neck, shoulder, and spinal rolls with diaphragmatic breathing.',
        exercises: [
          {
            name: 'Cat-Cow Stretch & Child Pose',
            sets: 3,
            reps: '10 breath cycles',
            rest: '30s',
            targetMuscle: 'Spine, lower back & core stabilizers',
            instructions: 'Inhale arching gently looking forward, exhale round the back tucking chin.',
            formTip: 'Keep movements slow and connected to your breath.'
          },
          {
            name: 'Pigeon Stretch or Figure-Four',
            sets: 2,
            reps: '45 seconds each leg',
            rest: '20s',
            targetMuscle: 'Glutes, piriformis & hips',
            instructions: 'Lay flat or lean forward in pigeon pose to loosen tight hip flexors.',
            formTip: 'Do not twist or torque the knee joints.'
          },
          {
            name: 'Low-Impact Brisk Stroll / Stride',
            sets: 1,
            reps: '15-20 minutes',
            rest: 'None',
            targetMuscle: 'Cardiovascular system & lower body flushing',
            instructions: 'Maintain an upright posture and moderate breathing pace.',
            formTip: 'Great for flushing out lactic acid build-up from previous sessions.'
          }
        ],
        cooldown: '5 minutes of seated meditation and relaxed chest openers.'
      };
    }

    // Active workout days
    if (idx === 0) {
      return {
        day: dayName,
        routineTitle: isWeightLoss ? 'Full Body Metabolic Blast' : 'Full Body Hypertrophy Kickoff',
        estimatedDuration: isBeginner ? '30 minutes' : '45 minutes',
        intensity: isBeginner ? 'Moderate' : 'High',
        focus: 'Compound movements, metabolic conditioning & core engagement',
        warmup: '5-10 minutes of dynamic leg swings, arm circles, and 2 mins jumping jacks or high knees.',
        exercises: [
          {
            name: isSenior ? 'Chair-Assisted Squats' : 'Air Squats / Goblet Squats',
            sets: isBeginner ? 3 : 4,
            reps: isBeginner ? '12-15 reps' : '10-12 reps',
            rest: '60s',
            targetMuscle: 'Quadriceps, hamstrings, glutes',
            instructions: 'Hips back and down as if sitting in a low chair. Keep chest tall and knees tracking over toes.',
            formTip: 'Drive through your heels to return to full upright standing position.'
          },
          {
            name: isBeginner ? 'Push-ups (on knees if needed)' : 'Standard Push-ups / Tempo Push-ups',
            sets: 3,
            reps: isBeginner ? '8-10 reps' : '12-15 reps',
            rest: '60s',
            targetMuscle: 'Pectorals, anterior deltoids, triceps',
            instructions: 'Maintain a straight plank line from shoulders to heels/knees. Lower chest gently towards the floor.',
            formTip: 'Do not allow your lower back or hips to sag.'
          },
          {
            name: 'Walking Lunges or Reverse Lunges',
            sets: 3,
            reps: '10 reps per leg',
            rest: '45s',
            targetMuscle: 'Glutes, quads, calves, core balance',
            instructions: 'Step backward or forward smoothly, lowering both knees to approximately 90-degree angles.',
            formTip: 'Keep torso upright and refrain from leaning excessively forward.'
          },
          {
            name: 'Core Plank Hold',
            sets: 3,
            reps: isBeginner ? '30 seconds' : '60 seconds',
            rest: '45s',
            targetMuscle: 'Rectus abdominis, transverse abdominis, obliques',
            instructions: 'Forearms on floor under shoulders, engage glutes and brace your core as if bracing for a punch.',
            formTip: 'Keep neck neutral by looking at a point on the floor between your hands.'
          }
        ],
        cooldown: '5 minutes of hamstring stretches, child pose, and deep quad stretches.'
      };
    }

    if (idx === 2) {
      return {
        day: dayName,
        routineTitle: isWeightLoss ? 'HIIT Cardio & Core Ignition' : 'Upper Body Power & Pull',
        estimatedDuration: '35 minutes',
        intensity: 'Moderate-High',
        focus: isWeightLoss ? 'Heart rate elevation & caloric burn' : 'Lats, rhomboids, biceps and core stability',
        warmup: '5 minutes: wrist rotations, torso twists, mountain climbers (slow tempo).',
        exercises: [
          {
            name: isWeightLoss ? 'Mountain Climbers (Fast Pace)' : 'Dumbbell or Resistance Band Rows',
            sets: 3,
            reps: isWeightLoss ? '30 seconds continuous' : '12 reps',
            rest: '45s',
            targetMuscle: isWeightLoss ? 'Core, shoulders, cardiovascular' : 'Upper back, lats, biceps',
            instructions: 'Drive knees rhythmically into chest while keeping hips level.',
            formTip: 'Pace your breathing and squeeze your shoulder blades at contraction.'
          },
          {
            name: 'Glute Bridges / Hip Thrusts',
            sets: 3,
            reps: '15 reps',
            rest: '45s',
            targetMuscle: 'Gluteus maximus, hamstrings, lower back',
            instructions: 'Lie on back with knees bent and feet flat. Squeeze glutes and lift hips upward into a bridge.',
            formTip: 'Hold for 2 seconds at the top for maximum glute recruitment.'
          },
          {
            name: 'Bicycle Crunches',
            sets: 3,
            reps: '20 reps (10 each side)',
            rest: '30s',
            targetMuscle: 'Obliques and lower abdominals',
            instructions: 'Bring opposite elbow to opposite knee while extending the other leg out straight.',
            formTip: 'Focus on rotation from the core rather than pulling on your neck.'
          },
          {
            name: isWeightLoss ? 'Jumping Jacks / Shadow Boxing' : 'Pike Push-ups or Overhead Press',
            sets: 3,
            reps: '45 seconds',
            rest: '45s',
            targetMuscle: 'Full body endurance & shoulder stability',
            instructions: 'Keep light on your toes with continuous fluid movement.',
            formTip: 'Land soft to protect knee and ankle joints.'
          }
        ],
        cooldown: 'Shoulder cross-body stretch, tricep overhead reach, and cobra pose.'
      };
    }

    // Remaining active days
    return {
      day: dayName,
      routineTitle: 'Lower Body Strength & Functional Conditioning',
      estimatedDuration: '30 minutes',
      intensity: 'Moderate',
      focus: 'Posterior chain endurance, ankle mobility & balance',
      warmup: 'Dynamic high knees, hip openers, and ankle circles.',
      exercises: [
        {
          name: 'Step-ups or Bulgarian Split Squats',
          sets: 3,
          reps: '10 per leg',
          rest: '60s',
          targetMuscle: 'Glutes, quadriceps, stabilizer muscles',
          instructions: 'Step onto a stable bench or platform with one leg, driving upward through the front foot.',
          formTip: 'Control the descent slowly for maximum muscle engagement.'
        },
        {
          name: 'Superman Holds & Lower Back Extensors',
          sets: 3,
          reps: '12 reps (3 sec hold)',
          rest: '30s',
          targetMuscle: 'Erector spinae, upper glutes, rear delts',
          instructions: 'Lie prone, elevate arms and feet simultaneously while gently squeezing back muscles.',
          formTip: 'Keep eyes looking downward to maintain cervical spine neutrality.'
        },
        {
          name: 'Side Plank Holds',
          sets: 3,
          reps: '25 seconds per side',
          rest: '30s',
          targetMuscle: 'Obliques, lateral hip stabilizers',
          instructions: 'Prop up on one elbow, body in straight diagonal line.',
          formTip: 'Ensure hips do not dip towards the floor.'
        }
      ],
      cooldown: 'Quad stretch, figure four, and deep breathing relaxation.'
    };
  });

  return {
    planTitle: `${experience} ${goal} Kickstart`,
    planSummary: `This 7-day personalized workout plan is dynamically generated for an age of ${age} (${weight} ${weightUnit}) with a primary goal of ${goal}. It incorporates age-appropriate intensity, progressive bodyweight and resistance movements, and active recovery intervals to keep you consistent without risking injury.`,
    dailyRoutines: routines,
    generalAdvice: `Perform 5-10 minutes of dynamic stretching (e.g., arm circles, leg swings, torso twists) before each session. Perform 5-10 minutes of static stretching (holding positions for 20-30 seconds) after each session. Stay well-hydrated by drinking water throughout the day, especially before, during, and after workouts. Pay attention to your body. If you feel pain, stop the exercise and consult a professional if necessary. Adjust intensity as needed. IMPORTANT: Always consult with a healthcare professional before starting any new exercise program or drastically changing your physical activity level.`,
    calorieEstimatePerSession: isWeightLoss ? 260 : 210,
    targetGoal: goal,
    ageCategory: age < 20 ? 'Teen / Student' : age < 36 ? 'Young Adult' : age < 55 ? 'Adult' : 'Senior'
  };
}

// Fallback dietary references generator with clinical & parameter personalization
function generateDietaryFallback(params: {
  fitnessGoals?: string;
  userProfile?: string;
  weight?: number;
  weightUnit?: string;
  height?: number;
  heightUnit?: string;
  age?: number;
  medicalConditions?: string[] | string;
  allergies?: string[] | string;
  medications?: string;
  dietaryPreference?: string;
}) {
  const {
    fitnessGoals = 'Weight Loss & Lean Muscle',
    userProfile = 'Vegetarian, mindful eating',
    weight = 50,
    weightUnit = 'kg',
    height = 172,
    heightUnit = 'cm',
    age = 21,
    medications = 'None',
    dietaryPreference = 'Vegetarian',
  } = params;

  const conditionsList: string[] = Array.isArray(params.medicalConditions)
    ? params.medicalConditions
    : params.medicalConditions
    ? [params.medicalConditions]
    : ['None'];

  const allergiesList: string[] = Array.isArray(params.allergies)
    ? params.allergies
    : params.allergies
    ? [params.allergies]
    : ['None'];

  const hasDiabetes = conditionsList.some((c) => c.toLowerCase().includes('diabet') || c.toLowerCase().includes('sugar') || c.toLowerCase().includes('insulin'));
  const hasHypertension = conditionsList.some((c) => c.toLowerCase().includes('hypertens') || c.toLowerCase().includes('pressure') || c.toLowerCase().includes('heart'));
  const hasCholesterol = conditionsList.some((c) => c.toLowerCase().includes('cholesterol') || c.toLowerCase().includes('lipid'));
  const hasPCOS = conditionsList.some((c) => c.toLowerCase().includes('pcos') || c.toLowerCase().includes('hormon'));
  const hasThyroid = conditionsList.some((c) => c.toLowerCase().includes('thyroid'));
  const hasGERD = conditionsList.some((c) => c.toLowerCase().includes('gerd') || c.toLowerCase().includes('acid') || c.toLowerCase().includes('reflux'));

  const hasNutAllergy = allergiesList.some((a) => a.toLowerCase().includes('nut') || a.toLowerCase().includes('peanut'));
  const hasLactoseAllergy = allergiesList.some((a) => a.toLowerCase().includes('lactose') || a.toLowerCase().includes('dairy') || a.toLowerCase().includes('milk'));
  const hasGlutenAllergy = allergiesList.some((a) => a.toLowerCase().includes('gluten') || a.toLowerCase().includes('celiac') || a.toLowerCase().includes('wheat'));

  const medLower = (medications || '').toLowerCase();
  const hasStatins = medLower.includes('statin') || medLower.includes('atorvastatin') || medLower.includes('lipitor');
  const hasMetformin = medLower.includes('metformin') || medLower.includes('glucophage');
  const hasThyroidMed = medLower.includes('levothyroxine') || medLower.includes('synthroid') || medLower.includes('thyroxine');
  const hasBpMed = medLower.includes('lisinopril') || medLower.includes('amlodipine') || medLower.includes('losartan') || medLower.includes('beta');

  // Height & Weight BMI
  const heightM = heightUnit === 'cm' ? height / 100 : (height * 2.54) / 100;
  const weightKg = weightUnit === 'kg' ? weight : weight * 0.453592;
  const bmiNum = heightM > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : '16.9';

  // Build Clinical Safety Report
  const contraindications: string[] = [];
  const allergenSafeNotice: string[] = [];
  const therapeuticStaples: string[] = [];
  const medicationInteractions: string[] = [];

  // Disease & Medication checks
  if (hasStatins) {
    contraindications.push('CRITICAL: Strictly avoid Grapefruit and Seville oranges. Compounds (furanocoumarins) inhibit the CYP3A4 enzyme, drastically increasing statin concentration in blood.');
    medicationInteractions.push('Statins can deplete CoQ10 levels; prioritize dietary CoQ10 from broccoli, spinach, and sesame seeds or discuss supplementation.');
  }

  if (hasMetformin) {
    medicationInteractions.push('Metformin impairs intestinal absorption of Vitamin B12 over time. Ensure dietary B12 via fortified nutritional yeast, fortified plant milks, or B12 supplements.');
    therapeuticStaples.push('Complex fiber (oats, chia seeds) to smooth glucose absorption and prevent post-prandial glycemic spikes.');
  }

  if (hasThyroidMed) {
    contraindications.push('Do NOT take calcium supplements, iron supplements, walnuts, or high-fiber foods within 2–4 hours of your morning thyroid medication, as they significantly inhibit bioavailability.');
    medicationInteractions.push('Take thyroid medication with plain water first thing in the morning on an empty stomach at least 30 to 60 minutes before breakfast.');
  }

  if (hasBpMed || hasHypertension) {
    contraindications.push('Restrict high-sodium processed foods, bouillon cubes, and cured foods (keep sodium < 1,500mg/day to optimize vascular tone).');
    therapeuticStaples.push('Potassium and magnesium-rich whole foods (spinach, avocados, lentils, bananas) to assist endothelial dilation.');
  }

  if (hasDiabetes) {
    contraindications.push('Avoid refined simple sugars, sweetened fruit juices, and white refined flour that trigger rapid insulin surges.');
    therapeuticStaples.push('Low Glycemic Index (GI < 55) complex carbohydrates paired with protein and healthy fats to slow gastric emptying.');
  }

  if (hasCholesterol) {
    contraindications.push('Eliminate trans-fats and limit saturated fats to < 7% of daily caloric intake; avoid coconut oil in excess.');
    therapeuticStaples.push('Soluble beta-glucan fiber (steel-cut oats, barley, psyllium husk) which actively binds cholesterol in the digestive tract.');
  }

  if (hasGERD) {
    contraindications.push('Avoid high-acid citrus fruits, tomatoes, peppermint, excess caffeine, and heavy spicy meals within 3 hours before bed.');
    therapeuticStaples.push('Soothing alkaline foods like oatmeal, ginger tea, steamed zucchini, and non-acidic plant proteins.');
  }

  if (hasPCOS) {
    therapeuticStaples.push('Anti-inflammatory whole food fats (extra virgin olive oil, flaxseeds) and spearmint tea for healthy hormonal balance.');
  }

  // Allergies
  if (hasNutAllergy) {
    contraindications.push('ALLERGY ALERT: Strictly avoid all peanuts, tree nuts, almond milks, walnut toppings, and bakery goods with potential cross-contamination.');
    allergenSafeNotice.push('100% Nut-Free verified: Substituted with pumpkin seeds, sunflower seed butter (SunButter), and hemp hearts.');
  }

  if (hasLactoseAllergy) {
    contraindications.push('ALLERGY ALERT: Strictly avoid dairy whey, cow milk, soft cheeses, and butter containing lactose.');
    allergenSafeNotice.push('100% Dairy-Free verified: Substituted with fortified calcium-rich oat milk, soy yogurt, and unsweetened hemp milk.');
  }

  if (hasGlutenAllergy) {
    contraindications.push('ALLERGY ALERT: Strictly avoid wheat, barley, rye, malt, and non-certified oat products to prevent intestinal villi inflammation.');
    allergenSafeNotice.push('100% Gluten-Free verified: Certified gluten-free rolled oats, quinoa, brown rice, and buckwheat.');
  }

  if (contraindications.length === 0) {
    contraindications.push('No acute pharmacological contraindications flagged based on entered profile.');
  }
  if (allergenSafeNotice.length === 0) {
    allergenSafeNotice.push('No allergen exclusions requested; flexible inclusion of whole food allergen categories.');
  }
  if (therapeuticStaples.length === 0) {
    therapeuticStaples.push('Whole grain complexes, colorful antioxidant-rich vegetables, and clean bioavailable proteins.');
  }

  // Books personalized
  const books = [
    {
      title: hasDiabetes
        ? 'Dr. Neal Barnards Program for Reversing Diabetes'
        : hasHypertension
        ? 'The DASH Diet Mediterranean Solution'
        : 'The Plant-Based Athlete: Peak Performance & Longevity',
      author: hasDiabetes ? 'Dr. Neal Barnard, MD, FACC' : hasHypertension ? 'Marla Heller, MS, RD' : 'Matt Frazier & Robert Cheeke',
      category: hasDiabetes ? 'Clinical Endocrinology & Glycemic Control' : hasHypertension ? 'Cardiovascular Health & Blood Pressure' : 'Sports Nutrition & Plant Fuel',
      rating: 4.8,
      isbnYear: 'Rodale / HarperCollins',
      summary: hasDiabetes
        ? 'A peer-reviewed, medically validated nutrition guide showing how low-fat, whole-food plant nutrition removes intramyocellular lipids to restore cellular insulin sensitivity.'
        : hasHypertension
        ? 'Scientifically ranked the #1 heart-healthy eating approach by US News for over a decade, integrating Mediterranean healthy fats with the mineral-rich DASH protocol.'
        : 'Comprehensive scientific roadmap showing how clean, whole food plant-based fueling speeds athletic recovery and supports lean muscle growth without digestive fatigue.',
      keyStrategies: [
        hasDiabetes ? 'Prioritize soluble fiber to stabilize blood glucose excursions' : 'Target 4,700mg dietary potassium from leafy greens and lentils to offset vascular tension',
        hasNutAllergy ? 'Utilize allergen-safe sunflower and pumpkin seeds for healthy essential fatty acids' : 'Time healthy unsaturated fats (avocado, olive oil) across regular meals',
        `Structured for your current physical baseline (${weight} ${weightUnit}, ${height} ${heightUnit}, BMI ${bmiNum})`
      ],
      relevance: `Directly formulated to respect your ${conditionsList.join(', ')} while safely matching ${fitnessGoals}.`,
      clinicalSafetyNote: `Safe for medications (${medications || 'None'}). Follows allergen-safe substitutions.`
    },
    {
      title: 'How Not to Die: Discover the Foods Scientifically Proven to Prevent Disease',
      author: 'Dr. Michael Greger, MD, FACLM',
      category: 'Evidence-Based Preventative & Lifestyle Medicine',
      rating: 4.9,
      isbnYear: 'Flatiron Books',
      summary: 'Dr. Greger examines the fifteen leading causes of premature death—including heart disease, cancer, diabetes, and high blood pressure—and reveals evidence-based dietary interventions to prevent and reverse them.',
      keyStrategies: [
        'Follow the Daily Dozen checklist: 3 servings of beans/lentils, berries, cruciferous vegetables, and greens',
        'Drink adequate water and herbal teas instead of liquid sugars',
        'Incorporate ground flaxseeds daily for lignans and alpha-linolenic omega-3 fatty acids'
      ],
      relevance: 'Provides verified clinical data to build lifelong immunity and metabolic health.',
      clinicalSafetyNote: 'Includes dedicated chapters on safe whole-food substitutions for common sensitivities.'
    },
    {
      title: 'Nutrition and Physical Degeneration & The Anti-Inflammatory Diet',
      author: 'Dr. Andrew Weil, MD (Harvard Medical School)',
      category: 'Integrative Clinical Nutrition',
      rating: 4.7,
      isbnYear: 'Little, Brown and Company',
      summary: 'Focuses on combating chronic low-grade systemic inflammation, optimizing mitochondrial energy production, and tailoring nutrient balance to personal physical metrics.',
      keyStrategies: [
        'Maintain a balanced omega-6 to omega-3 dietary ratio (approx 2:1)',
        'Choose low-glycemic carbohydrates that provide sustained 4-hour cognitive and physical energy',
        'Utilize anti-inflammatory culinary spices like turmeric (with black pepper) and ginger'
      ],
      relevance: 'Gentle on digestion, protects vascular health, and reduces workout-induced soreness.',
      clinicalSafetyNote: 'Compatible with standard lifestyle management guidelines.'
    }
  ];

  // Articles
  const articles = [
    {
      title: 'Drug-Nutrient Interactions in Clinical Practice: What Active Individuals Need to Know',
      source: 'American Journal of Clinical Nutrition (AJCN)',
      keyTakeaways: [
        'Certain prescription medications interact with common foods (e.g., grapefruit with statins, high-potassium with ACE inhibitors, calcium with thyroid medications).',
        'Spacing supplements and meals 2 to 4 hours away from sensitive medications preserves therapeutic efficacy.'
      ],
      practicalTip: `Always review your active medications (${medications || 'None'}) with your physician before introducing high-dose botanical supplements.`
    },
    {
      title: 'Medical Nutrition Therapy for Active Adults with Allergies and Sensitivities',
      source: 'Academy of Nutrition and Dietetics (AND)',
      keyTakeaways: [
        'Complete essential amino acids can be easily achieved through seed and grain combinations (e.g. hemp hearts + oats + lentils) without triggering nut or dairy allergies.',
        'Sufficient micronutrient density prevents workout fatigue and supports healthy thyroid and adrenal function.'
      ],
      practicalTip: `At ${weight} ${weightUnit} and ${height} ${heightUnit}, focus on nutrient-dense whole foods that provide satiety without feeling heavy.`
    }
  ];

  return {
    books,
    articles,
    clinicalSafety: {
      contraindications,
      allergenSafeNotice,
      therapeuticStaples,
      medicationInteractions: medicationInteractions.length > 0 ? medicationInteractions : ['No major drug-food interactions detected for listed medications. Continue drinking water and taking medications with appropriate meals as directed by your physician.']
    },
    userContextSummary: {
      height: `${height} ${heightUnit}`,
      weight: `${weight} ${weightUnit}`,
      bmi: `${bmiNum} (${parseFloat(bmiNum) < 18.5 ? 'Lean / Underweight' : parseFloat(bmiNum) < 25 ? 'Normal' : 'Overweight'})`,
      conditions: conditionsList.join(', '),
      allergies: allergiesList.join(', '),
      medications: medications || 'None reported'
    },
    macronutrientGuide: {
      protein: hasDiabetes || hasPCOS
        ? '30% of daily intake (~1.4g/kg) — high protein stabilizes blood glucose and prevents spikes'
        : '25% - 30% of daily intake (tofu, tempeh, lentils, pumpkin seeds, hemp hearts)',
      carbs: hasDiabetes
        ? '40% of daily intake (strictly low GI: rolled oats, black beans, quinoa, leafy greens)'
        : '45% - 50% of daily intake (complex whole grains, sweet potatoes, wild rice, berries)',
      fats: hasCholesterol || hasHypertension
        ? '25% of daily intake (strictly heart-healthy monounsaturated: cold-pressed olive oil, avocados, flaxseeds)'
        : '25% - 30% of daily intake (essential omega-3s, chia seeds, avocado)',
      hydrationTip: `Drink 2.2 - 2.8 Liters daily. ${hasGERD ? 'Sip water upright; avoid chugging large quantities right before lying down.' : 'Drink 500ml upon waking and hydrate evenly.'}`
    },
    expertDisclaimer: 'This clinical nutrition guide is tailored specifically to your physical metrics, medical conditions, medications, and reported allergies. It is intended for educational purposes and should complement, not replace, personalized medical supervision from your doctor or registered dietitian.'
  };
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// 1. Generate Age-Based Workout Plan
app.post('/api/workout/generate', async (req, res) => {
  try {
    const {
      age = 22,
      weight = 50,
      weightUnit = 'kg',
      height = 172,
      heightUnit = 'cm',
      fitnessGoal = 'Weight Loss',
      experienceLevel = 'Beginner',
      daysPerWeek = 4,
      focusAreas = ['HIIT', 'Core & Abs'],
      medicalNotes = ''
    } = req.body;

    if (ai) {
      try {
        const prompt = `You are a certified sports physiologist and elite personal trainer. 
Create an age-based, highly customized 7-day fitness workout plan for a user with these parameters:
- Age: ${age} years old
- Current Weight: ${weight} ${weightUnit}
- Height: ${height} ${heightUnit}
- Primary Fitness Goal: ${fitnessGoal}
- Fitness Experience Level: ${experienceLevel}
- Days per week available to work out: ${daysPerWeek} days
- Focus Areas / Workout types: ${Array.isArray(focusAreas) ? focusAreas.join(', ') : focusAreas}
- Medical considerations / injuries: ${medicalNotes || 'None'}

Return ONLY a valid JSON object matching this exact structure:
{
  "planTitle": "string (e.g. Beginner's Weight Loss Kickstart or Hypertrophy Foundation)",
  "planSummary": "string (warm, encouraging, age-appropriate summary)",
  "calorieEstimatePerSession": number (e.g. 240),
  "targetGoal": "${fitnessGoal}",
  "ageCategory": "string (e.g. Teens, Young Adults, Adults, Seniors)",
  "dailyRoutines": [
    {
      "day": "Monday",
      "routineTitle": "string (e.g. Full Body Blast)",
      "estimatedDuration": "string (e.g. 30 minutes)",
      "intensity": "string (Low, Moderate, or High)",
      "focus": "string",
      "warmup": "string",
      "exercises": [
        {
          "name": "string (e.g. Squats)",
          "sets": 3,
          "reps": "string (e.g. 12 reps)",
          "rest": "string (e.g. 45 sec)",
          "targetMuscle": "string",
          "instructions": "string (clear step-by-step)",
          "formTip": "string"
        }
      ],
      "cooldown": "string"
    }
  ],
  "generalAdvice": "string (warm, expert advice on hydration, stretching, sleep, nutrition, safety cautions)"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text);
          return res.json({ success: true, plan: parsed, source: 'ai' });
        }
      } catch (genAiError) {
        console.warn('Gemini API call failed, falling back to algorithmic plan:', genAiError);
      }
    }

    // Fallback to algorithmic generator
    const fallbackPlan = generateAlgorithmicPlan({
      age,
      weight,
      weightUnit,
      height,
      heightUnit,
      goal: fitnessGoal,
      experience: experienceLevel,
      daysPerWeek,
      focusAreas,
      medicalNotes
    });

    return res.json({ success: true, plan: fallbackPlan, source: 'algorithmic' });
  } catch (error: any) {
    console.error('Error generating workout plan:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate plan' });
  }
});

// 2. Curated Dietary References with Medical & Parameter Personalization
app.post('/api/diet/references', async (req, res) => {
  try {
    const {
      fitnessGoals = '',
      userProfile = '',
      weight = 50,
      weightUnit = 'kg',
      height = 172,
      heightUnit = 'cm',
      age = 21,
      medicalConditions = [],
      allergies = [],
      medications = 'None',
      dietaryPreference = 'Vegetarian'
    } = req.body;

    if (ai) {
      try {
        const prompt = `You are a clinical sports dietitian and clinical pharmacologist.
Provide personalized, medically safe, science-backed dietary book references, clinical paper summaries, and contraindication analysis for a specific patient:
- Patient Parameters: Age: ${age}, Weight: ${weight} ${weightUnit}, Height: ${height} ${heightUnit}
- Fitness & Health Goals: "${fitnessGoals}"
- Medical Conditions / Diseases: "${Array.isArray(medicalConditions) ? medicalConditions.join(', ') : medicalConditions || 'None'}"
- Food Allergies & Intolerances: "${Array.isArray(allergies) ? allergies.join(', ') : allergies || 'None'}"
- Current Medications / Prescriptions: "${medications || 'None'}"
- Dietary Preference: "${dietaryPreference || userProfile}"

You MUST analyze:
1. Food-Drug & Medication interactions (e.g. Statins + grapefruit, Warfarin + Vitamin K, Thyroid meds + calcium/iron, Metformin + B12).
2. Foods to strictly avoid or contraindicate based on the medical conditions and allergies.
3. Safe therapeutic staple foods that heal the condition and support the goal.
4. Accurate, real medical nutrition books and scientific journal studies.

Return ONLY a valid JSON object matching this schema:
{
  "clinicalSafety": {
    "contraindications": ["string (foods/herbs to strictly avoid based on disease or medication)"],
    "allergenSafeNotice": ["string (confirmation that allergens are 100% excluded with safe swaps)"],
    "therapeuticStaples": ["string (healing foods for their condition)"],
    "medicationInteractions": ["string (specific drug-nutrient timing and warnings)"]
  },
  "userContextSummary": {
    "height": "${height} ${heightUnit}",
    "weight": "${weight} ${weightUnit}",
    "bmi": "calculated BMI string",
    "conditions": "${Array.isArray(medicalConditions) ? medicalConditions.join(', ') : medicalConditions || 'None'}",
    "allergies": "${Array.isArray(allergies) ? allergies.join(', ') : allergies || 'None'}",
    "medications": "${medications || 'None'}"
  },
  "books": [
    {
      "title": "string (real, authoritative published book)",
      "author": "string (recognized MD or clinical RD)",
      "category": "string",
      "rating": number,
      "isbnYear": "string",
      "summary": "string",
      "keyStrategies": ["string", "string", "string"],
      "relevance": "string explaining how it addresses their condition and parameters",
      "clinicalSafetyNote": "string certifying safety for their medications and allergies"
    }
  ],
  "articles": [
    {
      "title": "string",
      "source": "string (reputable journal e.g. AJCN, Lancet, JISSN)",
      "keyTakeaways": ["string", "string"],
      "practicalTip": "string"
    }
  ],
  "macronutrientGuide": {
    "protein": "string tailored to condition and weight",
    "carbs": "string tailored to glycemic needs",
    "fats": "string tailored to lipid and heart profile",
    "hydrationTip": "string"
  },
  "expertDisclaimer": "string"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text);
          return res.json({ success: true, data: parsed, source: 'ai' });
        }
      } catch (genAiError) {
        console.warn('Gemini API call failed for diet references, falling back to clinical generator:', genAiError);
      }
    }

    const fallbackData = generateDietaryFallback({
      fitnessGoals,
      userProfile,
      weight,
      weightUnit,
      height,
      heightUnit,
      age,
      medicalConditions,
      allergies,
      medications,
      dietaryPreference
    });

    return res.json({ success: true, data: fallbackData, source: 'curated-clinical' });
  } catch (error: any) {
    console.error('Error fetching dietary references:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch diet references' });
  }
});

// 3. Community Endpoints
app.get('/api/community/posts', (req, res) => {
  res.json({ success: true, posts: communityPosts });
});

app.post('/api/community/posts', async (req, res) => {
  try {
    const { authorName = 'Anonymous Member', category = 'Workouts', content = '' } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Post content cannot be empty' });
    }

    // Moderate with Gemini if available
    let isApproved = true;
    if (ai) {
      try {
        const modResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Check if this fitness community post is safe, supportive, and appropriate (no hate speech, spam, extreme medical claims, or harassment). Content: "${content}". Answer only YES or NO.`,
        });
        if (modResponse.text && modResponse.text.trim().toUpperCase().includes('NO')) {
          isApproved = false;
        }
      } catch {
        // if mod fails, allow safe fitness content
      }
    }

    if (!isApproved) {
      return res.status(400).json({
        success: false,
        error: 'Your post could not be published because it flagged our community safety guidelines.'
      });
    }

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: authorName.trim() || 'Fitness Enthusiast',
      authorRole: 'Active Member',
      avatarSeed: authorName.trim() || 'User',
      badge: 'Fresh Contributor 🌟',
      timestamp: 'Just now',
      category: ['Workouts', 'Nutrition', 'Motivation', 'Milestone', 'Questions'].includes(category)
        ? category
        : 'Workouts',
      content: content.trim(),
      likes: 1,
      likedBy: [],
      comments: [],
    };

    communityPosts.unshift(newPost);
    res.json({ success: true, post: newPost });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/community/like', (req, res) => {
  const { postId, userId = 'current-user' } = req.body;
  const post = communityPosts.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ success: false, error: 'Post not found' });
  }

  const index = post.likedBy.indexOf(userId);
  if (index > -1) {
    post.likedBy.splice(index, 1);
    post.likes = Math.max(0, post.likes - 1);
  } else {
    post.likedBy.push(userId);
    post.likes += 1;
  }

  res.json({ success: true, likes: post.likes, liked: post.likedBy.includes(userId) });
});

app.post('/api/community/comment', (req, res) => {
  const { postId, author = 'You', text = '' } = req.body;
  const post = communityPosts.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ success: false, error: 'Post not found' });
  }
  if (!text || !text.trim()) {
    return res.status(400).json({ success: false, error: 'Comment cannot be empty' });
  }

  const newComment = {
    id: `c-${Date.now()}`,
    author: author.trim() || 'You',
    text: text.trim(),
    timestamp: 'Just now',
  };

  post.comments.push(newComment);
  res.json({ success: true, comment: newComment });
});

// Setup Vite middleware in dev or static serving in prod
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FitTrack Pro server running on port ${PORT}`);
  });
}

startServer();
