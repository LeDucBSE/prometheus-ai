export const ANTHROPIC_PROMPTING_REFERENCE = `
Anthropic prompt engineering reference for permanent use in this application.

This reference is derived from the Claude prompt engineering documentation supplied for this project.
It is the canonical guide for how prompts should be structured, refined, and delivered to downstream AI agents.

1. Core principles
- Be clear, direct, and explicit.
- Preserve the user's real intent while removing ambiguity.
- Add missing context when it improves performance.
- Explain why important constraints matter when that helps the model generalize correctly.
- Prefer telling the model what to do instead of only what not to do.

2. Prompt structure
- Assign a role when it sharpens behavior.
- Separate sections cleanly with descriptive XML tags such as <role>, <context>, <task>, <instructions>, <constraints>, <examples>, and <output_format>.
- Use numbered steps when order, completeness, or sequencing matters.
- Keep inputs, instructions, examples, and formatting requirements distinct.
- For long-context tasks, place large source material before the actual query.

3. Examples and few-shot guidance
- Use relevant examples that closely match the real task.
- Prefer 3 to 5 examples when examples materially improve reliability.
- Wrap examples in <example> or <examples> tags.
- Make examples diverse enough to cover edge cases and avoid accidental pattern overfitting.

4. Output control
- State the desired output shape explicitly.
- Define format, tone, completeness, and constraints.
- If prose is preferred, say so directly.
- If markdown should be limited, say what formatting is allowed instead.
- Avoid unnecessary preambles when the response should begin directly.

5. Tool and action behavior
- If action is desired, instruct the model to execute changes rather than merely suggest them.
- If the task is ambiguous, infer the most useful likely action and investigate before guessing.
- Use tools when they materially improve accuracy or execution.
- Prefer parallel tool calls only when there are no dependencies between them.
- Do not guess missing tool parameters.

6. Reasoning and thinking
- Use extra reasoning only when it meaningfully improves quality.
- Avoid excessive exploration, overthinking, and repeated reconsideration without new evidence.
- Commit to a sensible plan and course-correct only when new information requires it.
- For complex tasks, reflect after tool results before taking the next step.
- Ask the model to self-check important outputs before finishing.

7. Agentic behavior
- Persist on long tasks and make incremental progress.
- Track state clearly for multi-step workflows.
- Use structured state when helpful, such as JSON for task status.
- Prefer minimal, focused implementations over overengineering.
- Avoid creating unnecessary files, abstractions, or speculative flexibility.
- Do not optimize only for passing tests; implement general solutions.
- Never speculate about code or files that have not been opened.

8. Safety and reversibility
- Local, reversible actions are encouraged.
- Destructive or hard-to-reverse actions require confirmation.
- Do not delete, force-push, discard work, or bypass safety checks as a shortcut.
- Treat shared systems and visible external actions with extra caution.

9. Long-context and document workflows
- Put large documents first, then the query.
- Use XML metadata to separate documents and sources.
- Ask for quotes or grounded excerpts before synthesis when accuracy matters.
- Ground conclusions in source material instead of vague summaries.

10. Formatting for production prompts
- Prompts should be professional, implementation-ready, and easy to reuse.
- Include success criteria when useful.
- Include output-format instructions whenever the response shape matters.
- Keep solutions simple unless complexity is clearly required.
- Avoid generic filler and decorative prompt language.
- Do not use emojis or decorative symbols anywhere in a transformed prompt. Use plain text, numbered steps, XML tags, or clean section headings as the only structural organizing tools.

11. Frontend and coding guidance
- For frontend tasks, avoid generic "AI slop" aesthetics and choose a coherent visual direction.
- For coding tasks, prefer high-quality general solutions over shortcuts.
- Avoid unnecessary helper scripts, net new abstractions, and one-off workarounds.
- Add comments only when they help a reader understand non-obvious logic.

12. Migration and model behavior
- Modern Claude models are more proactive, so prompts should avoid overly aggressive tool-triggering language.
- Be specific about the desired output and degree of initiative.
- Prefer adaptive thinking configuration when available, and choose effort level intentionally.

13. Permanent policy for this app
- Every transformed prompt produced by this application should make downstream AI behavior more professional, structured, and reliable.
- For direct execution prompts, apply these principles implicitly — do not add meta-instructions or structural boilerplate that bloats a one-off request.
- Only make the transformed prompt behave like a durable system or developer instruction layer when the user's request explicitly calls for an assistant, agent, or reusable workflow setup.

14. Target-model adaptation
- The transformed prompt must adapt to the destination model selected by the user.
- Different target models can respond differently to tone, structure, verbosity, formatting, and tool guidance.
- The prompt should explicitly state which destination model it is optimized for.
- The prompt should tune wording and emphasis so the selected model receives the clearest, most effective instruction style.
- If Claude is selected, prefer XML structure, clear constraints, and Anthropic-style prompt organization.
- If Gemini is selected, preserve strong structure while emphasizing clarity, multimodal readiness, and concise task framing.
- If ChatGPT is selected, preserve strong structure while emphasizing direct instructions, explicit output contracts, and actionable step-by-step guidance.
- If Grok is selected, preserve a stable instruction prefix, front-load reusable guidance, and keep the wording crisp.
- If Mistral is selected, favor compact prompts, explicit schemas, and minimal but precise instruction framing.
- If Perplexity is selected, emphasize grounded synthesis, research scoping, recency, and source-aware answer shaping.
`.trim();
