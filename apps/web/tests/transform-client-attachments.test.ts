import { describe, expect, it } from "vitest";
import { serializeTransformAttachments } from "@/lib/transform/client-attachments";

describe("transform client attachments", () => {
  it("serializes supported text files and images", async () => {
    const result = await serializeTransformAttachments([
      {
        file: new File(["# Notes"], "notes.md", { type: "text/markdown" }),
        relativePath: "notes.md"
      },
      {
        file: new File([Uint8Array.from([137, 80, 78, 71])], "cover.png", { type: "image/png" }),
        relativePath: "assets/cover.png"
      }
    ]);

    expect(result.unsupportedFiles).toEqual([]);
    expect(result.attachments).toHaveLength(2);
    expect(result.attachments[0]).toMatchObject({
      kind: "text",
      relative_path: "notes.md",
      media_type: "text/plain"
    });
    expect(result.attachments[1]).toMatchObject({
      kind: "image",
      relative_path: "assets/cover.png",
      media_type: "image/png"
    });
  });

  it("truncates long text files and skips unsupported binaries", async () => {
    const longText = "a".repeat(25_500);
    const result = await serializeTransformAttachments([
      {
        file: new File([longText], "long.txt", { type: "text/plain" }),
        relativePath: "long.txt"
      },
      {
        file: new File([Uint8Array.from([80, 75, 3, 4])], "report.docx", {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        }),
        relativePath: "docs/report.docx"
      }
    ]);

    expect(result.attachments).toHaveLength(1);
    expect(result.attachments[0]).toMatchObject({
      kind: "text",
      relative_path: "long.txt"
    });
    expect("content" in result.attachments[0] && result.attachments[0].content).toContain(
      "Attachment truncated to fit prompt generation limits."
    );
    expect(result.unsupportedFiles).toEqual([
      {
        name: "report.docx",
        relativePath: "docs/report.docx",
        reason: "file format is not supported"
      }
    ]);
  });
});
