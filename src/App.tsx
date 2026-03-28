import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Landmark, Cpu } from 'lucide-react';

import { Article } from './types';
import { Header } from './components/Header';
import { CategoryColumn } from './components/CategoryColumn';
import { DetailModal } from './components/DetailModal';

function App() {
  const [isRumorMode, setIsRumorMode] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // テーマ切り替え
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isRumorMode ? 'rumor' : 'fact');
  }, [isRumorMode]);

  // データ取得
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/articles');
        setArticles(response.data);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      }
    };
    fetchArticles();
  }, []);

  // カテゴリごとにデータをフィルタリング
  const economyArticles = articles.filter(a => a.category_major === 'Economy');
  const politicsArticles = articles.filter(a => a.category_major === 'Politics');
  const techArticles = articles.filter(a => a.category_major === 'Technology');

  return (
    <div className="min-h-screen py-8 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col">
      <Header isRumorMode={isRumorMode} setIsRumorMode={setIsRumorMode} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-grow">
        <CategoryColumn 
          title="Economy" 
          Icon={TrendingUp} 
          articles={economyArticles} 
          isRumorMode={isRumorMode} 
          onArticleClick={setSelectedArticle} 
        />
        <CategoryColumn 
          title="Politics" 
          Icon={Landmark} 
          articles={politicsArticles} 
          isRumorMode={isRumorMode} 
          onArticleClick={setSelectedArticle} 
        />
        <CategoryColumn 
          title="Technology" 
          Icon={Cpu} 
          articles={techArticles} 
          isRumorMode={isRumorMode} 
          onArticleClick={setSelectedArticle}
        />
      </div>

      {selectedArticle && (
        <DetailModal
          article={selectedArticle}
          isRumorMode={isRumorMode}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
}

export default App;