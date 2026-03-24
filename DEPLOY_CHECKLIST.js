#!/usr/bin/env node

/**
 * 🚀 CHECKLIST DE DEPLOY - RAILWAY.APP
 *
 * Execute este checklist antes de fazer upload
 */

console.log(`
╔═══════════════════════════════════════════════════════╗
║   🎬 ClipMaker - Checklist de Deploy                 ║
║              Railway.app                              ║
╚═══════════════════════════════════════════════════════╝

📋 ANTES DE COMEÇAR:

  ☑ Arquivo .env criado ✅
  ☑ .gitignore configurado ✅
  ☑ Package.json pronto ✅
  ☑ Servidor configurado ✅

═══════════════════════════════════════════════════════

🔑 CHAVES QUE VOCÊ PRECISA:

  1. Cloudinary (para upload de vídeos)
     → Acesse: https://cloudinary.com/console
     → Copie: Cloud Name, API Key, API Secret
     → Crie: Upload Preset (não assinado)

  2. Claude IA (para análise de momentos virais)
     → Acesse: https://console.anthropic.com/keys
     → Copie: API Key

═══════════════════════════════════════════════════════

✈️ PRÓXIMOS PASSOS:

  1. Inicialize Git:
     git init
     git add .
     git commit -m "Initial commit - ClipMaker"

  2. Crie repositório no GitHub:
     https://github.com/new

  3. Conecte seu repositório local:
     git remote add origin https://github.com/SEU_USUARIO/clipmaker
     git branch -M main
     git push -u origin main

  4. Vá para Railway:
     https://railway.app

  5. Conecte seu GitHub e selecione o repositório

  6. Adicione as variáveis de ambiente no Railway

  7. Deploy automático! 🎉

═══════════════════════════════════════════════════════

📚 Documentação completa em: RAILWAY_DEPLOY.md

Boa sorte! 🚀
`);
