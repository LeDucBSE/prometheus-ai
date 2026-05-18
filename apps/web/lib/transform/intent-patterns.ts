import type { UseCasePrimary } from "@/lib/transform/use-cases";

export type UseCasePatternDefinition = {
  primary: UseCasePrimary;
  primaryPatterns: readonly RegExp[];
  subcases: readonly {
    id: string;
    patterns: readonly RegExp[];
  }[];
};

export const USE_CASE_PATTERN_DEFINITIONS: readonly UseCasePatternDefinition[] = [
  {
    primary: "text",
    primaryPatterns: [
      /\b(write|rewrite|draft|compose|rediger|ecrire|reformuler)\b/i,
      /\b(article|blog|post|newsletter|copy|contenu)\b/i,
      /\b(email|e-mail|mail|message|lettre)\b/i,
      /\b(script|scenario|voiceover|narration)\b/i,
      /\b(summary|summarize|resume|synthese|synthetiser)\b/i,
      /\b(tone|style|wording|formulation|phrasing)\b/i
    ],
    subcases: [
      {
        id: "article",
        patterns: [/\barticle\b/i, /\bblog\b/i, /\blong[- ]form\b/i, /\bdeep dive\b/i, /\bchronique\b/i]
      },
      {
        id: "social-post",
        patterns: [
          /\b(linkedin|twitter|x\.com|instagram|tiktok|thread|social)\b/i,
          /\bpost\b/i,
          /\bcaption\b/i,
          /\breel\b/i
        ]
      },
      {
        id: "email",
        patterns: [/\bemail\b/i, /\be-mail\b/i, /\bmail\b/i, /\bfollow[- ]up\b/i, /\bcold outreach\b/i]
      },
      {
        id: "script",
        patterns: [/\bscript\b/i, /\bscenario\b/i, /\bvoiceover\b/i, /\bmonologue\b/i, /\bscene\b/i]
      },
      {
        id: "sales-copy",
        patterns: [
          /\bsales\b/i,
          /\blanding copy\b/i,
          /\bconversion\b/i,
          /\boffer\b/i,
          /\bpitch\b/i,
          /\bobjection\b/i
        ]
      },
      {
        id: "summary",
        patterns: [/\bsummary\b/i, /\bsummarize\b/i, /\bresume\b/i, /\bsynthese\b/i, /\btl;dr\b/i]
      },
      {
        id: "rewrite",
        patterns: [/\brewrite\b/i, /\breformuler\b/i, /\bpolish\b/i, /\bimprove\b/i, /\bclarif/i]
      }
    ]
  },
  {
    primary: "image",
    primaryPatterns: [
      /\bimage\b/i,
      /\bphoto\b/i,
      /\billustration\b/i,
      /\bvisual\b/i,
      /\bvisuel\b/i,
      /\bposter\b/i,
      /\baffiche\b/i,
      /\bthumbnail\b/i,
      /\blogo\b/i,
      /\bmockup\b/i,
      /\btext(?: |-)?to(?: |-)?image\b/i
    ],
    subcases: [
      {
        id: "thumbnail-cover",
        patterns: [/\bthumbnail\b/i, /\bcover\b/i, /\bminiature\b/i, /\byoutube\b/i]
      },
      {
        id: "poster",
        patterns: [/\bposter\b/i, /\baffiche\b/i, /\bflyer\b/i]
      },
      {
        id: "ui-mockup",
        patterns: [/\bui\b/i, /\binterface\b/i, /\bmockup\b/i, /\bmaquette\b/i, /\bscreen\b/i]
      },
      {
        id: "character",
        patterns: [/\bcharacter\b/i, /\bpersonnage\b/i, /\bavatar\b/i, /\bmascot\b/i]
      },
      {
        id: "product-visual",
        patterns: [/\bproduct\b/i, /\bpackshot\b/i, /\bmerch\b/i, /\be-commerce\b/i]
      },
      {
        id: "ad-creative",
        patterns: [/\bad creative\b/i, /\bcampaign\b/i, /\bpublicite\b/i, /\bads?\b/i]
      },
      {
        id: "illustration",
        patterns: [/\billustration\b/i, /\banime\b/i, /\bdrawing\b/i, /\bvector\b/i, /\bdessin\b/i]
      },
      {
        id: "photorealistic",
        patterns: [/\bphotorealistic\b/i, /\brealistic\b/i, /\bcinematic\b/i, /\bportrait\b/i, /\bshot\b/i]
      },
      {
        id: "general-image",
        patterns: [/\bgenerate\b/i, /\bcreate\b/i, /\brender\b/i, /\bedit\b/i, /\bgenerer\b/i, /\bcreer\b/i]
      }
    ]
  },
  {
    primary: "code",
    primaryPatterns: [
      /\b(code|coding|program|script|function|class|api|bug|debug|refactor|test|sql)\b/i,
      /\b(typescript|javascript|python|rust|go|java|react|next\.js|node)\b/i,
      /\b(stack trace|error|exception|lint|unit test)\b/i
    ],
    subcases: [
      { id: "generate", patterns: [/\bgenerate\b/i, /\bscaffold\b/i, /\bimplement\b/i, /\bbuild\b/i, /\bcreer\b/i] },
      { id: "debug", patterns: [/\bdebug\b/i, /\bfix\b/i, /\bbug\b/i, /\berror\b/i, /\bstack trace\b/i] },
      {
        id: "refactor",
        patterns: [/\brefactor\b/i, /\bclean up\b/i, /\brestructure\b/i, /\bsimplify\b/i]
      },
      { id: "explain", patterns: [/\bexplain\b/i, /\bwalkthrough\b/i, /\bhow does\b/i, /\bcomprendre\b/i] },
      { id: "tests", patterns: [/\btest\b/i, /\bunit test\b/i, /\bcoverage\b/i, /\bjest\b/i, /\bvitest\b/i] },
      {
        id: "documentation",
        patterns: [/\bdocumentation\b/i, /\bdocstring\b/i, /\breadme\b/i, /\bapi doc\b/i]
      },
      { id: "sql", patterns: [/\bsql\b/i, /\bquery\b/i, /\bpostgres\b/i, /\bmigration\b/i, /\bjoin\b/i] },
      { id: "script", patterns: [/\bautomation\b/i, /\bcli\b/i, /\bbash\b/i, /\bcron\b/i, /\bpipeline\b/i] }
    ]
  },
  {
    primary: "website-app",
    primaryPatterns: [
      /\b(website|web app|landing|dashboard|ui|ux|frontend|screen|page|component)\b/i,
      /\b(design system|mvp|product spec|wireframe|prototype)\b/i,
      /\b(site web|application|maquette|interface)\b/i
    ],
    subcases: [
      { id: "landing-page", patterns: [/\blanding\b/i, /\bhomepage\b/i, /\bhero\b/i, /\bpage d accueil\b/i] },
      { id: "dashboard", patterns: [/\bdashboard\b/i, /\banalytics\b/i, /\badmin\b/i, /\bconsole\b/i] },
      { id: "ui-component", patterns: [/\bcomponent\b/i, /\bmodal\b/i, /\bnavbar\b/i, /\bbutton\b/i, /\bcard\b/i] },
      { id: "full-app", patterns: [/\bfull app\b/i, /\bapplication complete\b/i, /\bplatform\b/i, /\bsaas\b/i] },
      { id: "mvp", patterns: [/\bmvp\b/i, /\bminimum viable\b/i, /\blaunch scope\b/i] },
      { id: "design-system", patterns: [/\bdesign system\b/i, /\btokens\b/i, /\bcomponent library\b/i] },
      {
        id: "product-spec",
        patterns: [/\bproduct spec\b/i, /\bprd\b/i, /\brequirements\b/i, /\buser stor/i]
      }
    ]
  },
  {
    primary: "ai-agent",
    primaryPatterns: [
      /\b(agent|assistant|chatbot|copilot|workflow|automation|tool use|mcp)\b/i,
      /\b(system prompt|developer prompt|multi-step)\b/i,
      /\b(agent ia|assistant ia|automatisation)\b/i
    ],
    subcases: [
      { id: "system-prompt", patterns: [/\bsystem prompt\b/i, /\bpersistent\b/i, /\binstructions durables\b/i] },
      { id: "tool-using-agent", patterns: [/\btool\b/i, /\bfunction call\b/i, /\bmcp\b/i, /\bapi call\b/i] },
      {
        id: "research-agent",
        patterns: [/\bresearch agent\b/i, /\bcitation\b/i, /\bsource\b/i, /\bgrounded\b/i]
      },
      {
        id: "support-agent",
        patterns: [/\bsupport\b/i, /\bcustomer service\b/i, /\bticket\b/i, /\bhelpdesk\b/i]
      },
      {
        id: "workflow-automation",
        patterns: [/\bworkflow\b/i, /\btrigger\b/i, /\borchestrat/i, /\bpipeline\b/i]
      },
      {
        id: "multi-step-task",
        patterns: [/\bmulti[- ]step\b/i, /\bplan\b/i, /\bcheckpoint\b/i, /\blong[- ]running\b/i]
      }
    ]
  },
  {
    primary: "research",
    primaryPatterns: [
      /\b(research|analysis|benchmark|competitive|market|trend|regulatory|insight)\b/i,
      /\b(etude|analyse|concurrence|marche|tendance|reglementation)\b/i
    ],
    subcases: [
      { id: "market-research", patterns: [/\bmarket\b/i, /\btam\b/i, /\bsegment\b/i, /\bdemand\b/i] },
      {
        id: "competitive-analysis",
        patterns: [/\bcompetitive\b/i, /\bcompetitor\b/i, /\bbenchmark\b/i, /\bpositioning\b/i]
      },
      {
        id: "strategic-analysis",
        patterns: [/\bstrategic\b/i, /\bstrategy\b/i, /\btradeoff\b/i, /\boption\b/i]
      },
      { id: "trend-scan", patterns: [/\btrend\b/i, /\bemerging\b/i, /\bsignal\b/i, /\bhorizon\b/i] },
      {
        id: "regulatory-scan",
        patterns: [/\bregulatory\b/i, /\bcompliance\b/i, /\bgdpr\b/i, /\blaw\b/i, /\breglementation\b/i]
      },
      {
        id: "insight-extraction",
        patterns: [/\binsight\b/i, /\bpattern\b/i, /\bextract\b/i, /\bsynthesis\b/i]
      }
    ]
  },
  {
    primary: "marketing",
    primaryPatterns: [
      /\b(marketing|campaign|ads?|funnel|branding|messaging|offer|cta|icp)\b/i,
      /\b(publicite|marque|positionnement|conversion)\b/i
    ],
    subcases: [
      { id: "offer", patterns: [/\boffer\b/i, /\bpricing\b/i, /\bpackage\b/i, /\bvalue prop\b/i] },
      { id: "messaging", patterns: [/\bmessaging\b/i, /\bpositioning\b/i, /\bheadline\b/i, /\bangle\b/i] },
      { id: "ads", patterns: [/\bads?\b/i, /\bad copy\b/i, /\bmeta ads\b/i, /\bgoogle ads\b/i] },
      { id: "email-sequence", patterns: [/\bemail sequence\b/i, /\bdrip\b/i, /\bnurture\b/i, /\bsequence\b/i] },
      { id: "funnel", patterns: [/\bfunnel\b/i, /\blead\b/i, /\bconversion path\b/i] },
      { id: "branding", patterns: [/\bbranding\b/i, /\bbrand voice\b/i, /\bidentity\b/i, /\bmarque\b/i] },
      { id: "naming", patterns: [/\bnaming\b/i, /\bname ideas\b/i, /\bbrand name\b/i] }
    ]
  },
  {
    primary: "learning",
    primaryPatterns: [
      /\b(learn|teach|explain|quiz|study|course|lesson|pedagog|tutor)\b/i,
      /\b(apprendre|expliquer|cours|quiz|pedagogie|formation)\b/i
    ],
    subcases: [
      { id: "explain-concept", patterns: [/\bexplain\b/i, /\bconcept\b/i, /\blike i am\b/i, /\beli5\b/i] },
      { id: "study-notes", patterns: [/\bstudy notes\b/i, /\bnotes de cours\b/i, /\bfiche\b/i] },
      { id: "quiz", patterns: [/\bquiz\b/i, /\bquestion\b/i, /\bflashcard\b/i] },
      { id: "methodology", patterns: [/\bmethodology\b/i, /\bframework\b/i, /\bprocess\b/i, /\bmethode\b/i] },
      {
        id: "practice-questions",
        patterns: [/\bpractice\b/i, /\bexercise\b/i, /\bproblem set\b/i, /\bexercice\b/i]
      },
      { id: "simplification", patterns: [/\bsimplify\b/i, /\bsimplif/i, /\bbeginner\b/i, /\bdebutant\b/i] }
    ]
  },
  {
    primary: "documents",
    primaryPatterns: [
      /\b(document|meeting notes|minutes|sop|checklist|memo|report|pdf)\b/i,
      /\b(compte rendu|reunion|procedure|checklist|note)\b/i,
      /\b(action items|next steps|owners)\b/i
    ],
    subcases: [
      {
        id: "meeting-notes",
        patterns: [/\bmeeting\b/i, /\bminutes\b/i, /\breunion\b/i, /\bcompte rendu\b/i]
      },
      { id: "sop", patterns: [/\bsop\b/i, /\bprocedure\b/i, /\bplaybook\b/i, /\bprocess doc\b/i] },
      { id: "checklist", patterns: [/\bchecklist\b/i, /\blist of tasks\b/i, /\bto-do list\b/i] },
      { id: "internal-doc", patterns: [/\binternal doc\b/i, /\bpolicy\b/i, /\bguideline\b/i, /\bwiki\b/i] },
      {
        id: "action-extraction",
        patterns: [/\baction items\b/i, /\bfollow[- ]ups\b/i, /\bowners\b/i, /\bdeadlines\b/i]
      },
      {
        id: "structured-summary",
        patterns: [/\bstructured summary\b/i, /\bexecutive summary\b/i, /\bsynthese structuree\b/i]
      }
    ]
  }
];

