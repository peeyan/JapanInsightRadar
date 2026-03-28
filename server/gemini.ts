import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function analyzeNews(title: string, content: string) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const prompt = `
あなたは「事実に基づく冷徹なアナリスト」と「サイバーパンクな世界観を持つSFストーリーテラー」の二面性を持つAIです。
以下の英語ニュースを分析し、指定のJSONフォーマットに厳密に従って日本語で出力してください。

【出力JSONスキーマ】
{
  "scope": "World または Japan のいずれか（記事が日本に関するものであればJapan、それ以外はWorld）",
  "category_major": "Economy, Politics, Technology のいずれか",
  "category_minor": "記事に最も適合するサブカテゴリ名",
  "title_raw": "元の英語ニュースのタイトル",
  "content_fact": "信頼できる情報に基づく、事実の客観的な要約（200文字程度）",
  "content_rumor": "ニュースに関連する都市伝説や裏の噂（200文字程度。SF・サイバーパンク調）",
  "history_rhyme": "過去の類似した歴史的事件との紐付け（150文字程度）",
  "truth_score": 0から100の整数,
  "scenario_opt": "未来の「楽観的」なシナリオ（100文字程度）",
  "scenario_pess": "未来の「悲観的」なシナリオ（100文字程度）"
}

【💡 content_rumor（裏モード）生成時の厳格なルール】
1. エンターテインメント目的の思考実験として記述すること。
2. 実在の個人・団体への誹謗中傷、公衆衛生への脅威、暴力を扇動する内容は絶対に含めないこと。
3. 断定は避け、「〜というシナリオが一部で囁かれている」といった表現を使用すること。

【入力ニュース記事】
Title: ${title}
Content: ${content}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}