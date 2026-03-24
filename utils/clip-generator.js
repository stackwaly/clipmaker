import ffmpeg from 'fluent-ffmpeg';
import axios from 'axios';
import { promises as fs } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadsDir = join(__dirname, '../uploads');

// Garante que o diretório de uploads existe
await fs.mkdir(uploadsDir, { recursive: true }).catch(() => {});

export async function generateClips(videoUrl, moments) {
  try {
    // Baixar vídeo
    console.log('📥 Baixando vídeo...');
    const videoPath = await downloadVideo(videoUrl);

    const clips = [];

    for (let i = 0; i < moments.length; i++) {
      const moment = moments[i];
      console.log(`🎬 Gerando clip ${i + 1}/${moments.length}: ${moment.text.slice(0, 50)}...`);

      const clipPath = await extractClip(videoPath, moment, i);
      clips.push({
        id: i + 1,
        filename: `clip_${i + 1}.mp4`,
        path: clipPath,
        startTime: moment.startTime,
        endTime: moment.endTime,
        duration: moment.endTime - moment.startTime,
        text: moment.text,
        reason: moment.reason,
        viralScore: moment.viralScore
      });
    }

    return clips;
  } catch (error) {
    console.error('❌ Erro ao gerar clips:', error);
    throw error;
  }
}

async function downloadVideo(url) {
  const filename = `video_${Date.now()}.mp4`;
  const filepath = join(uploadsDir, filename);

  const response = await axios.get(url, { responseType: 'stream' });

  return new Promise((resolve, reject) => {
    const writer = require('fs').createWriteStream(filepath);
    response.data.pipe(writer);

    writer.on('finish', () => {
      console.log('✅ Vídeo baixado');
      resolve(filepath);
    });

    writer.on('error', reject);
  });
}

async function extractClip(videoPath, moment, index) {
  const outputFilename = `clip_${index + 1}.mp4`;
  const outputPath = join(uploadsDir, outputFilename);

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .setStartTime(moment.startTime)
      .setDuration(moment.endTime - moment.startTime)
      .output(outputPath)
      .on('end', () => {
        console.log(`✅ Clip ${index + 1} criado: ${outputFilename}`);
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error(`❌ Erro ao criar clip ${index + 1}:`, err);
        reject(err);
      })
      .run();
  });
}
