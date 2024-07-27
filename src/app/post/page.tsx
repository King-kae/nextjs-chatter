"use client";
import React, { useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { marked } from "marked";
import Image from "next/image";
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

export default function CreatePost() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [markdown, setMarkdown] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setPreviewUrl(imageURL);
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
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file || !title || !markdown) {
      setMessage("Please fill in all fields and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("content", markdown);

    try {
      const response = await axios.post("/api/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Post uploaded successfully!");
      router.push("/allposts");
    } catch (error) {
      console.error("Error uploading post:", error);
      setMessage("Error uploading post. Please try again.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#ccc",
      }}
    >
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="image">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <button type="button" onClick={handleButtonClick} className="bg-black text-white hover:bg-white hover:text-black py-3 px-4" >
              Upload cover image
            </button>
            {previewUrl && (
              <div style={{ marginTop: "20px" }}>
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={300}
                  height={200}
                />
              </div>
            )}
          </label>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              marginTop: "10px",
            }}
            placeholder="Enter the title of your post"
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="markdown">Content:</label>
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
            id="markdown"
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
            placeholder="Enter your content here"
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
          type="submit"
          className="bg-black text-white hover:bg-white hover:text-black"
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          Upload Post
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
