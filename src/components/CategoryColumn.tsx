import { ElementType } from 'react';
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
  return (
    <section>
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-l-4 border-accent pl-3">
        <Icon className="w-6 h-6 text-accent" /> {title}
      </h2>
      <div className="flex flex-col gap-5">
        {articles.length > 0 ? (
          articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isRumorMode={isRumorMode}
              onClick={onArticleClick}
            />
          ))
        ) : (
          <p className="text-sm text-textSecondary">No data</p>
        )}
      </div>
    </section>
  );
}