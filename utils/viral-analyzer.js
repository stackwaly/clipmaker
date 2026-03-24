import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function analyzeViralMoments(transcription) {
  const prompt = `Você é um especialista em conteúdo viral para TikTok e Shorts.

Analise a seguinte transcrição e identifique os momentos MAIS VIRALIZÁVEIS (máximo 10 clips de 15-30 segundos cada).

Para cada momento, retorne:
- startTime: tempo de início em segundos
- endTime: tempo de fim em segundos
- text: texto do trecho
- reason: por que é viral (engraçado, impactante, surpreendente, educativo, etc)
- viralScore: nota de 1-10 para probabilidade de viralizar

IMPORTANTE: Priorize trechos com impacto emocional forte, dados surpreendentes, piadas e momentos de crescendo.

Transcrição:
"""
${transcription}
"""

Retorne APENAS um JSON válido com a seguinte estrutura:
{
  "moments": [
    {
      "startTime": 0,
      "endTime": 15,
      "text": "...",
      "reason": "...",
      "viralScore": 9
    }
  ]
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const responseText = message.content[0].text;

    // Parse JSON da resposta
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('⚠️ Não foi possível extrair JSON da resposta');
      return [];
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return parsed.moments || [];
  } catch (error) {
    console.error('❌ Erro ao analisar com Claude:', error);
    throw new Error(`Falha na análise: ${error.message}`);
  }
}
