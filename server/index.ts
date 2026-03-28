import express from 'express';
import cors from 'cors';
import axios from 'axios';
import pool from './db';
import { analyzeNews } from './gemini';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' })); // フロントエンドからのアクセス許可

const PORT = process.env.PORT || 3001;

// --- API 1: 記事一覧の取得 (フロントエンドから呼ばれる) ---
app.get('/api/articles', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM articles ORDER BY published_at DESC LIMIT 50');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Fetch Articles Error:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// --- API 2: ニュースの巡回・分析・保存 (手動実行 or バッチ処理用) ---
app.post('/api/fetch-and-analyze', async (req, res) => {
  try {
    // 1. News APIからTopニュースを取得（今回は general カテゴリ）
    const newsResponse = await axios.get(`https://newsapi.org/v2/top-headlines`, {
      params: { category: 'general', language: 'en', pageSize: 5, apiKey: process.env.NEWS_API_KEY }
    });

    const articles = newsResponse.data.articles;
    const results:any[] = [];

    for (const article of articles) {
      if (!article.title || !article.content) continue;

      // 重複チェック: すでに同じURLの記事がDBにあるか確認
      const [existing]: any = await pool.execute('SELECT id FROM articles WHERE source_url = ?', [article.url]);
      if (existing.length > 0) {
        console.log(`Skipped (Already exists): ${article.title}`);
        continue;
      }

      console.log(`Analyzing: ${article.title}`);

      // 2. Gemini APIで分析
      const analyzedData = await analyzeNews(article.title, article.content || article.description);

      // 3. TiDBに保存
      const publishedAt = new Date(article.publishedAt).toISOString().slice(0, 19).replace('T', ' ');
      await pool.execute(`
        INSERT INTO articles (
          id, category_major, category_minor, title_raw, content_fact, content_rumor,
          history_rhyme, truth_score, scenario_opt, scenario_pess, source_url, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        uuidv4(), analyzedData.category_major, analyzedData.category_minor,
        analyzedData.title_raw || article.title, analyzedData.content_fact,
        analyzedData.content_rumor, analyzedData.history_rhyme, analyzedData.truth_score,
        analyzedData.scenario_opt, analyzedData.scenario_pess, article.url, publishedAt
      ]);

      results.push(analyzedData);
    }

    res.status(200).json({ message: 'Pipeline completed', added: results.length });
  } catch (error) {
    console.error('Pipeline Error:', error);
    res.status(500).json({ error: 'Failed to execute pipeline' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});