export const useCasePrimaryIds = [
  "text",
  "image",
  "code",
  "website-app",
  "ai-agent",
  "research",
  "marketing",
  "learning",
  "documents",
  "other"
] as const;

export type UseCasePrimary = (typeof useCasePrimaryIds)[number];

type UseCaseSubcaseOption = {
  id: string;
  label: string;
  rules: readonly string[];
};

type UseCaseOption = {
  id: UseCasePrimary;
  label: string;
  rules: readonly string[];
  subcases: readonly [UseCaseSubcaseOption, ...UseCaseSubcaseOption[]];
};

export const DEFAULT_USE_CASE_PRIMARY: UseCasePrimary = "other";
export const DEFAULT_USE_CASE_SECONDARY = "general";

export const USE_CASE_OPTIONS = [
  {
    id: "text",
    label: "Text",
    rules: [
      "Frame the prompt around audience, tone, structure, and a clear output contract.",
      "Pull out purpose, source material, and writing constraints so the downstream model can write consistently."
    ],
    subcases: [
      {
        id: "article",
        label: "Article",
        rules: ["Ask for thesis, target reader, structure depth, and citation expectations when relevant."]
      },
      {
        id: "social-post",
        label: "Social post",
        rules: ["Optimize for hook, platform fit, brevity, and a single strong CTA."]
      },
      {
        id: "email",
        label: "Email",
        rules: ["Clarify recipient, desired tone, response goal, and the exact call to action."]
      },
      {
        id: "script",
        label: "Script",
        rules: ["Shape the prompt around pacing, spoken clarity, beats, and optional scene or segment markers."]
      },
      {
        id: "sales-copy",
        label: "Sales copy",
        rules: ["Emphasize offer framing, objections, proof, urgency, and conversion intent."]
      },
      {
        id: "summary",
        label: "Summary",
        rules: ["Prioritize faithful compression, key takeaways, and explicit omissions of unsupported detail."]
      },
      {
        id: "rewrite",
        label: "Rewrite",
        rules: ["Require preservation of meaning while changing tone, clarity, or structure with minimal drift."]
      }
    ]
  },
  {
    id: "image",
    label: "Image",
    rules: [
      "Structure the prompt around subject, composition, style, lighting, detail, and useful negative constraints.",
      "Encourage concrete visual descriptors instead of abstract intent whenever the source prompt is vague.",
      "Default to a single paste-ready image prompt, not a meta analysis about prompting, unless the user explicitly asks for strategy or diagnosis."
    ],
    subcases: [
      {
        id: "general-image",
        label: "General image",
        rules: [
          "Keep the visual style flexible until the user specifies it, and prioritize a clean, paste-ready image prompt over narrow stylistic assumptions."
        ]
      },
      {
        id: "photorealistic",
        label: "Photorealistic",
        rules: ["Use camera, lens, lighting, realism, texture, and environmental detail cues."]
      },
      {
        id: "illustration",
        label: "Illustration",
        rules: ["Specify illustration style, line quality, palette, rendering approach, and mood."]
      },
      {
        id: "ad-creative",
        label: "Ad creative",
        rules: ["Emphasize product prominence, campaign message, brand clarity, and conversion-oriented composition."]
      },
      {
        id: "thumbnail-cover",
        label: "Thumbnail/Cover",
        rules: ["Optimize for glanceability, focal hierarchy, bold framing, and high-contrast visual readability."]
      },
      {
        id: "poster",
        label: "Poster",
        rules: ["Focus on central concept, layout balance, dramatic composition, and headline-safe space."]
      },
      {
        id: "ui-mockup",
        label: "UI mockup",
        rules: ["Describe interface context, layout zones, component hierarchy, and product mood without vague fluff."]
      },
      {
        id: "character",
        label: "Character",
        rules: ["Clarify silhouette, clothing, expression, pose, world context, and repeatable design traits."]
      },
      {
        id: "product-visual",
        label: "Product visual",
        rules: ["Highlight product angle, material fidelity, lighting setup, backdrop, and merchandising intent."]
      }
    ]
  },
  {
    id: "code",
    label: "Code",
    rules: [
      "Require language or framework context, inputs, constraints, edge cases, and the expected delivery format.",
      "Distinguish clearly between generating, debugging, refactoring, explaining, or validating code."
    ],
    subcases: [
      {
        id: "generate",
        label: "Generate",
        rules: ["Ask for target language, runtime, interfaces, and the exact artifact to return."]
      },
      {
        id: "debug",
        label: "Debug",
        rules: ["Prioritize failure symptoms, reproduction clues, likely root causes, and verification steps."]
      },
      {
        id: "refactor",
        label: "Refactor",
        rules: ["Preserve behavior while improving structure, readability, and maintainability under explicit constraints."]
      },
      {
        id: "explain",
        label: "Explain",
        rules: ["Optimize for step-by-step reasoning, code walkthrough clarity, and vocabulary matched to the audience."]
      },
      {
        id: "tests",
        label: "Tests",
        rules: ["Focus on coverage intent, edge cases, framework conventions, and how to validate correctness."]
      },
      {
        id: "documentation",
        label: "Documentation",
        rules: ["Require accurate API or behavior descriptions, setup assumptions, and usage examples when helpful."]
      },
      {
        id: "sql",
        label: "SQL",
        rules: ["Clarify schema assumptions, performance expectations, filters, joins, and output columns."]
      },
      {
        id: "script",
        label: "Script",
        rules: ["Shape the prompt around automation goal, environment, inputs, outputs, and safety constraints."]
      }
    ]
  },
  {
    id: "website-app",
    label: "Website/App",
    rules: [
      "Clarify product context, target user, page or screen type, sections, flows, and any stack constraints.",
      "Push the transformed prompt toward concrete UX intent, content structure, and implementation boundaries."
    ],
    subcases: [
      {
        id: "landing-page",
        label: "Landing page",
        rules: ["Emphasize headline promise, section flow, proof, CTA, and conversion-driven hierarchy."]
      },
      {
        id: "dashboard",
        label: "Dashboard",
        rules: ["Focus on information hierarchy, operator tasks, data freshness, and decision-making surfaces."]
      },
      {
        id: "ui-component",
        label: "UI component",
        rules: ["Clarify the component's purpose, states, variants, interactions, and integration context."]
      },
      {
        id: "full-app",
        label: "Full app",
        rules: ["Structure around product goals, key flows, architecture boundaries, and feature prioritization."]
      },
      {
        id: "mvp",
        label: "MVP",
        rules: ["Prioritize minimum lovable scope, launch-critical flows, and deliberate omissions."]
      },
      {
        id: "design-system",
        label: "Design system",
        rules: ["Require tokens, components, states, accessibility, and governance expectations."]
      },
      {
        id: "product-spec",
        label: "Product spec",
        rules: ["Optimize for problem framing, requirements, user stories, success metrics, and tradeoffs."]
      }
    ]
  },
  {
    id: "ai-agent",
    label: "AI Agent",
    rules: [
      "Make the result read like a reusable system package with objectives, tools, rules, escalation, and failure handling.",
      "Require durable behavior, handoff boundaries, and stop conditions when the task implies ongoing autonomy."
    ],
    subcases: [
      {
        id: "system-prompt",
        label: "System prompt",
        rules: ["Emphasize persistent behavior, operating rules, tone, and non-negotiable constraints."]
      },
      {
        id: "tool-using-agent",
        label: "Tool-using agent",
        rules: ["Clarify when tools should be invoked, how outputs are verified, and how failures are surfaced."]
      },
      {
        id: "research-agent",
        label: "Research agent",
        rules: ["Require source quality standards, uncertainty reporting, synthesis logic, and citation behavior."]
      },
      {
        id: "support-agent",
        label: "Support agent",
        rules: ["Optimize for resolution flow, empathy, policy adherence, and escalation thresholds."]
      },
      {
        id: "workflow-automation",
        label: "Workflow automation",
        rules: ["Specify triggers, decision gates, retries, completion criteria, and safe fallbacks."]
      },
      {
        id: "multi-step-task",
        label: "Multi-step task",
        rules: ["Require planning, intermediate validation, checkpointing, and explicit completion conditions."]
      }
    ]
  },
  {
    id: "research",
    label: "Research",
    rules: [
      "Define scope, decision framework, evidence standards, uncertainty handling, and the synthesis format.",
      "Push the prompt toward explicit assumptions, comparators, and transparent reasoning rather than vague summaries."
    ],
    subcases: [
      {
        id: "market-research",
        label: "Market research",
        rules: ["Clarify market definition, segments, demand signals, competitors, and buying dynamics."]
      },
      {
        id: "competitive-analysis",
        label: "Competitive analysis",
        rules: ["Require comparison axes, strengths and weaknesses, differentiation, and evidence-backed positioning."]
      },
      {
        id: "strategic-analysis",
        label: "Strategic analysis",
        rules: ["Structure around objectives, tradeoffs, options, risks, and recommended action paths."]
      },
      {
        id: "trend-scan",
        label: "Trend scan",
        rules: ["Focus on emerging patterns, drivers, signals versus noise, and likely implications."]
      },
      {
        id: "regulatory-scan",
        label: "Regulatory scan",
        rules: ["Require jurisdiction scope, compliance relevance, notable changes, and uncertainty flags."]
      },
      {
        id: "insight-extraction",
        label: "Insight extraction",
        rules: ["Optimize for patterns, anomalies, takeaways, and action-ready observations from source material."]
      }
    ]
  },
  {
    id: "marketing",
    label: "Marketing",
    rules: [
      "Anchor the prompt in ICP, channel, conversion goal, objections, offer mechanics, and CTA structure.",
      "Favor concrete positioning, message discipline, and measurable action over generic brand language."
    ],
    subcases: [
      {
        id: "offer",
        label: "Offer",
        rules: ["Clarify value proposition, pricing logic, urgency, bonuses, and decision drivers."]
      },
      {
        id: "messaging",
        label: "Messaging",
        rules: ["Focus on positioning, differentiators, audience language, and message hierarchy."]
      },
      {
        id: "ads",
        label: "Ads",
        rules: ["Optimize for hook, platform fit, scroll-stopping angles, and conversion CTA."]
      },
      {
        id: "email-sequence",
        label: "Email sequence",
        rules: ["Require sequence goal, narrative progression, send cadence assumptions, and CTA progression."]
      },
      {
        id: "funnel",
        label: "Funnel",
        rules: ["Clarify traffic source, stage-by-stage intent, objections, and conversion handoffs."]
      },
      {
        id: "branding",
        label: "Branding",
        rules: ["Structure around perception goals, tone, values, and distinctive brand assets."]
      },
      {
        id: "naming",
        label: "Naming",
        rules: ["Require naming criteria, linguistic constraints, tone, and filtering logic for bad options."]
      }
    ]
  },
  {
    id: "learning",
    label: "Learning",
    rules: [
      "Set the pedagogy level, progression, examples, and comprehension checks to match the learner's needs.",
      "Optimize for clarity, scaffolding, and retention rather than just restating information."
    ],
    subcases: [
      {
        id: "explain-concept",
        label: "Explain concept",
        rules: ["Tailor depth, analogies, and prerequisite framing to the learner's level."]
      },
      {
        id: "study-notes",
        label: "Study notes",
        rules: ["Organize into digestible headings, definitions, examples, and memory cues."]
      },
      {
        id: "quiz",
        label: "Quiz",
        rules: ["Specify question types, difficulty, answer key expectations, and feedback style."]
      },
      {
        id: "methodology",
        label: "Methodology",
        rules: ["Clarify process steps, rationale, common mistakes, and when to use the method."]
      },
      {
        id: "practice-questions",
        label: "Practice questions",
        rules: ["Focus on progressive difficulty, coverage, and optional worked solutions."]
      },
      {
        id: "simplification",
        label: "Simplification",
        rules: ["Reduce jargon, keep the core truth intact, and use concrete examples."]
      }
    ]
  },
  {
    id: "documents",
    label: "Documents",
    rules: [
      "Optimize for extraction, standardization, action-oriented formatting, and faithful handling of source material.",
      "Require a stable structure so the downstream output can be reused operationally."
    ],
    subcases: [
      {
        id: "meeting-notes",
        label: "Meeting notes",
        rules: ["Capture decisions, open questions, owners, and next steps with clear chronology."]
      },
      {
        id: "sop",
        label: "SOP",
        rules: ["Require prerequisites, step order, exceptions, and QA or review checkpoints."]
      },
      {
        id: "checklist",
        label: "Checklist",
        rules: ["Optimize for concise action items, logical ordering, and completion verifiability."]
      },
      {
        id: "internal-doc",
        label: "Internal doc",
        rules: ["Clarify audience, context, standards, and long-term maintainability."]
      },
      {
        id: "action-extraction",
        label: "Action extraction",
        rules: ["Prioritize owners, deadlines, blockers, and implied follow-ups from the source material."]
      },
      {
        id: "structured-summary",
        label: "Structured summary",
        rules: ["Produce a normalized summary with sections, key points, and explicit gaps or unknowns."]
      }
    ]
  },
  {
    id: "other",
    label: "Other",
    rules: [
      "Use a flexible, high-clarity transformation that still adds role framing, constraints, and an explicit output contract.",
      "Avoid inventing domain-specific structure unless the user's raw prompt strongly implies it."
    ],
    subcases: [
      {
        id: "general",
        label: "General",
        rules: ["Keep the transformed prompt broadly useful, specific, and easy to adapt."]
      }
    ]
  }
] as const satisfies readonly UseCaseOption[];

