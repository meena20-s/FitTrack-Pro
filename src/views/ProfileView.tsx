import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Scale,
  Flame,
  Award,
  CheckCircle,
  FileText,
  Edit2,
  Save,
  Zap
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    user,
    setUser,
    badges,
    activityLogs,
    currentStreak,
    totalCaloriesBurned,
    setActivePage,
    showToast,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(user.age);
  const [weight, setWeight] = useState(user.weight);
  const [height, setHeight] = useState(user.height);
  const [fitnessGoal, setFitnessGoal] = useState(user.fitnessGoal);

  // BMI Calculation
  const heightInMeters = user.heightUnit === 'cm' ? user.height / 100 : (user.height * 2.54) / 100;
  const weightInKg = user.weightUnit === 'kg' ? user.weight : user.weight * 0.453592;
  const bmi = heightInMeters > 0 ? (weightInKg / (heightInMeters * heightInMeters)).toFixed(1) : '21.5';
  const bmiNum = parseFloat(bmi);

  let bmiCategory = 'Normal Weight';
  let bmiColor = 'text-[#3e753e] bg-[#edf4ec] border-[#c2dac2]';
  if (bmiNum < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = 'text-[#487399] bg-[#ebf3f9] border-[#c4dcf0]';
  } else if (bmiNum >= 25 && bmiNum < 30) {
    bmiCategory = 'Overweight';
    bmiColor = 'text-[#965732] bg-[#f5ebe1] border-[#e4d3c3]';
  } else if (bmiNum >= 30) {
    bmiCategory = 'High BMI';
    bmiColor = 'text-[#b8533e] bg-[#f9ece8] border-[#ebd0c8]';
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name,
      age,
      weight,
      height,
      fitnessGoal,
    }));
    setIsEditing(false);
    showToast('Profile updated.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4 sm:py-6 pb-12">
      {/* Profile Header */}
      <div className="bg-[#fdfbf7] rounded-2xl p-6 sm:p-7 border border-[#e2d8c9] shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-[#ab7a52] text-white font-bold text-2xl flex items-center justify-center shadow-xs shrink-0">
            {user.name.charAt(0)}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#8d522e] font-['Outfit',sans-serif]">
                  {user.name}
                </h1>
                <p className="text-xs text-[#7d6c60]">{user.email}</p>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1 rounded-lg border border-[#dcd1c2] hover:bg-[#f6f2ea] text-xs font-medium text-[#6d5d51] flex items-center justify-center gap-1 self-center sm:self-auto transition"
              >
                <Edit2 className="w-3 h-3" />
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs">
              <span className="bg-[#f5ebe1] text-[#965732] font-medium px-2.5 py-0.5 rounded-md border border-[#e4d3c3]">
                {user.fitnessGoal}
              </span>
              <span className="bg-[#f6f2ea] text-[#6d5d51] font-medium px-2.5 py-0.5 rounded-md border border-[#e5dcce]">
                {user.experienceLevel}
              </span>
              <span className="bg-[#f6f2ea] text-[#6d5d51] font-medium px-2.5 py-0.5 rounded-md border border-[#e5dcce]">
                {user.age} yrs
              </span>
            </div>
          </div>
        </div>

        {isEditing && (
          <form
            onSubmit={handleSave}
            className="mt-5 pt-5 border-t border-[#eee4d6] grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs animate-in fade-in"
          >
            <div>
              <label className="block font-medium text-[#5c4d43] mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#f6f2ea] border border-[#dcd1c2] rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium text-[#5c4d43] mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-[#f6f2ea] border border-[#dcd1c2] rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium text-[#5c4d43] mb-1">Weight ({user.weightUnit})</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-[#f6f2ea] border border-[#dcd1c2] rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium text-[#5c4d43] mb-1">Height ({user.heightUnit})</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-[#f6f2ea] border border-[#dcd1c2] rounded-lg"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#cf784d] text-white font-medium rounded-lg shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#fdfbf7] p-4 rounded-xl border border-[#e2d8c9] space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-semibold text-[#8d7c70] uppercase">BMI</span>
          <p className="text-2xl font-bold text-[#4e3e34] font-mono">{bmi}</p>
          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${bmiColor}`}>
            {bmiCategory}
          </span>
        </div>

        <div className="bg-[#fdfbf7] p-4 rounded-xl border border-[#e2d8c9] space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-semibold text-[#8d7c70] uppercase">Active Streak</span>
          <p className="text-2xl font-bold text-[#4e3e34] font-mono">{currentStreak} Days</p>
          <span className="text-[10px] text-[#7d6c60]">Consistent</span>
        </div>

        <div className="bg-[#fdfbf7] p-4 rounded-xl border border-[#e2d8c9] space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-semibold text-[#8d7c70] uppercase">Burned</span>
          <p className="text-2xl font-bold text-[#4e3e34] font-mono">{totalCaloriesBurned}</p>
          <span className="text-[10px] text-[#7d6c60]">kcal active</span>
        </div>

        <div className="bg-[#fdfbf7] p-4 rounded-xl border border-[#e2d8c9] space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-semibold text-[#8d7c70] uppercase">Workouts</span>
          <p className="text-2xl font-bold text-[#4e3e34] font-mono">{activityLogs.length}</p>
          <span className="text-[10px] text-[#7d6c60]">Sessions</span>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-[#fdfbf7] rounded-2xl p-6 border border-[#e2d8c9] space-y-4 shadow-xs">
        <h2 className="text-base font-bold text-[#8d522e] font-['Outfit',sans-serif] flex items-center gap-2">
          <Award className="w-4 h-4 text-[#cf784d]" />
          <span>Earned Badges</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-3 rounded-xl border flex items-center space-x-3 ${
                badge.unlocked
                  ? 'bg-white border-[#e2d8c9]'
                  : 'bg-[#f7f4ed] border-[#e2d8c9] opacity-50'
              }`}
            >
              <div className="text-xl p-1.5 rounded-lg bg-[#f8f4ec] border border-[#e5dcce]">
                {badge.icon}
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#4e3e34]">{badge.name}</p>
                <p className="text-[11px] text-[#7d6c60] leading-tight">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
