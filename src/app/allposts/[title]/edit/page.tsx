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
} from "@heroicons/react/24/outline";
import axios from "axios";

// interface EditPostProps {
//     post: {
//         title: string;
//         content: string;
//         imageURL: string;
//     };
// }

export default function EditPostPage({
  params,
}: {
  params: Record<string, string>;
}) {
  const router = useRouter();
  const { title } = params;

  const [newTitle, setNewTitle] = useState<string>("");
  const [markdown, setMarkdown] = useState("");
  const [file, setFile] = useState<string | File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      setFile(data.imageURL);
    }
  }, [data]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      try {
        // setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post("/api/upload", file, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Image URL:", response.data.imageURL);
        const imageURL = response.data.imageURL;
        setFile(imageURL);
        // setLoading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
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

      try {
        const response = await axios.post("/api/upload", file, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Image URL:", response.data.imageURL);
        const imageURL = response.data.imageURL;
        insertMarkdownSyntax(`![Image description](${imageURL})`);
      } catch (error) {
        console.error("Error uploading image:", error);
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

  const updatePost = async () => {
    if (!data) return;
    const formData = new FormData();
    if (file) {
      formData.append("image", file);
    } else {
      formData.append("image", "");
    }
    formData.append("title", newTitle);
    formData.append("content", markdown)

    const response = await axios.put(`/api/post/${title}`, formData, {
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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div 
        style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: "20px",
            backgroundColor: "#ccc",
        }}
      >
        <h1>Edit Post</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="image">Cover Image:</label>
            <div onClick={() => fileInputRef.current?.click()} className="p-6">
              <div className="flex flex-col items-center justify-center w-full h-64 bg-muted rounded-md border-2 border-dashed border-muted-foreground/50 cursor-pointer transition-colors hover:bg-muted/50 relative">
              {file && (
                <img
                  src={typeof file === "string" ? file : undefined}
                  alt="Cover Image"
                  className="w-full h-full object-cover rounded-md"
                />
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
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={newTitle}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                marginTop: "10px",
              }}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="content">Content:</label>
            <div
            className="text-center flex gap-9"
            style={{ marginBottom: "10px" }}
          >
            <button title="Bold Text" type="button" onClick={handleBold}>
              <BoldIcon className="h-6 w-6" />
            </button>
            <button title="Italic Text" type="button" onClick={handleItalic}>
              <ItalicIcon className="h-6 w-6" />
            </button>
            <button
              title="Strikethrough Text"
              type="button"
              onClick={handleStrikethrough}
            >
              <StrikethroughIcon className="h-6 w-6" />
            </button>
            <button
              title="Underline Text"
              type="button"
              onClick={handleUnderline}
            >
              <UnderlineIcon className="h-6 w-6" />
            </button>
            <button
              title=" Bullet List"
              type="button"
              onClick={handleUnorderedList}
            >
              <ListBulletIcon className="h-6 w-6" />
            </button>
            <button
              title="Number List"
              type="button"
              onClick={handleOrderedList}
            >
              <NumberedListIcon className="h-6 w-6" />
            </button>
            <button title="Single line code" type="button" onClick={handleCode}>
              <CodeBracketIcon className="h-6 w-6" />
            </button>
            <button title="Code Block" type="button" onClick={handleCodeBlock}>
              <CodeBracketSquareIcon className="h-6 w-6" />
            </button>
            <button title="Header" type="button" onClick={handleHeading}>
              <H1Icon className="h-6 w-6" />
            </button>
            <button title="Add Link" type="button" onClick={handleLink}>
              <LinkIcon className="h-6 w-6" />
            </button>
            <button title="Add Image" type="button" onClick={handleImage}>
              <PhotoIcon className="h-6 w-6" />
            </button>
          </div>
            <textarea
              ref={textareaRef}
              id="content"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              style={{
                width: "100%",
                height: "200px",
                marginTop: "10px",
                padding: "10px",
                fontFamily: "monospace",
                fontSize: "16px",
                lineHeight: "1.5",
              }}
            />
          </div>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "15px",
            }}
          >
            <h2>Preview</h2>
            <div
              dangerouslySetInnerHTML={{
                __html: marked.parse(markdown) as string,
              }}
              style={{ lineHeight: "1.5" }}
            />
          </div>
          <button
            className="bg-black text-white hover:bg-white hover:text-black" 
            type="submit"
            style={{ padding: "10px 20px", fontSize: "16px" }}
          >
            Update Post
          </button>
        </form>
      </div>
    </>
  );
}
