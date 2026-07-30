import { useState, useEffect } from 'react';import { Heart, Volume2, Loader2, Sparkles } from 'lucide-react';


export default function App() {
  const [catImage, setCatImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);


  // Ссылка на звук мяуканья. 
  // Вы можете заменить URL на свой локальный файл (например, '/meow.mp3'), когда скачаете его.
  const meowSound = new Audio('https://actions.google.com/sounds/v1/animals/cat_meow_2.ogg');


  // Получаем текущую дату в красивом формате
  const today = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });


  // Функция для загрузки фото котика
  const fetchCat = async () => {
    setIsLoading(true);
    try {
      // Здесь используется публичное API. Позже вы можете вставить свой эндпоинт.
      const response = await fetch('https://api.thecatapi.com/v1/images/search');
      const data = await response.json();
      setCatImage(data[0].url);
    } catch (error) {
      console.error("Ошибка при загрузке котика:", error);
      // Фолбек картинка на случай ошибки API
      setCatImage('https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg');
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchCat();
  }, []);


  const handleImageClick = () => {
    // Сбрасываем звук на начало, чтобы можно было кликать быстро
    meowSound.currentTime = 0;
    meowSound.play().catch(e => console.log("Браузер заблокировал автовоспроизведение, но по клику должно работать:", e));
  };


  const toggleLike = () => {
    setIsLiked(!isLiked);
    // Добавляем класс для микро-анимации пульсации
    setLikeAnimation(true);
    setTimeout(() => setLikeAnimation(false), 200);
  };


  return (
    <div className="min-h-screen bg-[#F9F9F8] flex flex-col items-center justify-center p-4 font-sans text-stone-800 selection:bg-rose-200">
      
      {/* Шапка сайта */}
      <header className="mb-10 text-center animate-fade-in-down">
        <h1 className="text-4xl md:text-5xl font-serif italic tracking-wide text-stone-900 flex items-center justify-center gap-2">
          U'r daily cat <Sparkles className="w-6 h-6 text-rose-300" />
        </h1>
        <p className="text-xs md:text-sm text-stone-400 mt-3 tracking-[0.2em] uppercase font-medium">
          Твоя порция милоты на сегодня
        </p>
      </header>


      {/* Главная карточка */}
      <main className="relative w-full max-w-sm bg-white p-4 pb-5 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-stone-100 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)]">
        
        {/* Контейнер с фотографией */}
        <div 
          className="relative group cursor-pointer overflow-hidden rounded-[1.5rem] aspect-[4/5] bg-stone-50 flex items-center justify-center"
          onClick={handleImageClick}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center text-stone-300">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <span className="text-sm font-medium tracking-wide">Ищем котика...</span>
            </div>
          ) : (
            <>
              <img 
                src={catImage} 
                alt="Daily Cat" 
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
              />
              {/* Оверлей при наведении с иконкой звука */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white/30 backdrop-blur-md p-4 rounded-full text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <Volume2 className="w-8 h-8 drop-shadow-md" />
                </div>
              </div>
            </>
          )}
        </div>


        {/* Панель действий (Лайк и дата) */}
        <div className="flex justify-between items-center mt-5 px-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleLike} 
              className={`p-2 -ml-2 rounded-full transition-all duration-300 ease-out flex items-center gap-2
                ${isLiked ? 'bg-rose-50' : 'hover:bg-stone-50'}
                ${likeAnimation ? 'scale-75' : 'scale-100'}
              `}
              aria-label="Лайкнуть"
            >
              <Heart 
                className={`w-7 h-7 transition-colors duration-300 ${
                  isLiked ? 'fill-rose-400 text-rose-400' : 'text-stone-300 hover:text-rose-300'
                }`} 
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${isLiked ? 'text-rose-400' : 'text-stone-400'}`}>
              {isLiked ? 'Обожаю' : 'Нравится?'}
            </span>
          </div>
          
          <span className="text-xs font-medium text-stone-400 tracking-wide">
            {today}
          </span>
        </div>
      </main>


      {/* Подвал с подсказкой */}
      <footer className="mt-12 text-center opacity-60">
        <p className="text-sm text-stone-500 font-medium tracking-wide">
          Нажми на фото, чтобы сделать <span className="italic">«мяу»</span>
        </p>
      </footer>


      {/* Стили для кастомных анимаций (используются в Tailwind) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out forwards;
        }
      `}} />
    </div>
  );
}
