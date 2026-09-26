import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExerciseIllustration } from '../components/ExerciseIllustration';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Play,
  RotateCcw,
  Check,
  Flame,
  Clock,
  Sparkles,
  AlertCircle,
  Image as ImageIcon,
  User,
  Sliders
} from 'lucide-react';

export const WorkoutsView: React.FC = () => {
  const {
    user,
    workoutPlan,
    activeDayIndex,
    setActiveDayIndex,
    isGeneratingPlan,
    generateNewPlan,
    markDayComplete,
    setActiveWorkoutForPlayer,
  } = useApp();

  const [weight, setWeight] = useState<number>(user.weight || 50);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(user.weightUnit || 'kg');
  const [height, setHeight] = useState<number>(user.height || 172);
  const [heightUnit, setHeightUnit] = useState<'cm' | 'in'>(user.heightUnit || 'cm');
  const [fitnessGoal, setFitnessGoal] = useState<string>(user.fitnessGoal || 'Weight Loss');
  const [experienceLevel, setExperienceLevel] = useState<string>(
    user.experienceLevel ? `${user.experienceLevel} (New to structured exercise)` : 'Beginner (New to structured exercise)'
  );
  const [daysPerWeek, setDaysPerWeek] = useState<string>('3-4 days');

  // Exercise accordion state
  const [expandedExercise, setExpandedExercise] = useState<{ [key: number]: boolean }>({
    0: true,
  });

  // Reference picture visibility toggle per exercise (open first one by default)
  const [showIllustration, setShowIllustration] = useState<{ [key: number]: boolean }>({
    0: true,
  });

  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

  const toggleExerciseAccordion = (idx: number) => {
    setExpandedExercise((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const toggleIllustration = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowIllustration((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const daysNum = daysPerWeek.includes('3-4') ? 4 : daysPerWeek.includes('5') ? 5 : 3;
    const cleanLevel = experienceLevel.includes('Beginner')
      ? 'Beginner'
      : experienceLevel.includes('Intermediate')
      ? 'Intermediate'
      : 'Advanced';

    await generateNewPlan({
      weight,
      weightUnit,
      height,
      heightUnit,
      fitnessGoal,
      experienceLevel: cleanLevel as any,
      daysPerWeek: daysNum,
    });
    setIsFormVisible(false);
  };

  const activeRoutine = workoutPlan?.dailyRoutines[activeDayIndex];

  // Calculated BMI
  const heightM = heightUnit === 'cm' ? height / 100 : (height * 2.54) / 100;
  const weightKg = weightUnit === 'kg' ? weight : weight * 0.453592;
  const bmiVal = heightM > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : '16.9';

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-8 space-y-6">
      {/* Top Banner showing Personalized Parameters matching the picture */}
      <div className="bg-[#fdfbf7] rounded-2xl border border-[#e2d8c9] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#f5ebe1] text-[#965732] flex items-center justify-center border border-[#e4d3c3] shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9b5d38]">
              Personalized Workout Parameters
            </span>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#4e3e34] font-medium mt-0.5">
              <span>Weight: <strong>{weight} {weightUnit}</strong></span>
              <span>•</span>
              <span>Height: <strong>{height} {heightUnit}</strong></span>
              <span>•</span>
              <span>BMI: <strong>{bmiVal}</strong></span>
              <span>•</span>
              <span>Goal: <strong>{fitnessGoal}</strong></span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="self-start sm:self-auto px-3 py-1.5 rounded-xl border border-[#dcd1c2] bg-white hover:bg-[#f6f2ea] text-xs font-semibold text-[#8d522e] flex items-center space-x-1.5 transition shadow-xs"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{isFormVisible ? 'Hide Profile Form' : 'Edit Parameters'}</span>
        </button>
      </div>

      {/* Exact "Your Fitness Profile" Card matching the screenshot */}
      <div
        className={`bg-[#fdfbf7] rounded-2xl shadow-sm border border-[#e2d8c9] p-6 sm:p-9 space-y-6 ${
          isFormVisible ? 'block' : 'hidden'
        }`}
      >
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-[#965732] font-['Outfit',sans-serif]">
            Your Fitness Profile
          </h2>
          <p className="text-xs sm:text-sm text-[#7d6c60]">
            Help us understand your needs to create a personalized workout plan.
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-5">
          {/* Row 1: Weight & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#5c4d43] mb-1.5">
                Current Weight
              </label>
              <input
                type="number"
                min="30"
                max="250"
                required
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                placeholder="50"
                className="w-full px-3.5 py-2.5 bg-[#f6f2ea] border border-[#dcd1c2] rounded-xl text-xs sm:text-sm text-[#3e342d] focus:bg-white focus:ring-1 focus:ring-[#cf784d] focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5c4d43] mb-1.5">
                Weight Unit
              </label>
              <div className="relative">
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value as any)}
                  className="w-full appearance-none px-3.5 py-2.5 bg-[#f6f2ea] border border-[#dcd1c2] rounded-xl text-xs sm:text-sm text-[#3e342d] focus:bg-white focus:ring-1 focus:ring-[#cf784d] focus:outline-none pr-8 transition cursor-pointer"
                >
                  <option value="kg">kg (Kilograms)</option>
                  <option value="lbs">lbs (Pounds)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#7d6c60]">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Height & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#5c4d43] mb-1.5">
                Height
              </label>
              <input
                type="number"
                min="90"
                max="250"
                required
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                placeholder="172"
                className="w-full px-3.5 py-2.5 bg-[#f6f2ea] border border-[#dcd1c2] rounded-xl text-xs sm:text-sm text-[#3e342d] focus:bg-white focus:ring-1 focus:ring-[#cf784d] focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5c4d43] mb-1.5">
                Height Unit
              </label>
              <div className="relative">
                <select
                  value={heightUnit}
                  onChange={(e) => setHeightUnit(e.target.value as any)}
                  className="w-full appearance-none px-3.5 py-2.5 bg-[#f6f2ea] border border-[#dcd1c2] rounded-xl text-xs sm:text-sm text-[#3e342d] focus:bg-white focus:ring-1 focus:ring-[#cf784d] focus:outline-none pr-8 transition cursor-pointer"
                >
                  <option value="cm">cm (Centimeters)</option>
                  <option value="in">inches (Inches)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#7d6c60]">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Primary Fitness Goal */}
          <div>
            <label className="block text-xs font-medium text-[#5c4d43] mb-1.5">
              Primary Fitness Goal
            </label>
            <div className="relative">
              <select
                value={fitnessGoal}
                onChange={(e) => setFitnessGoal(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 bg-[#f6f2ea] border border-[#dcd1c2] rounded-xl text-xs sm:text-sm text-[#3e342d] focus:bg-white focus:ring-1 focus:ring-[#cf784d] focus:outline-none pr-8 transition cursor-pointer"
              >
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Building">Muscle Building</option>
                <option value="Athletic Endurance">Athletic Endurance</option>
                <option value="Flexibility & Core">Flexibility & Core</option>
                <option value="General Health">General Health</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#7d6c60]">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Row 4: Fitness Experience Level */}
          <div>
            <label className="block text-xs font-medium text-[#5c4d43] mb-1.5">
              Fitness Experience Level
            </label>
            <div className="relative">
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 bg-[#f6f2ea] border border-[#dcd1c2] rounded-xl text-xs sm:text-sm text-[#3e342d] focus:bg-white focus:ring-1 focus:ring-[#cf784d] focus:outline-none pr-8 transition cursor-pointer"
              >
                <option value="Beginner (New to structured exercise)">
                  Beginner (New to structured exercise)
                </option>
                <option value="Intermediate (6+ months consistent)">
                  Intermediate (6+ months consistent)
                </option>
                <option value="Advanced (Structured athletic training)">
                  Advanced (Structured athletic training)
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#7d6c60]">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Row 5: How many days per week can you work out? */}
          <div>
            <label className="block text-xs font-medium text-[#5c4d43] mb-1.5">
              How many days per week can you work out?
            </label>
            <div className="relative">
              <select
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 bg-[#f6f2ea] border border-[#dcd1c2] rounded-xl text-xs sm:text-sm text-[#3e342d] focus:bg-white focus:ring-1 focus:ring-[#cf784d] focus:outline-none pr-8 transition cursor-pointer"
              >
                <option value="3-4 days">3-4 days</option>
                <option value="5 days">5 days</option>
                <option value="6 days">6 days</option>
                <option value="2-3 days">2-3 days</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#7d6c60]">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Button: "Generating Plan..." (matching attached image) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isGeneratingPlan}
              className="w-full py-3 px-4 bg-[#d48c66] hover:bg-[#c67e58] text-white font-medium text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center justify-center space-x-2"
            >
              {isGeneratingPlan ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Plan...</span>
                </>
              ) : (
                <span>Generating Plan...</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Plan view with Reference Pictures and personalization */}
      {workoutPlan && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header Card */}
          <div className="bg-[#fdfbf7] rounded-2xl p-6 sm:p-8 border border-[#e2d8c9] space-y-3 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9b5d38] bg-[#f5ebe1] px-2.5 py-0.5 rounded border border-[#e4d3c3]">
                  Personalized 7-Day Plan
                </span>
                <h2 className="text-2xl font-bold text-[#965732] font-['Outfit',sans-serif] mt-1">
                  {workoutPlan.planTitle}
                </h2>
              </div>
              <button
                onClick={() => setIsFormVisible(!isFormVisible)}
                className="self-start sm:self-auto px-3 py-1.5 rounded-lg border border-[#dcd1c2] hover:bg-[#f6f2ea] text-xs font-semibold text-[#7d6c60] transition"
              >
                {isFormVisible ? 'Close Profile' : 'Change Profile'}
              </button>
            </div>
            <p className="text-xs sm:text-sm text-[#7d6c60] leading-relaxed">
              {workoutPlan.planSummary}
            </p>
          </div>

          {/* 7-Day Tabs (Fig 4.2.3) */}
          <div className="bg-[#fdfbf7] rounded-2xl p-2 border border-[#e2d8c9] shadow-xs">
            <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {workoutPlan.dailyRoutines.map((routine, idx) => {
                const isActive = activeDayIndex === idx;
                const isDone = !!routine.completed;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveDayIndex(idx)}
                    className={`flex-1 min-w-[85px] py-2 px-1 rounded-xl text-xs font-medium transition flex flex-col items-center justify-center border ${
                      isActive
                        ? 'bg-[#cf784d] text-white border-[#cf784d] shadow-xs font-bold'
                        : isDone
                        ? 'bg-[#edf4ec] text-[#2e5e2e] border-[#c2dac2]'
                        : 'bg-[#f7f3eb] text-[#6d5d51] border-[#dfd6c7] hover:bg-[#efe9dc]'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span>{routine.day}</span>
                      {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Routine Detail Card */}
          {activeRoutine && (
            <div className="bg-[#fdfbf7] rounded-2xl border border-[#e2d8c9] shadow-xs overflow-hidden">
              <div className="p-6 border-b border-[#e8ded0] bg-[#f8f4ec] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-[#8d522e] font-['Outfit',sans-serif]">
                    {activeRoutine.routineTitle}
                  </h3>
                  <p className="text-xs text-[#7d6c60] mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#9e7659]" />
                    <span>Estimated duration: {activeRoutine.estimatedDuration}</span>
                  </p>
                </div>

                <button
                  onClick={() => setActiveWorkoutForPlayer(activeRoutine)}
                  className="self-start sm:self-auto px-4 py-2 bg-[#ab7a52] hover:bg-[#996a45] text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start Live Timer</span>
                </button>
              </div>

              {/* Accordion Exercises with Reference Pictures & Personalization */}
              <div className="p-5 sm:p-6 space-y-4">
                {activeRoutine.exercises.map((ex, exIdx) => {
                  const isOpen = expandedExercise[exIdx] ?? false;
                  const isPicOpen = showIllustration[exIdx] ?? false;

                  return (
                    <div
                      key={exIdx}
                      className="rounded-xl border border-[#e2d8c9] overflow-hidden bg-white shadow-xs"
                    >
                      <button
                        type="button"
                        onClick={() => toggleExerciseAccordion(exIdx)}
                        className="w-full px-4 py-3.5 bg-[#faf7f0] hover:bg-[#f5efe4] flex items-center justify-between text-left transition"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="w-6 h-6 rounded-full bg-[#f5ebe1] text-[#965732] text-xs font-bold flex items-center justify-center border border-[#e4d3c3]">
                            {exIdx + 1}
                          </span>
                          <div>
                            <span className="text-sm font-semibold text-[#4e3e34] block">
                              {ex.name}
                            </span>
                            <span className="text-[11px] text-[#7d6c60]">
                              {ex.sets} Sets × {ex.reps} • Rest: {ex.rest}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={(e) => toggleIllustration(exIdx, e)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#8d522e] bg-white border border-[#dcd1c2] hover:bg-[#f5efe4] flex items-center space-x-1 shadow-xs transition"
                          >
                            <ImageIcon className="w-3 h-3 text-[#cf784d]" />
                            <span>{isPicOpen ? 'Hide Picture' : 'Reference Picture'}</span>
                          </button>

                          <div className="text-[#8d7c70]">
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      </button>

                      {/* Reference Picture Display */}
                      {isPicOpen && (
                        <div className="px-4 pt-3 pb-2 bg-[#fdfbf7] border-t border-[#eee5d8]">
                          <ExerciseIllustration
                            exerciseName={ex.name}
                            targetMuscle={ex.targetMuscle}
                            userWeight={weight}
                            weightUnit={weightUnit}
                            userHeight={height}
                            heightUnit={heightUnit}
                            fitnessGoal={fitnessGoal}
                          />
                        </div>
                      )}

                      {/* Expandable Exercise Details */}
                      {isOpen && (
                        <div className="px-4 py-3.5 text-xs text-[#635348] space-y-2 border-t border-[#eee5d8] bg-white">
                          <p className="leading-relaxed">
                            <strong className="text-[#41332a]">Instructions:</strong> {ex.instructions}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#825c43] font-medium pt-1">
                            <span>Sets: <strong>{ex.sets}</strong></span>
                            <span>Reps: <strong>{ex.reps}</strong></span>
                            <span>Rest: <strong>{ex.rest}</strong></span>
                            <span>Target: <strong>{ex.targetMuscle}</strong></span>
                          </div>
                          {ex.formTip && (
                            <p className="text-[11px] text-[#9b6644] italic">
                              💡 Tip: {ex.formTip}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* "Mark Day as Complete" button (Fig 4.2.3) */}
              <div className="p-5 sm:p-6 border-t border-[#e8ded0] bg-[#f9f5ed]">
                <button
                  type="button"
                  onClick={() => markDayComplete(activeDayIndex)}
                  className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition flex items-center justify-center space-x-1.5 ${
                    activeRoutine.completed
                      ? 'bg-[#4b824b] text-white hover:bg-[#417041]'
                      : 'bg-[#d48c66] hover:bg-[#c67e58] text-white'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {activeRoutine.completed
                      ? 'Marked as Completed! (Click to Undo)'
                      : 'Mark Day as Complete'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* General Fitness Advice Box (Fig 4.2.3 Bottom) */}
          <div className="bg-[#fdfbf7] rounded-2xl p-5 border border-[#e2d8c9] space-y-1.5 text-xs text-[#6e5f54] shadow-xs">
            <h4 className="font-bold text-[#8d522e] flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-[#cf784d]" />
              <span>General Fitness Advice</span>
            </h4>
            <p className="leading-relaxed">
              {workoutPlan.generalAdvice}
            </p>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setIsFormVisible(true)}
              className="text-xs font-semibold text-[#8d522e] hover:text-[#703f21] underline"
            >
              Create a New Workout Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
