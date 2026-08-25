"use client";

import React, { useState, useRef } from "react";
import { apiClient, ApiError } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/hook/useToast";
import { marked } from "marked";
import {
  BoldIcon,
  UnderlineIcon,
  ItalicIcon,
  LinkIcon,
  PhotoIcon,
  StrikethroughIcon,
  ListBulletIcon,
  NumberedListIcon,
  CodeBracketIcon,
  H1Icon,
  CodeBracketSquareIcon,
  MinusIcon,
  TableCellsIcon,
  VideoCameraIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Loader from "@/app/components/Loader";
import Header from "@/app/components/Header";
import { motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";
// import { useSession } from "next-auth/react";

export default function CreatePost() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [markdown, setMarkdown] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  // const {data: session, status} = useSession();

  // if (status === "unauthenticated") {
  //   router.push("/login"); // Redirect to login if unauthenticated
  // }

  const toast = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      const file = e.target.files[0];
      try {
        setLoading(true);
        const response = await apiClient.post("/api/upload", file, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Image URL:", response.data.fileURL);
        const imageURL = response.data.fileURL;
        setPreviewUrl(imageURL);
        setLoading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error(
          error instanceof ApiError ? error.message : "Error uploading image."
        );
        setLoading(false);
      }
    }
  };

  const insertMarkdownSyntax = (startTag: string, endTag: string = "") => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const { selectionStart, selectionEnd, value } = textarea;
      const selectedText = value.substring(selectionStart, selectionEnd);
      const newText = `${startTag}${selectedText}${endTag}`;
      setMarkdown(
        `${value.substring(0, selectionStart)}${newText}${value.substring(
          selectionEnd
        )}`
      );

      // Set cursor position correctly after inserting syntax
      setTimeout(() => {
        // If there was selected text, place the cursor at the end of the selected text
        // Otherwise, place the cursor between the start and end tags
        const cursorPosition =
          selectionStart +
          startTag.length +
          (selectedText ? selectedText.length : 0);
        textarea.setSelectionRange(cursorPosition, cursorPosition);
        textarea.focus();
      }, 0);
    }
  };

  const handleBold = () => insertMarkdownSyntax("**", "**");
  const handleItalic = () => insertMarkdownSyntax("*", "*");
  const handleStrikethrough = () => insertMarkdownSyntax("~~", "~~");
  const handleUnderline = () => insertMarkdownSyntax("<u>", "</u>");
  const handleUnorderedList = () => insertMarkdownSyntax("- ");
  const handleOrderedList = () => insertMarkdownSyntax("1. ");
  const handleCode = () => insertMarkdownSyntax("`", "`");
  const handleCodeBlock = () => insertMarkdownSyntax("```\n", "\n```");
  const handleHeading = () => insertMarkdownSyntax("## ");
  const handleLink = () => insertMarkdownSyntax("[Link description](url)");
  const handleHorizontalRule = () => insertMarkdownSyntax("\n---\n");
  const handleTable = () =>
    insertMarkdownSyntax(
      "| Header1 | Header2 |\n| --- | --- |\n| Row1 | Row2 |"
    );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setLoading(true);

      try {
        insertMarkdownSyntax("Upload in progress...");

        const response = await apiClient.post("/api/upload", file, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Image URL:", response.data.fileURL);
        const imageURL = response.data.fileURL;
        // Replace placeholder with actual markdown image syntax
        setMarkdown((prevMarkdown) =>
          prevMarkdown.replace(
            "Upload in progress...",
            `![Image description](${imageURL})`
          )
        );
        setLoading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error(
          error instanceof ApiError ? error.message : "Error uploading image."
        );
        setMarkdown((prevMarkdown) =>
          prevMarkdown.replace("Upload in progress...", "")
        );
        setLoading(false);
      }
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      console.log(file);
      console.log("File size:", file.size);

      // Check file size (10MB = 10 * 1024 * 1024 bytes)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds the 10MB limit.");
        setError("File size exceeds the 10MB limit.");
        return;
      } else {
        setError(""); // Clear error message if file is valid
      }

      setLoading(true);
      try {
        insertMarkdownSyntax("Upload in progress...");

        const response = await apiClient.post("/api/upload", file, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Video URL:", response.data.fileURL);
        const videoURL = response.data.fileURL;
        setMarkdown((prevMarkdown) =>
          prevMarkdown.replace(
            "Upload in progress...",
            `<video controls height="600">
             <source src="${videoURL}" type="video/mp4">Your browser does not support the video tag</video>`
          )
        );
        setLoading(false);
      } catch (error) {
        console.error("Error uploading video:", error);
        toast.error(
          error instanceof ApiError ? error.message : "Error uploading video."
        );
        setMarkdown((prevMarkdown) =>
          prevMarkdown.replace("Upload in progress...", "")
        );
        setLoading(false);
      }
    }
  };

  const handleImage = () => {
    if (textareaRef.current) {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.onchange = (e) =>
        handleImageUpload(e as unknown as React.ChangeEvent<HTMLInputElement>);
      fileInput.click();
    }
  };

  const handleVideo = () => {
    if (textareaRef.current) {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "video/*";
      fileInput.onchange = (e) =>
        handleVideoUpload(e as unknown as React.ChangeEvent<HTMLInputElement>);
      fileInput.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(file);
    console.log(title);
    console.log(tags);
    console.log(markdown);

    if (!file || !tags || !title || !markdown) {
      toast.error("Please fill in all fields and select a file.");
      // setMessage("Please fill in all fields and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("tags", tags);
    formData.append("content", markdown);

    try {
      setLoading(true);
      const response = await apiClient.post("/api/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Post uploaded successfully!");
      setMessage("Post uploaded successfully!");

      router.push("/allposts");
      setTimeout(() => {
      }, 1000);
      setLoading(false);
    } catch (error) {
      console.error("Error uploading post:", error);
      setMessage("Error uploading post. Please try again.");
    }
  };

  const toolbarButtons = [
    { title: "Bold", icon: BoldIcon, onClick: handleBold },
    { title: "Italic", icon: ItalicIcon, onClick: handleItalic },
    { title: "Strikethrough", icon: StrikethroughIcon, onClick: handleStrikethrough },
    { title: "Underline", icon: UnderlineIcon, onClick: handleUnderline },
    { title: "Bullet list", icon: ListBulletIcon, onClick: handleUnorderedList },
    { title: "Numbered list", icon: NumberedListIcon, onClick: handleOrderedList },
    { title: "Inline code", icon: CodeBracketIcon, onClick: handleCode },
    { title: "Code block", icon: CodeBracketSquareIcon, onClick: handleCodeBlock },
    { title: "Heading", icon: H1Icon, onClick: handleHeading },
    { title: "Link", icon: LinkIcon, onClick: handleLink },
    { title: "Image", icon: PhotoIcon, onClick: handleImage },
    { title: "Video", icon: VideoCameraIcon, onClick: handleVideo },
    { title: "Horizontal rule", icon: MinusIcon, onClick: handleHorizontalRule },
    { title: "Table", icon: TableCellsIcon, onClick: handleTable },
  ];

  return (
    <>
      <Header />
      <div className="mx-auto max-w-4xl px-4 pb-24 pt-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6 flex items-center gap-3"
        >
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-200 text-ink-600 transition-colors hover:bg-ink-100"
          >
            <ArrowLeftCircleIcon className="h-5 w-5" />
          </button>
          <h1 className="font-display text-2xl font-bold text-ink-950">Write a new story</h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label htmlFor="image" className="block">
            <div className="relative flex h-56 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-ink-200 bg-white transition-colors hover:border-brand-300 hover:bg-brand-50/40 sm:h-72">
              {loading ? (
                <Loader />
              ) : previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={800}
                  height={400}
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <ImageIcon className="h-10 w-10 text-ink-300" />
                  <p className="mt-3 text-sm text-ink-500">
                    Drag and drop a cover image, or click to select a file
                  </p>
                </>
              )}
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </div>
          </label>

          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-ink-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-ink-200 px-4 py-2.5 text-lg font-semibold text-ink-950 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              placeholder="Give your story a title"
            />
          </div>

          <div>
            <label htmlFor="tags" className="mb-1.5 block text-sm font-medium text-ink-700">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              id="tags"
              className="w-full rounded-xl border border-ink-200 px-4 py-2.5 text-ink-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              placeholder="e.g. travel, food, react (comma separated)"
            />
          </div>

          <div>
            <label htmlFor="markdown" className="mb-1.5 block text-sm font-medium text-ink-700">
              Content
            </label>
            <div className="rounded-2xl border border-ink-200 bg-white shadow-soft">
              <div className="flex flex-wrap gap-0.5 border-b border-ink-100 p-2">
                {toolbarButtons.map(({ title, icon: Icon, onClick }) => (
                  <button
                    key={title}
                    title={title}
                    type="button"
                    onClick={onClick}
                    className="rounded-lg p-2 text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-600"
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
              <textarea
                ref={textareaRef}
                id="content"
                name="content"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="h-56 w-full resize-y rounded-b-2xl p-4 font-mono text-sm leading-6 text-ink-900 outline-none"
                placeholder="Write in markdown..."
              />
            </div>
          </div>

          <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-soft">
            <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-ink-400">
              Preview
            </h2>
            <div
              className="markdown-preview text-ink-800"
              dangerouslySetInnerHTML={{
                __html: marked.parse(markdown) as string,
              }}
              style={{ lineHeight: "1.6", whiteSpace: "pre-wrap" }}
            />
          </div>

          <button
            type="submit"
            data-testid="Upload Post"
            disabled={loading}
            className={`w-full rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01] active:scale-[0.98] sm:w-auto ${
              loading ? "cursor-not-allowed opacity-60" : ""
            }`}
          >
            Publish post
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-ink-600">{message}</p>}
        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
      </div>
    </>
  );
}
