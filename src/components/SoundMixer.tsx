import { useState, useRef, useEffect, useCallback } from 'react';

type Sound = {
  id: string;
  name: string;
  icon: string;
  color: string;
  generate: (ctx: AudioContext, gainNode: GainNode) => AudioNode[];
};

function createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const buffer = ctx.createBuffer(2, length, sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }
  return buffer;
}

const sounds: Sound[] = [
  {
    id: 'rain',
    name: 'Дождь',
    icon: '🌧️',
    color: 'from-blue-300 to-indigo-400',
    generate: (ctx, gainNode) => {
      const buffer = createNoiseBuffer(ctx, 4);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 3000;
      filter.Q.value = 0.5;
      source.connect(filter);
      filter.connect(gainNode);
      source.start();
      return [source as unknown as AudioNode];
    },
  },
  {
    id: 'ocean',
    name: 'Океан',
    icon: '🌊',
    color: 'from-cyan-300 to-blue-400',
    generate: (ctx, gainNode) => {
      const buffer = createNoiseBuffer(ctx, 6);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 500;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.1;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 300;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      source.connect(filter);
      filter.connect(gainNode);
      source.start();
      return [source as unknown as AudioNode, lfo as unknown as AudioNode];
    },
  },
  {
    id: 'forest',
    name: 'Лес',
    icon: '🌲',
    color: 'from-green-300 to-emerald-400',
    generate: (ctx, gainNode) => {
      const buffer = createNoiseBuffer(ctx, 5);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 4000;
      const filter2 = ctx.createBiquadFilter();
      filter2.type = 'lowpass';
      filter2.frequency.value = 8000;
      source.connect(filter);
      filter.connect(filter2);
      filter2.connect(gainNode);
      source.start();
      return [source as unknown as AudioNode];
    },
  },
  {
    id: 'fire',
    name: 'Костёр',
    icon: '🔥',
    color: 'from-orange-300 to-red-400',
    generate: (ctx, gainNode) => {
      const buffer = createNoiseBuffer(ctx, 3);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 800;
      filter.Q.value = 1;
      const crackle = ctx.createOscillator();
      crackle.frequency.value = 0.5;
      const crackleGain = ctx.createGain();
      crackleGain.gain.value = 0.3;
      crackle.connect(crackleGain);
      crackleGain.connect(gainNode.gain);
      crackle.start();
      source.connect(filter);
      filter.connect(gainNode);
      source.start();
      return [source as unknown as AudioNode, crackle as unknown as AudioNode];
    },
  },
  {
    id: 'wind',
    name: 'Ветер',
    icon: '💨',
    color: 'from-gray-300 to-slate-400',
    generate: (ctx, gainNode) => {
      const buffer = createNoiseBuffer(ctx, 5);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 600;
      filter.Q.value = 2;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.05;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 400;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      source.connect(filter);
      filter.connect(gainNode);
      source.start();
      return [source as unknown as AudioNode, lfo as unknown as AudioNode];
    },
  },
  {
    id: 'night',
    name: 'Ночь',
    icon: '🌙',
    color: 'from-purple-300 to-indigo-400',
    generate: (ctx, gainNode) => {
      const buffer = createNoiseBuffer(ctx, 4);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1000;
      // cricket-like chirps
      const cricket = ctx.createOscillator();
      cricket.frequency.value = 4200;
      cricket.type = 'sine';
      const cricketGain = ctx.createGain();
      cricketGain.gain.value = 0;
      const cricketLfo = ctx.createOscillator();
      cricketLfo.frequency.value = 8;
      const cricketLfoGain = ctx.createGain();
      cricketLfoGain.gain.value = 0.02;
      cricketLfo.connect(cricketLfoGain);
      cricketLfoGain.connect(cricketGain.gain);
      cricketLfo.start();
      cricket.connect(cricketGain);
      cricketGain.connect(gainNode);
      cricket.start();
      source.connect(filter);
      filter.connect(gainNode);
      source.start();
      return [source as unknown as AudioNode, cricket as unknown as AudioNode, cricketLfo as unknown as AudioNode];
    },
  },
];

