import { useState, useEffect, useRef } from 'react';

type BreathingTechnique = {
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  holdAfter: number;
  description: string;
};

const techniques: BreathingTechnique[] = [
  { name: '4-7-8', inhale: 4, hold: 7, exhale: 8, holdAfter: 0, description: 'Расслабление и сон' },
  { name: 'Бокс', inhale: 4, hold: 4, exhale: 4, holdAfter: 4, description: 'Баланс и фокус' },
  { name: 'Спокойствие', inhale: 4, hold: 2, exhale: 6, holdAfter: 0, description: 'Снятие тревоги' },
];

type Phase = 'inhale' | 'hold' | 'exhale' | 'holdAfter' | 'idle';

export default function BreathingExercise() {
  const [techniqueIdx, setTechniqueIdx] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const technique = techniques[techniqueIdx];

  useEffect(() => {
    if (!isActive) return;

    const phases: { phase: Phase; duration: number }[] = [
      { phase: 'inhale', duration: technique.inhale },
      { phase: 'hold', duration: technique.hold },
      { phase: 'exhale', duration: technique.exhale },
    ];
    if (technique.holdAfter > 0) {
      phases.push({ phase: 'holdAfter', duration: technique.holdAfter });
    }

    let currentPhaseIdx = 0;
    let time = phases[0].duration;
    setPhase(phases[0].phase);
    setTimeLeft(time);

    intervalRef.current = setInterval(() => {
      time -= 1;
      if (time <= 0) {
        currentPhaseIdx += 1;
        if (currentPhaseIdx >= phases.length) {
          currentPhaseIdx = 0;
          setCycles(c => c + 1);
        }
        setPhase(phases[currentPhaseIdx].phase);
        time = phases[currentPhaseIdx].duration;
      }
      setTimeLeft(time);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, techniqueIdx]);

  const toggleActive = () => {
    if (isActive) {
      setIsActive(false);
      setPhase('idle');
      setTimeLeft(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setCycles(0);
      setIsActive(true);
    }
  };

  const getPhaseLabel = () => {
    switch (phase) {
      case 'inhale': return 'Вдох';
      case 'hold': return 'Задержка';
      case 'exhale': return 'Выдох';
      case 'holdAfter': return 'Пауза';
      default: return 'Готов';
    }
  };

  const getCircleScale = () => {
    if (!isActive) return 'scale-75';
    switch (phase) {
      case 'inhale': return 'scale-100';
      case 'hold': return 'scale-100';
      case 'exhale': return 'scale-75';
      case 'holdAfter': return 'scale-75';
      default: return 'scale-75';
    }
  };

  const getTransitionDuration = () => {
    if (!isActive) return 'duration-500';
    switch (phase) {
      case 'inhale': return `duration-[${technique.inhale * 1000}ms]`;
      case 'exhale': return `duration-[${technique.exhale * 1000}ms]`;
      default: return 'duration-500';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <h2 className="text-2xl font-light text-stone-700 mb-2">Дыхательные практики</h2>
      <p className="text-stone-400 text-sm mb-8">Найди свой ритм спокойствия</p>

      {/* Technique selector */}
      <div className="flex gap-3 mb-12 flex-wrap justify-center">
        {techniques.map((t, idx) => (
          <button
            key={t.name}
            onClick={() => { setTechniqueIdx(idx); setIsActive(false); setPhase('idle'); }}
            className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
              techniqueIdx === idx
                ? 'bg-stone-700 text-white shadow-lg'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span className="font-medium">{t.name}</span>
            <span className="block text-xs opacity-70">{t.description}</span>
          </button>
        ))}
      </div>

      {/* Breathing circle */}
      <div className="relative flex items-center justify-center mb-12">
        <div
          className={`w-48 h-48 rounded-full bg-gradient-to-br from-teal-200 to-emerald-300 opacity-30 absolute transition-transform ease-in-out ${getCircleScale()} ${getTransitionDuration()}`}
          style={{ transitionDuration: isActive ? `${
            phase === 'inhale' ? technique.inhale : phase === 'exhale' ? technique.exhale : 0.5
          }s` : '0.5s' }}
        />
        <div
          className={`w-36 h-36 rounded-full bg-gradient-to-br from-teal-300 to-emerald-400 opacity-50 absolute transition-transform ease-in-out ${getCircleScale()}`}
          style={{ transitionDuration: isActive ? `${
            phase === 'inhale' ? technique.inhale : phase === 'exhale' ? technique.exhale : 0.5
          }s` : '0.5s' }}
        />
        <div
          className={`w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center transition-transform ease-in-out ${getCircleScale()}`}
          style={{ transitionDuration: isActive ? `${
            phase === 'inhale' ? technique.inhale : phase === 'exhale' ? technique.exhale : 0.5
          }s` : '0.5s' }}
        >
          <span className="text-white text-lg font-light">
            {isActive ? timeLeft : '○'}
          </span>
        </div>
      </div>

      {/* Phase label */}
      <p className="text-xl font-light text-stone-600 mb-8 h-8">
        {getPhaseLabel()}
      </p>

      {/* Start/Stop button */}
      <button
        onClick={toggleActive}
        className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
          isActive
            ? 'bg-red-100 text-red-600 hover:bg-red-200'
            : 'bg-teal-500 text-white hover:bg-teal-600 shadow-lg hover:shadow-xl'
        }`}
      >
        {isActive ? 'Остановить' : 'Начать'}
      </button>

      {/* Cycles counter */}
      {cycles > 0 && (
        <p className="mt-6 text-stone-400 text-sm">
          Циклов завершено: {cycles}
        </p>
      )}
    </div>
  );
}
