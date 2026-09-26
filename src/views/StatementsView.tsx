import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Plus,
  Flame,
  Clock,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Download,
  Filter,
  Dumbbell
} from 'lucide-react';

export const StatementsView: React.FC = () => {
  const { activityLogs, addManualActivity, user, showToast } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [routineTitle, setRoutineTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [caloriesBurned, setCaloriesBurned] = useState(220);
  const [dayName, setDayName] = useState('Today');
  const [notes, setNotes] = useState('');

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineTitle.trim()) {
      showToast('Please provide an activity name.');
      return;
    }

    addManualActivity({
      date: new Date().toISOString().split('T')[0],
      routineTitle: routineTitle.trim(),
      dayName,
      durationMinutes,
      caloriesBurned,
      status: 'Completed',
      notes: notes.trim() || 'Manual activity entry',
    });

    setIsModalOpen(false);
    setRoutineTitle('');
    setNotes('');
  };

  const totalCalories = activityLogs.reduce((acc, log) => acc + log.caloriesBurned, 0);
  const totalMinutes = activityLogs.reduce((acc, log) => acc + log.durationMinutes, 0);

  const exportStatementText = () => {
    const lines = [
      `FITTRACK PRO - FITNESS ACTIVITY MINI STATEMENT`,
      `User: ${user.name} (${user.email})`,
      `Generated On: ${new Date().toLocaleString()}`,
      `Total Sessions: ${activityLogs.length}`,
      `Total Calories Burned: ${totalCalories} kcal`,
      `Total Active Minutes: ${totalMinutes} mins`,
      `-------------------------------------------------------`,
      ...activityLogs.map(
        (log, idx) =>
          `[${idx + 1}] Date: ${log.date} | ${log.dayName} | ${log.routineTitle} | ${log.durationMinutes} min | ${log.caloriesBurned} kcal | ${log.status}`
      ),
      `-------------------------------------------------------`,
      `© FitTrack Pro | New Horizon College of Engineering`,
    ].join('\n');

    const blob = new Blob([lines], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FitTrack_MiniStatement_${user.name.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📥 Activity Mini Statement downloaded!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
            <FileText className="w-3.5 h-3.5" />
            <span>Activity Ledger & History</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight mt-1 font-['Outfit',sans-serif]">
            Mini Statements
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Detailed chronological record of your workouts, duration, and caloric output.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-[#c2572b] hover:bg-[#b04a20] text-white text-xs font-bold rounded-xl shadow transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Log Custom Workout</span>
          </button>

          <button
            onClick={exportStatementText}
            className="px-3.5 py-2.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-xl shadow-xs transition flex items-center space-x-1.5"
            title="Download Statement"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-600" />
            Total Expended
          </span>
          <p className="text-3xl font-extrabold text-stone-900 font-mono">
            {totalCalories} kcal
          </p>
          <span className="text-[11px] text-stone-500 font-medium">Cumulative energy burn</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Active Duration
          </span>
          <p className="text-3xl font-extrabold text-stone-900 font-mono">
            {totalMinutes} mins
          </p>
          <span className="text-[11px] text-stone-500 font-medium">Time under tension</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Recorded Sessions
          </span>
          <p className="text-3xl font-extrabold text-stone-900 font-mono">
            {activityLogs.length}
          </p>
          <span className="text-[11px] text-stone-500 font-medium">Completed microcycles</span>
        </div>
      </div>

      {/* Mini Statements Table (Architecture Section 3.4 & 4.2) */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200/90 overflow-hidden">
        <div className="bg-[#fdfaf7] px-6 py-4 border-b border-stone-200/80 flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900 font-['Outfit',sans-serif] flex items-center gap-2">
            <span>Recent Fitness Transactions (Last 5+)</span>
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            Account: {user.name}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50/80 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Activity / Routine</th>
                <th className="py-3 px-5">Day</th>
                <th className="py-3 px-5">Duration</th>
                <th className="py-3 px-5">Energy Burned</th>
                <th className="py-3 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {activityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-amber-50/40 transition">
                  <td className="py-3.5 px-5 font-mono text-stone-500">{log.date}</td>
                  <td className="py-3.5 px-5 font-bold text-stone-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center shrink-0">
                        <Dumbbell className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span>{log.routineTitle}</span>
                        {log.notes && (
                          <span className="block text-[10px] text-stone-400 font-normal">
                            {log.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-stone-600">{log.dayName}</td>
                  <td className="py-3.5 px-5 font-medium">{log.durationMinutes} mins</td>
                  <td className="py-3.5 px-5 font-mono font-bold text-orange-800">
                    {log.caloriesBurned} kcal
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Activity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-amber-200">
            <div className="bg-[#873e1c] text-white p-5 flex items-center justify-between">
              <h3 className="text-lg font-bold font-['Outfit',sans-serif]">
                Log Custom Workout Session
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Activity Name
                </label>
                <input
                  type="text"
                  required
                  value={routineTitle}
                  onChange={(e) => setRoutineTitle(e.target.value)}
                  placeholder="e.g. 5km Morning Run, Power Yoga, Badminton"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Calories Burned (kcal)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="2000"
                    value={caloriesBurned}
                    onChange={(e) => setCaloriesBurned(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Day Label
                </label>
                <select
                  value={dayName}
                  onChange={(e) => setDayName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                  <option value="Today">Today</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Notes / Workout Experience
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Felt high stamina, hydrated well"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c2572b] hover:bg-[#b04a20] text-white rounded-lg text-xs font-bold shadow"
                >
                  Add to Statement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
