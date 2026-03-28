import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Landmark, Cpu } from 'lucide-react';

import { Article } from './types';
import { Header } from './components/Header';
import { CategoryColumn } from './components/CategoryColumn';
import { DetailModal } from './components/DetailModal';

function App() {
  const [isRumorMode, setIsRumorMode] = useState(false);
  const [isJapanMode, setIsJapanMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
        const response = await axios.get('/api/articles');
        setArticles(response.data);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      }
    };
    fetchArticles();
  }, []);

  // ✨ まず「World」か「Japan」かでフィルター
  const targetScope = isJapanMode ? 'Japan' : 'World';
  const scopedArticles = articles.filter(a => a.scope === targetScope || (!a.scope && targetScope === 'World'));

  // ✨ 検索キーワードでフィルター
  const filteredArticles = scopedArticles.filter(a => {
    if (!searchQuery) return true; // 検索窓が空なら全て表示
    const lowerQuery = searchQuery.toLowerCase();
    return (
      (a.title_raw && a.title_raw.toLowerCase().includes(lowerQuery)) ||
      (a.content_fact && a.content_fact.toLowerCase().includes(lowerQuery)) ||
      (a.content_rumor && a.content_rumor.toLowerCase().includes(lowerQuery)) ||
      (a.category_minor && a.category_minor.toLowerCase().includes(lowerQuery))
    );
  });

  // カテゴリごとにデータをフィルタリング
  const economyArticles = filteredArticles.filter(a => a.category_major === 'Economy');
  const politicsArticles = filteredArticles.filter(a => a.category_major === 'Politics');
  const techArticles = filteredArticles.filter(a => a.category_major === 'Technology');

  return (
    <div className="min-h-screen py-8 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col">
      <Header
        isRumorMode={isRumorMode}
        setIsRumorMode={setIsRumorMode}
        isJapanMode={isJapanMode}
        setIsJapanMode={setIsJapanMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-grow">
        <CategoryColumn
          title="経　済"
          Icon={TrendingUp}
          articles={economyArticles}
          isRumorMode={isRumorMode}
          onArticleClick={setSelectedArticle}
        />
        <CategoryColumn
          title="政　治"
          Icon={Landmark}
          articles={politicsArticles}
          isRumorMode={isRumorMode}
          onArticleClick={setSelectedArticle}
        />
        <CategoryColumn
          title="技　術"
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