import { useState } from 'react';
import BreathingExercise from './components/BreathingExercise';
import GratitudeJournal from './components/GratitudeJournal';
import SoundMixer from './components/SoundMixer';
import DailyQuote from './components/DailyQuote';

type Tab = 'quote' | 'breathing' | 'journal' | 'sounds';

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'quote', label: 'Цитата', icon: '💫' },
  { id: 'breathing', label: 'Дыхание', icon: '🫁' },
  { id: 'journal', label: 'Дневник', icon: '📓' },
  { id: 'sounds', label: 'Звуки', icon: '🎵' },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return 'Доброй ночи';
  if (hour < 12) return 'Доброе утро';
  if (hour < 18) return 'Добрый день';
  return 'Добрый вечер';
}

function getDateString() {
  return new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
  });
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('quote');

  const renderContent = () => {
    switch (activeTab) {
      case 'quote': return <DailyQuote />;
      case 'breathing': return <BreathingExercise />;
      case 'journal': return <GratitudeJournal />;
      case 'sounds': return <SoundMixer />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-100/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-amber-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-100/30 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="pt-8 pb-4 px-6 text-center">
          <p className="text-stone-400 text-sm">{getDateString()}</p>
          <h1 className="text-3xl font-light text-stone-800 mt-1">
            {getGreeting()} <span className="inline-block animate-pulse">🌿</span>
          </h1>
        </header>

        {/* Content area */}
        <main className="flex-1 pb-24">
          {renderContent()}
        </main>

        {/* Bottom navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-stone-100 z-50">
          <div className="max-w-lg mx-auto flex justify-around items-center py-3 px-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-stone-100 text-stone-800 scale-105'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
