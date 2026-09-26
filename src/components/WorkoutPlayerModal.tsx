import React, { useState, useEffect } from 'react';
import { DailyRoutine, Exercise } from '../types';
import { useApp } from '../context/AppContext';
import { ExerciseIllustration } from './ExerciseIllustration';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle,
  X,
  Volume2,
  VolumeX,
  Clock,
  Image as ImageIcon
} from 'lucide-react';

interface Props {
  routine: DailyRoutine;
  dayIndex: number;
  onClose: () => void;
  onComplete: (dayIndex: number) => void;
}

export const WorkoutPlayerModal: React.FC<Props> = ({
  routine,
  dayIndex,
  onClose,
  onComplete,
}) => {
  const { user } = useApp();
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState<number>(0);
  const [mode, setMode] = useState<'exercise' | 'rest'>('exercise');
  const [timerSeconds, setTimerSeconds] = useState<number>(45);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showIllustration, setShowIllustration] = useState<boolean>(false);

  const exercise: Exercise | undefined = routine.exercises[currentExerciseIdx];
  const isLastExercise = currentExerciseIdx >= routine.exercises.length - 1;

  const playBeep = (freq = 600, duration = 0.15) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext muted/unsupported
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            playBeep(880, 0.3);
            if (mode === 'exercise') {
              setMode('rest');
              return 30;
            } else {
              setMode('exercise');
              return 45;
            }
          }
          if (prev <= 4) {
            playBeep(440, 0.08);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds, mode]);

  const handleNextExercise = () => {
    if (isLastExercise) {
      onComplete(dayIndex);
      onClose();
    } else {
      setCurrentExerciseIdx((prev) => prev + 1);
      setMode('exercise');
      setTimerSeconds(45);
      setIsRunning(true);
      setShowIllustration(false);
      playBeep(700, 0.2);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-[#fdfbf7] rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-[#e2d8c9] my-6">
        {/* Header */}
        <div className="bg-[#ab7a52] text-white p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-100">
              {routine.day} Session • Personalized for {user.weight || 50} {user.weightUnit || 'kg'}
            </span>
            <h3 className="text-lg font-bold font-['Outfit',sans-serif]">
              {routine.routineTitle}
            </h3>
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1 rounded-full hover:bg-black/10 text-amber-100"
              title="Toggle audio beep"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-black/10 text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#eee4d6] h-1.5">
          <div
            className="bg-[#cf784d] h-1.5 transition-all duration-300"
            style={{
              width: `${((currentExerciseIdx + 1) / routine.exercises.length) * 100}%`,
            }}
          />
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#7d6c60] font-medium">
            <span>
              Movement {currentExerciseIdx + 1} of {routine.exercises.length}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowIllustration(!showIllustration)}
                className="px-2 py-0.5 rounded text-[11px] font-semibold text-[#8d522e] bg-[#f5ebe1] border border-[#e4d3c3] hover:bg-[#ebdfd3] flex items-center space-x-1 transition"
              >
                <ImageIcon className="w-3 h-3 text-[#cf784d]" />
                <span>{showIllustration ? 'Hide Picture' : 'Form Picture'}</span>
              </button>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  mode === 'exercise'
                    ? 'bg-[#f5ebe1] text-[#965732]'
                    : 'bg-[#edf4ec] text-[#3e753e]'
                }`}
              >
                {mode === 'exercise' ? 'ACTIVE' : 'REST'}
              </span>
            </div>
          </div>

          {exercise && (
            <div className="text-center space-y-3">
              <h2 className="text-xl font-bold text-[#4e3e34]">
                {exercise.name}
              </h2>

              <p className="text-xs text-[#7d6c60]">
                {exercise.sets} Sets × {exercise.reps} • Target: {exercise.targetMuscle}
              </p>

              {/* Optional Reference Picture View inside Modal */}
              {showIllustration ? (
                <div className="text-left animate-in fade-in">
                  <ExerciseIllustration
                    exerciseName={exercise.name}
                    targetMuscle={exercise.targetMuscle}
                    userWeight={user.weight || 50}
                    weightUnit={user.weightUnit || 'kg'}
                    userHeight={user.height || 172}
                    heightUnit={user.heightUnit || 'cm'}
                    fitnessGoal={user.fitnessGoal}
                  />
                </div>
              ) : (
                /* Timer */
                <div className="py-2 flex justify-center">
                  <div
                    className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border-2 transition-colors ${
                      mode === 'exercise'
                        ? 'border-[#cf784d] bg-[#f8efe7] text-[#8d522e]'
                        : 'border-[#4e824e] bg-[#eef5ee] text-[#2e5e2e]'
                    }`}
                  >
                    <span className="text-3xl font-bold font-mono tracking-tight">
                      {Math.floor(timerSeconds / 60)}:
                      {(timerSeconds % 60).toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-[#8d7c70] mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {mode === 'exercise' ? 'Work' : 'Rest'}
                    </span>
                  </div>
                </div>
              )}

              <div className="bg-[#f6f2ea] p-3 rounded-xl text-left border border-[#e5dcce] text-xs text-[#635348] leading-relaxed">
                <p><strong>Instructions:</strong> {exercise.instructions}</p>
                {exercise.formTip && (
                  <p className="text-[#965732] font-semibold mt-1">💡 {exercise.formTip}</p>
                )}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center space-x-3 pt-1">
            <button
              onClick={() => {
                setTimerSeconds(mode === 'exercise' ? 45 : 30);
                setIsRunning(false);
              }}
              className="p-2.5 rounded-full bg-[#f6f2ea] hover:bg-[#ece4d6] text-[#6d5d51]"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className="px-5 py-2.5 rounded-xl bg-[#cf784d] hover:bg-[#c26d43] text-white font-medium text-xs flex items-center space-x-1.5 shadow-xs"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Resume</span>
                </>
              )}
            </button>

            <button
              onClick={handleNextExercise}
              className="p-2.5 rounded-full bg-[#f6f2ea] hover:bg-[#ece4d6] text-[#6d5d51]"
              title="Next Exercise"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#f8f4ec] px-5 py-2.5 border-t border-[#e8ded0] flex items-center justify-between text-xs">
          <button onClick={onClose} className="text-[#8d7c70] hover:text-[#4e3e34]">
            Close
          </button>
          <button
            onClick={() => {
              onComplete(dayIndex);
              onClose();
            }}
            className="text-[#965732] hover:text-[#784221] font-semibold flex items-center space-x-1"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Finish Routine</span>
          </button>
        </div>
      </div>
    </div>
  );
};
