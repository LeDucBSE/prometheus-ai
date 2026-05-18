"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as React from "react";
import {
  File as FileIcon,
  Figma,
  Folder,
  ImageIcon,
  Loader2,
  MonitorIcon,
  Paperclip,
  SendIcon,
  Sparkles,
  XIcon
} from "lucide-react";
import { SiMistralai, SiOpenai, SiPerplexity, SiX } from "react-icons/si";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedDock, type DockItemData } from "@/components/ui/animated-dock";
import {
  ProcessingStatusPanel,
  PromptResultPanel
} from "@/components/ui/workspace-status-panels";
import {
  getTargetModelLabel,
  TARGET_MODEL_OPTIONS
} from "@/lib/transform/models";
import type { TargetModel, TransformResponse } from "@/lib/transform/schemas";
import { getTransformAuthPayload } from "@/lib/api-credentials/request";
import { getSubcaseOptions, type UseCasePrimary } from "@/lib/transform/use-cases";
import { UseCasePicker } from "@/components/ui/use-case-picker";
import {
  acceptedTransformImageTypes,
  isSupportedTransformImageFile,
  serializeTransformAttachments,
  type SelectedTransformAttachmentFile,
  type UnsupportedTransformAttachment
} from "@/lib/transform/client-attachments";

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

interface CommandSuggestion {
  icon: React.ReactNode;
  label: string;
  description: string;
  prefix: string;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  showRing?: boolean;
}

type SelectedAttachmentFile = SelectedTransformAttachmentFile;

interface AttachmentItem {
  id: string;
  kind: "file" | "folder";
  label: string;
  fileCount: number;
  totalSize: number;
  files: SelectedAttachmentFile[];
}

interface TransformApiResponse extends Partial<TransformResponse> {
  error?: string;
}

interface FileSystemEntry {
  readonly isFile: boolean;
  readonly isDirectory: boolean;
  readonly name: string;
  readonly fullPath: string;
}

interface FileSystemFileEntry extends FileSystemEntry {
  file: (
    successCallback: (file: File) => void,
    errorCallback?: (error: DOMException) => void
  ) => void;
}

interface FileSystemDirectoryReader {
  readEntries: (
    successCallback: (entries: FileSystemEntry[]) => void,
    errorCallback?: (error: DOMException) => void
  ) => void;
}

interface FileSystemDirectoryEntry extends FileSystemEntry {
  createReader: () => FileSystemDirectoryReader;
}

type DataTransferItemWithEntry = DataTransferItem & {
  webkitGetAsEntry?: () => FileSystemEntry | null;
};

type DirectoryInputAttributes = React.InputHTMLAttributes<HTMLInputElement> & {
  webkitdirectory?: string;
  directory?: string;
  mozdirectory?: string;
};

