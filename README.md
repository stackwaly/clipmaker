# 🎬 ClipMaker - Gerador de Clips Virais

Transforme seus vídeos em clips curtos e viralizáveis para **TikTok**, **YouTube Shorts** e **Instagram Reels** automaticamente usando IA!

## ✨ Features

- ✅ Upload de vídeos via Cloudinary
- ✅ Análise automática de transcrição com Claude IA
- ✅ Identificação de momentos viralizáveis (máximo 10 clips)
- ✅ Geração automática de clips de 15-30 segundos
- ✅ Interface moderna e responsiva
- ✅ Suporte para TikTok/Shorts

## 🚀 Como Começar

### 1️⃣ Instalação de Dependências

```bash
npm install
```

### 2️⃣ Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:

```
# Cloudinary
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=sua_api_secret
CLOUDINARY_UPLOAD_PRESET=seu_upload_preset

# Anthropic Claude
ANTHROPIC_API_KEY=sua_chave_claude

# Server
PORT=3000
NODE_ENV=development
```

### 3️⃣ Como Obter as Credenciais

#### **Cloudinary**

1. Acesse https://cloudinary.com/
2. Faça login ou crie uma conta
3. Vá para Dashboard → Account Settings
4. Copie: Cloud Name, API Key, API Secret
5. Crie um Upload Preset em Settings → Upload

#### **Claude (Anthropic)**

1. Acesse https://console.anthropic.com/
2. Faça login ou crie uma conta
3. Vá para API Keys
4. Crie uma nova chave e copie

### 4️⃣ Atualizar o Frontend

Edite `public/app.js` com suas credenciais do Cloudinary:

```javascript
const config = {
  cloudName: "seu_cloud_name_aqui",
  uploadPreset: "seu_upload_preset_aqui",
};
```

### 5️⃣ Instalar FFmpeg (Necessário para gerar clips)

**Windows (PowerShell como Admin):**

```powershell
choco install ffmpeg
```

Ou baixe em: https://ffmpeg.org/download.html

**Mac:**

```bash
brew install ffmpeg
```

**Linux:**

```bash
sudo apt install ffmpeg
```

### 6️⃣ Iniciar o Servidor

```bash
npm start
```

Acesse: http://localhost:3000

## 📖 Como Usar

1. **Upload**: Clique em "Clique para enviar vídeo" e selecione seu vídeo
2. **Transcrição**: Cole a transcrição do vídeo (ou espere ser preenchida automaticamente)
3. **Análise**: Clique em "Analisar Momentos Virais"
4. **Gerar Clips**: Clique em "Gerar Clips" após a análise
5. **Download**: Baixe os clips prontos para TikTok/Shorts

## 🤖 Como Funciona

1. **Upload** → Vídeo + Transcrição para Cloudinary
2. **IA Analysis** → Claude identifica momentos viralizáveis
3. **Clip Generation** → FFmpeg corta os melhores trechos
4. **Download** → Clips prontos para compartilhar

## 🎯 O que é Considerado Viral?

A IA procura por:

- ✅ Momentos engraçados/surpresa
- ✅ Dados impactantes
- ✅ Educativo/interessante
- ✅ Crescendo emocional
- ✅ Call-to-action forte

## ⚙️ Configuração Avançada

### Ajustar Duração dos Clips

Edite `utils/viral-analyzer.js`:

```javascript
// Mude 15-30 segundos para outro valor
Analise a seguinte transcrição e identifique os momentos MAIS VIRALIZÁVEIS (máximo 10 clips de 15-30 segundos cada).
```

### Customizar Limites de Clips

Edite `utils/viral-analyzer.js`:

```javascript
// Mude "máximo X clips" conforme necessário
(máximo 10 clips de 15-30 segundos cada)
```

## 🐛 Troubleshooting

### FFmpeg não encontrado

```bash
# Verifique se instalou
ffmpeg -version

# Ou reinstale
npm install fluent-ffmpeg
```

### Erro de autenticação Cloudinary

- Verifique `.env` com valores corretos
- Confirme que Upload Preset está criado no Cloudinary

### Erro de API Claude

- Verifique se a chave está correta
- Confira limites de uso da conta
- Verifique se a API está ativa

### Trechos muito curtinhos

- Aumente a duração mínima em `viral-analyzer.js`
- Verifique se a transcrição tem detalhes suficientes

## 📊 Exemplo de Resposta

```json
{
  "moments": [
    {
      "startTime": 12,
      "endTime": 27,
      "text": "E foi quando eu descobri que...",
      "reason": "Plot twist inesperado",
      "viralScore": 9
    }
  ]
}
```

## 🔐 Segurança

- ✅ Variáveis sensíveis no `.env`
- ✅ `.gitignore` protege credenciais
- ✅ Sem dados armazenados permanentemente
- ✅ Uploads são limpados automaticamente

## 📝 Estrutura do Projeto

```
NLW-22/
├── server.js                 # Servidor Express
├── public/
│   ├── index.html           # Frontend
│   └── app.js               # Lógica do frontend
├── utils/
│   ├── viral-analyzer.js    # Análise com Claude
│   └── clip-generator.js    # Geração de clips
├── uploads/                 # Vídeos temporários
├── .env                     # Variáveis de ambiente
├── package.json             # Dependências
└── README.md               # Este arquivo
```

## 🚀 Deploy

### Vercel

```bash
# Instale Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Render

1. Conecte seu repositório
2. Defina as variáveis de ambiente
3. Deploy automático

### Heroku

```bash
heroku create seu-app
heroku config:set ANTHROPIC_API_KEY=...
git push heroku main
```

## 📚 Recursos

- [Documentação Cloudinary](https://cloudinary.com/documentation)
- [API Claude](https://docs.anthropic.com/)
- [FFmpeg](https://ffmpeg.org/)
- [Express.js](https://expressjs.com/)

## 📄 Licença

MIT

## 👤 Autor

ClipMaker - NLW 22

---

**Feito com ❤️ para criadores de conteúdo**

Tem dúvidas? Abra uma issue no GitHub!
