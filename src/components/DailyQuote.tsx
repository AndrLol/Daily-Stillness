import { useState, useEffect } from 'react';

const quotes = [
  { text: 'Тишина — это не пустота. Это присутствие всего.', author: 'Лао-цзы' },
  { text: 'Счастье — это не станция, на которую вы прибываете, а способ путешествия.', author: 'Маргарет Ли Ранбек' },
  { text: 'Каждое утро — это новое начало. Каждый вдох — это новый шанс.', author: '' },
  { text: 'Не торопись. Всё приходит в своё время.', author: 'Руми' },
  { text: 'Мир — это не то, что снаружи. Мир — это то, что внутри.', author: '' },
  { text: 'Будь как океан. Пусть все камни падают в тебя, но ты оставайся спокойным.', author: 'Руми' },
  { text: 'Самое важное путешествие — это путешествие внутрь себя.', author: 'Рильке' },
  { text: 'В каждом моменте есть всё, что тебе нужно.', author: '' },
  { text: 'Дыши. Ты именно там, где должен быть.', author: '' },
  { text: 'Простота — это высшая форма утончённости.', author: 'Леонардо да Винчи' },
  { text: 'Отпусти то, что не можешь контролировать. Примирись с тем, что есть.', author: '' },
  { text: 'Живи настоящим моментом. Прошлое ушло, будущее ещё не наступило.', author: 'Тхить Нят Хань' },
  { text: 'Ты не обязан быть продуктивным. Ты имеешь право просто быть.', author: '' },
  { text: 'Спокойствие ума — это величайшее богатство.', author: '' },
  { text: 'Пусть этот день будет мягким к тебе.', author: '' },
  { text: 'Свет внутри тебя ярче, чем любая тьма снаружи.', author: '' },
  { text: 'Позволь себе отдохнуть. Мир подождёт.', author: '' },
  { text: 'Благодарность превращает то, что у нас есть, в достаточность.', author: '' },
  { text: 'Иногда самый продуктивный день — это день, когда ты просто отдыхаешь.', author: '' },
  { text: 'Ты достаточно. Ты всегда был(а) достаточно.', author: '' },
];

export default function DailyQuote() {
  const [quote, setQuote] = useState({ text: '', author: '' });

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    setQuote(quotes[dayOfYear % quotes.length]);
  }, []);

  const nextQuote = () => {
    const randomIdx = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIdx]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <h2 className="text-2xl font-light text-stone-700 mb-2">Цитата дня</h2>
      <p className="text-stone-400 text-sm mb-12">Вдохновение для твоего дня</p>

      <div className="max-w-md text-center">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-10 border border-stone-100 shadow-sm">
          <span className="text-4xl text-stone-200 block mb-4">❝</span>
          <p className="text-xl font-light text-stone-700 leading-relaxed mb-6">
            {quote.text}
          </p>
          {quote.author && (
            <p className="text-sm text-stone-400 italic">— {quote.author}</p>
          )}
        </div>
      </div>

      <button
        onClick={nextQuote}
        className="mt-8 px-6 py-3 rounded-full text-sm bg-stone-100 text-stone-600 hover:bg-stone-200 transition-all duration-300 hover:shadow-md"
      >
        Другая цитата ✨
      </button>

      <p className="mt-12 text-stone-300 text-xs">
        Новая цитата каждый день
      </p>
    </div>
  );
}
