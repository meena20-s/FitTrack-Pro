import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserFitnessProfile,
  WorkoutPlan,
  DietaryReferencesData,
  CommunityPost,
  ActivityLogItem,
  BadgeItem,
  DailyRoutine
} from '../types';
import {
  fetchWorkoutPlan,
  fetchDietaryReferences,
  fetchCommunityPosts,
  createCommunityPost,
  togglePostLike,
  addPostComment,
  DietSearchParams
} from '../services/api';

export type ActivePage =
  | 'home'
  | 'about'
  | 'workouts'
  | 'community'
  | 'dietary-refs'
  | 'contact'
  | 'profile'
  | 'statements';

interface AppContextType {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  user: UserFitnessProfile;
  setUser: React.Dispatch<React.SetStateAction<UserFitnessProfile>>;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  workoutPlan: WorkoutPlan | null;
  setWorkoutPlan: React.Dispatch<React.SetStateAction<WorkoutPlan | null>>;
  activeDayIndex: number;
  setActiveDayIndex: (idx: number) => void;
  isGeneratingPlan: boolean;
  generateNewPlan: (formData: Partial<UserFitnessProfile>) => Promise<void>;
  markDayComplete: (dayIndex: number) => void;
  // Dietary
  dietaryData: DietaryReferencesData | null;
  isLoadingDiet: boolean;
  searchDietReferences: (paramsOrGoals?: DietSearchParams | string, profileFallback?: string) => Promise<void>;
  // Community
  posts: CommunityPost[];
  isLoadingPosts: boolean;
  submitNewPost: (category: any, content: string) => Promise<boolean>;
  likePost: (postId: string) => Promise<void>;
  commentOnPost: (postId: string, text: string) => Promise<void>;
  // Activity / Mini Statements
  activityLogs: ActivityLogItem[];
  addManualActivity: (item: Omit<ActivityLogItem, 'id'>) => void;
  // Badges & Stats
  badges: BadgeItem[];
  currentStreak: number;
  totalCaloriesBurned: number;
  // Modals
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (val: boolean) => void;
  activeWorkoutForPlayer: DailyRoutine | null;
  setActiveWorkoutForPlayer: (routine: DailyRoutine | null) => void;
  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
  // Demo switchers
  switchUserRole: (role: 'meena' | 'ruchira' | 'guest') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_USER: UserFitnessProfile = {
  id: 'usr-1',
  name: 'Meena S',
  email: 'meena.s@nhce.edu',
  age: 21,
  weight: 50,
  weightUnit: 'kg',
  height: 172,
  heightUnit: 'cm',
  fitnessGoal: 'Weight Loss',
  experienceLevel: 'Beginner',
  daysPerWeek: 4,
  focusAreas: ['HIIT', 'Core & Abs', 'Yoga'],
  medicalNotes: '',
  avatarSeed: 'Meena',
};

const INITIAL_BADGES: BadgeItem[] = [
  {
    id: 'b-1',
    name: 'First Step',
    description: 'Completed your very first workout on FitTrack Pro',
    icon: '👟',
    unlocked: true,
    unlockedAt: '2 days ago',
  },
  {
    id: 'b-2',
    name: '3-Day Consistency Streak',
    description: 'Crushed workouts 3 days in a row without breaking form',
    icon: '🔥',
    unlocked: true,
    unlockedAt: 'Yesterday',
  },
  {
    id: 'b-3',
    name: 'Core Crusher',
    description: 'Held plank and finished an intensive abdominal circuit',
    icon: '⚡',
    unlocked: true,
    unlockedAt: '3 days ago',
  },
  {
    id: 'b-4',
    name: 'Nutrition Scholar',
    description: 'Researched science-backed dietary reference guides',
    icon: '🥗',
    unlocked: true,
    unlockedAt: 'Today',
  },
  {
    id: 'b-5',
    name: 'Community Voice',
    description: 'Shared an encouraging progress update with fellow athletes',
    icon: '💬',
    unlocked: false,
  },
  {
    id: 'b-6',
    name: 'Iron Determination',
    description: 'Burned more than 2,000 active calories across all workouts',
    icon: '🏆',
    unlocked: false,
  },
];

const INITIAL_LOGS: ActivityLogItem[] = [
  {
    id: 'log-1',
    date: '2025-05-12',
    routineTitle: 'Full Body Blast',
    dayName: 'Monday',
    durationMinutes: 30,
    caloriesBurned: 240,
    status: 'Completed',
    notes: 'Pushed through all squat sets. Felt great!',
  },
  {
    id: 'log-2',
    date: '2025-05-14',
    routineTitle: 'HIIT Cardio & Core Ignition',
    dayName: 'Wednesday',
    durationMinutes: 35,
    caloriesBurned: 285,
    status: 'Completed',
    notes: 'Mountain climbers were tough but energized my afternoon.',
  },
  {
    id: 'log-3',
    date: '2025-05-16',
    routineTitle: 'Lower Body Strength & Functional Conditioning',
    dayName: 'Friday',
    durationMinutes: 30,
    caloriesBurned: 230,
    status: 'Completed',
    notes: 'Good focus on balance and quad engagement.',
  },
];

// Initial plan replicating Fig 4.2.3 from the report
const INITIAL_PLAN: WorkoutPlan = {
  id: 'plan-default-1',
  planTitle: "Beginner's Weight Loss Kickstart",
  planSummary:
    'This 7-day workout plan is designed for beginners with a primary goal of weight loss. It incorporates a mix of cardio and bodyweight exercises to gradually build strength and endurance. Remember to listen to your body and adjust the intensity as needed.',
  dailyRoutines: [
    {
      day: 'Monday',
      routineTitle: 'Full Body Blast',
      estimatedDuration: '30 minutes',
      intensity: 'Moderate',
      focus: 'Whole body metabolic conditioning and foundational compound movement',
      warmup: '5 minutes: Dynamic arm swings, torso twists, marching in place, and bodyweight hip openers.',
      exercises: [
        {
          name: 'Squats',
          sets: 3,
          reps: '12-15 reps',
          rest: '45 seconds',
          targetMuscle: 'Quadriceps, Hamstrings, Glutes',
          instructions: 'Stand tall with feet shoulder-width apart. Hips sink back and down as if lowering into a chair. Drive through heels to return.',
          formTip: 'Keep your chest proud and ensure knees track along toes.'
        },
        {
          name: 'Push-ups (on knees if needed)',
          sets: 3,
          reps: '8-10 reps',
          rest: '45 seconds',
          targetMuscle: 'Pectorals, Anterior Deltoids, Triceps',
          instructions: 'Maintain a straight plank line from head to knees/heels. Lower chest slowly until 2 inches above ground, then push up.',
          formTip: 'Tuck your elbows at a 45-degree angle to protect shoulder joints.'
        },
        {
          name: 'Lunges',
          sets: 3,
          reps: '10 each leg',
          rest: '45 seconds',
          targetMuscle: 'Glutes, Quads, Calves, Stabilizers',
          instructions: 'Take an intentional step forward, lowering both knees to 90 degrees. Push back smoothly through the lead foot.',
          formTip: 'Avoid slamming your back knee into the floor.'
        },
        {
          name: 'Plank',
          sets: 3,
          reps: '30-45 seconds',
          rest: '30 seconds',
          targetMuscle: 'Rectus Abdominis, Transverse Core',
          instructions: 'Rest on forearms and toes, squeezing glutes and pulling belly button inward.',
          formTip: 'Do not allow your lower back to arch or dip.'
        }
      ],
      cooldown: '5 minutes: Seated hamstring reach, quad stretch, and deep diaphragmatic breathing.',
      completed: true,
      completedAt: 'Yesterday'
    },
    {
      day: 'Tuesday',
      routineTitle: 'Active Recovery & Gentle Mobility',
      estimatedDuration: '20 minutes',
      intensity: 'Low',
      focus: 'Joint lubrication, lymphatic drainage, and nervous system recovery',
      warmup: 'Slow neck rolls and shoulder shrugs with relaxed breathing.',
      exercises: [
        {
          name: 'Cat-Cow Flow',
          sets: 3,
          reps: '10 breath cycles',
          rest: '20s',
          targetMuscle: 'Spine, Erector Spinae',
          instructions: 'Move gently between arched spine with inhale and curved back with exhale.',
          formTip: 'Move at your own natural breathing pace.'
        },
        {
          name: 'Child Pose with Side Reaches',
          sets: 3,
          reps: '45 seconds',
          rest: '20s',
          targetMuscle: 'Lats, Lower Back, Hips',
          instructions: 'Sit hips back onto heels, reach hands forward and walk fingers to left and right sides.',
          formTip: 'Breathe into the ribs on each stretch.'
        },
        {
          name: 'Brisk Outdoor Stroll / Walking Stride',
          sets: 1,
          reps: '15 minutes',
          rest: 'None',
          targetMuscle: 'Cardiovascular System',
          instructions: 'Enjoy a light pace outdoors or on treadmill with comfortable posture.',
          formTip: 'Keep eyes forward and shoulders dropped away from ears.'
        }
      ],
      cooldown: 'Standing calf stretch and hydration glass.',
      completed: false
    },
    {
      day: 'Wednesday',
      routineTitle: 'HIIT Cardio & Core Ignition',
      estimatedDuration: '30 minutes',
      intensity: 'Moderate',
      focus: 'Aerobic threshold and targeted core stabilization',
      warmup: '5 minutes: Jumping jacks (or step jacks), high knees, and ankle circles.',
      exercises: [
        {
          name: 'Mountain Climbers',
          sets: 3,
          reps: '30 seconds continuous',
          rest: '45 seconds',
          targetMuscle: 'Full Body Core & Calorie Burn',
          instructions: 'From high plank, pump knees alternating towards chest in rhythm.',
          formTip: 'Keep your hips level without bouncing in the air.'
        },
        {
          name: 'Glute Bridges',
          sets: 3,
          reps: '15 reps',
          rest: '30 seconds',
          targetMuscle: 'Gluteus Maximus, Hamstrings',
          instructions: 'Lie on back, bend knees, feet flat. Press through heels and squeeze glutes upward.',
          formTip: 'Hold the top squeeze for 2 seconds before lowering.'
        },
        {
          name: 'Bicycle Crunches',
          sets: 3,
          reps: '20 total (10 each side)',
          rest: '30 seconds',
          targetMuscle: 'Obliques and Upper Abs',
          instructions: 'Rotate torso bringing right elbow toward left knee while extending right leg.',
          formTip: 'Initiate the twist from your core rather than pulling on head.'
        },
        {
          name: 'Standing High Knee Skips',
          sets: 3,
          reps: '30 seconds',
          rest: '45 seconds',
          targetMuscle: 'Hip Flexors, Quads, Cardio Endurance',
          instructions: 'Drive knees up rhythmically with arm counter-swing.',
          formTip: 'Land lightly on balls of your feet.'
        }
      ],
      cooldown: 'Cobra pose stretch and gentle spinal twist.',
      completed: false
    },
    {
      day: 'Thursday',
      routineTitle: 'Active Walking & Lower Body Flush',
      estimatedDuration: '25 minutes',
      intensity: 'Low',
      focus: 'Low-impact aerobic conditioning and lactic acid flushing',
      warmup: 'Dynamic ankle rolls and hip circles.',
      exercises: [
        {
          name: 'Incline Stride / Power Walk',
          sets: 1,
          reps: '20 minutes',
          rest: 'None',
          targetMuscle: 'Heart, Calves, Hamstrings',
          instructions: 'Maintain a brisk pace where you can still hold a conversation.',
          formTip: 'Engage core gently and keep shoulders relaxed.'
        },
        {
          name: 'Figure Four Hip Stretch',
          sets: 2,
          reps: '45 seconds each leg',
          rest: '20 seconds',
          targetMuscle: 'Piriformis, Outer Glutes',
          instructions: 'Cross ankle over opposite thigh and sink hips back.',
          formTip: 'Use a wall or chair for balance if needed.'
        }
      ],
      cooldown: 'Hamstring door-frame stretch.',
      completed: false
    },
    {
      day: 'Friday',
      routineTitle: 'Upper Body & Postural Strength',
      estimatedDuration: '30 minutes',
      intensity: 'Moderate',
      focus: 'Back, chest, arms, and posture alignment',
      warmup: '5 minutes: Arm hugs, shoulder rolls, and wall angels.',
      exercises: [
        {
          name: 'Incline Desk or Chair Push-ups',
          sets: 3,
          reps: '10-12 reps',
          rest: '45 seconds',
          targetMuscle: 'Upper Chest, Deltoids, Triceps',
          instructions: 'Hands on sturdy elevated surface, lower chest towards edge and press back up.',
          formTip: 'Great variation for building push-up depth and strength.'
        },
        {
          name: 'Doorframe or Towel Isometric Rows',
          sets: 3,
          reps: '12 reps',
          rest: '45 seconds',
          targetMuscle: 'Rhomboids, Lats, Biceps',
          instructions: 'Grip doorway frame, lean back slightly and pull your chest towards frame squeezing back.',
          formTip: 'Focus on retracting shoulder blades.'
        },
        {
          name: 'Bird-Dog Extensions',
          sets: 3,
          reps: '10 reps each side',
          rest: '30 seconds',
          targetMuscle: 'Lower Back, Core, Glutes',
          instructions: 'On hands and knees, extend opposite arm and opposite leg simultaneously.',
          formTip: 'Keep hips square to the ground.'
        },
        {
          name: 'Dead Bug Holds',
          sets: 3,
          reps: '10 each side',
          rest: '30 seconds',
          targetMuscle: 'Deep Transverse Abdominis',
          instructions: 'On back, knees at 90 degrees. Lower opposite arm and heel toward floor without lower back arching.',
          formTip: 'Press your lower spine firmly into the floor.'
        }
      ],
      cooldown: 'Chest opener against doorway and tricep stretch.',
      completed: false
    },
    {
      day: 'Saturday',
      routineTitle: 'Metabolic Conditioning Circuit',
      estimatedDuration: '30 minutes',
      intensity: 'Moderate-High',
      focus: 'Full body functional agility and stamina',
      warmup: 'Torso twists, butt kicks, arm pulses.',
      exercises: [
        {
          name: 'Bodyweight Step-Back Squats',
          sets: 3,
          reps: '15 reps',
          rest: '45s',
          targetMuscle: 'Quads, Glutes',
          instructions: 'Smooth rhythmic squats keeping weight grounded through mid-foot and heel.',
          formTip: 'Exhale as you push up to standing.'
        },
        {
          name: 'Lateral Skater Steps',
          sets: 3,
          reps: '20 steps total',
          rest: '45s',
          targetMuscle: 'Abductors, Calves, Dynamic Balance',
          instructions: 'Bound softly from side to side, swinging opposite arm across.',
          formTip: 'Land with a soft knee.'
        },
        {
          name: 'Forearm Side Plank',
          sets: 2,
          reps: '25s each side',
          rest: '30s',
          targetMuscle: 'Obliques, Shoulder Girdle',
          instructions: 'Prop up on forearm, lifting hips off mat into straight diagonal.',
          formTip: 'Do not let top shoulder roll forward.'
        }
      ],
      cooldown: 'Quad stretch, child pose, relaxed box breathing.',
      completed: false
    },
    {
      day: 'Sunday',
      routineTitle: 'Full Body Reset & Deep Yoga Flow',
      estimatedDuration: '25 minutes',
      intensity: 'Low',
      focus: 'Mindful breathing, deep myofascial opening, and weekly renewal',
      warmup: 'Gentle standing forward fold with soft knees and slow rise.',
      exercises: [
        {
          name: 'Sun Salutation A Flow',
          sets: 3,
          reps: '3 rounds',
          rest: '30s',
          targetMuscle: 'Full Body Mobility & Breath',
          instructions: 'Mountain pose to forward fold, halfway lift, cobra or updog, downward dog, and back.',
          formTip: 'Prioritize fluid breath over extreme flexibility.'
        },
        {
          name: 'Downward Facing Dog & Calf Pedals',
          sets: 2,
          reps: '1 minute',
          rest: '20s',
          targetMuscle: 'Calves, Hamstrings, Shoulders',
          instructions: 'Press through palms, lift hips high, pedal heels gently one by one.',
          formTip: 'Bend knees if hamstrings feel tight.'
        },
        {
          name: 'Reclining Spinal Twist',
          sets: 2,
          reps: '1 minute each side',
          rest: 'None',
          targetMuscle: 'Thoracic Spine, Glutes, Chest',
          instructions: 'Lie on back, hug knees to chest, drop knees gently to the right while looking left.',
          formTip: 'Let gravity do the work; breathe deeply into belly.'
        }
      ],
      cooldown: 'Savasana / 5 minutes meditation.',
      completed: false
    }
  ],
  generalAdvice:
    'Perform 5-10 minutes of dynamic stretching (e.g., arm circles, leg swings, torso twists) before each session. Perform 5-10 minutes of static stretching (holding positions for 20-30 seconds) after each session. Stay well-hydrated by drinking water throughout the day, especially before, during, and after workouts. Pay attention to your body. If you feel pain, stop the exercise and consult a professional if necessary. Adjust intensity as needed. IMPORTANT: Always consult with a healthcare professional before starting any new exercise program or drastically changing your physical activity level.',
  calorieEstimatePerSession: 240,
  targetGoal: 'Weight Loss',
  ageCategory: 'Young Adults',
  createdAt: '2025-05-10T08:00:00.000Z'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [user, setUser] = useState<UserFitnessProfile>(() => {
    const saved = localStorage.getItem('fit_track_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USER;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(() => {
    const saved = localStorage.getItem('fit_track_active_plan');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PLAN;
  });

  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);

  const [dietaryData, setDietaryData] = useState<DietaryReferencesData | null>(null);
  const [isLoadingDiet, setIsLoadingDiet] = useState<boolean>(false);

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(false);

  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(() => {
    const saved = localStorage.getItem('fit_track_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_LOGS;
  });

  const [badges, setBadges] = useState<BadgeItem[]>(INITIAL_BADGES);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [activeWorkoutForPlayer, setActiveWorkoutForPlayer] = useState<DailyRoutine | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('fit_track_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (workoutPlan) {
      localStorage.setItem('fit_track_active_plan', JSON.stringify(workoutPlan));
    }
  }, [workoutPlan]);

