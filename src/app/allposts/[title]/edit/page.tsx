"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
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
  VideoCameraIcon,
  ArrowLeftCircleIcon,
} from "@heroicons/react/24/outline";
import { apiClient, ApiError } from "@/lib/api";
import { useToast } from "@/app/hook/useToast";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Header from "@/app/components/Header";
import Loader from "@/app/components/Loader";
import { motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";

// interface EditPostProps {
//     post: {
//         title: string;
//         content: string;
//         imageURL: string;
//     };
// }

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams<{ title: string }>();
  const title = decodeURIComponent(params.title as string);
  const toast = useToast();

  const [newTitle, setNewTitle] = useState<string>("");
  const [markdown, setMarkdown] = useState("");
  const [newerror, setNewError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [tags, setTags] = useState<string>("");
  const [file, setFile] = useState<string | File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    router.push("/login"); // Redirect to login if unauthenticated
  }

  const getPost = async (title: string) => {
    const response = await fetch(`/api/post/${title}`);
    const data = await response.json();
    return data;
  };

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["post", title],
    queryFn: () => getPost(title),
  });
  console.log(data);

  useEffect(() => {
    if (data) {
      setNewTitle(data.title);
      setMarkdown(data.content);
      const tagNames = data.tags.map((tag: { name: string }) => tag.name);
      setTags(tagNames.join(", "));
      setFile(data.imageURL);
    }
  }, [data]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // setLoading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await apiClient.post("/api/upload", file, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Image URL:", response.data.fileURL);
        const imageURL = response.data.fileURL;
        setFile(imageURL);
        // setLoading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error(
          error instanceof ApiError ? error.message : "Error uploading image."
        );
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
  const handleHeading = () => insertMarkdownSyntax("# ");
  const handleLink = () => insertMarkdownSyntax("[Link description](url)");

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
        setNewError("File size exceeds the 10MB limit.");
        return;
      } else {
        setNewError(""); // Clear error message if file is valid
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

  const updatePost = async () => {
    if (!data) return;
    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    } else {
      formData.append("image", "");
    }
    formData.append("title", newTitle);
    formData.append("content", markdown);
    formData.append("tags", tags);

    const response = await apiClient.put(`/api/post/${title}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to update post");
    }
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      router.push(`/allposts/${newTitle}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // if
    mutation.mutate();
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  if (error)
    return (
      <p className="flex h-screen items-center justify-center text-rose-600">
        Error: {error.message}
      </p>
    );

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
          <h1 className="font-display text-2xl font-bold text-ink-950">Edit story</h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="image" className="mb-1.5 block text-sm font-medium text-ink-700">
              Cover image
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative flex h-56 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-ink-200 bg-white transition-colors hover:border-brand-300 hover:bg-brand-50/40 sm:h-72"
            >
              {file ? (
                <Image
                  src={typeof file === "string" ? file : ""}
                  alt="Cover Image"
                  width={800}
                  height={400}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon className="h-10 w-10 text-ink-300" />
              )}
              <input
                type="file"
                id="image"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-ink-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={newTitle}
              className="w-full rounded-xl border border-ink-200 px-4 py-2.5 text-lg font-semibold text-ink-950 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="tags" className="mb-1.5 block text-sm font-medium text-ink-700">
              Tags
            </label>
            <input
              name="tags"
              type="text"
              id="tags"
              value={tags}
              className="w-full rounded-xl border border-ink-200 px-4 py-2.5 text-ink-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="content" className="mb-1.5 block text-sm font-medium text-ink-700">
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
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="h-56 w-full resize-y rounded-b-2xl p-4 font-mono text-sm leading-6 text-ink-900 outline-none"
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
              style={{ lineHeight: "1.6" }}
            />
          </div>

          <button
            className="w-full rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01] active:scale-[0.98] sm:w-auto"
            type="submit"
          >
            Save changes
          </button>
        </form>
      </div>
    </>
  );
}
