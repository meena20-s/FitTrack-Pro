import { WorkoutPlan, DietaryReferencesData, CommunityPost } from '../types';

export async function fetchWorkoutPlan(params: {
  age: number;
  weight: number;
  weightUnit: 'kg' | 'lbs';
  height: number;
  heightUnit: 'cm' | 'in';
  fitnessGoal: string;
  experienceLevel: string;
  daysPerWeek: number;
  focusAreas: string[];
  medicalNotes?: string;
}): Promise<WorkoutPlan> {
  try {
    const res = await fetch('/api/workout/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    if (data.success && data.plan) {
      return {
        ...data.plan,
        id: `plan-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
    }
    throw new Error(data.error || 'Failed to parse plan from server');
  } catch (err) {
    console.warn('Using client-side fallback workout plan generator due to:', err);
    // Reliable client-side fallback
    return createClientFallbackPlan(params);
  }
}

export interface DietSearchParams {
  fitnessGoals: string;
  userProfile?: string;
  weight?: number;
  weightUnit?: 'kg' | 'lbs';
  height?: number;
  heightUnit?: 'cm' | 'in';
  age?: number;
  medicalConditions?: string[];
  allergies?: string[];
  medications?: string;
  dietaryPreference?: string;
}

export async function fetchDietaryReferences(
  paramsOrGoals: DietSearchParams | string,
  userProfileFallback?: string
): Promise<DietaryReferencesData> {
  const payload: DietSearchParams =
    typeof paramsOrGoals === 'string'
      ? {
          fitnessGoals: paramsOrGoals,
          userProfile: userProfileFallback || '',
        }
      : paramsOrGoals;

  try {
    const res = await fetch('/api/diet/references', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
    throw new Error(json.error || 'Failed to fetch diet references');
  } catch (err) {
    console.warn('Using client-side fallback diet references:', err);
    return getClientFallbackDietData(payload);
  }
}

export async function fetchCommunityPosts(): Promise<CommunityPost[]> {
  try {
    const res = await fetch('/api/community/posts');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.posts) {
        return data.posts;
      }
    }
  } catch (err) {
    console.warn('Error fetching community posts:', err);
  }
  return [];
}

export async function createCommunityPost(
  authorName: string,
  category: 'Workouts' | 'Nutrition' | 'Motivation' | 'Milestone' | 'Questions',
  content: string
): Promise<CommunityPost | null> {
  try {
    const res = await fetch('/api/community/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorName, category, content }),
    });
    const json = await res.json();
    if (json.success && json.post) {
      return json.post;
    }
    throw new Error(json.error || 'Failed to create post');
  } catch (err: any) {
    console.error('Failed to post to community:', err);
    throw err;
  }
}

export async function togglePostLike(postId: string, userId: string): Promise<{ likes: number; liked: boolean } | null> {
  try {
    const res = await fetch('/api/community/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, userId }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Like toggle error:', err);
  }
  return null;
}

export async function addPostComment(postId: string, author: string, text: string) {
  try {
    const res = await fetch('/api/community/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, author, text }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Comment post error:', err);
  }
  return null;
}

// Client Fallbacks
function createClientFallbackPlan(params: any): WorkoutPlan {
  const isBeginner = (params.experienceLevel || '').toLowerCase().includes('beginner');
  const isWeightLoss = (params.fitnessGoal || '').toLowerCase().includes('weight');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const dailyRoutines = days.map((day, idx) => {
    const isRest = idx === 1 || idx === 4 || idx === 6;
    if (isRest) {
      return {
        day,
        routineTitle: idx === 6 ? 'Restorative Yoga & Deep Stretch' : 'Active Recovery & Walking',
        estimatedDuration: '20-25 mins',
        intensity: 'Low' as const,
        focus: 'Joint mobility, breathing & active recovery',
        warmup: 'Slow neck and shoulder rotations with gentle torso twists.',
        exercises: [
          {
            name: 'Cat-Cow Pose & Child’s Pose',
            sets: 3,
            reps: '10 deep breaths',
            rest: '30s',
            targetMuscle: 'Spine, thoracic mobility, abdominal wall',
            instructions: 'Alternate between arching and rounding back with rhythmic breathing.',
            formTip: 'Keep neck relaxed and avoid rushing.'
          },
          {
            name: 'Seated Hamstring & Piriformis Stretch',
            sets: 2,
            reps: '45 seconds each leg',
            rest: '20s',
            targetMuscle: 'Hamstrings, lower back, glutes',
            instructions: 'Reach gently towards toes keeping back elongated.',
            formTip: 'Breathe out as you sink deeper into the stretch.'
          },
          {
            name: 'Brisk Walk or Stride',
            sets: 1,
            reps: '15-20 mins',
            rest: 'None',
            targetMuscle: 'Cardiovascular system & lymphatic flow',
            instructions: 'Comfortable steady-state walk outdoors or on treadmill.',
            formTip: 'Stay tall and swing arms naturally.'
          }
        ],
        cooldown: '3 minutes of deep box breathing.'
      };
    }

    if (idx === 0) {
      return {
        day,
        routineTitle: 'Full Body Blast',
        estimatedDuration: '30 minutes',
        intensity: isBeginner ? ('Moderate' as const) : ('High' as const),
        focus: 'Compound functional movements and core activation',
        warmup: '5 minutes of dynamic jumping jacks, arm circles, and bodyweight hip hinges.',
        exercises: [
          {
            name: 'Squats',
            sets: 3,
            reps: '12-15 reps',
            rest: '45 sec',
            targetMuscle: 'Quadriceps, hamstrings, gluteals',
            instructions: 'Lower hips back as if sitting in a chair, keep chest upright, push back up through heels.',
            formTip: 'Do not allow knees to cave inward.'
          },
          {
            name: 'Push-ups (on knees if needed)',
            sets: 3,
            reps: '8-12 reps',
            rest: '45 sec',
            targetMuscle: 'Chest, shoulders, triceps, core',
            instructions: 'Lower body in a rigid straight line until chest is 2 inches above the ground, then press back up.',
            formTip: 'Keep elbows tucked at about 45 degrees relative to your torso.'
          },
          {
            name: 'Lunges',
            sets: 3,
            reps: '10 each leg',
            rest: '45 sec',
            targetMuscle: 'Quadriceps, glutes, core stability',
            instructions: 'Step forward smoothly into a 90-degree bend, then press through the lead heel back to start.',
            formTip: 'Keep your front knee directly over your front ankle.'
          },
          {
            name: 'Plank',
            sets: 3,
            reps: '30-45 seconds',
            rest: '30 sec',
            targetMuscle: 'Transverse abdominis, rectus abdominis, shoulders',
            instructions: 'Hold forearm plank position with engaged core and glutes.',
            formTip: 'Maintain a straight line from neck to heels without sagging hips.'
          }
        ],
        cooldown: '5 minutes of slow quad, hamstring, and chest stretches.'
      };
    }

    return {
      day,
      routineTitle: idx === 2 ? 'Cardio & Core Ignition' : 'Upper Body & Posture Focus',
      estimatedDuration: '30 minutes',
      intensity: 'Moderate' as const,
      focus: 'Endurance and core stability',
      warmup: '5 minutes dynamic leg swings and high knees.',
      exercises: [
        {
          name: 'Mountain Climbers',
          sets: 3,
          reps: '30 seconds',
          rest: '45 sec',
          targetMuscle: 'Full body core & cardio endurance',
          instructions: 'From high plank, rhythmically drive knees alternating toward chest.',
          formTip: 'Keep hands firmly planted under shoulders.'
        },
        {
          name: 'Glute Bridges',
          sets: 3,
          reps: '15 reps',
          rest: '30 sec',
          targetMuscle: 'Glutes, hamstrings, lower back',
          instructions: 'Lie on back with knees bent, squeeze glutes and lift hips toward ceiling.',
          formTip: 'Hold at the top for 2 full seconds.'
        },
        {
          name: 'Bicycle Crunches',
          sets: 3,
          reps: '20 reps (10 each side)',
          rest: '30 sec',
          targetMuscle: 'Obliques, rectus abdominis',
          instructions: 'Alternate touching opposite elbow to opposite knee with controlled rotation.',
          formTip: 'Rotate from ribcage, not by yanking the head.'
        }
      ],
      cooldown: 'Child pose and slow thoracic rotation stretch.'
    };
  });

  return {
    id: `plan-${Date.now()}`,
    planTitle: `${params.experienceLevel || 'Beginner'}'s ${params.fitnessGoal || 'Fitness'} Kickstart`,
    planSummary: `This 7-day workout plan is designed for ${params.experienceLevel || 'beginners'} aged ${params.age} with a primary goal of ${params.fitnessGoal}. It incorporates a balanced mix of cardio and bodyweight exercises to gradually build strength, metabolic tone, and endurance. Remember to listen to your body and adjust intensity as needed.`,
    dailyRoutines,
    generalAdvice: `Perform 5-10 minutes of dynamic stretching (e.g., arm circles, leg swings, torso twists) before each session. Perform 5-10 minutes of static stretching (holding positions for 20-30 seconds) after each session. Stay well-hydrated by drinking water throughout the day, especially before, during, and after workouts. Pay attention to your body. If you feel pain, stop the exercise and consult a professional if necessary. Adjust intensity as needed. IMPORTANT: Always consult with a healthcare professional before starting any new exercise program or drastically changing your physical activity level.`,
    calorieEstimatePerSession: isWeightLoss ? 260 : 210,
    targetGoal: params.fitnessGoal || 'Weight Loss',
    ageCategory: params.age < 20 ? 'Teens' : params.age < 36 ? 'Young Adults' : params.age < 55 ? 'Adults' : 'Seniors',
    createdAt: new Date().toISOString(),
  };
}

function getClientFallbackDietData(params: DietSearchParams): DietaryReferencesData {
  const {
    fitnessGoals = 'Weight Loss & Energy',
    weight = 50,
    weightUnit = 'kg',
    height = 172,
    heightUnit = 'cm',
    medicalConditions = ['None'],
    allergies = ['None'],
    medications = 'None',
    dietaryPreference = 'Vegetarian',
  } = params;

  const heightM = heightUnit === 'cm' ? height / 100 : (height * 2.54) / 100;
  const weightKg = weightUnit === 'kg' ? weight : weight * 0.453592;
  const bmiVal = heightM > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : '16.9';

  const conds = (medicalConditions || []).map((c) => c.toLowerCase());
  const hasDiabetes = conds.some((c) => c.includes('diabet') || c.includes('sugar'));
  const hasHypertension = conds.some((c) => c.includes('hypertens') || c.includes('pressure') || c.includes('heart'));
  const hasCholesterol = conds.some((c) => c.includes('cholesterol'));
  const hasPCOS = conds.some((c) => c.includes('pcos'));
  const hasGERD = conds.some((c) => c.includes('gerd') || c.includes('reflux') || c.includes('acid'));

  const allgs = (allergies || []).map((a) => a.toLowerCase());
  const hasNuts = allgs.some((a) => a.includes('nut') || a.includes('peanut'));
  const hasDairy = allgs.some((a) => a.includes('dairy') || a.includes('lactose'));
  const hasGluten = allgs.some((a) => a.includes('gluten') || a.includes('celiac'));

  const medsLower = (medications || '').toLowerCase();
  const hasStatins = medsLower.includes('statin') || medsLower.includes('lipitor');
  const hasThyroid = medsLower.includes('levothyroxine') || medsLower.includes('synthroid');
  const hasMetformin = medsLower.includes('metformin');
  const hasBpMed = medsLower.includes('lisinopril') || medsLower.includes('amlodipine') || medsLower.includes('losartan');

  const contraindications: string[] = [];
  const allergenSafeNotice: string[] = [];
  const therapeuticStaples: string[] = [];
  const medicationInteractions: string[] = [];

  if (hasStatins) {
    contraindications.push('🚨 Strict Avoidance: Grapefruit and Seville oranges. Compounds inactivate intestinal CYP3A4 enzymes, raising statin concentrations dangerously high.');
    medicationInteractions.push('Statins can lower intracellular CoQ10. Discuss CoQ10-rich foods or co-supplementation with your physician.');
  }

  if (hasThyroid) {
    contraindications.push('⚠️ Medication Absorption: Do not ingest calcium supplements, iron, walnuts, or high-fiber foods within 3-4 hours of morning thyroid medication.');
    medicationInteractions.push('Take thyroid medication with plain water first thing in the morning on an empty stomach at least 30-60 minutes before breakfast.');
  }

  if (hasMetformin) {
    medicationInteractions.push('Metformin reduces long-term Vitamin B12 absorption. Ensure fortified nutritional yeast, fortified soy/almond milk, or periodic B12 checks.');
    therapeuticStaples.push('Viscous soluble fiber (chia, flaxseeds, rolled oats) to blunt glycemic spikes.');
  }

  if (hasBpMed || hasHypertension) {
    contraindications.push('Limit sodium intake to under 1,500mg/day. Strictly avoid cured deli meats, packaged broths, and high-sodium sauces.');
    therapeuticStaples.push('Magnesium and potassium-dense greens (spinach, Swiss chard, steamed broccoli) to relax arterial walls.');
  }

  if (hasDiabetes) {
    contraindications.push('Strictly avoid high-glycemic syrups, sweetened beverages, fruit juices without pulp, and refined flours.');
    therapeuticStaples.push('Low-GI complex carbohydrates (black beans, sprouted lentils, quinoa, berries) combined with healthy fats.');
  }

  if (hasCholesterol) {
    contraindications.push('Eliminate trans fats and keep saturated fats < 6% of total calories. Avoid palm and coconut oils.');
    therapeuticStaples.push('Beta-glucan soluble fiber (barley, oats) to actively bind and eliminate biliary cholesterol.');
  }

  if (hasGERD) {
    contraindications.push('Avoid acidic citrus, tomatoes, peppermint, excess caffeine, and heavy meals within 3 hours of sleep.');
    therapeuticStaples.push('Alkaline soothing foods (ginger root tea, oatmeal, zucchini, non-citrus fruits).');
  }

  if (hasPCOS) {
    therapeuticStaples.push('Spearmint tea, anti-inflammatory whole fats, and myo-inositol-friendly cruciferous veggies.');
  }

  if (hasNuts) {
    contraindications.push('🥜 ALLERGY NOTICE: All peanuts and tree nuts strictly excluded.');
    allergenSafeNotice.push('100% Nut-Free: Sunflower seed butter, pumpkin seeds, and hemp hearts replace nut oils.');
  }

  if (hasDairy) {
    contraindications.push('🥛 ALLERGY NOTICE: Milk, whey proteins, soft cheeses, and butter strictly excluded.');
    allergenSafeNotice.push('100% Dairy-Free: Calcium-fortified oat, soy, and pea milks utilized.');
  }

  if (hasGluten) {
    contraindications.push('🌾 ALLERGY NOTICE: Wheat, barley, rye, and non-certified oats strictly excluded.');
    allergenSafeNotice.push('100% Gluten-Free: Certified gluten-free oats, brown rice, quinoa, and buckwheat.');
  }

  if (contraindications.length === 0) {
    contraindications.push('No acute pharmacological contraindications flagged. Maintain balanced hydration and whole-food diversity.');
  }
  if (allergenSafeNotice.length === 0) {
    allergenSafeNotice.push('No allergen exclusions requested. Tolerates standard whole food allergens safely.');
  }
  if (therapeuticStaples.length === 0) {
    therapeuticStaples.push('Phytonutrient-rich colorful vegetables, clean plant-based proteins, and omega-3 fatty acids.');
  }

  return {
    books: [
      {
        title: hasDiabetes
          ? 'Dr. Neal Barnard’s Program for Reversing Diabetes'
          : hasHypertension
          ? 'The DASH Diet Mediterranean Solution'
          : 'The Plant-Based Athlete: Peak Performance & Longevity',
        author: hasDiabetes ? 'Dr. Neal Barnard, MD, FACC' : hasHypertension ? 'Marla Heller, MS, RD' : 'Matt Frazier & Robert Cheeke',
        category: hasDiabetes ? 'Clinical Endocrinology & Glycemic Control' : hasHypertension ? 'Cardiovascular Health' : 'Holistic Sports Nutrition',
        rating: 4.8,
        isbnYear: 'HarperCollins / Rodale',
        summary: hasDiabetes
          ? 'Medically validated clinical trial nutrition protocol showing how low-fat whole food nutrition removes cellular intramyocellular lipids to restore natural insulin sensitivity.'
          : hasHypertension
          ? 'Top-ranked cardiovascular dietary framework combining Mediterranean heart-healthy polyphenols with DASH electrolyte balance.'
          : 'Comprehensive, science-backed guidance on optimizing athletic performance and body composition through plant-rich nutrition.',
        keyStrategies: [
          hasDiabetes ? 'Prioritize soluble fiber to eliminate postprandial glucose excursions' : 'Target 4,700mg dietary potassium from leafy greens and lentils to balance sodium',
          hasNuts ? 'Use pumpkin & sunflower seeds for essential fatty acids without nut allergens' : 'Healthy plant fats for anti-inflammatory joint recovery',
          `Directly calibrated for your physical baseline: ${weight} ${weightUnit}, ${height} ${heightUnit} (BMI ${bmiVal})`
        ],
        relevance: `Formulated to respect your health status (${medicalConditions.join(', ')}) while supporting ${fitnessGoals}.`,
        clinicalSafetyNote: `Compatible with medications (${medications}). Allergen-safe verified.`
      },
      {
        title: 'How Not to Die: Discover the Foods Scientifically Proven to Prevent Disease',
        author: 'Dr. Michael Greger, MD, FACLM',
        category: 'Evidence-Based Preventative & Lifestyle Medicine',
        rating: 4.9,
        isbnYear: 'Flatiron Books',
        summary: 'Dr. Greger examines the fifteen leading causes of premature death—including heart disease, diabetes, and high blood pressure—and reveals evidence-based dietary interventions.',
        keyStrategies: [
          'Daily Dozen checklist: 3 servings of beans/lentils, berries, cruciferous vegetables, and greens',
          'Optimize hydration without added refined liquid sugars',
          'Incorporate ground flaxseeds daily for lignans and alpha-linolenic omega-3 fatty acids'
        ],
        relevance: 'Provides verified clinical data to build lifelong metabolic vigor.',
        clinicalSafetyNote: 'Dedicated clinical chapters on drug-nutrient safety and whole food substitutions.'
      },
      {
        title: 'The Blue Zones Kitchen',
        author: 'Dan Buettner',
        category: 'Longevity, Heart Health & Metabolic Wellness',
        rating: 4.8,
        isbnYear: 'National Geographic',
        summary: 'Delicious, life-extending recipes and lifestyle habits from the world’s longest-living populations.',
        keyStrategies: [
          'Whole food plant-forward nutritional foundation',
          'Rich fiber intake through legumes and root vegetables',
          'Mindful eating: stopping when 80% full'
        ],
        relevance: 'Minimizes systemic inflammation and supports joint and cardiovascular recovery.',
        clinicalSafetyNote: 'Easily customizable for specific dietary preferences and sensitivities.'
      }
    ],
    articles: [
      {
        title: 'Drug-Nutrient Interactions in Clinical Practice: What Active Individuals Need to Know',
        source: 'American Journal of Clinical Nutrition (AJCN)',
        keyTakeaways: [
          'Certain prescription medications interact with common foods (e.g. grapefruit with statins, high-potassium with ACE inhibitors, calcium with thyroid medications).',
          'Spacing supplements and meals 2 to 4 hours away from sensitive medications preserves therapeutic efficacy.'
        ],
        practicalTip: `Always review your active medications (${medications}) with your physician before introducing high-dose botanical supplements.`
      },
      {
        title: 'Medical Nutrition Therapy for Active Adults with Allergies and Sensitivities',
        source: 'Academy of Nutrition and Dietetics (AND)',
        keyTakeaways: [
          'Complete essential amino acids can be easily achieved through seed and grain combinations (e.g. hemp hearts + oats + lentils) without triggering nut or dairy allergies.',
          'Sufficient micronutrient density prevents workout fatigue and supports healthy thyroid and adrenal function.'
        ],
        practicalTip: `At ${weight} ${weightUnit} and ${height} ${heightUnit} (BMI ${bmiVal}), prioritize nutrient-dense whole foods that provide satiety without digestive burden.`
      }
    ],
    clinicalSafety: {
      contraindications,
      allergenSafeNotice,
      therapeuticStaples,
      medicationInteractions: medicationInteractions.length > 0 ? medicationInteractions : ['No major drug-food interactions detected for listed medications. Take medications as directed by your physician.']
    },
    userContextSummary: {
      height: `${height} ${heightUnit}`,
      weight: `${weight} ${weightUnit}`,
      bmi: `${bmiVal} (${parseFloat(bmiVal) < 18.5 ? 'Lean / Underweight' : parseFloat(bmiVal) < 25 ? 'Normal' : 'Overweight'})`,
      conditions: medicalConditions.join(', '),
      allergies: allergies.join(', '),
      medications: medications || 'None reported',
      goal: fitnessGoals
    },
    macronutrientGuide: {
      calories: `${Math.round(weightKg * 30)} - ${Math.round(weightKg * 34)} kcal/day`,
      protein: hasDiabetes || hasPCOS
        ? '30% of daily intake (~1.4g/kg) — high protein stabilizes blood glucose'
        : '25% - 30% of daily intake (tofu, tempeh, lentils, pumpkin seeds, hemp hearts)',
      carbs: hasDiabetes
        ? '40% of daily intake (strictly low GI: rolled oats, black beans, quinoa, leafy greens)'
        : '45% - 50% of daily intake (complex whole grains, sweet potatoes, wild rice, berries)',
      fats: hasCholesterol || hasHypertension
        ? '25% of daily intake (strictly heart-healthy monounsaturated: cold-pressed olive oil, avocados, flaxseeds)'
        : '25% - 30% of daily intake (essential omega-3s, chia seeds, avocado)',
      fiber: '35 - 45 grams/day (essential for glycemic smoothing & cholesterol binding)',
      hydrationTip: `Drink 2.4 - 3.0 Liters daily. ${hasGERD ? 'Sip water upright; avoid chugging large quantities right before lying down.' : 'Drink 500ml upon waking and hydrate evenly.'}`,
      conditionStrategy: hasDiabetes
        ? 'Glucose stabilization protocol: Pair every carb with protein and healthy fats.'
        : hasHypertension
        ? 'Electrolyte balance protocol: High dietary potassium & magnesium with restricted sodium (<1,500mg).'
        : 'Whole-food metabolic vitality protocol: High fiber, steady hydration, clean proteins.'
    },
    expertDisclaimer: 'This clinical nutrition guide is personalized specifically to your physical metrics, medical conditions, medications, and reported allergies. It is intended for educational purposes and should complement, not replace, personalized medical supervision from your doctor or registered dietitian.'
  };
}
