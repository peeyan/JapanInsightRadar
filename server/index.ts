import express from 'express';
import cors from 'cors';
import axios from 'axios';
import pool from './db.js';
import { analyzeNews } from './gemini.js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import cron from 'node-cron';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' })); // フロントエンドからのアクセス許可

const PORT = process.env.PORT || 3001;

// --- API 1: 記事一覧の取得 (フロントエンドから呼ばれる) ---
app.get('/api/articles', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM articles ORDER BY published_at DESC LIMIT 200');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Fetch Articles Error:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// --- API 2: ニュースの巡回・分析・保存 (手動実行 or バッチ処理用) ---
async function runFetchPipeline() {
  try {
    console.log("Fetching news from API...");

    // 日本に関するキーワードのリスト
    const japanKeywords = [
      'Japan economy',       // 日本の経済
      'Japan politics',      // 日本の政治・政界
      'Tokyo',               // 東京
      'Bank of Japan',       // 日銀
      'Japan technology',    // 日本の技術
      'Japan diplomacy',     // 日本の外交
      'Japan social issues', // 日本の社会問題
      'Japan defense',       // 日本の防衛
      'Japanese companies'   // 日本の企業
    ];

    // リストからランダムに「3つ」選ぶ（シャッフルして最初の3つを取る）
    const shuffledKeywords = japanKeywords.sort(() => 0.5 - Math.random());
    const selectedKeywords = shuffledKeywords.slice(0, 3);

    console.log(`Target Japan Keywords: ${selectedKeywords.join(', ')}`);

    // 世界ニュースのAPIリクエスト（10件）
    const apiRequests = [
      axios.get(`https://newsapi.org/v2/top-headlines`, {
        params: { category: 'general', language: 'en', pageSize:10, apiKey: process.env.NEWS_API_KEY }
      })
    ];

    // 選んだ3つのキーワードごとに、日本ニュースのAPIリクエストを追加（各5件）
    for (const keyword of selectedKeywords) {
      apiRequests.push(
        axios.get(`https://newsapi.org/v2/everything`, {
          params: { q: keyword, language: 'en', sortBy: 'publishedAt', pageSize: 5, apiKey: process.env.NEWS_API_KEY }
        })
      );
    }

    // 全部のリクエスト（世界1 + 日本3 = 計4リクエスト）を同時に実行
    const responses = await Promise.all(apiRequests);

    // 全てのレスポンスから記事データだけを抽出して1つの配列に合体
    const articles = responses.flatMap(response => response.data.articles);
    let addedCount = 0;

    for (const article of articles) {
      if (!article.title || !article.content) continue;

      const [existing]: any = await pool.execute('SELECT id FROM articles WHERE source_url = ?', [article.url]);
      if (existing.length > 0) continue; // 重複は静かにスキップ

      console.log(`🧠 Analyzing: ${article.title}`);

      try {
        const analyzedData = await analyzeNews(article.title, article.content || article.description);
        const publishedAt = new Date(article.publishedAt).toISOString().slice(0, 19).replace('T', ' ');
        await pool.execute(`
          INSERT INTO articles (
            id, scope, category_major, category_minor, title_raw, content_fact, content_rumor,
            history_rhyme, truth_score, scenario_opt, scenario_pess, source_url, published_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          uuidv4(), analyzedData.scope || 'World', analyzedData.category_major, analyzedData.category_minor,
          analyzedData.title_raw || article.title, analyzedData.content_fact,
          analyzedData.content_rumor, analyzedData.history_rhyme, analyzedData.truth_score,
          analyzedData.scenario_opt, analyzedData.scenario_pess, article.url, publishedAt
        ]);

        addedCount++;
        // 7秒待機 (API制限対策)
        await new Promise(resolve => setTimeout(resolve, 7000));

      } catch (err) {
        console.error(`Failed to analyze article: ${article.title}`, err);
      }
    }
    console.log(`✅ Pipeline completed. Added ${addedCount} new articles.`);
    return { added: addedCount };
  } catch (error) {
    console.error('Pipeline Error:', error);
    throw error;
  }
}

// --- API 2: 手動トリガー用エンドポイント ---
app.post('/api/fetch-and-analyze', async (req, res) => {
  try {
    const result = await runFetchPipeline();
    res.status(200).json({ message: 'Pipeline completed manually', added: result.added });
  } catch (error) {
    res.status(500).json({ error: 'Failed to execute pipeline' });
  }
});

// ✨ Vercelの定期実行(Cron)はGETリクエストで来るため、GETも許可する
app.get('/api/fetch-and-analyze', async (req, res) => {
  try {
    const result = await runFetchPipeline();
    res.status(200).json({ message: 'Pipeline completed manually', added: result.added });
  } catch (error) {
    res.status(500).json({ error: 'Failed to execute pipeline' });
  }
});

// --- ✨ Vercel / ローカル 実行の切り分け ---
if (process.env.NODE_ENV !== 'production') {
  // ローカル環境の場合のみ、サーバーを常駐させてCronを回す
  cron.schedule('0 */2 * * *', () => {
    console.log('⏰ Scheduled task triggered: Fetching latest global intelligence...');
    runFetchPipeline();
  });

  app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
    console.log('⏰ Cron job activated: Automatic news fetch will run every 2 hours.');
  });
}

// ✨ Vercel Serverless Functions 用にアプリをエクスポートする
export default app;