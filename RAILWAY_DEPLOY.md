# 🚀 Deploy no Railway.app

## Passo 1: Preparar Repositório Git

```bash
git init
git add .
git commit -m "Initial commit - ClipMaker ready for deploy"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/clipmaker.git
git push -u origin main
```

> **Substitua `SEU_USUARIO`** pelo seu username do GitHub

---

## Passo 2: Criar Conta no Railway

1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub (recomendado)
3. Crie um novo projeto

---

## Passo 3: Conectar ao Repositório

1. No painel do Railway, clique em **"New Project"**
2. Selecione **"Deploy from GitHub"**
3. Escolha seu repositório `clipmaker`
4. Autorize o Railway a acessar seu GitHub
5. Railway detectará automaticamente que é um projeto Node.js

---

## Passo 4: Adicionar Variáveis de Ambiente

No painel do Railway, vá para **"Variables"** e adicione:

```
CLOUDINARY_CLOUD_NAME = seu_cloud_name
CLOUDINARY_API_KEY = sua_api_key
CLOUDINARY_API_SECRET = sua_api_secret
CLOUDINARY_UPLOAD_PRESET = seu_upload_preset
ANTHROPIC_API_KEY = sua_chave_claude
NODE_ENV = production
```

> **Onde pegar essas chaves:**
>
> - **Cloudinary:** [cloudinary.com](https://cloudinary.com) → Dashboard → API Keys
> - **Claude:** [console.anthropic.com](https://console.anthropic.com) → API Keys

---

## Passo 5: Deploy Automático

✅ Railway fará deploy automaticamente quando você fizer `git push`

```bash
# Quando for fazer mudanças:
git add .
git commit -m "Descrição da mudança"
git push
```

---

## Passo 6: Verificar se está online

1. Acesse o painel do Railway
2. Clique em seu projeto
3. Você verá um link como: `https://seu-app-xxx.railway.app`
4. Abra e teste o site! 🎉

---

## ⚠️ Importante: FFmpeg

O Railway já tem FFmpeg instalado por padrão, então seu app de clipagem de vídeos vai funcionar sem problemas!

---

## 🆘 Se algo der errado

### Erro: "Cannot find module"

```bash
# Rode localmente para testar:
npm install
npm start
```

### Erro na API Claude/Cloudinary

- Verifique as chaves no `.env.example`
- Confirme que as variáveis estão corretas no Railway
- Teste com `curl` na aba "Logs" do Railway

### Verificar logs em tempo real

No painel do Railway → seu projeto → "Logs" (aba verde)

---

## 📊 Próximos Passos

1. ✅ Prepare o `.env` (feito!)
2. ✅ Prepare o repositório Git
3. ✅ Conecte ao Railway
4. ✅ Deploy automático
5. 🎉 Seu app está online!

---

**Seu site estará em:** `https://seu-clipmaker-xxx.railway.app`

Compartilhe o link com seus amigos! 🚀
