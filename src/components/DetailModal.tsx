import { Globe, Skull, Percent, Zap, History } from 'lucide-react';
import { Article } from '../types';

interface DetailModalProps {
  article: Article;
  isRumorMode: boolean;
  onClose: () => void;
}

export function DetailModal({ article, isRumorMode, onClose }: DetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className={`w-full max-w-2xl p-8 rounded-2xl bg-bgSecondary shadow-2xl overflow-y-auto max-h-[90vh] ${isRumorMode ? 'border border-accent' : ''}`}
        onClick={(e) => e.stopPropagation()} // モーダル内のクリックで閉じないようにする
      >
        <div className="flex justify-between items-start mb-6">
          <span className="text-xs font-bold text-accent bg-accentGlow px-3 py-1 rounded-full">{article.category_minor}</span>
          <div className="flex items-center gap-1 text-accent font-mono font-bold">
            <Percent className="w-4 h-4" /> Truth Score: {article.truth_score}%
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">{article.title_raw}</h2>

        <div className="mb-8">
          <h4 className="text-sm font-bold text-textSecondary mb-2 flex items-center gap-2">
            {isRumorMode ? <Skull className="w-4 h-4"/> : <Globe className="w-4 h-4"/>} 
            {isRumorMode ? "Whispered Rumors (裏)" : "Verified Facts (表)"}
          </h4>
          <p className="text-lg leading-relaxed bg-bgPrimary p-4 rounded-lg">
            {isRumorMode ? article.content_rumor : article.content_fact}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <h4 className="text-emerald-500 font-bold mb-2 flex items-center gap-2"><Zap className="w-4 h-4"/> 楽観シナリオ</h4>
            <p className="text-sm text-textSecondary">{article.scenario_opt}</p>
          </div>
          <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30">
            <h4 className="text-rose-500 font-bold mb-2 flex items-center gap-2"><Zap className="w-4 h-4"/> 悲観シナリオ</h4>
            <p className="text-sm text-textSecondary">{article.scenario_pess}</p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-bgPrimary border-l-4 border-accent">
          <h4 className="text-sm font-bold text-accent mb-2 flex items-center gap-2"><History className="w-4 h-4"/> 歴史の韻 (History Rhymes)</h4>
          <p className="text-sm text-textSecondary italic">{article.history_rhyme}</p>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors font-bold text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}