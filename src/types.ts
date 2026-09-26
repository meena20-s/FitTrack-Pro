export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  targetMuscle: string;
  instructions: string;
  formTip?: string;
}

export interface DailyRoutine {
  day: string; // 'Monday', 'Tuesday', etc.
  routineTitle: string; // e.g. 'Full Body Blast'
  estimatedDuration: string; // e.g. '30 minutes'
  intensity: 'Low' | 'Moderate' | 'Moderate-High' | 'High';
  focus: string;
  warmup: string;
  exercises: Exercise[];
  cooldown: string;
  completed?: boolean;
  completedAt?: string;
}

export interface WorkoutPlan {
  id: string;
  planTitle: string;
  planSummary: string;
  dailyRoutines: DailyRoutine[];
  generalAdvice: string;
  calorieEstimatePerSession: number;
  targetGoal: string;
  ageCategory: string;
  createdAt: string;
}

export interface UserFitnessProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  weight: number;
  weightUnit: 'kg' | 'lbs';
  height: number;
  heightUnit: 'cm' | 'in';
  fitnessGoal: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  daysPerWeek: number;
  focusAreas: string[];
  medicalNotes?: string;
  allergies?: string[];
  medicalConditions?: string[];
  medications?: string;
  dietaryPreference?: string;
  avatarSeed: string;
}

export interface DietBook {
  title: string;
  author: string;
  category: string;
  rating: number;
  isbnYear: string;
  summary: string;
  keyStrategies: string[];
  relevance: string;
  clinicalSafetyNote?: string;
}

export interface DietArticle {
  title: string;
  source: string;
  keyTakeaways: string[];
  practicalTip: string;
}

export interface ClinicalSafetyReport {
  contraindications: string[];
  allergenSafeNotice: string[];
  therapeuticStaples: string[];
  medicationInteractions: string[];
}

export interface DietaryReferencesData {
  books: DietBook[];
  articles: DietArticle[];
  clinicalSafety?: ClinicalSafetyReport;
  userContextSummary?: {
    height: string;
    weight: string;
    bmi: string;
    conditions: string;
    allergies: string;
    medications: string;
    goal?: string;
  };
  macronutrientGuide: {
    calories?: string;
    protein: string;
    carbs: string;
    fats: string;
    fiber?: string;
    hydrationTip: string;
    conditionStrategy?: string;
  };
  expertDisclaimer: string;
}

export interface CommunityComment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface CommunityPost {
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
  comments: CommunityComment[];
}

export interface ActivityLogItem {
  id: string;
  date: string;
  routineTitle: string;
  dayName: string;
  durationMinutes: number;
  caloriesBurned: number;
  status: 'Completed' | 'Skipped';
  notes?: string;
}

export interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}
