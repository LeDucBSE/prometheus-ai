# Prometheus AI

Transform rough prompts into precise, expert-grade instructions — optimized for the AI model you actually use.

Prometheus AI is a self-hosted prompt engineer. You bring your own API key, pick your destination model, and the app rewrites your raw input into a production-ready prompt using structured prompt engineering principles.

Your key stays in your browser. No account, no database, no data sent anywhere except your chosen AI provider.

---

## Getting started

**Requires Node.js 18+**

```bash
git clone https://github.com/LeDucBSE/prometheus-ai.git
cd prometheus-ai
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), enter your API key on the home page, and start transforming prompts. No `.env` file needed.

---

## Supported providers

| Provider | Where to get a key |
|---|---|
| [OpenRouter](https://openrouter.ai/keys) | Recommended — one key for many models |
| [Anthropic](https://console.anthropic.com/settings/keys) | Claude Sonnet, Opus, and others |
| [OpenAI](https://platform.openai.com/api-keys) | GPT-4o and compatible models |
| [Mistral](https://console.mistral.ai/api-keys) | Mistral Large and others |
| [Google AI](https://aistudio.google.com/apikey) | Gemini 2.5 Flash, Pro, and others |

The model field is optional. Leave it blank to use the provider's recommended default.

---

## How it works

1. Enter your provider API key on the home page — stored locally in your browser, never persisted server-side.
2. Open the workspace and write your raw idea, or attach files (text, PDF, images).
3. Select the destination model and optionally a use case.
4. Click **Optimize** — the app calls your provider's API and returns a structured, expert-grade prompt ready to paste.

You pay your provider directly and keep full control of your usage.

---

## Deploying to production

The app is a standard Next.js project. No environment variables are required.

```bash
npm run build
npm run start
```

Deploys to Vercel, Railway, Render, or any Node-compatible host out of the box.

---

## Development

```bash
npm run dev         # start dev server
npm run typecheck   # TypeScript check
npm run test        # run tests
npm run lint        # ESLint
npm run format      # Prettier
```

---

## Stack

- [Next.js 16](https://nextjs.org) — App Router, server-side API route for inference
- [Tailwind CSS](https://tailwindcss.com) — styling
- [Framer Motion](https://www.framer.com/motion) — animations
- [Zod](https://zod.dev) — request/response validation
- [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript) — unified client for Anthropic and OpenRouter

---

## License

MIT — see [LICENSE](./LICENSE).
