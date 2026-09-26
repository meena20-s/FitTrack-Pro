import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Heart,
  BookOpen,
  Sparkles,
  Bookmark,
  CheckCircle2,
  FileText,
  Apple,
  Droplets,
  Star,
  ShieldAlert,
  AlertTriangle,
  Pill,
  Activity,
  Sliders,
  User,
  Check,
  X,
  Scale,
  Flame,
  ChevronDown,
  Info
} from 'lucide-react';

const COMMON_CONDITIONS = [
  'None (Healthy)',
  'Type 2 Diabetes / Pre-Diabetes',
  'Hypertension (High Blood Pressure)',
  'High Cholesterol (Hyperlipidemia)',
  'PCOS (Polycystic Ovary Syndrome)',
  'Thyroid (Hypothyroidism)',
  'GERD / Acid Reflux',
  'Fatty Liver',
  'IBS (Irritable Bowel Syndrome)',
];

const COMMON_MEDICATIONS = [
  'None',
  'Metformin (Diabetes)',
  'Atorvastatin / Lipitor (Cholesterol)',
  'Lisinopril / Amlodipine (Blood Pressure)',
  'Levothyroxine / Synthroid (Thyroid)',
  'Insulin',
  'Oral Contraceptives',
];

const COMMON_ALLERGIES = [
  'No Allergies',
  'Peanuts & Tree Nuts',
  'Dairy / Lactose',
  'Gluten / Celiac',
  'Shellfish',
  'Soy',
  'Eggs',
  'Sesame',
];

const DIETARY_PREFERENCES = [
  'Vegetarian',
  'Vegan',
  'Mediterranean',
  'Keto / Low-Carb',
  'DASH Heart-Healthy',
  'High Protein Omnivore',
  'Pescatarian',
];