export default function SoundMixer() {
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [activeSounds, setActiveSounds] = useState<Record<string, boolean>>({});
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodesRef = useRef<Record<string, GainNode>>({});
  const sourcesRef = useRef<Record<string, AudioNode[]>>({});

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }, []);

  const toggleSound = (soundId: string) => {
    const ctx = getAudioContext();

    if (activeSounds[soundId]) {
      // Stop
      if (sourcesRef.current[soundId]) {
        sourcesRef.current[soundId].forEach(node => {
          try {
            (node as OscillatorNode | AudioBufferSourceNode).stop?.();
          } catch {}
        });
        delete sourcesRef.current[soundId];
      }
      if (gainNodesRef.current[soundId]) {
        gainNodesRef.current[soundId].disconnect();
        delete gainNodesRef.current[soundId];
      }
      setActiveSounds(prev => ({ ...prev, [soundId]: false }));
    } else {
      // Start
      const gainNode = ctx.createGain();
      gainNode.gain.value = volumes[soundId] || 0.5;
      gainNode.connect(ctx.destination);
      gainNodesRef.current[soundId] = gainNode;

      const sound = sounds.find(s => s.id === soundId)!;
      const nodes = sound.generate(ctx, gainNode);
      sourcesRef.current[soundId] = nodes;
      setActiveSounds(prev => ({ ...prev, [soundId]: true }));
    }
  };

  const updateVolume = (soundId: string, value: number) => {
    setVolumes(prev => ({ ...prev, [soundId]: value }));
    if (gainNodesRef.current[soundId]) {
      gainNodesRef.current[soundId].gain.value = value;
    }
  };

  const stopAll = () => {
    Object.keys(activeSounds).forEach(id => {
      if (activeSounds[id]) toggleSound(id);
    });
  };

  useEffect(() => {
    return () => {
      Object.values(sourcesRef.current).forEach(nodes => {
        nodes.forEach(node => {
          try { (node as OscillatorNode | AudioBufferSourceNode).stop?.(); } catch {}
        });
      });
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const activeCount = Object.values(activeSounds).filter(Boolean).length;

  return (
    <div className="flex flex-col items-center min-h-[70vh] px-4 py-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-light text-stone-700 mb-2">Звуки природы</h2>
      <p className="text-stone-400 text-sm mb-8 text-center">
        Создай свою атмосферу спокойствия
      </p>

      {/* Sound grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full mb-8">
        {sounds.map(sound => (
          <button
            key={sound.id}
            onClick={() => toggleSound(sound.id)}
            className={`relative p-6 rounded-2xl transition-all duration-300 ${
              activeSounds[sound.id]
                ? `bg-gradient-to-br ${sound.color} text-white shadow-lg scale-105`
                : 'bg-white/60 backdrop-blur-sm border border-stone-100 text-stone-600 hover:bg-white/80 hover:shadow-md'
            }`}
          >
            <span className="text-3xl block mb-2">{sound.icon}</span>
            <span className="text-sm font-medium">{sound.name}</span>
            {activeSounds[sound.id] && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Volume sliders for active sounds */}
      {activeCount > 0 && (
        <div className="w-full space-y-3 mb-6">
          {sounds.filter(s => activeSounds[s.id]).map(sound => (
            <div key={sound.id} className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-stone-100">
              <span className="text-lg">{sound.icon}</span>
              <span className="text-sm text-stone-600 w-16">{sound.name}</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volumes[sound.id] ?? 0.5}
                onChange={(e) => updateVolume(sound.id, parseFloat(e.target.value))}
                className="flex-1 h-1.5 bg-stone-200 rounded-full appearance-none cursor-pointer accent-stone-500"
              />
            </div>
          ))}
        </div>
      )}

      {/* Stop all */}
      {activeCount > 0 && (
        <button
          onClick={stopAll}
          className="px-6 py-2 rounded-full text-sm bg-stone-100 text-stone-600 hover:bg-stone-200 transition-all"
        >
          Остановить все
        </button>
      )}

      {activeCount === 0 && (
        <p className="text-stone-300 text-sm mt-4">
          Нажми на звук, чтобы начать ✨
        </p>
      )}
    </div>
  );
}
