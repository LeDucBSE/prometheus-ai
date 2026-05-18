<div align="center">

# 🔥 Prometheus AI

### Transform rough prompts into expert-grade instructions

**Your ideas in, production-ready prompts out — optimized for the model you actually use.**

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js_16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/LeDucBSE/prometheus-ai/pulls)

[Getting Started](#-getting-started) · [Features](#-features) · [Supported Models](#-supported-providers) · [How It Works](#-how-it-works) · [Deploy](#-deploying-to-production) · [Contributing](#-contributing)

</div>

---

## Why Prometheus AI?

Most people write prompts like text messages — vague, ambiguous, missing context. Then they wonder why the AI gives mediocre results.

**Prometheus AI fixes this.** Paste your rough idea, and the app restructures it into an expert-grade prompt using structured prompt engineering principles — tailored to the specific model you're targeting.

- 🔑 **Bring Your Own Key** — Your API key stays in your browser. No account, no database, no middleman.
- 🎯 **Model-Aware Optimization** — Prompts optimized specifically for Claude, ChatGPT, Gemini, Grok, Mistral, or Perplexity.
- 📎 **Multimodal Input** — Attach text, PDFs, or images alongside your prompt.
- 🏷️ **10 Use Case Categories** — From code generation to marketing copy, image prompts to AI agent instructions — with 60+ subcategories for precision.
- 🛡️ **100% Privacy** — Zero data stored server-side. Your key and prompts never leave your browser (except to your chosen AI provider).
- 🚀 **Self-Hosted** — Deploy anywhere in minutes. No environment variables needed.

---

## ✨ Features

### 🎯 Model-Specific Optimization

Each prompt is tailored to the target model's strengths:

| Model | Optimization Focus |
|-------|-------------------|
| **Claude** | XML structure, explicit constraints, role/task separation |
| **ChatGPT** | Direct task framing, actionable instructions, conversational flow |
| **Gemini** | Multimodal clarity, structured output, fast comprehension |
| **Grok** | Stable prefixes, front-loaded guidance, execution-oriented |
| **Mistral** | Compact high-signal instructions, schema-first contracts |
| **Perplexity** | Research scoping, grounded synthesis, source-aware output |

### 🏷️ Use Case Intelligence

Select a use case and Prometheus applies domain-specific prompt engineering rules:

**Text** · **Image** · **Code** · **Website/App** · **AI Agent** · **Research** · **Marketing** · **Learning** · **Documents** · **Other**

Each category includes specialized subcases (e.g., Image → Photorealistic, Ad Creative, UI Mockup, Character Design...) with dedicated rules for maximum output quality.

### 🖼️ Image Prompt Engineering

Prometheus knows the image generation APIs for ChatGPT (GPT Image), Gemini (Nano Banana), and Grok (Grok Imagine). When you select the Image use case, it generates paste-ready image prompts with proper visual descriptors, composition cues, and engine-specific optimizations.

---

## 🚀 Getting Started

**Requires Node.js 18+**

```bash
git clone https://github.com/LeDucBSE/prometheus-ai.git
cd prometheus-ai
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), enter your API key, and start transforming prompts. No `.env` file needed.

---

## 🔌 Supported Providers

| Provider | Models | Get a Key |
|----------|--------|-----------|
| [OpenRouter](https://openrouter.ai/keys) | 100+ models via one key | Recommended for flexibility |
| [Anthropic](https://console.anthropic.com/settings/keys) | Claude Sonnet, Opus, Haiku | Best for structured tasks |
| [OpenAI](https://platform.openai.com/api-keys) | GPT-4o, GPT-4.5, o-series | Most popular |
| [Mistral](https://console.mistral.ai/api-keys) | Mistral Large, Medium | European AI leader |
| [Google AI](https://aistudio.google.com/apikey) | Gemini 2.5 Flash, Pro | Strong multimodal |

> **Tip:** [OpenRouter](https://openrouter.ai) gives you access to models from all providers with a single API key.

---

## ⚙️ How It Works

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│   Your rough     │────▶│   Prometheus AI       │────▶│  Expert prompt   │
│   idea / prompt  │     │   Prompt Compiler     │     │  ready to paste  │
└─────────────────┘     └──────────────────────┘     └─────────────────┘
                              │
                    ┌─────────┼─────────┐
                    ▼         ▼         ▼
              Model Rules  Use Case  Reference
              (per target) Rules     Documentation
```

1. **Enter your API key** — stored locally in your browser, never sent to any server except your chosen provider.
2. **Open the workspace** — write your raw idea, or attach files (text, PDF, images).
3. **Select your target model** and optionally a use case category.
4. **Click Optimize** — the prompt compiler assembles model-specific rules, use case rules, and reference documentation, then calls your provider to transform your input into a structured, expert-grade prompt.

You pay your provider directly and keep full control of your usage and costs.

---

## 🏗️ Architecture

```
prometheus-ai/
├── apps/web/                    # Next.js 16 application
│   ├── app/                     # App Router pages
│   │   ├── api/transform/       # Server-side inference endpoint
│   │   ├── workspace/           # Prompt transformation workspace
│   │   └── page.tsx             # Landing page
│   ├── components/              # React components
│   ├── lib/
│   │   ├── api-credentials/     # Client-side key management
│   │   └── transform/           # Prompt engineering engine
│   │       ├── compiler.ts      # Rule assembly per model + use case
│   │       ├── inference.ts     # Provider API calls
│   │       ├── intent.ts        # Intent detection & classification
│   │       ├── models.ts        # Model-specific configurations
│   │       ├── use-cases.ts     # 10 categories, 60+ subcases
│   │       └── schemas.ts       # Zod validation
│   └── tests/                   # Vitest test suite
├── package.json                 # Monorepo root
└── LICENSE                      # MIT
```

---

## 🚢 Deploying to Production

The app is a standard Next.js project. No environment variables required.

```bash
npm run build
npm run start
```

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LeDucBSE/prometheus-ai)
[![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/template/prometheus-ai)

Also works on Render, Fly.io, Coolify, or any Node-compatible host.

---

## 🧪 Development

```bash
npm run dev         # Start dev server
npm run typecheck   # TypeScript check
npm run test        # Run Vitest tests
npm run lint        # ESLint
npm run format      # Prettier
```

---

## 🛠️ Stack

- [Next.js 16](https://nextjs.org) — App Router, server-side API route
- [TypeScript](https://www.typescriptlang.org/) — Full type safety
- [Tailwind CSS](https://tailwindcss.com) — Styling
- [Framer Motion](https://www.framer.com/motion) — Animations
- [Zod](https://zod.dev) — Request/response validation
- [Vitest](https://vitest.dev) — Testing
- [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript) — Unified inference client

---

## 🤝 Contributing

Contributions are welcome! Here are some ways to help:

- 🐛 [Report bugs](https://github.com/LeDucBSE/prometheus-ai/issues)
- 💡 [Suggest features](https://github.com/LeDucBSE/prometheus-ai/issues)
- 🔧 Submit a PR (new use cases, model support, UI improvements)
- ⭐ Star the repo if you find it useful!

---

## 📄 License

MIT — see [LICENSE](./LICENSE).

---

<div align="center">

**Built by [Léon Wils](https://github.com/LeDucBSE)**

If Prometheus AI helps you write better prompts, consider giving it a ⭐

</div>
