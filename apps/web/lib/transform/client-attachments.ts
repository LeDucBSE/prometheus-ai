import {
  supportedTransformImageMediaTypes,
  type TransformAttachment
} from "@/lib/transform/schemas";

export interface SelectedTransformAttachmentFile {
  file: File;
  relativePath: string;
}

export interface UnsupportedTransformAttachment {
  name: string;
  relativePath: string;
  reason: string;
}

export interface SerializedTransformAttachmentsResult {
  attachments: TransformAttachment[];
  unsupportedFiles: UnsupportedTransformAttachment[];
}

const MAX_SERIALIZED_ATTACHMENTS = 48;
const MAX_TEXT_ATTACHMENT_BYTES = 60_000;
const MAX_TEXT_ATTACHMENT_CHARACTERS = 20_000;
const MAX_BINARY_ATTACHMENT_BYTES = 5 * 1024 * 1024;

const textMimeTypes = new Set([
  "application/json",
  "application/ld+json",
  "application/sql",
  "application/toml",
  "application/typescript",
  "application/x-httpd-php",
  "application/x-sh",
  "application/xml",
  "application/x-yaml"
]);

const textExtensions = new Set([
  "c",
  "cc",
  "cpp",
  "cs",
  "css",
  "csv",
  "env",
  "go",
  "h",
  "hpp",
  "html",
  "ini",
  "java",
  "js",
  "json",
  "jsx",
  "log",
  "md",
  "mdx",
  "mjs",
  "py",
  "rb",
  "rs",
  "sh",
  "sql",
  "svg",
  "toml",
  "ts",
  "tsx",
  "txt",
  "xml",
  "yaml",
  "yml"
]);

export const acceptedTransformImageTypes =
  "image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp";

function normalizeRelativePath(relativePath: string, fallbackName: string) {
  return relativePath.replace(/\\/g, "/").replace(/^\/+/, "").trim() || fallbackName;
}

function getFileExtension(fileName: string) {
  const segments = fileName.toLowerCase().split(".");
  return segments.length > 1 ? segments.at(-1) ?? "" : "";
}

function isSupportedImageFile(file: File) {
  return supportedTransformImageMediaTypes.includes(
    file.type as (typeof supportedTransformImageMediaTypes)[number]
  );
}

function isPdfFile(file: File) {
  return file.type === "application/pdf" || getFileExtension(file.name) === "pdf";
}

function isLikelyTextFile(file: File) {
  if (file.type.startsWith("text/")) {
    return true;
  }

  if (textMimeTypes.has(file.type)) {
    return true;
  }

  return textExtensions.has(getFileExtension(file.name));
}

function arrayBufferToBase64(arrayBuffer: ArrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);

  if (typeof btoa !== "function") {
    return Buffer.from(bytes).toString("base64");
  }

  let binary = "";
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

async function serializeSingleAttachment(
  selectedFile: SelectedTransformAttachmentFile
): Promise<TransformAttachment | UnsupportedTransformAttachment> {
  const { file } = selectedFile;
  const relativePath = normalizeRelativePath(selectedFile.relativePath, file.name);

  if (isSupportedImageFile(file)) {
    if (file.size > MAX_BINARY_ATTACHMENT_BYTES) {
      return {
        name: file.name,
        relativePath,
        reason: "image is larger than 5 MB"
      };
    }

    const mediaType = file.type as (typeof supportedTransformImageMediaTypes)[number];

    return {
      kind: "image",
      name: file.name,
      relative_path: relativePath,
      size_bytes: file.size,
      media_type: mediaType,
      data_base64: arrayBufferToBase64(await file.arrayBuffer())
    };
  }

  if (isPdfFile(file)) {
    if (file.size > MAX_BINARY_ATTACHMENT_BYTES) {
      return {
        name: file.name,
        relativePath,
        reason: "PDF is larger than 5 MB"
      };
    }

    return {
      kind: "pdf",
      name: file.name,
      relative_path: relativePath,
      size_bytes: file.size,
      media_type: "application/pdf",
      data_base64: arrayBufferToBase64(await file.arrayBuffer())
    };
  }

  if (isLikelyTextFile(file)) {
    const rawText = await file.slice(0, MAX_TEXT_ATTACHMENT_BYTES).text();
    const cleanedText = rawText.replace(/\u0000/g, "").trim();

    if (!cleanedText) {
      return {
        name: file.name,
        relativePath,
        reason: "text file is empty"
      };
    }

    const truncatedContent = cleanedText.slice(0, MAX_TEXT_ATTACHMENT_CHARACTERS);
    const wasTruncated =
      file.size > MAX_TEXT_ATTACHMENT_BYTES || cleanedText.length > MAX_TEXT_ATTACHMENT_CHARACTERS;

    return {
      kind: "text",
      name: file.name,
      relative_path: relativePath,
      size_bytes: file.size,
      media_type: "text/plain",
      content: wasTruncated
        ? `${truncatedContent}\n\n[Attachment truncated to fit prompt generation limits.]`
        : truncatedContent
    };
  }

  return {
    name: file.name,
    relativePath,
    reason: "file format is not supported"
  };
}

export async function serializeTransformAttachments(
  selectedFiles: SelectedTransformAttachmentFile[]
): Promise<SerializedTransformAttachmentsResult> {
  const attachments: TransformAttachment[] = [];
  const unsupportedFiles: UnsupportedTransformAttachment[] = [];

  const filesToSerialize = selectedFiles.slice(0, MAX_SERIALIZED_ATTACHMENTS);

  for (const selectedFile of filesToSerialize) {
    const serializedAttachment = await serializeSingleAttachment(selectedFile);

    if ("reason" in serializedAttachment) {
      unsupportedFiles.push(serializedAttachment);
      continue;
    }

    attachments.push(serializedAttachment);
  }

  for (const skippedFile of selectedFiles.slice(MAX_SERIALIZED_ATTACHMENTS)) {
    unsupportedFiles.push({
      name: skippedFile.file.name,
      relativePath: normalizeRelativePath(skippedFile.relativePath, skippedFile.file.name),
      reason: `only the first ${MAX_SERIALIZED_ATTACHMENTS} attachments are included`
    });
  }

  return {
    attachments,
    unsupportedFiles
  };
}

export function isSupportedTransformImageFile(file: File) {
  return isSupportedImageFile(file);
}
