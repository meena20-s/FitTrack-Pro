import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { WorkoutsView } from './views/WorkoutsView';
import { DietaryRefsView } from './views/DietaryRefsView';
import { CommunityView } from './views/CommunityView';
import { ProfileView } from './views/ProfileView';
import { StatementsView } from './views/StatementsView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { LoginModal } from './views/LoginModal';
import { WorkoutPlayerModal } from './components/WorkoutPlayerModal';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    activePage,
    activeWorkoutForPlayer,
    setActiveWorkoutForPlayer,
    markDayComplete,
    activeDayIndex,
    toastMessage,
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#faf6f0] text-stone-800">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activePage === 'home' && <HomeView />}
        {activePage === 'workouts' && <WorkoutsView />}
        {activePage === 'dietary-refs' && <DietaryRefsView />}
        {activePage === 'community' && <CommunityView />}
        {activePage === 'profile' && <ProfileView />}
        {activePage === 'statements' && <StatementsView />}
        {activePage === 'about' && <AboutView />}
        {activePage === 'contact' && <ContactView />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Workout Player Modal */}
      {activeWorkoutForPlayer && (
        <WorkoutPlayerModal
          routine={activeWorkoutForPlayer}
          dayIndex={activeDayIndex}
          onClose={() => setActiveWorkoutForPlayer(null)}
          onComplete={(dayIdx) => {
            markDayComplete(dayIdx);
            setActiveWorkoutForPlayer(null);
          }}
        />
      )}

      {/* Login / Auth Modal */}
      <LoginModal />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3">
          <div className="bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 border border-stone-700">
            <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
