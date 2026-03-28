import express from 'express';
import cors from 'cors';
import axios from 'axios';
import pool from './db.js';
import { analyzeNews } from './gemini.js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
app.use(express.json());
// Viteのデフォルトポート(5173)からのアクセスを許可
app.use(cors({ origin: 'http://localhost:5173' }));

const PORT = process.env.PORT || 3001;

// 1. [バッチ処理用] News APIから記事取得 -> Gemini分析 -> TiDB保存
app.post('/api/fetch-and-analyze', async (req, res) => {
  try {
    const newsResponse = await axios.get(`https://newsapi.org/v2/top-headlines`, {
      params: {
        category: 'business', // 実際は politics, tech などを巡回します
        language: 'en',
        pageSize: 3, // API制限を考慮し少なめに設定
        apiKey: process.env.NEWS_API_KEY
      }
    });

    const articles = newsResponse.data.articles;
    const results:any[] = [];

    for (const article of articles) {
      if (!article.title || !article.content) continue;

      const analyzedData = await analyzeNews(article.title, article.content || article.description);
      const id = uuidv4();
      const publishedAt = new Date(article.publishedAt).toISOString().slice(0, 19).replace('T', ' ');

      const query = `
        INSERT INTO articles (
          id, category_major, category_minor, title_raw,
          content_fact, content_rumor, history_rhyme, truth_score,
          scenario_opt, scenario_pess, source_url, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        id, analyzedData.category_major, analyzedData.category_minor,
        analyzedData.title_raw || article.title, analyzedData.content_fact,
        analyzedData.content_rumor, analyzedData.history_rhyme, analyzedData.truth_score,
        analyzedData.scenario_opt, analyzedData.scenario_pess, article.url, publishedAt
      ];

      await pool.execute(query, values);
      results.push(analyzedData);
    }

    res.status(200).json({ message: 'Pipeline executed successfully', data: results });

  } catch (error) {
    console.error('Pipeline Error:', error);
    res.status(500).json({ error: 'Failed to execute pipeline' });
  }
});

// 2. [フロントエンド用] 記事一覧を取得するエンドポイント
app.get('/api/articles', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM articles ORDER BY published_at DESC LIMIT 50');
    res.status(200).json(rows);
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});