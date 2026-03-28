import { ElementType, useState } from 'react';
import { Article } from '../types';
import { ArticleCard } from './ArticleCard';

interface CategoryColumnProps {
  title: string;
  Icon: ElementType;
  articles: Article[];
  isRumorMode: boolean;
  onArticleClick: (article: Article) => void;
}

export function CategoryColumn({ title, Icon, articles, isRumorMode, onArticleClick }: CategoryColumnProps) {
  // ✨ 表示する記事の件数を管理（最初は5件）
  const [visibleCount, setVisibleCount] = useState(5);

  // 表示用の配列を切り出し
  const visibleArticles = articles.slice(0, visibleCount);

  // もっと見るボタンの処理
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5); // 5件ずつ追加表示
  };

  return (
    <section className="flex flex-col h-full">
      {/* ヘッダー部分（件数バッジを追加） */}
      <div className="flex justify-between items-end mb-6 border-b border-gray-500/30 pb-2">
        <h2 className="text-xl font-bold flex items-center gap-2 border-l-4 border-accent pl-3">
          <Icon className="w-6 h-6 text-accent" /> {title}
        </h2>
        <span className="text-xs font-mono font-bold text-textSecondary bg-bgPrimary px-2 py-1 rounded-md border border-gray-500/30">
          全 {articles.length} 記事
        </span>
      </div>

      {/* 記事リスト */}
      <div className="flex flex-col gap-5">
        {visibleArticles.length > 0 ? (
          visibleArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isRumorMode={isRumorMode}
              onClick={onArticleClick}
            />
          ))
        ) : (
          <p className="text-sm text-textSecondary text-center py-8">No data</p>
        )}
      </div>

      {/* ✨ もっと見るボタン（未表示の記事がある場合のみ表示） */}
      {visibleCount < articles.length && (
        <button
          onClick={handleLoadMore}
          className={`mt-6 w-full py-3 rounded-lg font-bold text-sm tracking-widest transition-all duration-300 border-2 
            ${isRumorMode
              ? 'border-accent text-accent hover:bg-accent hover:text-white shadow-[0_0_10px_var(--accent-glow)]' 
              : 'border-slate-300 text-slate-500 hover:border-accent hover:text-accent'}`}
        >
          MORE DECRYPT (もっと見る)
        </button>
      )}
    </section>
  );
}