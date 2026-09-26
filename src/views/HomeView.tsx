import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Dumbbell,
  ArrowRight,
  Heart,
  BookOpen,
  Users,
  Award,
  Zap,
  Activity,
  Play,
  Clock,
  Sparkles
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { setActivePage, workoutPlan, setActiveWorkoutForPlayer } = useApp();

  const workoutCategories = [
    {
      title: 'HIIT (High Intensity)',
      tagline: 'Rapid calorie burn and aerobic power',
      icon: <Zap className="w-5 h-5 text-[#b86d45]" />,
      color: 'border-[#e4d9ca] bg-[#faf7f0]',
      duration: '20-30 mins',
      level: 'All Levels',
    },
    {
      title: 'Strength Training',
      tagline: 'Compound bodyweight & resistance load',
      icon: <Dumbbell className="w-5 h-5 text-[#9e5c36]" />,
      color: 'border-[#e4d9ca] bg-[#faf7f0]',
      duration: '35-45 mins',
      level: 'Beginner - Adv',
    },
    {
      title: 'Core & Abdomen',
      tagline: 'Transverse stability, planking & posture',
      icon: <Activity className="w-5 h-5 text-[#ad653f]" />,
      color: 'border-[#e4d9ca] bg-[#faf7f0]',
      duration: '15-25 mins',
      level: 'Daily Routine',
    },
    {
      title: 'Restorative Yoga',
      tagline: 'Mobility, gentle flow & mindful breath',
      icon: <Heart className="w-5 h-5 text-[#5e825e]" />,
      color: 'border-[#e4d9ca] bg-[#faf7f0]',
      duration: '25-40 mins',
      level: 'Low Impact',
    },
    {
      title: 'Cardio Endurance',
      tagline: 'Vascular stamina, brisk strides & circuits',
      icon: <Sparkles className="w-5 h-5 text-[#587994]" />,
      color: 'border-[#e4d9ca] bg-[#faf7f0]',
      duration: '30-40 mins',
      level: 'Endurance',
    },
    {
      title: 'Active Mobility',
      tagline: 'Joint decompression & injury prevention',
      icon: <Award className="w-5 h-5 text-[#886991]" />,
      color: 'border-[#e4d9ca] bg-[#faf7f0]',
      duration: '15-20 mins',
      level: 'Recovery',
    },
  ];

  const todayRoutine = workoutPlan?.dailyRoutines?.[0];

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Section with Vintage Light Brown styling */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#ab7a52] to-[#bc8a61] text-white shadow-sm border border-[#9b6c47]">
        <div className="relative max-w-4xl mx-auto px-6 py-12 sm:py-16 text-center space-y-5">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/15 text-amber-100 text-xs font-medium">
            <Dumbbell className="w-3.5 h-3.5 text-amber-200" />
            <span>Smart Fitness & Dietary Planning</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit',sans-serif] leading-tight">
            FIT TRACK PRO <br />
            <span className="text-amber-100 font-light">Your AI Fitness Partner</span>
          </h1>

          <p className="max-w-xl mx-auto text-xs sm:text-sm text-[#f5ebd9] leading-relaxed">
            A personalized, age-adaptive fitness platform that dynamically generates 
            custom workout schedules, curates expert-reviewed nutrition references, and fosters 
            an inspiring fitness community.
          </p>

          {/* Quick Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActivePage('workouts')}
              className="px-5 py-2.5 bg-[#fdfbf7] text-[#965732] font-semibold text-xs sm:text-sm rounded-xl shadow-xs hover:bg-white transition flex items-center space-x-1.5"
            >
              <span>Build Workout Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActivePage('dietary-refs')}
              className="px-5 py-2.5 bg-black/20 hover:bg-black/30 text-white font-medium text-xs sm:text-sm rounded-xl transition flex items-center space-x-1.5 border border-white/20"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Dietary References</span>
            </button>

            <button
              onClick={() => setActivePage('community')}
              className="px-5 py-2.5 bg-black/10 hover:bg-black/20 text-white font-medium text-xs sm:text-sm rounded-xl transition flex items-center space-x-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Community</span>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Workout Preview */}
      {todayRoutine && (
        <section className="bg-[#fdfbf7] rounded-2xl p-6 border border-[#e2d8c9] shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#eee4d6]">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9b5d38] bg-[#f5ebe1] px-2.5 py-0.5 rounded border border-[#e4d3c3]">
                Today's Workout • {todayRoutine.day}
              </span>
              <h2 className="text-xl font-bold text-[#8d522e] mt-1 font-['Outfit',sans-serif]">
                {todayRoutine.routineTitle}
              </h2>
              <p className="text-xs text-[#7d6c60] mt-0.5 flex items-center gap-2">
                <span>Duration: <strong>{todayRoutine.estimatedDuration}</strong></span>
                <span>•</span>
                <span>Intensity: <strong>{todayRoutine.intensity}</strong></span>
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveWorkoutForPlayer(todayRoutine)}
                className="px-4 py-2 bg-[#ab7a52] hover:bg-[#996a45] text-white rounded-xl text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Session</span>
              </button>
              <button
                onClick={() => setActivePage('workouts')}
                className="px-4 py-2 bg-[#f4efe6] hover:bg-[#ebe4d7] text-[#6d5d51] rounded-xl text-xs font-semibold transition"
              >
                View 7-Day Plan
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            {todayRoutine.exercises.slice(0, 4).map((ex, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-white border border-[#e5dcce]"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#4e3e34]">
                  <span>{ex.name}</span>
                  <span className="text-[#965732] text-[11px]">{ex.sets} sets</span>
                </div>
                <p className="text-[11px] text-[#7d6c60] mt-1">
                  Reps: {ex.reps} • Rest: {ex.rest}
                </p>
                <p className="text-[10px] text-[#9b6644] font-medium mt-1 truncate">
                  Target: {ex.targetMuscle}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Workout Categories */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#8d522e] font-['Outfit',sans-serif]">
            Workout Spectrum
          </h2>
          <p className="text-xs text-[#7d6c60]">
            Carefully structured movement categories for varied goals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workoutCategories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => setActivePage('workouts')}
              className={`p-5 rounded-2xl border ${cat.color} shadow-xs hover:border-[#cf784d] transition cursor-pointer flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="p-2 rounded-lg bg-white border border-[#e2d8c9]">
                    {cat.icon}
                  </div>
                  <span className="text-[11px] font-medium text-[#7d6c60] bg-white px-2 py-0.5 rounded-md border border-[#e8ded0]">
                    {cat.duration}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#4e3e34]">
                  {cat.title}
                </h4>
                <p className="text-xs text-[#7d6c60] mt-1 leading-relaxed">
                  {cat.tagline}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#eee5d8] flex items-center justify-between text-xs">
                <span className="text-[#9b6644] font-medium text-[11px]">{cat.level}</span>
                <span className="text-[#965732] font-semibold text-[11px]">
                  Explore →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
