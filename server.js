import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { analyzeViralMoments } from './utils/viral-analyzer.js';
import { generateClips } from './utils/clip-generator.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

// Rota para analisar transcrição
app.post('/api/analyze', async (req, res) => {
  try {
    const { transcription, videoUrl, videoDuration } = req.body;

    if (!transcription) {
      return res.status(400).json({ error: 'Transcrição é obrigatória' });
    }

    console.log('🎬 Analisando transcrição para momentos virais...');
    const viralMoments = await analyzeViralMoments(transcription);

    console.log(`✅ Encontrados ${viralMoments.length} momentos virais`);

    res.json({
      success: true,
      moments: viralMoments,
      transcription,
      videoUrl,
      videoDuration
    });
  } catch (error) {
    console.error('Erro ao analisar:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para gerar clips
app.post('/api/generate-clips', async (req, res) => {
  try {
    const { videoUrl, moments } = req.body;

    if (!videoUrl || !moments || moments.length === 0) {
      return res.status(400).json({
        error: 'URL do vídeo e momentos são obrigatórios'
      });
    }

    console.log('🎬 Gerando clips...');
    const clips = await generateClips(videoUrl, moments);

    res.json({
      success: true,
      clips,
      message: `${clips.length} clips gerados com sucesso!`
    });
  } catch (error) {
    console.error('Erro ao gerar clips:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve index.html para rotas não encontradas
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 ClipMaker rodando em http://localhost:${PORT}`);
  console.log(`
╔════════════════════════════════════╗
║        🎬 CLIPMAKER INICIADO 🎬     ║
║                                    ║
║  Endpoint: http://localhost:${PORT}  ║
║  POST /api/analyze - Analisar      ║
║  POST /api/generate-clips - Gerar  ║
╚════════════════════════════════════╝
  `);
});
