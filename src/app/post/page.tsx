"use client";
import React, { useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { marked } from "marked";
// import DOMPurify from "dompurify";


export default function CreatePost() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const insertMarkdownSyntax = (startTag: string, endTag: string = "") => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const { selectionStart, selectionEnd, value } = textarea;
      const selectedText = value.substring(selectionStart, selectionEnd);
      const newText = `${startTag}${selectedText}${endTag}`;
      setMarkdown(
        `${value.substring(0, selectionStart)}${newText}${value.substring(selectionEnd)}`
      );

      // Set cursor position correctly after inserting syntax
      setTimeout(() => {
        // If there was selected text, place the cursor at the end of the selected text
        // Otherwise, place the cursor between the start and end tags
        const cursorPosition = selectionStart + startTag.length + (selectedText ? selectedText.length : 0);
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
  // const handleLink = () => {
  //   const url = prompt("Enter the URL:");
  //   if (url) {
  //     insertMarkdownSyntax(`[`, `](${url})`);
  //   }
  // };
  // const handleImage = () => insertMarkdownSyntax("![Image description](url)");
  // const handleImage = () => {
  //   const url = prompt("Enter the image URL:");
  //   if (url) {
  //     insertMarkdownSyntax(`![alt text](${url})`);
  //   }
  // };


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
      fileInput.onchange = (e) => handleImageUpload(e as unknown as React.ChangeEvent<HTMLInputElement>);
      fileInput.click();
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
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="image">Cover Image:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "block", marginTop: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: "10px", fontSize: "16px", marginTop: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="markdown">Markdown Content:</label>
          <div style={{ marginBottom: "10px" }}>
            <button type="button" onClick={handleBold}><b>Bold</b></button>
            <button type="button" onClick={handleItalic}><i>Italic</i></button>
            <button type="button" onClick={handleStrikethrough}>Strikethrough</button>
            <button type="button" onClick={handleUnderline}><u>Underline</u></button>
            <button type="button" onClick={handleUnorderedList}>Unordered List</button>
            <button type="button" onClick={handleOrderedList}>Ordered List</button>
            <button type="button" onClick={handleCode}>Inline Code</button>
            <button type="button" onClick={handleCodeBlock}>Code Block</button>
            <button type="button" onClick={handleHeading}>Heading</button>
            <button type="button" onClick={handleLink}>Link</button>
            <button type="button" onClick={handleImage}>Image</button>
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
          />
        </div>
        <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "15px" }}>
          <h2>Preview</h2>
          <div
            dangerouslySetInnerHTML={{ __html: marked.parse(markdown) as string }}
            style={{ lineHeight: "1.5" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>Upload Post</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