export const DietaryRefsView: React.FC = () => {
  const {
    user,
    dietaryData,
    isLoadingDiet,
    searchDietReferences,
    showToast,
  } = useApp();

  // User physical parameters
  const [weight, setWeight] = useState<number>(user.weight || 50);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(user.weightUnit || 'kg');
  const [height, setHeight] = useState<number>(user.height || 172);
  const [heightUnit, setHeightUnit] = useState<'cm' | 'in'>(user.heightUnit || 'cm');
  const [age, setAge] = useState<number>(user.age || 22);

  // Goal and preference
  const [fitnessGoals, setFitnessGoals] = useState<string>(
    user.fitnessGoal || 'Weight Loss & Sustained Energy'
  );
  const [dietaryPreference, setDietaryPreference] = useState<string>(
    user.dietaryPreference || 'Vegetarian'
  );

  // Clinical health parameters
  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    user.medicalConditions && user.medicalConditions.length > 0
      ? user.medicalConditions
      : ['None (Healthy)']
  );
  const [customCondition, setCustomCondition] = useState<string>('');

  const [selectedMedications, setSelectedMedications] = useState<string[]>(
    user.medications && user.medications !== 'None'
      ? [user.medications]
      : ['None']
  );
  const [customMedication, setCustomMedication] = useState<string>('');

  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(
    user.allergies && user.allergies.length > 0
      ? user.allergies
      : ['No Allergies']
  );
  const [customAllergy, setCustomAllergy] = useState<string>('');

  const [additionalNotes, setAdditionalNotes] = useState<string>(
    'Prefers whole grains, pulses, legumes, and nutrient-dense hydration.'
  );

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [bookmarkedTitles, setBookmarkedTitles] = useState<string[]>([]);

  // Calculate BMI
  const heightM = heightUnit === 'cm' ? height / 100 : (height * 2.54) / 100;
  const weightKg = weightUnit === 'kg' ? weight : weight * 0.453592;
  const bmiVal = heightM > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : '16.9';

  // Toggle helpers
  const toggleCondition = (cond: string) => {
    if (cond === 'None (Healthy)') {
      setSelectedConditions(['None (Healthy)']);
      return;
    }
    const filtered = selectedConditions.filter((c) => c !== 'None (Healthy)');
    if (filtered.includes(cond)) {
      const next = filtered.filter((c) => c !== cond);
      setSelectedConditions(next.length > 0 ? next : ['None (Healthy)']);
    } else {
      setSelectedConditions([...filtered, cond]);
    }
  };

  const toggleMedication = (med: string) => {
    if (med === 'None') {
      setSelectedMedications(['None']);
      return;
    }
    const filtered = selectedMedications.filter((m) => m !== 'None');
    if (filtered.includes(med)) {
      const next = filtered.filter((m) => m !== med);
      setSelectedMedications(next.length > 0 ? next : ['None']);
    } else {
      setSelectedMedications([...filtered, med]);
    }
  };

  const toggleAllergy = (allg: string) => {
    if (allg === 'No Allergies') {
      setSelectedAllergies(['No Allergies']);
      return;
    }
    const filtered = selectedAllergies.filter((a) => a !== 'No Allergies');
    if (filtered.includes(allg)) {
      const next = filtered.filter((a) => a !== allg);
      setSelectedAllergies(next.length > 0 ? next : ['No Allergies']);
    } else {
      setSelectedAllergies([...filtered, allg]);
    }
  };

  const addCustomCondition = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (customCondition.trim()) {
      const filtered = selectedConditions.filter((c) => c !== 'None (Healthy)');
      setSelectedConditions([...filtered, customCondition.trim()]);
      setCustomCondition('');
    }
  };

  const addCustomMedication = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (customMedication.trim()) {
      const filtered = selectedMedications.filter((m) => m !== 'None');
      setSelectedMedications([...filtered, customMedication.trim()]);
      setCustomMedication('');
    }
  };

  const addCustomAllergy = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (customAllergy.trim()) {
      const filtered = selectedAllergies.filter((a) => a !== 'No Allergies');
      setSelectedAllergies([...filtered, customAllergy.trim()]);
      setCustomAllergy('');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const conditionsToSubmit = selectedConditions.filter((c) => c !== 'None (Healthy)');
    const medsToSubmit = selectedMedications.filter((m) => m !== 'None').join(', ') || 'None';
    const allergiesToSubmit = selectedAllergies.filter((a) => a !== 'No Allergies');

    await searchDietReferences({
      fitnessGoals,
      userProfile: `${dietaryPreference}. ${additionalNotes}`,
      weight,
      weightUnit,
      height,
      heightUnit,
      age,
      medicalConditions: conditionsToSubmit.length > 0 ? conditionsToSubmit : ['None'],
      medications: medsToSubmit,
      allergies: allergiesToSubmit.length > 0 ? allergiesToSubmit : ['None'],
      dietaryPreference,
    });

    setIsFormOpen(false);
  };

  const handleToggleBookmark = (title: string) => {
    if (bookmarkedTitles.includes(title)) {
      setBookmarkedTitles(bookmarkedTitles.filter((t) => t !== title));
      showToast(`Removed "${title}" from your bookmarks.`);
    } else {
      setBookmarkedTitles([...bookmarkedTitles, title]);
      showToast(`📚 Saved "${title}" to your reading list!`);
    }
  };

  // Has active medical or allergy warnings
  const hasConditions = selectedConditions.some((c) => c !== 'None (Healthy)');
  const hasMedications = selectedMedications.some((m) => m !== 'None');
  const hasAllergies = selectedAllergies.some((a) => a !== 'No Allergies');

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4 sm:py-6 pb-14">
      {/* Top Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-xl bg-[#f5ebe1] text-[#965732] flex items-center justify-center border border-[#e4d3c3]">
            <Heart className="w-5 h-5 text-[#965732]" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#8d522e] tracking-tight font-['Outfit',sans-serif]">
          Personalized Dietary References & Safety
        </h1>
        <p className="text-xs sm:text-sm text-[#7d6c60] max-w-xl mx-auto">
          Medically safe nutrition recommendations, drug-nutrient interactions, and curated literature
          tailored to your exact weight, height, health conditions, medications, and allergies.
        </p>
      </div>

      {/* Top Banner showing Personalized Parameters & Medical Status */}
      <div className="bg-[#fdfbf7] rounded-2xl border border-[#e2d8c9] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#f5ebe1] text-[#965732] flex items-center justify-center border border-[#e4d3c3] shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9b5d38]">
                Active Health & Dietary Profile
              </span>
              {(hasConditions || hasMedications || hasAllergies) && (
                <span className="text-[9px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded">
                  Clinical Filter Active
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#4e3e34] font-medium mt-0.5">
              <span>Weight: <strong>{weight} {weightUnit}</strong></span>
              <span>•</span>
              <span>Height: <strong>{height} {heightUnit}</strong></span>
              <span>•</span>
              <span>BMI: <strong>{bmiVal}</strong></span>
              <span>•</span>
              <span>Goal: <strong>{fitnessGoals}</strong></span>
              <span>•</span>
              <span>Diet: <strong>{dietaryPreference}</strong></span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="self-start sm:self-auto px-3 py-1.5 rounded-xl border border-[#dcd1c2] bg-white hover:bg-[#f6f2ea] text-xs font-semibold text-[#8d522e] flex items-center space-x-1.5 transition shadow-xs"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{isFormOpen ? 'Hide Profile Form' : 'Edit Health & Diet Profile'}</span>
        </button>
      </div>

      {/* "Personalize Your Dietary Guide" Form Card */}
      <div
        className={`bg-[#fdfbf7] rounded-2xl shadow-xs border border-[#e2d8c9] overflow-hidden transition-all duration-200 ${
          isFormOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="px-6 py-4 border-b border-[#eee4d6] bg-[#f8f4ec] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#8d522e] font-['Outfit',sans-serif]">
              Personalize Your Dietary Guide
            </h2>
            <p className="text-xs text-[#7d6c60] mt-0.5">
              Input your physical metrics, medical conditions, medications, and allergies for safe recommendations.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsFormOpen(false)}
            className="text-xs text-[#8d522e] hover:underline"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSearch} className="p-6 space-y-5">
          {/* Row 1: Weight & Height */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Weight */}
            <div>
              <label className="block text-xs font-medium text-[#5c4d43] mb-1.5">
                Current Weight
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  min="30"
                  max="250"
                  required
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  className="col-span-2 px-3.5 py-2.5 bg-[#f6f2ea] border border-[#dcd1c2] rounded-xl text-xs sm:text-sm text-[#3e342d] focus:bg-white focus:ring-1 focus:ring-[#cf784d] focus:outline-none transition"
                />
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value as any)}
                  className="px-2 py-2.5 bg-[#f6f2ea] border border-[#dcd1c2] rounded-xl text-xs sm:text-sm text-[#3e342d] focus:bg-white focus:outline-none transition cursor-pointer"
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>

            {/* Height */}
            <div>
              <label className="block text-xs font-medium text-[#5c4d43] mb-1.5">
                Height
              </label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  min="90"
                  max="250"
                  required
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                  className="col-span-2 px-3.5 py-2.5 bg-[#f6f2ea] border border-[#dcd1c2] rounded-xl text-xs sm:text-sm text-[#3e342d] focus:bg-white focus:ring-1 focus:ring-[#cf784d] focus:outline-none transition"
                />
                <select
                  value={heightUnit}
                  onChange={(e) => setHeightUnit(e.target.value as any)}
                  className="px-2 py-2.5 bg-[#f6f2ea] border border-[#dcd1c2] rounded-xl text-xs sm:text-sm text-[#3e342d] focus:bg-white focus:outline-none transition cursor-pointer"
                >
                  <option value="cm">cm</option>
                  <option value="in">in</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 2: Goals & Dietary Preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#5c4d43] mb-1.5">
                Primary Fitness & Nutrition Goal
              </label>
              <div className="relative">
                <select
                  value={fitnessGoals}
                  onChange={(e) => setFitnessGoals(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 bg-[#f6f2ea] border border-[#dcd1c2] rounded-xl text-xs sm:text-sm text-[#3e342d] focus:bg-white focus:ring-1 focus:ring-[#cf784d] focus:outline-none pr-8 transition cursor-pointer"
                >
                  <option value="Weight Loss & Lean Muscle">Weight Loss & Lean Muscle</option>
                  <option value="Blood Sugar Regulation & Diabetes Care">Blood Sugar Regulation & Diabetes Care</option>
                  <option value="Cardiovascular Health & Lowering BP">Cardiovascular Health & Lowering BP</option>
                  <option value="Cholesterol Reduction & Lipid Optimization">Cholesterol Reduction & Lipid Optimization</option>
                  <option value="PCOS Hormonal Balance & Insulin Sensitivity">PCOS Hormonal Balance & Insulin Sensitivity</option>
                  <option value="Anti-Inflammatory Joint Recovery">Anti-Inflammatory Joint Recovery</option>
                  <option value="Athletic Endurance & Clean Plant Fuel">Athletic Endurance & Clean Plant Fuel</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#7d6c60]">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5c4d43] mb-1.5">
                Dietary Preference / Pattern
              </label>
              <div className="relative">
                <select
                  value={dietaryPreference}
                  onChange={(e) => setDietaryPreference(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 bg-[#f6f2ea] border border-[#dcd1c2] rounded-xl text-xs sm:text-sm text-[#3e342d] focus:bg-white focus:ring-1 focus:ring-[#cf784d] focus:outline-none pr-8 transition cursor-pointer"
                >
                  {DIETARY_PREFERENCES.map((pref) => (
                    <option key={pref} value={pref}>{pref}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#7d6c60]">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Medical Conditions / Diseases */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#5c4d43] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#cf784d]" />
                <span>Medical Conditions & Diseases (Select all that apply)</span>
              </label>
              <span className="text-[11px] text-[#7d6c60]">Essential for clinical contraindications</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {COMMON_CONDITIONS.map((cond) => {
                const isSelected = selectedConditions.includes(cond);
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => toggleCondition(cond)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition border flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#cf784d] text-white border-[#cf784d] shadow-2xs'
                        : 'bg-[#f6f2ea] text-[#5c4d43] border-[#dcd1c2] hover:bg-[#ede5d8]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    <span>{cond}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Condition input */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={customCondition}
                onChange={(e) => setCustomCondition(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomCondition(e))}
                placeholder="Other disease or diagnosed condition (e.g. Hashimoto's, Celiac)..."
                className="flex-1 px-3 py-1.5 bg-[#f6f2ea] border border-[#dcd1c2] rounded-lg text-xs text-[#3e342d] focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={addCustomCondition}
                className="px-3 py-1.5 bg-white border border-[#dcd1c2] hover:bg-[#f6f2ea] text-xs font-semibold text-[#8d522e] rounded-lg transition"
              >
                Add
              </button>
            </div>
          </div>

          {/* Row 4: Prescription Medications */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#5c4d43] flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-[#cf784d]" />
                <span>Current Medications (Crucial for Food-Drug Interactions)</span>
              </label>
              <span className="text-[11px] text-[#7d6c60]">Prevents dangerous enzyme inhibition</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {COMMON_MEDICATIONS.map((med) => {
                const isSelected = selectedMedications.includes(med);
                return (
                  <button
                    key={med}
                    type="button"
                    onClick={() => toggleMedication(med)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition border flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#ab7a52] text-white border-[#ab7a52] shadow-2xs'
                        : 'bg-[#f6f2ea] text-[#5c4d43] border-[#dcd1c2] hover:bg-[#ede5d8]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    <span>{med}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Medication input */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={customMedication}
                onChange={(e) => setCustomMedication(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomMedication(e))}
                placeholder="Other prescription or daily supplement (e.g. Warfarin, SSRI)..."
                className="flex-1 px-3 py-1.5 bg-[#f6f2ea] border border-[#dcd1c2] rounded-lg text-xs text-[#3e342d] focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={addCustomMedication}
                className="px-3 py-1.5 bg-white border border-[#dcd1c2] hover:bg-[#f6f2ea] text-xs font-semibold text-[#8d522e] rounded-lg transition"
              >
                Add
              </button>
            </div>
          </div>

          {/* Row 5: Food Allergies & Intolerances */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#5c4d43] flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#cf784d]" />
                <span>Food Allergies & Intolerances (100% Excluded from Plans)</span>
              </label>
              <span className="text-[11px] text-[#7d6c60]">Guaranteed safe substitutions</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {COMMON_ALLERGIES.map((allg) => {
                const isSelected = selectedAllergies.includes(allg);
                return (
                  <button
                    key={allg}
                    type="button"
                    onClick={() => toggleAllergy(allg)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition border flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#c66550] text-white border-[#c66550] shadow-2xs'
                        : 'bg-[#f6f2ea] text-[#5c4d43] border-[#dcd1c2] hover:bg-[#ede5d8]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    <span>{allg}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Allergy input */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={customAllergy}
                onChange={(e) => setCustomAllergy(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAllergy(e))}
                placeholder="Other allergy (e.g. strawberries, nightshades, sulfites)..."
                className="flex-1 px-3 py-1.5 bg-[#f6f2ea] border border-[#dcd1c2] rounded-lg text-xs text-[#3e342d] focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={addCustomAllergy}
                className="px-3 py-1.5 bg-white border border-[#dcd1c2] hover:bg-[#f6f2ea] text-xs font-semibold text-[#8d522e] rounded-lg transition"
              >
                Add
              </button>
            </div>
          </div>

          {/* Row 6: Additional Dietary Preferences / Notes */}
          <div>
            <label className="block text-xs font-medium text-[#5c4d43] mb-1.5">
              Additional Dietary Preferences & Notes
            </label>
            <textarea
              rows={2}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="e.g. prefers batch cooking, limited cooking time, likes spicy curries, dislikes artificial sweeteners..."
              className="w-full px-3.5 py-2.5 bg-[#f6f2ea] border border-[#dcd1c2] rounded-xl text-xs sm:text-sm text-[#3e342d] focus:bg-white focus:ring-1 focus:ring-[#cf784d] focus:outline-none transition"
            />
          </div>

          {/* Submit Button matching vintage terracotta style */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoadingDiet}
              className="w-full py-3 px-4 bg-[#d48c66] hover:bg-[#c67e58] text-white font-medium text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center justify-center space-x-2"
            >
              {isLoadingDiet ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Curating Personalized Recommendations...</span>
                </>
              ) : (
                <span>Update & Get Personalized Diet References</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {dietaryData && (
        <div className="space-y-6 animate-in fade-in">
          {/* 1. Clinical Safety, Disease Contraindications & Drug-Nutrient Advisory Card */}
          {dietaryData.clinicalSafety && (
            <div className="bg-[#fdfbf7] rounded-2xl border border-[#e2d8c9] p-5 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center space-x-2 pb-2 border-b border-[#eee4d6]">
                <ShieldAlert className="w-5 h-5 text-[#c66550]" />
                <h3 className="text-base font-bold text-[#8d522e] font-['Outfit',sans-serif]">
                  Clinical Safety & Medical Interaction Report
                </h3>
              </div>

              {/* User Health Summary Pills */}
              {dietaryData.userContextSummary && (
                <div className="bg-[#f8f4ec] p-3 rounded-xl border border-[#eee4d6] text-xs text-[#524137] flex flex-wrap gap-x-4 gap-y-1.5">
                  <span>Target: <strong>{dietaryData.userContextSummary.weight}</strong>, <strong>{dietaryData.userContextSummary.height}</strong> (BMI {dietaryData.userContextSummary.bmi})</span>
                  <span>Conditions: <strong className="text-[#965732]">{dietaryData.userContextSummary.conditions || 'None'}</strong></span>
                  <span>Medications: <strong className="text-[#965732]">{dietaryData.userContextSummary.medications || 'None'}</strong></span>
                  <span>Allergies: <strong className="text-[#965732]">{dietaryData.userContextSummary.allergies || 'None'}</strong></span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Contraindications & Strict Exclusions */}
                <div className="bg-[#fcf0ed] rounded-xl p-4 border border-[#f0c8c0] space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-[#9b3824]">
                    <AlertTriangle className="w-4 h-4 text-[#b8533e] shrink-0" />
                    <span>Foods & Ingredients to Avoid</span>
                  </div>
                  <ul className="text-xs text-[#823b2c] space-y-1.5">
                    {dietaryData.clinicalSafety.contraindications.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <X className="w-3.5 h-3.5 text-[#b8533e] mt-0.5 shrink-0 stroke-[3]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Medication Interactions & Timing */}
                <div className="bg-[#fff9ea] rounded-xl p-4 border border-[#f3e1b8] space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-[#8d6728]">
                    <Pill className="w-4 h-4 text-[#a3792c] shrink-0" />
                    <span>Medication Timing & Drug Interactions</span>
                  </div>
                  <ul className="text-xs text-[#6e4e1a] space-y-1.5">
                    {dietaryData.clinicalSafety.medicationInteractions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Info className="w-3.5 h-3.5 text-[#a3792c] mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Therapeutic Staples for Condition */}
                <div className="bg-[#edf4ec] rounded-xl p-4 border border-[#c2dac2] space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-[#2e5e2e]">
                    <CheckCircle2 className="w-4 h-4 text-[#3e753e] shrink-0" />
                    <span>Condition-Specific Therapeutic Staples</span>
                  </div>
                  <ul className="text-xs text-[#3e5e3e] space-y-1.5">
                    {dietaryData.clinicalSafety.therapeuticStaples.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#3e753e] mt-0.5 shrink-0 stroke-[3]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Allergen Safe Verification */}
                <div className="bg-white rounded-xl p-4 border border-[#e5dcce] space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-[#5c4d43]">
                    <ShieldAlert className="w-4 h-4 text-[#8d522e] shrink-0" />
                    <span>Verified Allergen Exclusions & Swaps</span>
                  </div>
                  <ul className="text-xs text-[#635348] space-y-1.5">
                    {dietaryData.clinicalSafety.allergenSafeNotice.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[#8d522e] mt-0.5 shrink-0 stroke-[3]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 2. Personalized Macronutrient & Calorie Prescription */}
          {dietaryData.macronutrientGuide && (
            <div className="bg-[#fdfbf7] border border-[#e2d8c9] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eee4d6] pb-3">
                <div className="flex items-center space-x-2">
                  <Apple className="w-5 h-5 text-[#965732]" />
                  <h3 className="text-base font-bold text-[#8d522e] font-['Outfit',sans-serif]">
                    Personalized Nutrition & Macronutrient Target
                  </h3>
                </div>
                <div className="text-xs text-[#7d6c60] font-medium bg-[#f6f2ea] px-3 py-1 rounded-lg border border-[#e4d6c6] self-start sm:self-auto">
                  Calibrated for {weight} {weightUnit} • {height} {heightUnit}
                </div>
              </div>

              {dietaryData.macronutrientGuide.calories && (
                <div className="bg-[#f5ebe1] p-3 rounded-xl border border-[#e4d3c3] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-[#8d522e] flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-[#cf784d]" />
                    Estimated Daily Caloric Baseline:
                  </span>
                  <span className="font-bold text-[#4e3e34] bg-white px-2.5 py-1 rounded-lg border border-[#ded0bf]">
                    {dietaryData.macronutrientGuide.calories}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-[#e5dcce] space-y-1">
                  <span className="text-[11px] font-bold text-[#965732] uppercase block">
                    Protein Strategy
                  </span>
                  <p className="text-[#635348] font-medium leading-relaxed">
                    {dietaryData.macronutrientGuide.protein}
                  </p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-[#e5dcce] space-y-1">
                  <span className="text-[11px] font-bold text-[#8d522e] uppercase block">
                    Carbohydrate Quality
                  </span>
                  <p className="text-[#635348] font-medium leading-relaxed">
                    {dietaryData.macronutrientGuide.carbs}
                  </p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-[#e5dcce] space-y-1">
                  <span className="text-[11px] font-bold text-[#4e6f4e] uppercase block">
                    Healthy Fats & Lipids
                  </span>
                  <p className="text-[#635348] font-medium leading-relaxed">
                    {dietaryData.macronutrientGuide.fats}
                  </p>
                </div>
              </div>

              {/* Fiber & Hydration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                {dietaryData.macronutrientGuide.fiber && (
                  <div className="bg-[#f8f4ec] p-3 rounded-xl border border-[#eee4d6] flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#8d522e] mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-[#5c4d43] block">Target Dietary Fiber</span>
                      <p className="text-[#635348] mt-0.5">{dietaryData.macronutrientGuide.fiber}</p>
                    </div>
                  </div>
                )}
                <div className="bg-[#f8f4ec] p-3 rounded-xl border border-[#eee4d6] flex items-start gap-2">
                  <Droplets className="w-4 h-4 text-[#4a7a96] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-[#5c4d43] block">Hydration Guidance</span>
                    <p className="text-[#635348] mt-0.5">{dietaryData.macronutrientGuide.hydrationTip}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Curated Books & Authoritative Literature */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#8d522e] font-['Outfit',sans-serif] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#965732]" />
                <span>Curated Books & Clinical Literature</span>
              </h3>
              <span className="text-xs text-[#7d6c60]">
                {dietaryData.books.length} Books Curated
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {dietaryData.books.map((book, idx) => {
                const isSaved = bookmarkedTitles.includes(book.title);
                return (
                  <div
                    key={idx}
                    className="bg-[#fdfbf7] rounded-2xl p-5 border border-[#e2d8c9] space-y-3.5 shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9b5d38] bg-[#f5ebe1] px-2 py-0.5 rounded border border-[#e4d3c3]">
                            {book.category}
                          </span>
                          {book.clinicalSafetyNote && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2e5e2e] bg-[#edf4ec] px-2 py-0.5 rounded border border-[#c2dac2]">
                              Medication Safe
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-bold text-[#4e3e34] mt-1.5">
                          {book.title}
                        </h4>
                        <p className="text-xs text-[#7d6c60]">
                          By <strong className="text-[#524137]">{book.author}</strong> • {book.isbnYear}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 self-start sm:self-auto">
                        <div className="flex items-center space-x-1 bg-white px-2 py-0.5 rounded-lg border border-[#e5dcce] text-xs font-semibold text-[#8d522e]">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{book.rating}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleBookmark(book.title)}
                          className={`p-1.5 rounded-lg border transition ${
                            isSaved
                              ? 'bg-[#cf784d] text-white border-[#cf784d]'
                              : 'bg-white text-[#7d6c60] border-[#e5dcce] hover:text-[#4e3e34]'
                          }`}
                          title="Save Bookmark"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#635348] leading-relaxed">
                      {book.summary}
                    </p>

                    {/* Specific Relevance Badge */}
                    {book.relevance && (
                      <div className="bg-[#f7f2ea] p-2.5 rounded-xl border border-[#dfd5c5] text-xs text-[#6d5543] flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#cf784d] mt-0.5 shrink-0" />
                        <span>
                          <strong>Why this applies to you:</strong> {book.relevance}
                        </span>
                      </div>
                    )}

                    {/* Core Strategies */}
                    <div className="bg-[#f8f4ec] p-3 rounded-xl border border-[#eee4d6] space-y-1.5">
                      <span className="text-[11px] font-bold text-[#5c4d43] uppercase tracking-wide block">
                        Core Takeaways & Clinical Actions:
                      </span>
                      <ul className="text-xs text-[#635348] space-y-1">
                        {book.keyStrategies.map((strat, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#5e825e] mt-0.5 shrink-0" />
                            <span>{strat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Peer-Reviewed Articles & Clinical Studies */}
          {dietaryData.articles && dietaryData.articles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#8d522e] font-['Outfit',sans-serif] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#965732]" />
                <span>Evidence-Based Clinical Papers & Guidance</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dietaryData.articles.map((art, aIdx) => (
                  <div
                    key={aIdx}
                    className="bg-[#fdfbf7] p-5 rounded-2xl border border-[#e2d8c9] space-y-2.5 shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-[#8d522e] uppercase tracking-wider block">
                        {art.source}
                      </span>
                      <h4 className="text-sm font-bold text-[#4e3e34] leading-snug">
                        {art.title}
                      </h4>
                      <ul className="text-xs text-[#635348] space-y-1 pt-1">
                        {art.keyTakeaways.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-1.5">
                            <span className="text-[#cf784d] font-bold">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-[#eee4d6] text-[11px] text-[#7d6c60]">
                      <strong className="text-[#8d522e]">Clinical Practice Tip:</strong> {art.practicalTip}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expert Medical Disclaimer */}
          <div className="bg-[#fdfbf7] rounded-2xl p-4 sm:p-5 border border-[#e2d8c9] space-y-1 text-xs text-[#7d6c60] shadow-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#8d522e]">
              <Info className="w-4 h-4 text-[#cf784d]" />
              <span>Medical & Clinical Nutrition Notice</span>
            </div>
            <p className="leading-relaxed">
              {dietaryData.expertDisclaimer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
