import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  isRumorMode: boolean;
  onClick: (article: Article) => void;
}

export function ArticleCard({ article, isRumorMode, onClick }: ArticleCardProps) {
  return (
    <div
      onClick={() => onClick(article)}
      className={`p-5 rounded-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 bg-bgSecondary ${isRumorMode ? 'rumor-glow' : 'shadow-md hover:shadow-lg border border-slate-200'}`}
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-bold text-accent tracking-wider uppercase px-2 py-1 rounded bg-accentGlow">
          {article.category_minor}
        </span>
        <span className="text-xs text-textSecondary">
          {new Date(article.published_at).toLocaleDateString()}
        </span>
      </div>
      <h3 className="text-lg font-bold mb-3 leading-tight">{article.title_raw}</h3>
      <p className="text-sm text-textSecondary line-clamp-3 leading-relaxed">
        {isRumorMode ? article.content_rumor : article.content_fact}
      </p>
    </div>
  );
}