export type UseCaseSecondary = (typeof USE_CASE_OPTIONS)[number]["subcases"][number]["id"];

type UseCaseConfigMap = {
  [K in UseCasePrimary]: Extract<(typeof USE_CASE_OPTIONS)[number], { id: K }>;
};

export const useCaseConfig = Object.fromEntries(
  USE_CASE_OPTIONS.map((option) => [option.id, option])
) as UseCaseConfigMap;

export const useCaseRules = Object.fromEntries(
  USE_CASE_OPTIONS.map((option) => [option.id, option.rules])
) as unknown as Record<UseCasePrimary, readonly string[]>;

export const subcaseRules = Object.fromEntries(
  USE_CASE_OPTIONS.map((option) => [
    option.id,
    Object.fromEntries(option.subcases.map((subcase) => [subcase.id, subcase.rules]))
  ])
) as unknown as Record<UseCasePrimary, Record<string, readonly string[]>>;

export function isUseCasePrimary(value: string | null | undefined): value is UseCasePrimary {
  return Boolean(value && value in useCaseConfig);
}

export function getSubcaseOptions(primary: UseCasePrimary) {
  return useCaseConfig[primary].subcases;
}

export function getDefaultSubcase(primary: UseCasePrimary) {
  return getSubcaseOptions(primary)[0]?.id ?? DEFAULT_USE_CASE_SECONDARY;
}

export function getUseCaseLabel(primary: UseCasePrimary) {
  return useCaseConfig[primary].label;
}

export function getSubcaseLabel(primary: UseCasePrimary, secondary: string) {
  const matchedSubcase = getSubcaseOptions(primary).find((subcase) => subcase.id === secondary);
  return matchedSubcase?.label ?? getSubcaseOptions(primary)[0]?.label ?? "General";
}

export function normalizeUseCaseSelection(
  primary?: UseCasePrimary | null,
  secondary?: string | null
) {
  const resolvedPrimary =
    primary && isUseCasePrimary(primary) ? primary : DEFAULT_USE_CASE_PRIMARY;
  const availableSubcases = getSubcaseOptions(resolvedPrimary);
  const fallbackSecondary = availableSubcases[0]?.id ?? DEFAULT_USE_CASE_SECONDARY;
  const resolvedSecondary =
    secondary && availableSubcases.some((subcase) => subcase.id === secondary)
      ? secondary
      : fallbackSecondary;

  return {
    primary: resolvedPrimary,
    secondary: resolvedSecondary,
    primaryLabel: getUseCaseLabel(resolvedPrimary),
    secondaryLabel: getSubcaseLabel(resolvedPrimary, resolvedSecondary)
  };
}
