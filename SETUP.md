# 🎬 ClipMaker - QUICK START GUIDE

Siga este guia passo-a-passo para colocar o ClipMaker rodando em minutos!

## ⚡ Pré-requisitos

- Node.js 16+ instalado
- FFmpeg instalado
- Contas criadas em: Cloudinary e Anthropic

## 📋 Checklist de Setup

### 1. Instalar Dependências

```bash
npm install
```

⏱️ Tempo: ~2 minutos

### 2. Criar Arquivo .env

```bash
cp .env.example .env
```

Edite o .env com seus valores (não deixe em branco):

```
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
CLOUDINARY_UPLOAD_PRESET=xxx
ANTHROPIC_API_KEY=xxx
PORT=3000
```

### 3. Atualizar public/app.js

Procure por:

```javascript
const config = {
  cloudName: "seu_cloud_name_aqui",
  uploadPreset: "seu_upload_preset_aqui",
};
```

Substitua pelos valores corretos do Cloudinary.

### 4. Verificar FFmpeg

```bash
ffmpeg -version
```

Se não funcionar, instale:

- Windows: https://ffmpeg.org/download.html
- Mac: `brew install ffmpeg`
- Linux: `sudo apt install ffmpeg`

### 5. Iniciar o Servidor

```bash
npm start
```

Você verá:

```
🚀 ClipMaker rodando em http://localhost:3000
```

### 6. Abrir no Navegador

Acesse: http://localhost:3000

## 🔑 Obter Credenciais

### Cloudinary

1. https://cloudinary.com/ → Sign Up/Login
2. Dashboard → Settings
3. Copie: Cloud Name, API Key, API Secret
4. Settings → Upload → Create Upload Preset → Unsigned Mode
5. Copie o nome do Preset

### Anthropic Claude

1. https://console.anthropic.com/ → Sign Up/Login
2. API Keys → Create Key
3. Copie a chave

## ✅ Testando

1. Clique em "Clique para enviar vídeo"
2. Selecione um vídeo (curto para testar)
3. Cole a transcrição (ou espere ser preenchida)
4. Clique em "Analisar Momentos Virais"
5. Espere a IA processar
6. Clique em "Gerar Clips"
7. Baixe os resultados!

## 🐛 Troubleshooting Rápido

| Erro                  | Solução                          |
| --------------------- | -------------------------------- |
| "Cannot find module"  | Execute `npm install`            |
| "FFmpeg not found"    | Instale FFmpeg no seu SO         |
| "Invalid credentials" | Verifique o .env                 |
| "API Error"           | Confira chave Claude ativa       |
| "Upload fails"        | Verifique Upload Preset Unsigned |

## 📊 Arquitetura Simplificada

```
Navegador (Frontend)
    ↓
Express Server
    ↓
    ├→ Cloudinary (upload)
    ├→ Claude IA (análise)
    └→ FFmpeg (gerar clips)
    ↓
Download dos Clips
```

## 🎯 Próximos Passos

- [ ] Testar com seu primeiro vídeo
- [ ] Ajustar critérios de viralidade (em viral-analyzer.js)
- [ ] Customizar duração dos clips
- [ ] Deploy para produção (Vercel/Render)

## 📞 Suporte

Confira o README.md para mais detalhes!

---

**Pronto? Vamos viral! 🚀**
