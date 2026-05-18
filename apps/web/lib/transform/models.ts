import type { TargetModel } from "@/lib/transform/schemas";

type PromptReferenceSource = {
  title: string;
  url?: string;
};

type ImageGenerationProfile = {
  title: string;
  summary: string;
  engineName: string;
  sources: readonly PromptReferenceSource[];
  promptReferenceRules: readonly string[];
};

export type TargetModelConfig = {
  id: TargetModel;
  label: string;
  subtitle: string;
  placeholder: string;
  promptReferenceTitle: string;
  promptReferenceSummary: string;
  promptReferenceSources: readonly PromptReferenceSource[];
  promptReferenceRules: readonly string[];
  imageGenerationProfile?: ImageGenerationProfile;
};

export const TARGET_MODEL_CONFIG: Record<TargetModel, TargetModelConfig> = {
  chatgpt: {
    id: "chatgpt",
    label: "ChatGPT",
    subtitle: "OpenAI",
    placeholder: "Décris ton idée, ton besoin, ou le prompt que tu veux rendre plus net pour ChatGPT.",
    promptReferenceTitle: "OpenAI response-contract profile",
    promptReferenceSummary:
      "Derived from OpenAI guidance on structured outputs and production-safe response shaping.",
    promptReferenceSources: [
      {
        title: "Structured model outputs | OpenAI API",
        url: "https://platform.openai.com/docs/guides/structured-outputs?api-mode=chat"
      }
    ],
    promptReferenceRules: [
      "Use direct task framing and explicit deliverable contracts.",
      "When structure matters, define the exact JSON shape, fields, or section headings expected from the model.",
      "Keep instructions easy to execute inside an ongoing conversational workflow."
    ],
    imageGenerationProfile: {
      title: "OpenAI image-generation profile",
      summary:
        "Use OpenAI's current GPT Image family for image generation prompts. The tool auto-optimizes text inputs, but stronger prompts still benefit from explicit visual direction and editing constraints.",
      engineName: "gpt-image-1 / gpt-image-1.5",
      sources: [
        {
          title: "Image generation | OpenAI API",
          url: "https://platform.openai.com/docs/guides/tools-image-generation"
        },
        {
          title: "Images API reference | OpenAI API",
          url: "https://platform.openai.com/docs/api-reference/images/generate"
        }
      ],
      promptReferenceRules: [
        "Describe the subject, framing, lighting, mood, materials, and any text rendering requirements directly in plain language.",
        "If the user is editing an image, specify exactly what must change and what must stay untouched.",
        "Only mention background transparency, aspect ratio, or output constraints when the user explicitly needs them."
      ]
    }
  },
  gemini: {
    id: "gemini",
    label: "Gemini",
    subtitle: "Google",
    placeholder: "Décris ton idée, ton besoin, ou le prompt que tu veux rendre plus net pour Gemini.",
    promptReferenceTitle: "Gemini multimodal-clarity profile",
    promptReferenceSummary:
      "Derived from Gemini API guidance on text generation and structured output behavior.",
    promptReferenceSources: [
      {
        title: "Text generation | Gemini API | Google AI for Developers",
        url: "https://ai.google.dev/gemini-api/docs/text-generation"
      },
      {
        title: "Structured output | Gemini API | Google AI for Developers",
        url: "https://ai.google.dev/gemini-api/docs/structured-output"
      }
    ],
    promptReferenceRules: [
      "Keep prompts clear, direct, and multimodal-ready when text, image, audio, or video inputs are relevant.",
      "Prefer compact sections and explicit schemas when deterministic output structure matters.",
      "Optimize for fast comprehension while keeping constraints visible."
    ],
    imageGenerationProfile: {
      title: "Gemini image-generation profile",
      summary:
        "Google's official Gemini image-generation docs position Gemini 2.5 Flash Image as Nano Banana and Gemini 3 Pro Preview as Nano Banana Pro for conversational image generation and editing.",
      engineName: "gemini-2.5-flash-image (Nano Banana)",
      sources: [
        {
          title: "Image generation with Gemini | Google AI for Developers",
          url: "https://ai.google.dev/gemini-api/docs/image-generation"
        }
      ],
      promptReferenceRules: [
        "Write the prompt as a natural language visual request that can support both generation and iterative edits.",
        "Specify subject, composition, style, materials, lighting, camera feel, and any text placement in one coherent instruction.",
        "When the user is refining an existing image, preserve the unchanged elements explicitly and state the delta cleanly."
      ]
    }
  },
  claude: {
    id: "claude",
    label: "Claude",
    subtitle: "Anthropic",
    placeholder: "Décris ton idée, ton besoin, ou le prompt que tu veux rendre plus net pour Claude.",
    promptReferenceTitle: "Anthropic reliability profile",
    promptReferenceSummary:
      "Derived from the Anthropic prompt engineering reference bundled with this project.",
    promptReferenceSources: [
      {
        title: "Project-local Anthropic prompt engineering reference"
      }
    ],
    promptReferenceRules: [
      "Lean into XML organization, explicit constraints, and careful role or task separation.",
      "Favor durable behavioral rules and transparent success criteria over short-lived wording tricks.",
      "Keep instructions precise and reusable across future turns."
    ]
  },
  grok: {
    id: "grok",
    label: "Grok",
    subtitle: "xAI",
    placeholder: "Décris ton idée, ton besoin, ou le prompt que tu veux rendre plus net pour Grok.",
    promptReferenceTitle: "xAI stable-prefix profile",
    promptReferenceSummary:
      "Derived from xAI guidance on prompt caching, stable message prefixes, and Grok conversation best practices.",
    promptReferenceSources: [
      {
        title: "Best Practices & FAQ | xAI Prompt Caching",
        url: "https://docs.x.ai/developers/advanced-api-usage/prompt-caching/best-practices"
      }
    ],
    promptReferenceRules: [
      "Front-load stable system guidance, few-shot examples, and reusable reference material.",
      "Keep long-lived instructions unchanged across turns when possible, and append new user specifics instead of rewriting the prefix.",
      "Ask for crisp, execution-oriented outputs with explicit structure when consistency matters."
    ],
    imageGenerationProfile: {
      title: "xAI image-generation profile",
      summary:
        "xAI's image-generation guide uses Grok Imagine for text-to-image, editing, multi-turn refinement, and style transfer. Prompts should stay visually concrete and execution-oriented.",
      engineName: "grok-imagine-image",
      sources: [
        {
          title: "Image Generation | xAI",
          url: "https://docs.x.ai/docs/guides/image-generation"
        },
        {
          title: "Grok Imagine Image Pro | xAI",
          url: "https://docs.x.ai/developers/models/grok-imagine-image-pro"
        }
      ],
      promptReferenceRules: [
        "Prefer crisp, front-loaded scene descriptions with explicit style, composition, and material cues.",
        "If the request is about editing, describe the exact visual change while preserving everything else that should remain identical.",
        "Mention aspect ratio or framing intent only when the user's request makes the output format important."
      ]
    }
  },
  mistral: {
    id: "mistral",
    label: "Mistral",
    subtitle: "Mistral AI",
    placeholder: "Décris ton idée, ton besoin, ou le prompt que tu veux rendre plus net pour Mistral.",
    promptReferenceTitle: "Mistral compact-schema profile",
    promptReferenceSummary:
      "Derived from Mistral guidance on prompting capabilities and custom structured outputs.",
    promptReferenceSources: [
      {
        title: "Prompting Capabilities with Mistral AI",
        url: "https://docs.mistral.ai/cookbooks/mistral-prompting-prompting_capabilities"
      },
      {
        title: "Custom Structured Outputs | Mistral Docs",
        url: "https://docs.mistral.ai/capabilities/structured-output/custom_structured_output/"
      }
    ],
    promptReferenceRules: [
      "Use a clear system role and compact, high-signal instructions instead of verbose narrative framing.",
      "If output structure matters, define the exact JSON schema or required keys explicitly.",
      "Align creativity controls with the task and keep examples only when they materially improve reliability."
    ]
  },
  perplexity: {
    id: "perplexity",
    label: "Perplexity",
    subtitle: "Perplexity",
    placeholder:
      "Décris ton idée, ton besoin, ou le prompt que tu veux rendre plus net pour Perplexity.",
    promptReferenceTitle: "Perplexity grounded-research profile",
    promptReferenceSummary:
      "Derived from Perplexity guidance on prompt design, grounded search responses, and source handling.",
    promptReferenceSources: [
      {
        title: "Prompt Guide | Perplexity",
        url: "https://docs.perplexity.ai/docs/agentic-research/prompt-guide"
      },
      {
        title: "Core Features | Perplexity",
        url: "https://docs.perplexity.ai/guides/search-context-size-guide"
      }
    ],
    promptReferenceRules: [
      "For research or web-grounded tasks, specify recency, scope, and desired synthesis directly.",
      "Do not ask the model to invent inline source URLs when the platform already returns sources separately.",
      "Keep the final answer concise, evidence-aware, and shaped for downstream source rendering."
    ]
  }
};