export const promptRequestPatterns = [
  /\bprompt\b/i,
  /\bprompts\b/i,
  /\bwording\b/i,
  /\bformulation\b/i,
  /\bphrase it\b/i,
  /\bhow do i write\b/i,
  /\bwrite me\b/i,
  /\bwrite the prompt\b/i,
  /\btexte a coller\b/i,
  /\ba coller\b/i,
  /\bcopy(?: |-)?paste\b/i,
  /\bcopier(?: |-)?coller\b/i,
  /\brends?-moi le prompt\b/i,
  /\bdonne(?:s)?-moi le prompt\b/i,
  /\bquel prompt\b/i,
  /\bwhat prompt\b/i
] as const;

export const imageGenerationPatterns = [
  /\bgenerate\b.{0,24}\b(image|photo|illustration|poster|visual|logo)\b/i,
  /\bcreate\b.{0,24}\b(image|photo|illustration|poster|visual|logo)\b/i,
  /\bmake\b.{0,24}\b(image|photo|illustration|poster|visual|logo)\b/i,
  /\brender\b.{0,24}\b(image|photo|illustration|poster|visual|logo)\b/i,
  /\bedit\b.{0,24}\b(image|photo|illustration|poster|visual|logo)\b/i,
  /\bgenerer\b.{0,24}\b(image|photo|illustration|affiche|visuel|logo)\b/i,
  /\bcreer\b.{0,24}\b(image|photo|illustration|affiche|visuel|logo)\b/i,
  /\brendre\b.{0,24}\b(image|photo|illustration|affiche|visuel|logo)\b/i,
  /\bmodifier\b.{0,24}\b(image|photo|illustration|affiche|visuel|logo)\b/i,
  /\btext(?: |-)?to(?: |-)?image\b/i,
  /\bimage generation\b/i,
  /\bgeneration d image\b/i
] as const;
