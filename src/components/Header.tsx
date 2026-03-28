import { Globe, Skull, Globe2, MapPin, Search, X } from 'lucide-react';

interface HeaderProps {
  isRumorMode: boolean;
  setIsRumorMode: (mode: boolean) => void;
  isJapanMode: boolean;
  setIsJapanMode: (mode: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function Header({ isRumorMode, setIsRumorMode, isJapanMode, setIsJapanMode, searchQuery, setSearchQuery }: HeaderProps) {
  return (
    <header className="flex flex-col mb-8 border-b border-gray-500/30 pb-6 gap-6">

      {/* 1段目：タイトルロゴ */}
      <div className="flex items-center justify-center sm:justify-start gap-3">
        {isRumorMode ? <Skull className="w-8 h-8 text-accent" /> : <Globe className="w-8 h-8 text-accent" />}
        <h1 className="text-3xl font-black tracking-tighter">
          日本から世界の情勢を観る
        </h1>
      </div>

      {/* 2段目：左トグル・中央検索・右トグル */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 w-full">

        {/* 左端：世界 ⇄ 日本 トグル */}
        <div className="flex items-center gap-2 bg-bgPrimary p-1 rounded-full border border-gray-500/30 shrink-0 shadow-sm">
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

        {/* 中央：検索バー */}
        <div className="relative w-full max-w-xl mx-auto flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-textSecondary" />
          </div>
          <input
            type="text"
            placeholder="キーワードで世界の裏側を検索... (例: AI, 選挙)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-11 pr-12 py-2.5 rounded-full bg-bgSecondary border outline-none transition-all duration-300
              ${isRumorMode
                ? 'border-accent/50 focus:border-accent focus:shadow-[0_0_15px_var(--accent-glow)] text-textPrimary placeholder-textSecondary' 
                : 'border-slate-300 focus:border-accent text-textPrimary placeholder-slate-400 focus:ring-2 focus:ring-accent/20'
              }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-textSecondary hover:text-accent transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* 右端：表 ⇄ 裏 トグル */}
        <div className="flex items-center gap-3 shrink-0">
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