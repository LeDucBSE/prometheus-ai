import { describe, expect, it } from "vitest";
import { buildTransformUserContent } from "@/lib/transform/service";
import type { TransformAttachment } from "@/lib/transform/schemas";

describe("transform service", () => {
  it("builds multimodal user content with attachment inventory", () => {
    const attachments: TransformAttachment[] = [
      {
        kind: "text",
        name: "notes.md",
        relative_path: "notes.md",
        size_bytes: 128,
        media_type: "text/plain",
        content: "# Notes"
      },
      {
        kind: "image",
        name: "cover.png",
        relative_path: "assets/cover.png",
        size_bytes: 256,
        media_type: "image/png",
        data_base64: "aGVsbG8="
      },
      {
        kind: "pdf",
        name: "brief.pdf",
        relative_path: "docs/brief.pdf",
        size_bytes: 512,
        media_type: "application/pdf",
        data_base64: "cGRm"
      }
    ];

    const content = buildTransformUserContent("Rewrite this into a stronger prompt.", attachments);

    expect(Array.isArray(content)).toBe(true);
    expect(content[0]).toMatchObject({
      type: "text"
    });
    expect("text" in content[0] && content[0].text).toContain("Attached source material (mandatory input):");
    expect("text" in content[0] && content[0].text).toContain("Read every attached file");
    expect("text" in content[0] && content[0].text).toContain("- notes.md (text file)");
    expect(content[1]).toMatchObject({
      type: "document",
      title: "notes.md"
    });
    expect(content[2]).toMatchObject({
      type: "image"
    });
    expect(content[3]).toMatchObject({
      type: "document",
      title: "brief.pdf"
    });
  });

  it("uses a default instruction when attachments are the only input", () => {
    const content = buildTransformUserContent("", [
      {
        kind: "text",
        name: "notes.md",
        relative_path: "notes.md",
        size_bytes: 128,
        media_type: "text/plain",
        content: "Source notes"
      }
    ]);

    expect(Array.isArray(content)).toBe(true);
    expect(content[0]).toMatchObject({
      type: "text"
    });
    expect("text" in content[0] && content[0].text).toContain(
      "Use the attached source material as the basis for an expert AI engineering prompt."
    );
  });
});