export const TARGET_MODEL_OPTIONS = [
  TARGET_MODEL_CONFIG.chatgpt,
  TARGET_MODEL_CONFIG.gemini,
  TARGET_MODEL_CONFIG.claude,
  TARGET_MODEL_CONFIG.grok,
  TARGET_MODEL_CONFIG.mistral,
  TARGET_MODEL_CONFIG.perplexity
] as const;

export function getTargetModelConfig(targetModel: TargetModel) {
  return TARGET_MODEL_CONFIG[targetModel];
}

export function getTargetModelLabel(targetModel: TargetModel) {
  return TARGET_MODEL_CONFIG[targetModel].label;
}

export function formatTargetModelDocumentation(
  targetModel: TargetModel,
  options?: { includeImageGenerationProfile?: boolean }
) {
  const config = getTargetModelConfig(targetModel);
  const sourceBlock = config.promptReferenceSources
    .map((source) => (source.url ? `- ${source.title} (${source.url})` : `- ${source.title}`))
    .join("\n");
  const rulesBlock = config.promptReferenceRules.map((rule) => `- ${rule}`).join("\n");
  const includeImageGenerationProfile = options?.includeImageGenerationProfile ?? false;

  const imageGenerationBlock =
    includeImageGenerationProfile && config.imageGenerationProfile
      ? `

Image-generation profile: ${config.imageGenerationProfile.title}
${config.imageGenerationProfile.summary}
Preferred image engine: ${config.imageGenerationProfile.engineName}

Official image sources:
${config.imageGenerationProfile.sources
  .map((source) => (source.url ? `- ${source.title} (${source.url})` : `- ${source.title}`))
  .join("\n")}

Image prompt optimization rules:
${config.imageGenerationProfile.promptReferenceRules.map((rule) => `- ${rule}`).join("\n")}`
      : "";

  return `Documentation profile: ${config.promptReferenceTitle}
${config.promptReferenceSummary}

Official sources:
${sourceBlock}

Model-specific prompting rules:
${rulesBlock}${imageGenerationBlock}`;
}
