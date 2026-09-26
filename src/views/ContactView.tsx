import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mail,
  Send,
  CheckCircle,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { user, showToast } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [subject, setSubject] = useState('Workout Plan Question');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      showToast('Please type your inquiry or message.');
      return;
    }
    setSubmitted(true);
    showToast('📨 Message sent! Our team will get back to you shortly.');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4 sm:py-6 pb-12">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#8d522e] font-['Outfit',sans-serif]">
          Contact Us
        </h1>
        <p className="text-xs sm:text-sm text-[#7d6c60] max-w-md mx-auto">
          Have questions about your AI workout plan or feedback on dietary references?
          We'd love to hear from you.
        </p>
      </div>

      <div className="bg-[#fdfbf7] rounded-2xl p-6 sm:p-8 border border-[#e2d8c9] shadow-xs">
        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#edf4ec] text-[#3e753e] flex items-center justify-center mx-auto">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#4e3e34]">Message Received</h3>
            <p className="text-xs text-[#7d6c60] max-w-xs mx-auto">
              Thank you for reaching out. We will get back to your inquiry promptly.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setMessage('');
              }}
              className="mt-2 px-4 py-2 bg-[#f4efe6] hover:bg-[#ebe4d7] text-[#6d5d51] text-xs font-semibold rounded-lg"
            >
              Send Another Note
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#5c4d43] mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#f6f2ea] border border-[#dcd1c2] rounded-xl text-xs sm:text-sm text-[#3e342d] focus:bg-white focus:ring-1 focus:ring-[#cf784d] focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5c4d43] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#f6f2ea] border border-[#dcd1c2] rounded-xl text-xs sm:text-sm text-[#3e342d] focus:bg-white focus:ring-1 focus:ring-[#cf784d] focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5c4d43] mb-1.5">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#f6f2ea] border border-[#dcd1c2] rounded-xl text-xs sm:text-sm text-[#3e342d] focus:bg-white focus:ring-1 focus:ring-[#cf784d] focus:outline-none transition"
              >
                <option value="Workout Plan Question">Workout Plan Question</option>
                <option value="Dietary Reference Suggestion">Dietary Reference Suggestion</option>
                <option value="Community & Feedback">Community & Feedback</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5c4d43] mb-1.5">
                Message
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help your fitness journey?"
                className="w-full px-3.5 py-2.5 bg-[#f6f2ea] border border-[#dcd1c2] rounded-xl text-xs sm:text-sm text-[#3e342d] focus:bg-white focus:ring-1 focus:ring-[#cf784d] focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#d48c66] hover:bg-[#c67e58] text-white font-medium text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