  useEffect(() => {
    localStorage.setItem('fit_track_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Load initial community posts & dietary reference
  useEffect(() => {
    async function loadInitial() {
      setIsLoadingPosts(true);
      const fetched = await fetchCommunityPosts();
      setPosts(fetched);
      setIsLoadingPosts(false);

      // Pre-load personalized dietary references based on user parameters
      setIsLoadingDiet(true);
      try {
        const diet = await fetchDietaryReferences({
          fitnessGoals: user.fitnessGoal || 'Weight Loss & Lean Muscle',
          userProfile: user.dietaryPreference || 'Vegetarian, whole foods',
          weight: user.weight,
          weightUnit: user.weightUnit,
          height: user.height,
          heightUnit: user.heightUnit,
          age: user.age,
          medicalConditions: user.medicalConditions || ['None'],
          allergies: user.allergies || ['None'],
          medications: user.medications || 'None',
          dietaryPreference: user.dietaryPreference || 'Vegetarian',
        });
        setDietaryData(diet);
      } catch (e) {
        console.warn('Initial diet reference load error:', e);
      } finally {
        setIsLoadingDiet(false);
      }
    }
    loadInitial();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const generateNewPlan = async (formData: Partial<UserFitnessProfile>) => {
    setIsGeneratingPlan(true);
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);

    try {
      const plan = await fetchWorkoutPlan({
        age: updatedUser.age,
        weight: updatedUser.weight,
        weightUnit: updatedUser.weightUnit,
        height: updatedUser.height,
        heightUnit: updatedUser.heightUnit,
        fitnessGoal: updatedUser.fitnessGoal,
        experienceLevel: updatedUser.experienceLevel,
        daysPerWeek: updatedUser.daysPerWeek,
        focusAreas: updatedUser.focusAreas,
        medicalNotes: updatedUser.medicalNotes,
      });

      setWorkoutPlan(plan);
      setActiveDayIndex(0);
      showToast(`🎉 New personalized ${plan.planTitle} generated successfully!`);
    } catch (err: any) {
      showToast('⚠️ Could not generate plan from server. Using intelligent default.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const markDayComplete = (dayIndex: number) => {
    if (!workoutPlan) return;
    const routine = workoutPlan.dailyRoutines[dayIndex];
    if (!routine) return;

    const isAlready = !!routine.completed;
    const updatedRoutines = [...workoutPlan.dailyRoutines];
    updatedRoutines[dayIndex] = {
      ...routine,
      completed: !isAlready,
      completedAt: !isAlready ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
    };

    setWorkoutPlan({
      ...workoutPlan,
      dailyRoutines: updatedRoutines,
    });

    if (!isAlready) {
      // Add to activity logs / Mini Statement
      const newLog: ActivityLogItem = {
        id: `log-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        routineTitle: routine.routineTitle,
        dayName: routine.day,
        durationMinutes: parseInt(routine.estimatedDuration, 10) || 30,
        caloriesBurned: workoutPlan.calorieEstimatePerSession || 240,
        status: 'Completed',
        notes: `Completed ${routine.exercises.length} sets and core movements.`,
      };
      setActivityLogs([newLog, ...activityLogs]);

      showToast(`🌟 High five! You completed "${routine.routineTitle}" for ${routine.day}!`);
    } else {
      showToast(`Routine for ${routine.day} unmarked.`);
    }
  };

  const searchDietReferences = async (
    paramsOrGoals?: DietSearchParams | string,
    profileFallback?: string
  ) => {
    setIsLoadingDiet(true);
    try {
      let payload: DietSearchParams;
      if (!paramsOrGoals) {
        payload = {
          fitnessGoals: user.fitnessGoal || 'Weight Loss & Lean Muscle',
          userProfile: user.dietaryPreference || 'Vegetarian, whole foods',
          weight: user.weight,
          weightUnit: user.weightUnit,
          height: user.height,
          heightUnit: user.heightUnit,
          age: user.age,
          medicalConditions: user.medicalConditions || ['None'],
          allergies: user.allergies || ['None'],
          medications: user.medications || 'None',
          dietaryPreference: user.dietaryPreference || 'Vegetarian',
        };
      } else if (typeof paramsOrGoals === 'string') {
        payload = {
          fitnessGoals: paramsOrGoals,
          userProfile: profileFallback || user.dietaryPreference || '',
          weight: user.weight,
          weightUnit: user.weightUnit,
          height: user.height,
          heightUnit: user.heightUnit,
          age: user.age,
          medicalConditions: user.medicalConditions || ['None'],
          allergies: user.allergies || ['None'],
          medications: user.medications || 'None',
          dietaryPreference: user.dietaryPreference || 'Vegetarian',
        };
      } else {
        payload = {
          ...paramsOrGoals,
          weight: paramsOrGoals.weight ?? user.weight,
          weightUnit: paramsOrGoals.weightUnit ?? user.weightUnit,
          height: paramsOrGoals.height ?? user.height,
          heightUnit: paramsOrGoals.heightUnit ?? user.heightUnit,
          age: paramsOrGoals.age ?? user.age,
          medicalConditions: paramsOrGoals.medicalConditions ?? user.medicalConditions ?? ['None'],
          allergies: paramsOrGoals.allergies ?? user.allergies ?? ['None'],
          medications: paramsOrGoals.medications ?? user.medications ?? 'None',
          dietaryPreference: paramsOrGoals.dietaryPreference ?? user.dietaryPreference ?? 'Vegetarian',
        };
      }

      const data = await fetchDietaryReferences(payload);
      setDietaryData(data);
      showToast('📚 Personalized AI Dietary References updated!');
    } catch (e) {
      showToast('⚠️ Unable to refresh references right now.');
    } finally {
      setIsLoadingDiet(false);
    }
  };

  const submitNewPost = async (category: any, content: string): Promise<boolean> => {
    try {
      const newPost = await createCommunityPost(user.name, category, content);
      if (newPost) {
        setPosts([newPost, ...posts]);
        showToast('🚀 Your post is published to the FitTrack Pro community!');

        // Unlock badge if not unlocked
        setBadges((prev) =>
          prev.map((b) =>
            b.id === 'b-5' ? { ...b, unlocked: true, unlockedAt: 'Just now' } : b
          )
        );
        return true;
      }
    } catch (err: any) {
      showToast(`❌ ${err.message || 'Error submitting post'}`);
    }
    return false;
  };

  const likePost = async (postId: string) => {
    const res = await togglePostLike(postId, user.id);
    if (res) {
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            const hasLiked = p.likedBy.includes(user.id);
            return {
              ...p,
              likes: res.likes,
              likedBy: hasLiked ? p.likedBy.filter((id) => id !== user.id) : [...p.likedBy, user.id],
            };
          }
          return p;
        })
      );
    }
  };

  const commentOnPost = async (postId: string, text: string) => {
    const res = await addPostComment(postId, user.name, text);
    if (res && res.comment) {
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              comments: [...p.comments, res.comment],
            };
          }
          return p;
        })
      );
      showToast('💬 Comment added!');
    }
  };

  const addManualActivity = (item: Omit<ActivityLogItem, 'id'>) => {
    const newLog: ActivityLogItem = {
      ...item,
      id: `log-${Date.now()}`,
    };
    setActivityLogs([newLog, ...activityLogs]);
    showToast(`📝 Activity "${item.routineTitle}" logged into Mini Statements!`);
  };

  const switchUserRole = (role: 'meena' | 'ruchira' | 'guest') => {
    if (role === 'meena') {
      setUser({
        id: 'usr-meena',
        name: 'Meena S',
        email: 'meena.s@nhce.edu',
        age: 21,
        weight: 60,
        weightUnit: 'kg',
        height: 172,
        heightUnit: 'cm',
        fitnessGoal: 'Weight Loss',
        experienceLevel: 'Beginner',
        daysPerWeek: 4,
        focusAreas: ['HIIT', 'Core & Abs'],
        avatarSeed: 'Meena',
      });
      showToast('Switched profile to Meena S (1NH23CD089)');
    } else if (role === 'ruchira') {
      setUser({
        id: 'usr-ruchira',
        name: 'Ruchira Rane',
        email: 'ruchira.r@nhce.edu',
        age: 21,
        weight: 58,
        weightUnit: 'kg',
        height: 168,
        heightUnit: 'cm',
        fitnessGoal: 'Muscle Building',
        experienceLevel: 'Intermediate',
        daysPerWeek: 5,
        focusAreas: ['Strength Training', 'Core', 'Cardio'],
        avatarSeed: 'Ruchira',
      });
      showToast('Switched profile to Ruchira Rane (1NH23CD134)');
    } else {
      setUser({
        id: 'usr-guest',
        name: 'Alex Rivera',
        email: 'alex.fitness@example.com',
        age: 28,
        weight: 75,
        weightUnit: 'kg',
        height: 180,
        heightUnit: 'cm',
        fitnessGoal: 'Endurance & Stamina',
        experienceLevel: 'Beginner',
        daysPerWeek: 3,
        focusAreas: ['Cardio', 'Yoga'],
        avatarSeed: 'Alex',
      });
      showToast('Switched profile to Guest User');
    }
  };

  const totalCaloriesBurned = activityLogs.reduce((acc, log) => acc + (log.caloriesBurned || 0), 0);
  const currentStreak = Math.min(activityLogs.length, 7);

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        workoutPlan,
        setWorkoutPlan,
        activeDayIndex,
        setActiveDayIndex,
        isGeneratingPlan,
        generateNewPlan,
        markDayComplete,
        dietaryData,
        isLoadingDiet,
        searchDietReferences,
        posts,
        isLoadingPosts,
        submitNewPost,
        likePost,
        commentOnPost,
        activityLogs,
        addManualActivity,
        badges,
        currentStreak,
        totalCaloriesBurned,
        isLoginModalOpen,
        setIsLoginModalOpen,
        activeWorkoutForPlayer,
        setActiveWorkoutForPlayer,
        toastMessage,
        showToast,
        switchUserRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
