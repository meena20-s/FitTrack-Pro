import React from 'react';
import { useApp } from '../context/AppContext';
import { Dumbbell, Heart, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePage } = useApp();

  return (
    <footer className="bg-[#a87750] text-[#f7eee4] border-t border-[#966843] pt-10 pb-8 mt-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#966843]/60">
          {/* Brand */}
          <div className="flex items-center space-x-2.5">
            <Dumbbell className="w-6 h-6 text-orange-200" />
            <span className="text-xl font-bold text-white font-['Outfit',sans-serif]">
              FitTrack Pro
            </span>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-amber-50">
            <button
              onClick={() => {
                setActivePage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white transition"
            >
              Home
            </button>
            <button
              onClick={() => {
                setActivePage('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white transition"
            >
              About Us
            </button>
            <button
              onClick={() => {
                setActivePage('workouts');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white transition"
            >
              Workouts
            </button>
            <button
              onClick={() => {
                setActivePage('community');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white transition"
            >
              Community
            </button>
            <button
              onClick={() => {
                setActivePage('dietary-refs');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white transition"
            >
              Dietary Refs
            </button>
            <button
              onClick={() => {
                setActivePage('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-white transition"
            >
              Contact
            </button>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#eedbca] gap-3">
          <p>© 2025 FitTrack Pro. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-amber-200" /> Safe & Private
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-amber-200" /> Your Health First
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