function useAutoResizeTextarea({ minHeight, maxHeight }: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) {
        return;
      }

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      );

      textarea.style.height = `${newHeight}px`;
    },
    [maxHeight, minHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, showRing = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div className={cn("relative", containerClassName)}>
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "transition-all duration-200 ease-in-out",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
            showRing ? "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" : "",
            className
          )}
          ref={ref}
          onFocus={(event) => {
            setIsFocused(true);
            props.onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            props.onBlur?.(event);
          }}
          {...props}
        />

        {showRing && isFocused ? (
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-0 ring-violet-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

const commandSuggestions: CommandSuggestion[] = [
  {
    icon: <ImageIcon className="h-4 w-4" />,
    label: "Clone UI",
    description: "Generate a UI from a screenshot",
    prefix: "/clone"
  },
  {
    icon: <Figma className="h-4 w-4" />,
    label: "Import Figma",
    description: "Import a design from Figma",
    prefix: "/figma"
  },
  {
    icon: <MonitorIcon className="h-4 w-4" />,
    label: "Create Page",
    description: "Generate a new web page",
    prefix: "/page"
  },
  {
    icon: <Sparkles className="h-4 w-4" />,
    label: "Improve",
    description: "Improve existing UI design",
    prefix: "/improve"
  }
];

function ClaudeGlyph() {
  return (
    <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M32 4c2.2 0 3.9 1.8 3.8 4L34 26.2l10.1-15.1a3.8 3.8 0 0 1 6-.4c1.5 1.6 1.6 4 .2 5.8L39.8 29.3l16.5-7.6a3.8 3.8 0 0 1 5 2c.9 2 .1 4.3-1.9 5.2L42 35l18 2.2a3.8 3.8 0 0 1 3.4 4.9 3.8 3.8 0 0 1-5 2.2l-16.9-6.5 11.2 14.3a3.8 3.8 0 0 1-.5 5.8 3.8 3.8 0 0 1-5.8-.8L36.7 42.1 38 60.2a3.8 3.8 0 0 1-4.2 3.8 3.8 3.8 0 0 1-3.4-3.7l-.5-18.5-11 14.5a3.8 3.8 0 0 1-5.7.7 3.8 3.8 0 0 1-.4-5.7l11.4-13.3L7 44.6a3.8 3.8 0 0 1-4.9-2.4 3.8 3.8 0 0 1 3.2-4.9L23 35.8 6.2 28.4A3.8 3.8 0 0 1 4.4 23a3.8 3.8 0 0 1 5-1.8l16 8.1L14.1 15.9A3.8 3.8 0 0 1 14.2 10a3.8 3.8 0 0 1 5.9.5L30 25.8 28.2 8A3.8 3.8 0 0 1 32 4Z"
      />
    </svg>
  );
}

function GeminiGlyph() {
  return (
    <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden="true">
      <path
        d="M32 4C35.2 18.8 45.2 28.8 60 32C45.2 35.2 35.2 45.2 32 60C28.8 45.2 18.8 35.2 4 32C18.8 28.8 28.8 18.8 32 4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChatGptGlyph() {
  return <SiOpenai className="h-5 w-5" aria-hidden="true" />;
}

function GrokGlyph() {
  return <SiX className="h-5 w-5" aria-hidden="true" />;
}

function MistralGlyph() {
  return <SiMistralai className="h-5 w-5" aria-hidden="true" />;
}

function PerplexityGlyph() {
  return <SiPerplexity className="h-5 w-5" aria-hidden="true" />;
}

function ModelGlyph({ model }: { model: TargetModel }) {
  if (model === "chatgpt") {
    return <ChatGptGlyph />;
  }

  if (model === "gemini") {
    return <GeminiGlyph />;
  }

  if (model === "claude") {
    return <ClaudeGlyph />;
  }

  if (model === "grok") {
    return <GrokGlyph />;
  }

  if (model === "mistral") {
    return <MistralGlyph />;
  }

  return <PerplexityGlyph />;
}

const directoryInputAttributes: DirectoryInputAttributes = {
  directory: "",
  mozdirectory: "",
  multiple: true,
  webkitdirectory: ""
};

function createAttachmentId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ["KB", "MB", "GB", "TB"];
  let size = bytes / 1024;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  const precision = size >= 100 ? 0 : 1;
  return `${size.toFixed(precision)} ${units[unitIndex]}`;
}

function attachmentSignature(attachment: AttachmentItem) {
  const fileSignature = attachment.files
    .map(
      ({ file, relativePath }) =>
        `${relativePath}:${file.name}:${file.size}:${file.lastModified}:${file.type}`
    )
    .sort()
    .join("|");

  return `${attachment.kind}:${attachment.label}:${fileSignature}`;
}

function isImageFile(file: File) {
  return file.type.startsWith("image/");
}

function buildTransformInput(rawValue: string, attachmentCount: number) {
  const trimmedValue = rawValue.trim();

  if (trimmedValue) {
    return trimmedValue;
  }

  if (attachmentCount > 0) {
    return "Use the attached source material as the basis for an expert AI engineering prompt.";
  }

  return "";
}

function flattenAttachmentFiles(attachments: AttachmentItem[]) {
  return attachments.flatMap((attachment) => attachment.files);
}

function formatUnsupportedAttachmentNotice(unsupportedFiles: UnsupportedTransformAttachment[]) {
  if (unsupportedFiles.length === 0) {
    return "";
  }

  const preview = unsupportedFiles
    .slice(0, 3)
    .map(({ relativePath, reason }) => `${relativePath} (${reason})`)
    .join(", ");
  const remainingCount = unsupportedFiles.length - 3;

  return remainingCount > 0
    ? `${unsupportedFiles.length} attachment(s) were skipped: ${preview}, and ${remainingCount} more.`
    : `${unsupportedFiles.length} attachment(s) were skipped: ${preview}.`;
}

function mergeAttachments(existing: AttachmentItem[], incoming: AttachmentItem[]) {
  const signatures = new Set(existing.map(attachmentSignature));
  const next = [...existing];

  for (const attachment of incoming) {
    const signature = attachmentSignature(attachment);
    if (signatures.has(signature)) {
      continue;
    }

    signatures.add(signature);
    next.push(attachment);
  }

  return next;
}

function buildAttachments(selectedFiles: SelectedAttachmentFile[]) {
  const folders = new Map<string, SelectedAttachmentFile[]>();
  const looseFiles: SelectedAttachmentFile[] = [];

  for (const selectedFile of selectedFiles) {
    const normalizedPath = selectedFile.relativePath.replace(/^\/+/, "") || selectedFile.file.name;
    const pathSegments = normalizedPath.split("/").filter(Boolean);

    if (pathSegments.length > 1) {
      const rootFolder = pathSegments[0];
      const folderFiles = folders.get(rootFolder) ?? [];
      folderFiles.push({ ...selectedFile, relativePath: normalizedPath });
      folders.set(rootFolder, folderFiles);
      continue;
    }

    looseFiles.push({ ...selectedFile, relativePath: normalizedPath });
  }

  const folderAttachments = Array.from(folders.entries()).map(([label, files]) => ({
    id: createAttachmentId(),
    kind: "folder" as const,
    label,
    fileCount: files.length,
    totalSize: files.reduce((total, item) => total + item.file.size, 0),
    files
  }));

  const fileAttachments = looseFiles.map((item) => ({
    id: createAttachmentId(),
    kind: "file" as const,
    label: item.file.name,
    fileCount: 1,
    totalSize: item.file.size,
    files: [item]
  }));

  return [...folderAttachments, ...fileAttachments];
}

function hasDraggedFiles(dataTransfer: DataTransfer | null) {
  if (!dataTransfer) {
    return false;
  }

  return Array.from(dataTransfer.items ?? []).some((item) => item.kind === "file");
}

async function readDirectoryEntries(reader: FileSystemDirectoryReader) {
  const entries: FileSystemEntry[] = [];

  while (true) {
    const batch = await new Promise<FileSystemEntry[]>((resolve) => {
      reader.readEntries(resolve, () => resolve([]));
    });

    if (batch.length === 0) {
      break;
    }

    entries.push(...batch);
  }

  return entries;
}

async function readDroppedEntry(
  entry: FileSystemEntry,
  parentPath = ""
): Promise<SelectedAttachmentFile[]> {
  const nextPath = parentPath ? `${parentPath}/${entry.name}` : entry.name;

  if (entry.isFile) {
    const fileEntry = entry as FileSystemFileEntry;

    return new Promise<SelectedAttachmentFile[]>((resolve) => {
      fileEntry.file(
        (file) => resolve([{ file, relativePath: nextPath }]),
        () => resolve([])
      );
    });
  }

  if (!entry.isDirectory) {
    return [];
  }

  const directoryEntry = entry as FileSystemDirectoryEntry;
  const entries = await readDirectoryEntries(directoryEntry.createReader());
  const nestedFiles = await Promise.all(entries.map((childEntry) => readDroppedEntry(childEntry, nextPath)));
  return nestedFiles.flat();
}

async function extractDroppedFiles(dataTransfer: DataTransfer) {
  const itemResults = await Promise.all(
    Array.from(dataTransfer.items ?? []).map(async (item) => {
      if (item.kind !== "file") {
        return [];
      }

      const entry = (item as DataTransferItemWithEntry).webkitGetAsEntry?.();
      if (entry) {
        return readDroppedEntry(entry);
      }

      const file = item.getAsFile();
      return file ? [{ file, relativePath: file.name }] : [];
    })
  );

  const flattenedItems = itemResults.flat();
  if (flattenedItems.length > 0) {
    return flattenedItems;
  }

  return Array.from(dataTransfer.files ?? []).map((file) => ({
    file,
    relativePath: file.webkitRelativePath || file.name
  }));
}


const rippleKeyframes = `
@keyframes ripple {
  0% { transform: scale(0.5); opacity: 0.6; }
  100% { transform: scale(2); opacity: 0; }
}
`;

export function AnimatedAIChat() {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [attachmentNotice, setAttachmentNotice] = useState("");
  const [targetModel, setTargetModel] = useState<TargetModel>("chatgpt");
  const [useCasePrimary, setUseCasePrimary] = useState<UseCasePrimary | "">("");
  const [useCaseSecondary, setUseCaseSecondary] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [expertPrompt, setExpertPrompt] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200
  });
  const [inputFocused, setInputFocused] = useState(false);
  const commandPaletteRef = useRef<HTMLDivElement>(null);
  const directoryInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const dragDepthRef = useRef(0);
  const isSlashCommand = value.startsWith("/") && !value.includes(" ");
  const isCommandPaletteOpen = showCommandPalette || isSlashCommand;
  const canSend = Boolean(value.trim()) || attachments.length > 0;
  const canSubmit = canSend && !isGenerating;
  const hasExpandedPanel = isGenerating || (!!expertPrompt && !error);
  const targetModelLabel = getTargetModelLabel(targetModel);

  const clearGeneratedState = useCallback(() => {
    setExpertPrompt("");
    setError("");
    setAttachmentNotice("");
    setCopied(false);
  }, []);

  const handleNewPrompt = useCallback(() => {
    clearGeneratedState();
    setValue("");
    setAttachments([]);
  }, [clearGeneratedState]);

  const selectTargetModel = (nextModel: TargetModel) => {
    clearGeneratedState();
    setTargetModel(nextModel);
  };

  const selectUseCasePrimary = (nextPrimary: UseCasePrimary | "") => {
    clearGeneratedState();

    if (!nextPrimary) {
      setUseCasePrimary("");
      setUseCaseSecondary("");
      return;
    }

    setUseCasePrimary(nextPrimary);
    setUseCaseSecondary(getSubcaseOptions(nextPrimary)[0]?.id ?? "");
  };

  const selectUseCaseSecondary = (nextSecondary: string) => {
    clearGeneratedState();
    setUseCaseSecondary(nextSecondary);
  };

  const modelDockItems: DockItemData[] = TARGET_MODEL_OPTIONS.map((option) => ({
    id: option.id,
    label: option.label,
    Icon: <ModelGlyph model={option.id} />,
    onClick: () => selectTargetModel(option.id),
    active: targetModel === option.id,
  }));

  const syncActiveSuggestion = useCallback((nextValue: string) => {
    if (nextValue.startsWith("/") && !nextValue.includes(" ")) {
      const matchingSuggestionIndex = commandSuggestions.findIndex((cmd) =>
        cmd.prefix.startsWith(nextValue)
      );
      setActiveSuggestion(matchingSuggestionIndex >= 0 ? matchingSuggestionIndex : -1);
      return;
    }

    setActiveSuggestion(-1);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const style = document.createElement("style");
    style.innerHTML = rippleKeyframes;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const commandButton = document.querySelector("[data-command-button]");

      if (
        commandPaletteRef.current &&
        !commandPaletteRef.current.contains(target) &&
        !commandButton?.contains(target)
      ) {
        setShowCommandPalette(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [adjustHeight, value]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isCommandPaletteOpen) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveSuggestion((prev) => (prev < commandSuggestions.length - 1 ? prev + 1 : 0));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : commandSuggestions.length - 1));
      } else if (event.key === "Tab" || event.key === "Enter") {
        event.preventDefault();
        if (activeSuggestion >= 0) {
          const selectedCommand = commandSuggestions[activeSuggestion];
          setValue(`${selectedCommand.prefix} `);
          setShowCommandPalette(false);
          setActiveSuggestion(-1);
        }
      } else if (event.key === "Escape") {
        event.preventDefault();
        setShowCommandPalette(false);
        setActiveSuggestion(-1);
      }
    } else if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (canSubmit) {
        handleSendMessage();
      }
    }
  };

  const handleSendMessage = async () => {
    const selectedFiles = flattenAttachmentFiles(attachments);
    const transformInput = buildTransformInput(value, selectedFiles.length);
    if (!transformInput) {
      return;
    }

    setIsGenerating(true);
    setError("");
    setAttachmentNotice("");
    setCopied(false);
    setExpertPrompt("");

    try {
      const { attachments: serializedAttachments, unsupportedFiles } =
        await serializeTransformAttachments(selectedFiles);
      const unsupportedNotice = formatUnsupportedAttachmentNotice(unsupportedFiles);

      if (unsupportedNotice) {
        setAttachmentNotice(unsupportedNotice);
      }

      if (!value.trim() && selectedFiles.length > 0 && serializedAttachments.length === 0) {
        throw new Error(
          "The selected attachments could not be included. Attach text files, PDFs, or JPEG, PNG, GIF, and WEBP images."
        );
      }

      const authPayload = getTransformAuthPayload();

      const response = await fetch("/api/transform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...authPayload,
          raw_prompt: transformInput,
          attachments: serializedAttachments,
          target_model: targetModel,
          use_case_primary: useCasePrimary || null,
          use_case_secondary: useCasePrimary ? useCaseSecondary || null : null
        })
      });

      const data = (await response.json()) as TransformApiResponse;
      if (!response.ok) {
        throw new Error(data.error || "The transformation request failed.");
      }

      const nextPrompt = data.expert_prompt?.trim() ?? "";
      if (!nextPrompt) {
        throw new Error("The model returned an empty prompt.");
      }

      setExpertPrompt(nextPrompt);
      setValue("");
      setAttachments([]);
      adjustHeight(true);
      setActiveSuggestion(-1);
    } catch (transformError) {
      const message =
        transformError instanceof Error ? transformError.message : "An unexpected error occurred.";
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const addAttachments = useCallback((selectedFiles: SelectedAttachmentFile[]) => {
    if (selectedFiles.length === 0) {
      return;
    }

    clearGeneratedState();
    setAttachments((prev) => mergeAttachments(prev, buildAttachments(selectedFiles)));
  }, [clearGeneratedState]);

  const openDirectoryPicker = () => {
    directoryInputRef.current?.click();
  };

  const openImagePicker = () => {
    imageInputRef.current?.click();
  };

  const handleDirectorySelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []).map((file) => ({
      file,
      relativePath: file.webkitRelativePath || file.name
    }));

    addAttachments(selectedFiles);
    event.target.value = "";
  };

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? [])
      .filter(isSupportedTransformImageFile)
      .map((file) => ({
        file,
        relativePath: file.name
      }));

    addAttachments(selectedFiles);
    event.target.value = "";
  };

  const removeAttachment = (index: number) => {
    clearGeneratedState();
    setAttachments((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const selectCommandSuggestion = (index: number) => {
    const selectedCommand = commandSuggestions[index];
    clearGeneratedState();
    setValue(`${selectedCommand.prefix} `);
    setShowCommandPalette(false);
    setActiveSuggestion(-1);
  };

  const handleCopyPrompt = async () => {
    if (!expertPrompt) {
      return;
    }

    try {
      await navigator.clipboard.writeText(expertPrompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Clipboard access failed. Please copy the prompt manually.");
    }
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    if (!hasDraggedFiles(event.dataTransfer)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current += 1;
    setIsDraggingFiles(true);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    if (!hasDraggedFiles(event.dataTransfer)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "copy";
    setIsDraggingFiles(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);

    if (dragDepthRef.current === 0) {
      setIsDraggingFiles(false);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    if (!hasDraggedFiles(event.dataTransfer)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current = 0;
    setIsDraggingFiles(false);

    const droppedFiles = await extractDroppedFiles(event.dataTransfer);
    addAttachments(droppedFiles);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-transparent p-6 text-white">
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <div className="absolute left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-violet-500/10 blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-indigo-500/10 blur-[128px] delay-700" />
        <div className="absolute right-1/3 top-1/4 h-64 w-64 animate-pulse rounded-full bg-fuchsia-500/10 blur-[96px] delay-1000" />
      </div>

      <div
        className={cn(
          "relative mx-auto w-full transition-[max-width] duration-500 ease-out",
          hasExpandedPanel ? "max-w-5xl" : "max-w-2xl"
        )}
      >
        <motion.div
          className="relative z-10 space-y-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="space-y-3 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block"
            >
              <h1 className="bg-gradient-to-r from-white/90 to-white/40 bg-clip-text pb-1 text-3xl font-medium tracking-tight text-transparent">
                Transform your ideas into an AI engineering prompt.
              </h1>
              <motion.div
                className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </motion.div>
            <motion.p
              className="text-sm text-white/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Raw Ideas, Expert Renderings.
            </motion.p>
          </div>

          <motion.div
            className="relative overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.02] shadow-2xl backdrop-blur-2xl"
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              {...directoryInputAttributes}
              ref={directoryInputRef}
              type="file"
              className="hidden"
              onChange={handleDirectorySelection}
              aria-label="Select folders"
              tabIndex={-1}
            />
            <input
              ref={imageInputRef}
              type="file"
              className="hidden"
              multiple
              accept={acceptedTransformImageTypes}
              onChange={handleImageSelection}
              aria-label="Select images"
              tabIndex={-1}
            />

            <AnimatePresence>
              {isCommandPaletteOpen ? (
                <motion.div
                  ref={commandPaletteRef}
                  className="absolute bottom-full left-4 right-4 z-50 mb-2 overflow-hidden rounded-lg border border-white/10 bg-black/90 shadow-lg backdrop-blur-xl"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="bg-black/95 py-1">
                    {commandSuggestions.map((suggestion, index) => (
                      <motion.div
                        key={suggestion.prefix}
                        className={cn(
                          "flex cursor-pointer items-center gap-2 px-3 py-2 text-xs transition-colors",
                          activeSuggestion === index
                            ? "bg-white/10 text-white"
                            : "text-white/70 hover:bg-white/5"
                        )}
                        onClick={() => selectCommandSuggestion(index)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <div className="flex h-5 w-5 items-center justify-center text-white/60">
                          {suggestion.icon}
                        </div>
                        <div className="font-medium">{suggestion.label}</div>
                        <div className="ml-1 text-xs text-white/40">{suggestion.prefix}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <AnimatePresence>
              {isDraggingFiles ? (
                <motion.div
                  className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/70 p-6 text-center backdrop-blur-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="space-y-2">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5">
                      <Folder className="h-5 w-5 text-white/80" />
                    </div>
                    <p className="text-sm font-medium text-white/90">Drop folders or files to attach them</p>
                    <p className="text-xs text-white/50">
                      Supported text files, PDFs, and compatible images will be sent as source material for prompt generation.
                    </p>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="p-4">
              <Textarea
                ref={textareaRef}
                value={value}
                disabled={isGenerating}
                onChange={(event) => {
                  clearGeneratedState();
                  setValue(event.target.value);
                  syncActiveSuggestion(event.target.value);
                  adjustHeight();
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="Décris ton idée ou joins des fichiers sources pour générer un prompt expert."
                containerClassName="w-full"
                className={cn(
                  "min-h-[60px] w-full resize-none bg-transparent px-4 py-3",
                  "border-none text-sm text-white/90",
                  "focus:outline-none",
                  "placeholder:text-white/20"
                )}
                style={{
                  overflow: "hidden"
                }}
                showRing={false}
              />
            </div>

            <div className="space-y-3 px-4 pb-3 text-center">
              <p className="text-xs text-white/35">
                Ajoute du texte, des PDF, des images ou des dossiers. Prometheus détectera aussi le type de tâche si tu
                ne choisis pas de catégorie.
              </p>
              <UseCasePicker
                primary={useCasePrimary}
                secondary={useCaseSecondary}
                disabled={isGenerating}
                onPrimaryChange={selectUseCasePrimary}
                onSecondaryChange={selectUseCaseSecondary}
                onClear={() => selectUseCasePrimary("")}
              />
            </div>

            <AnimatePresence>
              {attachments.length > 0 ? (
                <motion.div
                  className="flex flex-wrap gap-2 px-4 pb-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {attachments.map((attachment, index) => (
                    <motion.div
                      key={attachment.id}
                      className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-3 py-2 text-xs text-white/70"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.04] text-white/55">
                        {attachment.kind === "folder" ? (
                          <Folder className="h-3.5 w-3.5" />
                        ) : attachment.files.some(({ file }) => isImageFile(file)) ? (
                          <ImageIcon className="h-3.5 w-3.5" />
                        ) : (
                          <FileIcon className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-medium text-white/80">{attachment.label}</div>
                        <div className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                          {attachment.kind === "folder"
                            ? `${attachment.fileCount} files • ${formatBytes(attachment.totalSize)}`
                            : formatBytes(attachment.totalSize)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-white/40 transition-colors hover:text-white"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="flex items-center justify-between gap-4 border-t border-white/[0.05] p-4">
              <div className="flex items-center gap-3">
                <motion.button
                  type="button"
                  onClick={openDirectoryPicker}
                  whileTap={{ scale: 0.94 }}
                  className="group relative rounded-lg p-2 text-white/40 transition-colors hover:text-white/90"
                  aria-label="Attach folders"
                  title="Attach folders"
                >
                  <Paperclip className="h-4 w-4" />
                  <motion.span
                    className="absolute inset-0 rounded-lg bg-white/[0.05] opacity-0 transition-opacity group-hover:opacity-100"
                    layoutId="button-highlight"
                  />
                </motion.button>

                <motion.button
                  type="button"
                  onClick={openImagePicker}
                  whileTap={{ scale: 0.94 }}
                  className="group relative rounded-lg p-2 text-white/40 transition-colors hover:text-white/90"
                  aria-label="Attach images"
                  title="Attach supported images"
                >
                  <ImageIcon className="h-4 w-4" />
                  <motion.span
                    className="absolute inset-0 rounded-lg bg-white/[0.05] opacity-0 transition-opacity group-hover:opacity-100"
                    layoutId="button-highlight"
                  />
                </motion.button>
              </div>

              <motion.button
                type="button"
                onClick={handleSendMessage}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={!canSubmit}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                  canSubmit
                    ? "bg-white text-[#0A0A0B] shadow-lg shadow-white/10"
                    : "bg-white/[0.05] text-white/40"
                )}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-[spin_2s_linear_infinite]" />
                ) : (
                  <SendIcon className="h-4 w-4" />
                )}
                <span>Optimize</span>
              </motion.button>
            </div>
          </motion.div>

          <AnimatePresence>
            {!isGenerating && !expertPrompt && !error ? (
              <motion.div
                key="model-dock"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="space-y-3"
              >
                <AnimatedDock
                  items={modelDockItems}
                  className="h-20 gap-4 px-6 pb-4"
                />
                <p className="text-center text-xs uppercase tracking-[0.18em] text-white/38">
                  select the destinated chatbot
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isGenerating ? (
              <ProcessingStatusPanel
                key="generating-panel"
                targetModelLabel={targetModelLabel}
                variant="generating"
              />
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {error ? (
              <motion.div
                key="error-panel"
                className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5 text-sm text-rose-100 shadow-2xl backdrop-blur-2xl"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                role="alert"
              >
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {attachmentNotice && !error ? (
              <motion.div
                key="attachment-notice-panel"
                className="rounded-2xl border border-amber-300/20 bg-amber-500/10 p-5 text-sm text-amber-50 shadow-2xl backdrop-blur-2xl"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
              >
                {attachmentNotice}
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {expertPrompt && !isGenerating && !error ? (
              <PromptResultPanel
                key="result-panel"
                copied={copied}
                expertPrompt={expertPrompt}
                onCopy={handleCopyPrompt}
                targetModelLabel={targetModelLabel}
              />
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {expertPrompt && !isGenerating && !error ? (
              <motion.div
                key="new-prompt-button"
                className="flex justify-center"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <motion.button
                  type="button"
                  onClick={handleNewPrompt}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-2.5 text-sm font-medium text-white/70 backdrop-blur-xl transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                >
                  New prompt
                </motion.button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>

      {inputFocused ? (
        <motion.div
          className="pointer-events-none fixed z-0 h-[50rem] w-[50rem] rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 opacity-[0.02] blur-[96px]"
          animate={{
            x: mousePosition.x - 400,
            y: mousePosition.y - 400
          }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 150,
            mass: 0.5
          }}
        />
      ) : null}
    </div>
  );
}
