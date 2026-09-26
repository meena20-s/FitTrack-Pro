import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Dumbbell,
  ShieldCheck,
  Zap,
  BookOpen,
  Users,
  Target,
  Heart,
  CheckCircle2
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { setActivePage } = useApp();

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4 sm:py-6 pb-12">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-[#8d522e] font-['Outfit',sans-serif]">
          About FitTrack Pro
        </h1>
        <p className="text-xs sm:text-sm text-[#7d6c60] max-w-xl mx-auto">
          An intelligent fitness partner created to help you build consistency,
          train safely according to your age, and fuel your body with science-backed nutrition.
        </p>
      </div>

      {/* Mission & Overview */}
      <div className="bg-[#fdfbf7] rounded-2xl p-6 sm:p-8 border border-[#e2d8c9] space-y-4 shadow-xs">
        <h2 className="text-xl font-bold text-[#965732] font-['Outfit',sans-serif]">
          Our Philosophy
        </h2>
        <p className="text-xs sm:text-sm text-[#6d5d51] leading-relaxed">
          Traditional fitness plans often fail because they lack personalization and ignore individual 
          differences in age, joint recovery, and dietary preferences. FitTrack Pro bridges that gap 
          by dynamically generating adaptive routines that respect your body while keeping workouts 
          motivating and progressive.
        </p>
      </div>

      {/* Core Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#fdfbf7] p-5 rounded-2xl border border-[#e2d8c9] space-y-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#f5ebe1] text-[#965732] flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#4e3e34]">Age-Adaptive Workouts</h3>
          <p className="text-xs text-[#7d6c60] leading-relaxed">
            Routines tailored specifically for teens, young adults, adults, and seniors with balanced 
            rest intervals and safe progressive overload.
          </p>
        </div>

        <div className="bg-[#fdfbf7] p-5 rounded-2xl border border-[#e2d8c9] space-y-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#f5ebe1] text-[#965732] flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#4e3e34]">Curated Dietary Literature</h3>
          <p className="text-xs text-[#7d6c60] leading-relaxed">
            Evidence-based books and sports nutrition research cross-referenced with your specific 
            dietary goals and preferences.
          </p>
        </div>

        <div className="bg-[#fdfbf7] p-5 rounded-2xl border border-[#e2d8c9] space-y-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#f5ebe1] text-[#965732] flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#4e3e34]">Supportive Community</h3>
          <p className="text-xs text-[#7d6c60] leading-relaxed">
            Connect with fellow athletes, celebrate completed workout streaks, share recipes, 
            and keep each other accountable.
          </p>
        </div>

        <div className="bg-[#fdfbf7] p-5 rounded-2xl border border-[#e2d8c9] space-y-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#f5ebe1] text-[#965732] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#4e3e34]">Private & Distraction-Free</h3>
          <p className="text-xs text-[#7d6c60] leading-relaxed">
            A clean, minimalist vintage interface designed to keep you focused purely on your workout 
            without ads or complex clutter.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center pt-2">
        <button
          onClick={() => setActivePage('workouts')}
          className="px-6 py-2.5 bg-[#ab7a52] hover:bg-[#996a45] text-white text-xs font-semibold rounded-xl shadow-xs transition"
        >
          Create Your Personalized Plan
        </button>
      </div>
    </div>
  );
};
