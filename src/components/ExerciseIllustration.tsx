import React, { useState } from 'react';
import {
  Check,
  X,
  ShieldAlert,
  CheckCircle2,
  User,
  Target,
  Sparkles,
  Layers,
  ArrowRight,
  Info,
  Maximize2,
  ChevronRight,
  RotateCcw,
  Flame,
  Scale
} from 'lucide-react';

interface ExerciseIllustrationProps {
  exerciseName: string;
  targetMuscle: string;
  userWeight?: number;
  weightUnit?: string;
  userHeight?: number;
  heightUnit?: string;
  fitnessGoal?: string;
}

type ExerciseCategory =
  | 'squat'
  | 'pushup'
  | 'lunge'
  | 'plank'
  | 'glutebridge'
  | 'mountainclimber'
  | 'crunch'
  | 'birddog'
  | 'catcow'
  | 'row'
  | 'generic';

export const ExerciseIllustration: React.FC<ExerciseIllustrationProps> = ({
  exerciseName,
  targetMuscle,
  userWeight = 50,
  weightUnit = 'kg',
  userHeight = 172,
  heightUnit = 'cm',
  fitnessGoal = 'Weight Loss',
}) => {
  const [activePhase, setActivePhase] = useState<'setup' | 'action' | 'return'>('action');
  const [formMode, setFormMode] = useState<'correct' | 'mistake'>('correct');

  const norm = exerciseName.toLowerCase();

  // Detect exercise category
  let category: ExerciseCategory = 'generic';
  if (norm.includes('squat')) category = 'squat';
  else if (norm.includes('push-up') || norm.includes('pushup')) category = 'pushup';
  else if (norm.includes('lunge')) category = 'lunge';
  else if (norm.includes('plank')) category = 'plank';
  else if (norm.includes('glute bridge') || norm.includes('bridge')) category = 'glutebridge';
  else if (norm.includes('mountain climber') || norm.includes('climber')) category = 'mountainclimber';
  else if (norm.includes('crunch') || norm.includes('dead bug') || norm.includes('ab')) category = 'crunch';
  else if (norm.includes('bird-dog') || norm.includes('bird dog')) category = 'birddog';
  else if (norm.includes('cat-cow') || norm.includes('cat cow') || norm.includes('dog') || norm.includes('stretch')) category = 'catcow';
  else if (norm.includes('row') || norm.includes('pull')) category = 'row';

  // Biomechanical & Personalized data calculation
  const heightM = heightUnit === 'cm' ? userHeight / 100 : (userHeight * 2.54) / 100;
  const weightKg = weightUnit === 'kg' ? userWeight : userWeight * 0.453592;
  const bmiNum = heightM > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : '16.9';

  // Exercise database for crystal clear understanding
  const exerciseData = getExerciseDetails(category, exerciseName, userHeight, heightUnit, userWeight, weightUnit, fitnessGoal, bmiNum, targetMuscle);

  return (
    <div className="rounded-2xl border border-[#e2d8c9] bg-[#fdfbf7] p-4 sm:p-5 space-y-4 shadow-xs">
      {/* 1. Header with Title & User Personalization Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#eee4d6]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#965732] bg-[#f5ebe1] px-2.5 py-0.5 rounded border border-[#e4d3c3]">
              Biomechanic Form Guide
            </span>
            <span className="text-xs font-semibold text-[#5c4d43]">
              Target: <strong className="text-[#8d522e]">{targetMuscle}</strong>
            </span>
          </div>
          <h3 className="text-lg font-bold text-[#4e3e34] mt-1 font-['Outfit',sans-serif]">
            {exerciseName} Form Reference
          </h3>
        </div>

        {/* Personalized Parameters Pill */}
        <div className="flex items-center space-x-1.5 self-start sm:self-auto bg-[#f6f2ea] px-3 py-1.5 rounded-xl border border-[#dfd5c5] text-xs text-[#524137]">
          <User className="w-3.5 h-3.5 text-[#cf784d]" />
          <span>
            Calibrated for: <strong>{userWeight} {weightUnit}</strong> • <strong>{userHeight} {heightUnit}</strong> • BMI <strong>{bmiNum}</strong>
          </span>
        </div>
      </div>

      {/* 2. Interactive Phase Switcher & Form Checker Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f8f4ec] p-2 rounded-xl border border-[#e8ded0]">
        {/* Phase Tabs */}
        <div className="flex items-center space-x-1">
          <span className="text-[11px] font-bold text-[#7d6c60] uppercase mr-1 hidden sm:inline">Phase:</span>
          {(['setup', 'action', 'return'] as const).map((phase) => (
            <button
              key={phase}
              type="button"
              onClick={() => setActivePhase(phase)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activePhase === phase
                  ? 'bg-[#ab7a52] text-white shadow-2xs'
                  : 'bg-white text-[#6d5d51] hover:bg-[#ede5d8] border border-[#dcd1c2]'
              }`}
            >
              {phase === 'setup' && '1. Setup Stance'}
              {phase === 'action' && '2. Peak Action (90°)'}
              {phase === 'return' && '3. Lockout & Return'}
            </button>
          ))}
        </div>

        {/* Correct vs Mistake Form Checker Toggle */}
        <div className="flex items-center space-x-1 self-start sm:self-auto">
          <span className="text-[11px] font-bold text-[#7d6c60] uppercase mr-1">Checker:</span>
          <button
            type="button"
            onClick={() => setFormMode('correct')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
              formMode === 'correct'
                ? 'bg-[#4b824b] text-white shadow-2xs'
                : 'bg-white text-[#4b824b] border border-[#c2dac2] hover:bg-[#edf4ec]'
            }`}
          >
            <Check className="w-3 h-3 stroke-[3]" />
            <span>Proper Form</span>
          </button>
          <button
            type="button"
            onClick={() => setFormMode('mistake')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
              formMode === 'mistake'
                ? 'bg-[#c66550] text-white shadow-2xs'
                : 'bg-white text-[#c66550] border border-[#f0c8c0] hover:bg-[#fcf0ed]'
            }`}
          >
            <X className="w-3 h-3 stroke-[3]" />
            <span>Common Mistake</span>
          </button>
        </div>
      </div>

      {/* 3. The Visual Diagrammatic Canvas (Crystal Clear, NOT Confusing) */}
      <div className="relative rounded-2xl overflow-hidden border border-[#dfd5c5] bg-[#f5efe4] p-4 sm:p-6 shadow-inner">
        {/* Status watermark */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          {formMode === 'correct' ? (
            <span className="bg-[#4b824b] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Correct Biomechanics</span>
            </span>
          ) : (
            <span className="bg-[#c66550] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Critical Mistake to Avoid</span>
            </span>
          )}

          <span className="bg-white/80 backdrop-blur-xs text-[#524137] text-[11px] font-medium px-2 py-0.5 rounded-md border border-[#dcd1c2]">
            {activePhase === 'setup' && 'Phase 1: Starting Posture'}
            {activePhase === 'action' && 'Phase 2: Target Joint Depth'}
            {activePhase === 'return' && 'Phase 3: Squeeze & Reset'}
          </span>
        </div>

        {/* Clean Vector SVG Illustration */}
        <div className="py-2 flex items-center justify-center">
          <ExerciseSvgDiagram
            category={category}
            phase={activePhase}
            formMode={formMode}
          />
        </div>

        {/* Direct Callout Annotations on the diagram */}
        <div className="mt-3 pt-3 border-t border-[#dfd5c5] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-[#4e3e34]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#cf784d]" />
            <span>Primary Muscle: <strong>{exerciseData.primaryMuscle}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-[#4e3e34]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4b824b]" />
            <span>Joint Angle: <strong>{exerciseData.angleTarget}</strong></span>
          </div>
          <div className="text-[11px] text-[#7d6c60]">
            Tempo: <strong>{exerciseData.tempo}</strong>
          </div>
        </div>
      </div>

      {/* 4. Active Phase Instructions & Form Cue */}
      <div className="bg-white p-4 rounded-xl border border-[#e5dcce] space-y-2 shadow-2xs">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#8d522e] uppercase tracking-wider flex items-center gap-1.5 font-['Outfit',sans-serif]">
            <Sparkles className="w-3.5 h-3.5 text-[#cf784d]" />
            <span>
              {activePhase === 'setup' && 'Setup & Alignment Instructions'}
              {activePhase === 'action' && 'Execution & Descent Dynamics'}
              {activePhase === 'return' && 'Concentric Drive & Reset Instructions'}
            </span>
          </h4>
          <span className="text-[11px] font-semibold text-[#965732]">
            {activePhase === 'setup' && 'Step 1 of 3'}
            {activePhase === 'action' && 'Step 2 of 3'}
            {activePhase === 'return' && 'Step 3 of 3'}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#4e3e34] leading-relaxed">
          {formMode === 'correct'
            ? exerciseData.phases[activePhase].correctDesc
            : exerciseData.phases[activePhase].mistakeDesc}
        </p>

        {formMode === 'mistake' && (
          <div className="bg-[#fcf0ed] p-2.5 rounded-lg border border-[#f0c8c0] text-xs text-[#9b3824] flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[#b8533e]" />
            <span>
              <strong>Injury Risk:</strong> {exerciseData.injuryRisk}
            </span>
          </div>
        )}
      </div>

      {/* 5. Biomechanical Adjustments Formulated for Height (172cm) & Weight (50kg) */}
      <div className="bg-[#f6f2ea] rounded-xl p-4 border border-[#dfd5c5] space-y-2.5">
        <div className="flex items-center space-x-2 text-xs font-bold text-[#8d522e]">
          <Target className="w-4 h-4 text-[#cf784d]" />
          <span>Biomechanical Adjustments For Your Physique</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#524137]">
          {/* Height adjustment */}
          <div className="bg-white/80 p-3 rounded-lg border border-[#e5dcce] space-y-1">
            <span className="font-bold text-[#965732] text-[11px] block flex items-center gap-1">
              <span>📏 Lever Length ({userHeight} {heightUnit})</span>
            </span>
            <p className="text-[11px] text-[#635348] leading-relaxed">
              {exerciseData.personalizedHeight}
            </p>
          </div>

          {/* Weight & Goal adjustment */}
          <div className="bg-white/80 p-3 rounded-lg border border-[#e5dcce] space-y-1">
            <span className="font-bold text-[#965732] text-[11px] block flex items-center gap-1">
              <span>⚖️ Mass & Tempo ({userWeight} {weightUnit} • {fitnessGoal})</span>
            </span>
            <p className="text-[11px] text-[#635348] leading-relaxed">
              {exerciseData.personalizedWeight}
            </p>
          </div>
        </div>
      </div>

      {/* 6. Form Checklist: DOs and DONTs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* DOs */}
        <div className="bg-[#edf4ec] rounded-xl p-3.5 border border-[#c2dac2] space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-[#2e5e2e]">
            <CheckCircle2 className="w-4 h-4 text-[#3e753e]" />
            <span>Form Checklist (DO THIS)</span>
          </div>
          <ul className="text-[11px] text-[#3e5e3e] space-y-1.5">
            {exerciseData.dos.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#3e753e] mt-0.5 shrink-0 stroke-[3]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* DONTs */}
        <div className="bg-[#fcf0ed] rounded-xl p-3.5 border border-[#f0c8c0] space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-[#9b3824]">
            <ShieldAlert className="w-4 h-4 text-[#b8533e]" />
            <span>Common Mistakes (AVOID THIS)</span>
          </div>
          <ul className="text-[11px] text-[#823b2c] space-y-1.5">
            {exerciseData.donts.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <X className="w-3.5 h-3.5 text-[#b8533e] mt-0.5 shrink-0 stroke-[3]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Vector SVG Anatomical Renderer for Crystal Clarity
// -------------------------------------------------------------
interface SvgProps {
  category: ExerciseCategory;
  phase: 'setup' | 'action' | 'return';
  formMode: 'correct' | 'mistake';
}

const ExerciseSvgDiagram: React.FC<SvgProps> = ({ category, phase, formMode }) => {
  const isMistake = formMode === 'mistake';
  const strokeColor = isMistake ? '#b8533e' : '#4b824b';
  const jointFill = isMistake ? '#e57373' : '#81c784';
  const muscleGlow = '#cf784d';

  // SVG canvas dimensions
  const width = 360;
  const height = 180;

  switch (category) {
    case 'squat':
      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[340px] h-44 select-none">
          {/* Floor line */}
          <line x1="20" y1="165" x2="340" y2="165" stroke="#d5c8b5" strokeWidth="3" strokeDasharray="4 4" />
          <text x="320" y="160" fill="#9e8d7d" fontSize="9" textAnchor="end">Floor Level</text>

          {phase === 'setup' && (
            <g transform="translate(140, 10)">
              {/* Vertical Plumb Line */}
              <line x1="40" y1="10" x2="40" y2="155" stroke="#a0c49d" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="45" y="25" fill="#4b824b" fontSize="8">Plumb Line</text>

              {/* Head */}
              <circle cx="40" cy="25" r="12" fill="#e8dfd3" stroke="#5c4d43" strokeWidth="2.5" />
              {/* Torso */}
              <line x1="40" y1="37" x2="40" y2="85" stroke="#5c4d43" strokeWidth="8" strokeLinecap="round" />
              {/* Arms */}
              <line x1="40" y1="48" x2="65" y2="60" stroke="#5c4d43" strokeWidth="4" strokeLinecap="round" />
              {/* Pelvis */}
              <circle cx="40" cy="85" r="5" fill={jointFill} stroke={strokeColor} strokeWidth="2" />
              {/* Legs */}
              <line x1="40" y1="85" x2="40" y2="120" stroke="#5c4d43" strokeWidth="6" strokeLinecap="round" />
              <circle cx="40" cy="120" r="4.5" fill={jointFill} stroke={strokeColor} strokeWidth="2" />
              <line x1="40" y1="120" x2="40" y2="155" stroke="#5c4d43" strokeWidth="5.5" strokeLinecap="round" />
              {/* Foot */}
              <line x1="38" y1="155" x2="55" y2="155" stroke="#3e342d" strokeWidth="4" strokeLinecap="round" />
            </g>
          )}

          {phase === 'action' && !isMistake && (
            <g transform="translate(130, 20)">
              {/* Head & Neck neutral */}
              <circle cx="20" cy="30" r="11" fill="#e8dfd3" stroke="#5c4d43" strokeWidth="2.5" />
              {/* Flat Back Torso at 45 degree angle */}
              <line x1="20" y1="40" x2="45" y2="78" stroke="#5c4d43" strokeWidth="8" strokeLinecap="round" />
              {/* Working muscle highlight: Quads & Glutes */}
              <path d="M 45 78 Q 75 75 80 82" stroke={muscleGlow} strokeWidth="10" strokeLinecap="round" opacity="0.85" />
              {/* Femur parallel to ground */}
              <line x1="45" y1="78" x2="85" y2="80" stroke="#5c4d43" strokeWidth="6.5" strokeLinecap="round" />
              {/* 90 degree knee joint */}
              <circle cx="85" cy="80" r="5.5" fill="#4b824b" stroke="#2e5e2e" strokeWidth="2" />
              {/* Angle Arc 90deg */}
              <path d="M 75 80 A 10 10 0 0 1 85 92" fill="none" stroke="#2e5e2e" strokeWidth="2" />
              <text x="94" y="80" fill="#2e5e2e" fontSize="10" fontWeight="bold">90° Depth</text>

              {/* Shin / Tibia slightly forward */}
              <line x1="85" y1="80" x2="80" y2="145" stroke="#5c4d43" strokeWidth="5.5" strokeLinecap="round" />
              {/* Foot flat on floor */}
              <line x1="72" y1="145" x2="102" y2="145" stroke="#3e342d" strokeWidth="4" strokeLinecap="round" />
              {/* Arms counterbalancing */}
              <line x1="26" y1="48" x2="60" y2="40" stroke="#5c4d43" strokeWidth="4" strokeLinecap="round" />

              {/* Callouts */}
              <text x="3" y="18" fill="#4b824b" fontSize="8" fontWeight="bold">✓ Chest Proud</text>
              <text x="100" y="142" fill="#4b824b" fontSize="8" fontWeight="bold">✓ Heel Grounded</text>
            </g>
          )}

          {phase === 'action' && isMistake && (
            <g transform="translate(130, 20)">
              {/* Head drooping down */}
              <circle cx="10" cy="45" r="11" fill="#f8d7da" stroke="#b8533e" strokeWidth="2.5" />
              {/* Curved / Hunched Back */}
              <path d="M 10 55 Q 35 60 40 85" stroke="#b8533e" strokeWidth="7" fill="none" strokeLinecap="round" />
              {/* Knees drifting too far past toes, heels off ground */}
              <line x1="40" y1="85" x2="95" y2="82" stroke="#5c4d43" strokeWidth="6" strokeLinecap="round" />
              <circle cx="95" cy="82" r="5" fill="#e57373" stroke="#b8533e" strokeWidth="2" />
              <line x1="95" y1="82" x2="75" y2="142" stroke="#5c4d43" strokeWidth="5" strokeLinecap="round" />
              {/* Heel lifted */}
              <line x1="75" y1="142" x2="95" y2="147" stroke="#b8533e" strokeWidth="4" strokeLinecap="round" />

              {/* Mistake markers */}
              <text x="5" y="25" fill="#b8533e" fontSize="9" fontWeight="bold">✗ Rounded Spine</text>
              <text x="100" y="80" fill="#b8533e" fontSize="9" fontWeight="bold">✗ Knees Past Toes</text>
              <text x="45" y="155" fill="#b8533e" fontSize="8" fontWeight="bold">✗ Heel Lifting</text>
            </g>
          )}

          {phase === 'return' && (
            <g transform="translate(140, 15)">
              <circle cx="40" cy="25" r="11" fill="#e8dfd3" stroke="#5c4d43" strokeWidth="2.5" />
              <line x1="40" y1="36" x2="40" y2="85" stroke="#5c4d43" strokeWidth="8" strokeLinecap="round" />
              {/* Upward Force Arrow */}
              <line x1="55" y1="80" x2="55" y2="45" stroke="#4b824b" strokeWidth="2" markerEnd="url(#arrow)" />
              <polygon points="55,40 51,48 59,48" fill="#4b824b" />
              <text x="62" y="60" fill="#4b824b" fontSize="8" fontWeight="bold">Drive Through Heels</text>

              <line x1="40" y1="85" x2="40" y2="120" stroke="#5c4d43" strokeWidth="6" strokeLinecap="round" />
              <line x1="40" y1="120" x2="40" y2="150" stroke="#5c4d43" strokeWidth="5.5" strokeLinecap="round" />
              <line x1="38" y1="150" x2="55" y2="150" stroke="#3e342d" strokeWidth="4" strokeLinecap="round" />
            </g>
          )}
        </svg>
      );

    case 'pushup':
      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[340px] h-44 select-none">
          <line x1="20" y1="155" x2="340" y2="155" stroke="#d5c8b5" strokeWidth="3" strokeDasharray="4 4" />
          <text x="320" y="150" fill="#9e8d7d" fontSize="9" textAnchor="end">Mat Floor</text>

          {phase === 'setup' && (
            <g transform="translate(50, 40)">
              {/* Rigid straight line from head to heels */}
              <line x1="20" y1="35" x2="220" y2="105" stroke="#4b824b" strokeWidth="2" strokeDasharray="3 3" />
              <text x="110" y="55" fill="#4b824b" fontSize="8">Straight Plank Line</text>

              {/* Head */}
              <circle cx="20" cy="30" r="11" fill="#e8dfd3" stroke="#5c4d43" strokeWidth="2.5" />
              {/* Torso & Legs */}
              <line x1="28" y1="35" x2="130" y2="70" stroke="#5c4d43" strokeWidth="8" strokeLinecap="round" />
              <line x1="130" y1="70" x2="220" y2="105" stroke="#5c4d43" strokeWidth="6" strokeLinecap="round" />
              {/* Arms locked under shoulders */}
              <line x1="45" y1="42" x2="45" y2="115" stroke="#5c4d43" strokeWidth="5" strokeLinecap="round" />
              {/* Hands on mat */}
              <line x1="40" y1="115" x2="55" y2="115" stroke="#3e342d" strokeWidth="4" strokeLinecap="round" />
              {/* Toes on mat */}
              <circle cx="220" cy="105" r="4" fill="#5c4d43" />
            </g>
          )}

          {phase === 'action' && !isMistake && (
            <g transform="translate(50, 60)">
              {/* Chest 2 inches off mat */}
              <circle cx="20" cy="65" r="10" fill="#e8dfd3" stroke="#5c4d43" strokeWidth="2.5" />
              <line x1="28" y1="70" x2="130" y2="78" stroke="#5c4d43" strokeWidth="8" strokeLinecap="round" />
              <line x1="130" y1="78" x2="220" y2="88" stroke="#5c4d43" strokeWidth="6" strokeLinecap="round" />

              {/* Bent elbow at 45 degree angle */}
              <path d="M 45 72 L 55 50 L 45 95" fill="none" stroke="#5c4d43" strokeWidth="5" strokeLinecap="round" />
              <circle cx="55" cy="50" r="4.5" fill="#4b824b" stroke="#2e5e2e" strokeWidth="2" />
              <text x="65" y="48" fill="#2e5e2e" fontSize="9" fontWeight="bold">45° Elbow Angle</text>

              {/* Pectoral & Tricep activation glow */}
              <ellipse cx="40" cy="72" rx="14" ry="7" fill={muscleGlow} opacity="0.75" />

              <text x="15" y="45" fill="#4b824b" fontSize="8" fontWeight="bold">✓ Chest 2" Off Floor</text>
              <text x="120" y="65" fill="#4b824b" fontSize="8" fontWeight="bold">✓ Rigid Core</text>
            </g>
          )}

          {phase === 'action' && isMistake && (
            <g transform="translate(50, 60)">
              {/* Dropped head and sagging hips */}
              <circle cx="15" cy="85" r="10" fill="#f8d7da" stroke="#b8533e" strokeWidth="2.5" />
              {/* Sagging belly / spine */}
              <path d="M 25 82 Q 100 105 140 75" fill="none" stroke="#b8533e" strokeWidth="8" strokeLinecap="round" />
              <line x1="140" y1="75" x2="220" y2="88" stroke="#5c4d43" strokeWidth="6" strokeLinecap="round" />

              {/* Flared elbows at 90 degrees */}
              <path d="M 40 82 L 40 45 L 35 95" fill="none" stroke="#b8533e" strokeWidth="5" strokeLinecap="round" />

              <text x="60" y="40" fill="#b8533e" fontSize="9" fontWeight="bold">✗ Elbows Flared at 90° (Impairs Shoulders)</text>
              <text x="75" y="115" fill="#b8533e" fontSize="9" fontWeight="bold">✗ Sagging Hips & Lumbar Spine</text>
            </g>
          )}

          {phase === 'return' && (
            <g transform="translate(50, 45)">
              <circle cx="20" cy="35" r="11" fill="#e8dfd3" stroke="#5c4d43" strokeWidth="2.5" />
              <line x1="28" y1="40" x2="130" y2="72" stroke="#5c4d43" strokeWidth="8" strokeLinecap="round" />
              <line x1="130" y1="72" x2="220" y2="100" stroke="#5c4d43" strokeWidth="6" strokeLinecap="round" />
              <line x1="45" y1="45" x2="45" y2="110" stroke="#5c4d43" strokeWidth="5" strokeLinecap="round" />

              {/* Arrow pushing floor away */}
              <line x1="30" y1="95" x2="30" y2="55" stroke="#4b824b" strokeWidth="2" />
              <polygon points="30,50 26,58 34,58" fill="#4b824b" />
              <text x="55" y="80" fill="#4b824b" fontSize="8" fontWeight="bold">Push Floor Away to Full Lockout</text>
            </g>
          )}
        </svg>
      );

    case 'plank':
      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[340px] h-44 select-none">
          <line x1="20" y1="155" x2="340" y2="155" stroke="#d5c8b5" strokeWidth="3" strokeDasharray="4 4" />

          {!isMistake ? (
            <g transform="translate(50, 60)">
              {/* Perfectly horizontal spine line */}
              <line x1="25" y1="40" x2="230" y2="75" stroke="#4b824b" strokeWidth="2" strokeDasharray="3 3" />
              <text x="110" y="30" fill="#4b824b" fontSize="9" fontWeight="bold">Level Bridge Alignment</text>

              {/* Head neutral gazing at floor */}
              <circle cx="20" cy="35" r="10" fill="#e8dfd3" stroke="#5c4d43" strokeWidth="2.5" />
              {/* Torso & Core */}
              <line x1="28" y1="40" x2="135" y2="58" stroke="#5c4d43" strokeWidth="8" strokeLinecap="round" />
              {/* Transverse Abdominis Core Glow */}
              <ellipse cx="80" cy="50" rx="28" ry="8" fill={muscleGlow} opacity="0.8" />
              {/* Legs */}
              <line x1="135" y1="58" x2="230" y2="75" stroke="#5c4d43" strokeWidth="6" strokeLinecap="round" />
              {/* Elbow under shoulder (90 degrees) */}
              <line x1="45" y1="44" x2="45" y2="95" stroke="#5c4d43" strokeWidth="5" strokeLinecap="round" />
              <line x1="45" y1="95" x2="70" y2="95" stroke="#3e342d" strokeWidth="4" strokeLinecap="round" />
              <circle cx="45" cy="44" r="4.5" fill="#4b824b" stroke="#2e5e2e" strokeWidth="1.5" />

              <text x="35" y="110" fill="#4b824b" fontSize="8" fontWeight="bold">✓ Elbows Under Shoulders</text>
              <text x="140" y="95" fill="#4b824b" fontSize="8" fontWeight="bold">✓ Glutes Squeezed Tight</text>
            </g>
          ) : (
            <g transform="translate(50, 50)">
              {/* Hips hiked up or sagging */}
              <circle cx="20" cy="40" r="10" fill="#f8d7da" stroke="#b8533e" strokeWidth="2.5" />
              {/* Sagging spine */}
              <path d="M 28 45 Q 85 85 135 50" fill="none" stroke="#b8533e" strokeWidth="8" strokeLinecap="round" />
              <line x1="135" y1="50" x2="230" y2="85" stroke="#5c4d43" strokeWidth="6" strokeLinecap="round" />
              <line x1="45" y1="52" x2="45" y2="105" stroke="#5c4d43" strokeWidth="5" strokeLinecap="round" />

              <text x="65" y="105" fill="#b8533e" fontSize="9" fontWeight="bold">✗ Lumbar Sagging (Strain on Lower Back)</text>
              <text x="60" y="30" fill="#b8533e" fontSize="8" fontWeight="bold">✗ Never Hold Breath — Breathe Smoothly</text>
            </g>
          )}
        </svg>
      );

    case 'lunge':
      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[340px] h-44 select-none">
          <line x1="20" y1="160" x2="340" y2="160" stroke="#d5c8b5" strokeWidth="3" strokeDasharray="4 4" />

          {!isMistake ? (
            <g transform="translate(100, 20)">
              {/* Torso straight vertical line */}
              <line x1="60" y1="10" x2="60" y2="140" stroke="#4b824b" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="65" y="20" fill="#4b824b" fontSize="8">Upright Torso</text>

              {/* Head */}
              <circle cx="60" cy="22" r="11" fill="#e8dfd3" stroke="#5c4d43" strokeWidth="2.5" />
              {/* Torso */}
              <line x1="60" y1="33" x2="60" y2="80" stroke="#5c4d43" strokeWidth="8" strokeLinecap="round" />

              {/* Front Leg: 90 degree angle */}
              <line x1="60" y1="80" x2="115" y2="82" stroke="#5c4d43" strokeWidth="6.5" strokeLinecap="round" />
              {/* Front knee joint */}
              <circle cx="115" cy="82" r="5" fill="#4b824b" stroke="#2e5e2e" strokeWidth="2" />
              <text x="122" y="80" fill="#2e5e2e" fontSize="9" fontWeight="bold">90° Knee Angle</text>
              {/* Shin stacked over ankle */}
              <line x1="115" y1="82" x2="115" y2="140" stroke="#5c4d43" strokeWidth="5.5" strokeLinecap="round" />
              <line x1="105" y1="140" x2="130" y2="140" stroke="#3e342d" strokeWidth="4" strokeLinecap="round" />

              {/* Back Leg: 90 degree angle hovering 2 inches off floor */}
              <line x1="60" y1="80" x2="15" y2="115" stroke="#5c4d43" strokeWidth="6" strokeLinecap="round" />
              <circle cx="15" cy="115" r="4.5" fill="#4b824b" stroke="#2e5e2e" strokeWidth="2" />
              <line x1="15" y1="115" x2="15" y2="135" stroke="#5c4d43" strokeWidth="5" strokeLinecap="round" />

              {/* Muscle activation: Front Glute & Quad */}
              <path d="M 60 80 Q 90 75 115 82" stroke={muscleGlow} strokeWidth="10" strokeLinecap="round" opacity="0.8" />

              <text x="90" y="152" fill="#4b824b" fontSize="8" fontWeight="bold">✓ Front Heel Drives Up</text>
              <text x="5" y="152" fill="#4b824b" fontSize="8" fontWeight="bold">✓ Back Knee Hovers</text>
            </g>
          ) : (
            <g transform="translate(100, 20)">
              {/* Torso leaning forward and front knee caving past toes */}
              <circle cx="90" cy="30" r="11" fill="#f8d7da" stroke="#b8533e" strokeWidth="2.5" />
              <line x1="85" y1="40" x2="60" y2="85" stroke="#b8533e" strokeWidth="8" strokeLinecap="round" />
              {/* Front knee drifting way past toes */}
              <line x1="60" y1="85" x2="140" y2="95" stroke="#5c4d43" strokeWidth="6" strokeLinecap="round" />
              <circle cx="140" cy="95" r="5" fill="#e57373" stroke="#b8533e" strokeWidth="2" />
              <line x1="140" y1="95" x2="110" y2="140" stroke="#5c4d43" strokeWidth="5" strokeLinecap="round" />

              <text x="80" y="18" fill="#b8533e" fontSize="9" fontWeight="bold">✗ Torso Leaning Forward</text>
              <text x="120" y="75" fill="#b8533e" fontSize="9" fontWeight="bold">✗ Front Knee Shear</text>
            </g>
          )}
        </svg>
      );

    default:
      return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[340px] h-44 select-none">
          <line x1="20" y1="155" x2="340" y2="155" stroke="#d5c8b5" strokeWidth="3" strokeDasharray="4 4" />
          <g transform="translate(140, 20)">
            <circle cx="40" cy="25" r="12" fill="#e8dfd3" stroke="#5c4d43" strokeWidth="2.5" />
            <line x1="40" y1="37" x2="40" y2="85" stroke="#5c4d43" strokeWidth="8" strokeLinecap="round" />
            <line x1="40" y1="50" x2="70" y2="40" stroke="#5c4d43" strokeWidth="4" strokeLinecap="round" />
            <line x1="40" y1="85" x2="25" y2="120" stroke="#5c4d43" strokeWidth="6" strokeLinecap="round" />
            <line x1="25" y1="120" x2="20" y2="150" stroke="#5c4d43" strokeWidth="5.5" strokeLinecap="round" />
            <line x1="40" y1="85" x2="55" y2="120" stroke="#5c4d43" strokeWidth="6" strokeLinecap="round" />
            <line x1="55" y1="120" x2="60" y2="150" stroke="#5c4d43" strokeWidth="5.5" strokeLinecap="round" />

            <circle cx="40" cy="85" r="5" fill={jointFill} stroke={strokeColor} strokeWidth="2" />
            <text x="40" y="165" fill="#4b824b" fontSize="9" textAnchor="middle" fontWeight="bold">
              Controlled Symmetrical Alignment
            </text>
          </g>
        </svg>
      );
  }
};

// -------------------------------------------------------------
// Exercise Details Helper with personalized physics
// -------------------------------------------------------------
function getExerciseDetails(
  category: ExerciseCategory,
  name: string,
  userHeight: number,
  heightUnit: string,
  userWeight: number,
  weightUnit: string,
  fitnessGoal: string,
  bmiNum: string,
  targetMuscle?: string
) {
  const isTall = heightUnit === 'cm' ? userHeight >= 170 : userHeight >= 67;
  const isLight = weightUnit === 'kg' ? userWeight <= 55 : userWeight <= 125;

  switch (category) {
    case 'squat':
      return {
        primaryMuscle: 'Quadriceps, Gluteus Maximus, Hamstrings',
        angleTarget: '90° Knee Flexion (Thighs parallel to ground)',
        tempo: '3 sec down (eccentric), 1 sec pause, 1 sec up',
        injuryRisk: 'Allowing knees to cave inward puts extreme shearing torque on the ACL and meniscus.',
        phases: {
          setup: {
            correctDesc: `Stand tall with feet slightly wider than shoulder-width. Flare toes outward 15°–20° to open hip capsule for your height (${userHeight} ${heightUnit}). Brace your core as if preparing for a gentle tap.`,
            mistakeDesc: 'Standing with feet too narrow or pointing straight forward, which blocks the femur from dropping into a full safe hip pocket.',
          },
          action: {
            correctDesc: 'Inhale while sending your hips back and down simultaneously. Descend until thighs are parallel to the floor (90° knee angle) while keeping chest lifted and gaze forward.',
            mistakeDesc: 'Hunching shoulders forward, letting knees collapse toward the midline, and lifting heels off the floor.',
          },
          return: {
            correctDesc: 'Exhale forcefully and drive through the whole foot and heels. Squeeze glutes firmly at the apex without hyperextending your lower back.',
            mistakeDesc: 'Locking knees violently with knees snapping back, which transfers load from muscle to cartilage.',
          },
        },
        personalizedHeight: `With your height of ${userHeight} ${heightUnit} (longer femoral limb levers), a slightly wider stance (1.15× shoulder width) and a 30° torso forward pitch maintains perfect center of gravity over your midfoot without rounding lower back.`,
        personalizedWeight: `At ${userWeight} ${weightUnit} (BMI ${bmiNum}), your bodyweight provides ideal baseline resistance for ${fitnessGoal}. Emphasize a deliberate 3-second descent to trigger high motor-unit recruitment without spinal compression.`,
        dos: [
          'Keep your chest proud and collarbones open',
          'Send hips back first before bending the knees',
          'Drive weight firmly through mid-foot and heels',
          'Knees must track in the exact same direction as your 2nd and 3rd toes',
        ],
        donts: [
          'Do NOT allow knees to cave inward towards each other',
          'Do NOT round your lower lumbar back',
          'Do NOT lift your heels off the ground',
          'Do NOT hold your breath—inhale down, exhale up',
        ],
      };

    case 'pushup':
      return {
        primaryMuscle: 'Pectoralis Major, Anterior Deltoids, Triceps Brachii',
        angleTarget: '45° Elbow Flaring (Arrow Shape)',
        tempo: '2 sec down, 1 sec explosive press',
        injuryRisk: 'Flaring elbows at 90 degrees creates subacromial impingement and damages rotator cuff tendons.',
        phases: {
          setup: {
            correctDesc: 'Place hands flat directly under shoulders with fingers spread. Body forms a rigid wooden plank from the crown of your head down to your heels.',
            mistakeDesc: 'Placing hands too wide or far ahead of shoulders, placing immediate shear on the anterior shoulder joint capsule.',
          },
          action: {
            correctDesc: 'Inhale and lower until your chest hovers 2 inches above the mat. Tuck elbows close at a 45-degree angle (arrowhead shape) while keeping your neck neutral.',
            mistakeDesc: 'Flaring elbows out sideways like a "T" at 90°, and allowing your belly or hips to sag into the floor.',
          },
          return: {
            correctDesc: 'Exhale and press the floor away firmly through the base of your palms until arms are fully straight.',
            mistakeDesc: 'Shrugging shoulders up toward ears or pushing hips up into the air before the chest.',
          },
        },
        personalizedHeight: `At ${userHeight} ${heightUnit}, your longer arm reach increases torque on the pectoral insertions. Place your hands roughly 2 inches wider than shoulder width to keep wrists and forearms perpendicular to floor.`,
        personalizedWeight: `At ${userWeight} ${weightUnit}, you are pressing approximately 64% of your mass (~32 kg). If performing standard push-ups feels fatiguing after 6 reps, elevate hands on a bench or drop to knees to preserve the critical 45° elbow angle.`,
        dos: [
          'Maintain a rigid straight line from head to heels',
          'Tuck elbows at 45 degrees (arrow shape, not T-shape)',
          'Lower fully until chest hovers just off the floor',
          'Engage glutes and pull belly button toward spine',
        ],
        donts: [
          'Do NOT allow lower back or belly to sag toward the mat',
          'Do NOT flare elbows out at 90 degrees to sides',
          'Do NOT drop your chin or crane your neck upwards',
        ],
      };

    case 'lunge':
      return {
        primaryMuscle: 'Quadriceps, Gluteus Medius & Maximus, Calves',
        angleTarget: 'Both Knees at 90° Right Angles',
        tempo: '2 sec lower, 1 sec pause, explosive return',
        injuryRisk: 'Slamming the rear patella into the ground or letting the front knee shear past toes strains patellar tendon.',
        phases: {
          setup: {
            correctDesc: 'Stand tall with feet hip-width apart. Shoulders drawn back, chest open, hands on hips or held at chest.',
            mistakeDesc: 'Standing on a tightrope with both feet on a single narrow line, which severely impairs lateral balance.',
          },
          action: {
            correctDesc: 'Take a long, intentional step forward. Lower straight down until both the front and rear knees form comfortable 90-degree right angles.',
            mistakeDesc: 'Taking too short a step, forcing the front heel to lift while the knee shoots past the toes.',
          },
          return: {
            correctDesc: 'Push forcefully through the front heel to step back smoothly to the starting standing posture.',
            mistakeDesc: 'Pushing off your front toes or twisting the ankle sideways upon return.',
          },
        },
        personalizedHeight: `For your height of ${userHeight} ${heightUnit}, take an elongated step (approx 3 to 3.5 feet). This ensures your front tibia stays vertical and back knee hovers safely without compressive patellofemoral pressure.`,
        personalizedWeight: `At ${userWeight} ${weightUnit}, single-leg balance activates deep stabilizing muscles. Keep 70% of load grounded through the front heel to maximize glute recruitment for ${fitnessGoal}.`,
        dos: [
          'Keep your upper torso tall and perpendicular to the floor',
          'Front knee stays directly stacked above the front ankle',
          'Sink straight down rather than pitching forward',
        ],
        donts: [
          'Do NOT slam your back knee into the hard ground',
          'Do NOT allow front knee to drift far past your toes',
          'Do NOT collapse your chest over your front thigh',
        ],
      };

    case 'plank':
      return {
        primaryMuscle: 'Transverse Abdominis, Rectus Abdominis, Obliques',
        angleTarget: '180° Horizontal Straight Bridge',
        tempo: 'Continuous unyielding tension (30-45s)',
        injuryRisk: 'Sagging the lumbar spine puts harmful compressive pressure onto L4-L5 vertebrae.',
        phases: {
          setup: {
            correctDesc: 'Rest on forearms with elbows directly under shoulders. Forearms parallel, palms flat or loosely clasped.',
            mistakeDesc: 'Elbows placed too far ahead or wide, overstressing the rotator cuff before core engages.',
          },
          action: {
            correctDesc: 'Lift knees and lock body in a straight line from ears through shoulders, hips, and heels. Pull belly button toward spine and squeeze glutes.',
            mistakeDesc: 'Hiking hips into a tent shape to cheat the core, or allowing hips to sag toward the floor.',
          },
          return: {
            correctDesc: 'Lower knees gently to mat after the target interval without dropping your lower back.',
            mistakeDesc: 'Collapsing onto the floor abruptly while holding your breath.',
          },
        },
        personalizedHeight: `With ${userHeight} ${heightUnit}, your longer physical lever increases gravity torque on the core. Pull your elbows slightly toward your toes isometrically to amplify abdominal tension.`,
        personalizedWeight: `At ${userWeight} ${weightUnit}, 30 to 45 seconds of clean, uncompromised tension is vastly superior to 2 minutes with a sagging lower back.`,
        dos: [
          'Keep elbows directly stacked under shoulders',
          'Actively squeeze your glutes and quad muscles',
          'Breathe rhythmically into your belly—never hold breath',
        ],
        donts: [
          'Do NOT allow your hips to sink toward the mat',
          'Do NOT push your hips high into a mountain / tent shape',
          'Do NOT tuck your chin tightly against your chest',
        ],
      };

    default:
      return {
        primaryMuscle: targetMuscle || 'Core & Kinetic Chain',
        angleTarget: 'Natural Anatomical Range of Motion',
        tempo: 'Controlled tempo with steady breathing',
        injuryRisk: 'Using momentum or jerky swinging shifts load off muscles onto vulnerable connective tissue.',
        phases: {
          setup: {
            correctDesc: 'Establish a stable, grounded base with a neutral spine and relaxed shoulders.',
            mistakeDesc: 'Starting with uneven weight balance or hyperextended joints.',
          },
          action: {
            correctDesc: 'Perform the movement through a comfortable, controlled full range of motion. Inhale on eccentric lengthening.',
            mistakeDesc: 'Rushing through reps with jerky momentum or holding breath.',
          },
          return: {
            correctDesc: 'Exhale during concentric exertion, squeezing the working muscle before resetting smoothly.',
            mistakeDesc: 'Letting gravity drop the limbs back without control.',
          },
        },
        personalizedHeight: `Calibrated for ${userHeight} ${heightUnit}: Maintain tall posture and softly unlocked joints.`,
        personalizedWeight: `Calibrated for ${userWeight} ${weightUnit}: Smooth tension matching ${fitnessGoal}.`,
        dos: [
          'Maintain a smooth, continuous tempo',
          'Breathe rhythmically throughout each set',
        ],
        donts: [
          'Do NOT use momentum or swing weights/limbs',
          'Do NOT push through sharp joint pain',
        ],
      };
  }
}
