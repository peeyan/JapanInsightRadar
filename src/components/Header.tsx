import { Globe, Skull, Globe2, MapPin } from 'lucide-react';

interface HeaderProps {
  isRumorMode: boolean;
  setIsRumorMode: (mode: boolean) => void;
  isJapanMode: boolean;
  setIsJapanMode: (mode: boolean) => void;
}

export function Header({ isRumorMode, setIsRumorMode, isJapanMode, setIsJapanMode }: HeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center mb-12 border-b border-gray-500/30 pb-6 gap-6">
      <div className="flex items-center gap-3">
        {isRumorMode ? <Skull className="w-8 h-8 text-accent" /> : <Globe className="w-8 h-8 text-accent" />}
        <h1 className="text-3xl font-black tracking-tighter">
          日本から世界の情勢を観る
        </h1>
      </div>

      <div className="flex items-center gap-8">
        {/* 日本 ⇄ 世界 トグル */}
        <div className="flex items-center gap-2 bg-bgPrimary p-1 rounded-full border border-gray-500/30">
          <button
            onClick={() => setIsJapanMode(false)}
            className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${!isJapanMode ? 'bg-accent text-white shadow-md' : 'text-textSecondary hover:text-textPrimary'}`}
          >
            <Globe2 className="w-4 h-4" /> WORLD
          </button>
          <button
            onClick={() => setIsJapanMode(true)}
            className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${isJapanMode ? 'bg-rose-600 text-white shadow-md' : 'text-textSecondary hover:text-textPrimary'}`}
          >
            <MapPin className="w-4 h-4" /> JAPAN
          </button>
        </div>

        {/* 表 ⇄ 裏 トグル */}
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
      </div>
    </header>
  );
}