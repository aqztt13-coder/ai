import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { PLACES } from './src/data/places.ts';
import { GOVERNORATES } from './src/data/governorates.ts';
import { INITIAL_TRIPS } from './src/data/extraData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-memory / dynamic store initialized with curated data
let serverPlaces = [...PLACES];
let serverTrips = [...INITIAL_TRIPS];

// REST Endpoints for Dynamic Places Data (PWA Network-First caching target)
app.get('/api/places', (req, res) => {
  const { category, governorate, search } = req.query;
  let results = [...serverPlaces];

  if (category && typeof category === 'string') {
    results = results.filter((p) => p.category === category);
  }
  if (governorate && typeof governorate === 'string') {
    results = results.filter((p) => p.governorate_id === governorate);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (p) =>
        p.name_ar.toLowerCase().includes(q) ||
        p.name_en.toLowerCase().includes(q) ||
        p.description_ar.toLowerCase().includes(q)
    );
  }

  res.setHeader('Cache-Control', 'public, max-age=60');
  res.json(results);
});

app.get('/api/places/:id', (req, res) => {
  const place = serverPlaces.find((p) => p.id === req.params.id);
  if (!place) {
    return res.status(404).json({ error: 'Place not found' });
  }
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.json(place);
});

app.get('/api/governorates', (_req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.json(GOVERNORATES);
});

app.get('/api/trips', (_req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=120');
  res.json(serverTrips);
});

// Initialize GoogleGenAI SDK with required headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System prompt for the Iraq Tourism AI Guide
const DEFAULT_SYSTEM_INSTRUCTION = `أنت "مرشد الرافدين" - المرشد السياحي الرقمي الذكي الرسمي لمنصة دليل العراق السياحي (Iraq Tourism Guide).
مهمتك:
1. الإجابة بدقة، أدب، وحفاوة عن جميع الاستفسارات المتعلقة بالسياحة، المعالم الدينية، المواقع الأثرية، الطبيعة، والأهوار في كافة محافظات العراق الـ 18.
2. تقديم برامج رحلات مفصلة، نصائح السفر، آداب زيارة المراقد، وتوصيات المطاعم الشعبية (مثل المسكوف، القوزي، الكباب، الدولمة).
3. عندما يطلب المستخدم معلومات حديثة (مثل مواعيد الزيارة، الفعاليات الحالية، الطقس، أو أسعار التذاكر)، استخدم البحث عبر Google Search لتقديم معلومات موثقة ومحدثة.
4. حافظ على نبرة فخورة بالتراث والحضارات السومرية والبابلية والآشورية والإسلامية، وقدم إجابات واضحة ومنسقة باللغة العربية مع دعم اللغة الإنجليزية إذا سأل المستخدم بالإنجليزية.`;

// Multi-turn Chat API with Google Search Grounding
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { 
      messages, 
      systemInstruction = DEFAULT_SYSTEM_INSTRUCTION, 
      enableSearch = true, 
      modelName = 'gemini-2.5-flash',
      role = 'guide'
    } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'GEMINI_API_KEY is not configured on the server. Please configure it in AI Studio Secrets.' 
      });
    }

    // Determine model to use
    // Supported: gemini-2.5-flash (default general with search), gemini-2.5-pro (complex), gemini-2.5-flash-lite (fast)
    let selectedModel = modelName;
    if (selectedModel !== 'gemini-2.5-pro' && selectedModel !== 'gemini-2.5-flash-lite') {
      selectedModel = 'gemini-2.5-flash';
    }

    // Role-specific instruction additions
    let effectiveInstruction = systemInstruction;
    if (role === 'archaeologist') {
      effectiveInstruction += `\nأنت تركز بصفتك عالم آثار رافديني متخصص على العمق التاريخي، التنقيبات، الأختام المسمارية، وتاريخ العصور القديمة.`;
    } else if (role === 'planner') {
      effectiveInstruction += `\nأنت تركز كمخطط رحلات محترف على الجدولة الزمنية اليومية الدقيقة، حساب المسافات، الفنادق، وأوقات الراحة ووسائل النقل.`;
    }

    // Build contents array for multi-turn history
    const contents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    // Configure tools: Google Search grounding
    const config: any = {
      systemInstruction: effectiveInstruction,
    };

    if (enableSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config,
    });

    const replyText = response.text || 'عذراً، لم أتمكن من الحصول على رد.';

    // Extract search grounding metadata if available
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const searchQueries = groundingMetadata?.webSearchQueries || [];
    const searchChunks = groundingMetadata?.groundingChunks || [];
    const searchSupports = groundingMetadata?.groundingSupports || [];

    const sources = searchChunks
      .map((chunk: any) => ({
        title: chunk.web?.title || 'مصدر خارجي',
        url: chunk.web?.uri || '',
      }))
      .filter((s: any) => s.url);

    res.json({
      reply: replyText,
      sources,
      searchQueries,
      modelUsed: selectedModel,
      grounded: Boolean(searchQueries.length > 0 || sources.length > 0),
    });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    res.status(500).json({ 
      error: error?.message || 'حدث خطأ أثناء معالجة الطلب عبر Gemini AI' 
    });
  }
});

// Smart Itinerary Generation endpoint
app.post('/api/ai/generate-itinerary', async (req, res) => {
  try {
    const { governorates, days, interests, budget } = req.body;

    const prompt = `أريد برنامج رحلة سياحي متكامل في العراق:
- المحافظات المستهدفة: ${governorates ? governorates.join(', ') : 'بغداد وبابل'}
- مدة الرحلة: ${days || 3} أيام
- الاهتمامات: ${interests ? interests.join(', ') : 'تاريخي، أثري، وتراثي'}
- الميزانية: ${budget || 'متوسطة'}

قم بإنشاء جدول منظم لكل يوم بالساعات (صباحاً، ظهراً، بعد الظهر، مساءً) مع ترشيح أسماء المطاعم والنصائح العملية. استخدم البحث عبر Google للتأكد من مواعيد الفعاليات والأماكن المفتوحة.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro', // Use pro for complex itinerary reasoning
      contents: prompt,
      config: {
        systemInstruction: DEFAULT_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    });

    res.json({
      plan: response.text,
      grounding: response.candidates?.[0]?.groundingMetadata,
    });
  } catch (error: any) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate itinerary' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
