import { Globe, Skull } from 'lucide-react';

interface HeaderProps {
  isRumorMode: boolean;
  setIsRumorMode: (mode: boolean) => void;
}

export function Header({ isRumorMode, setIsRumorMode }: HeaderProps) {
  return (
    <header className="flex justify-between items-center mb-12 border-b border-gray-500/30 pb-6">
      <div className="flex items-center gap-3">
        {isRumorMode ? <Skull className="w-8 h-8 text-accent" /> : <Globe className="w-8 h-8 text-accent" />}
        <h1 className="text-3xl font-black tracking-tighter">
          日本から世界の行く末を観るんです。
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-sm font-bold ${!isRumorMode ? 'text-accent' : 'text-textSecondary'}`}>世界情勢</span>
        <button
          onClick={() => setIsRumorMode(!isRumorMode)}
          className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${isRumorMode ? 'bg-accent' : 'bg-slate-300'}`}
        >
          <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${isRumorMode ? 'translate-x-7' : ''}`}></div>
        </button>
        <span className={`text-sm font-bold ${isRumorMode ? 'text-accent' : 'text-textSecondary'}`}>都市伝説</span>
      </div>
    </header>
  );
}