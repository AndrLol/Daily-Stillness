import { useState, useEffect } from 'react';

type JournalEntry = {
  date: string;
  items: string[];
};

const getTodayKey = () => new Date().toISOString().split('T')[0];

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    weekday: 'short',
  });
};

export default function GratitudeJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentItems, setCurrentItems] = useState(['', '', '']);
  const [showHistory, setShowHistory] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('gratitude-entries');
    if (stored) {
      const parsed: JournalEntry[] = JSON.parse(stored);
      setEntries(parsed);
      const todayEntry = parsed.find(e => e.date === getTodayKey());
      if (todayEntry) {
        setCurrentItems(todayEntry.items);
        setSaved(true);
      }
    }
  }, []);

  const saveEntry = () => {
    const today = getTodayKey();
    const filteredItems = currentItems.filter(item => item.trim() !== '');
    if (filteredItems.length === 0) return;

    const newEntries = entries.filter(e => e.date !== today);
    newEntries.push({ date: today, items: currentItems });
    newEntries.sort((a, b) => b.date.localeCompare(a.date));

    setEntries(newEntries);
    localStorage.setItem('gratitude-entries', JSON.stringify(newEntries));
    setSaved(true);
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...currentItems];
    newItems[index] = value;
    setCurrentItems(newItems);
    setSaved(false);
  };

  const placeholders = [
    'За что я благодарен(а) сегодня...',
    'Что принесло мне радость...',
    'Что хорошего я заметил(а)...',
  ];

  return (
    <div className="flex flex-col items-center min-h-[70vh] px-4 py-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-light text-stone-700 mb-2">Дневник благодарности</h2>
      <p className="text-stone-400 text-sm mb-8 text-center">
        Три вещи, за которые ты благодарен(а) сегодня
      </p>

      {/* Input fields */}
      <div className="w-full space-y-4 mb-8">
        {currentItems.map((item, idx) => (
          <div key={idx} className="relative">
            <span className="absolute left-4 top-4 text-amber-400 text-lg">✦</span>
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(idx, e.target.value)}
              placeholder={placeholders[idx]}
              className="w-full pl-10 pr-4 py-4 bg-amber-50/50 border border-amber-100 rounded-2xl text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-transparent transition-all"
            />
          </div>
        ))}
      </div>

      {/* Save button */}
      <button
        onClick={saveEntry}
        disabled={saved || currentItems.every(i => !i.trim())}
        className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
          saved
            ? 'bg-green-100 text-green-600 cursor-default'
            : 'bg-amber-400 text-white hover:bg-amber-500 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'
        }`}
      >
        {saved ? '✓ Сохранено' : 'Сохранить'}
      </button>

      {/* History toggle */}
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="mt-6 text-stone-400 text-sm hover:text-stone-600 transition-colors"
      >
        {showHistory ? 'Скрыть записи' : `Прошлые записи (${entries.length})`}
      </button>

      {/* History */}
      {showHistory && (
        <div className="w-full mt-6 space-y-4">
          {entries.length === 0 ? (
            <p className="text-center text-stone-400 text-sm py-8">
              Пока нет записей. Начни свой путь благодарности ✨
            </p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.date}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-stone-100"
              >
                <p className="text-xs text-stone-400 mb-3 font-medium uppercase tracking-wider">
                  {formatDate(entry.date)}
                </p>
                <ul className="space-y-2">
                  {entry.items.filter(i => i.trim()).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-stone-600 text-sm">
                      <span className="text-amber-400 mt-0.5">✦</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
