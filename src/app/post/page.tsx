// "use client";
// import React, { useState, useRef } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { marked } from "marked";
// import {
//   BoldIcon,
//   UnderlineIcon,
//   ItalicIcon,
//   LinkIcon,
//   PhotoIcon,
//   StrikethroughIcon,
//   ListBulletIcon,
//   NumberedListIcon,
//   CodeBracketIcon,
//   H1Icon,
//   CodeBracketSquareIcon,
//   MinusIcon,
//   TableCellsIcon,
// } from "@heroicons/react/24/outline";
// import Image from "next/image";

// export default function CreatePost() {
//   const [file, setFile] = useState<File | null>(null);
//   const [title, setTitle] = useState("");
//   const [previewUrl, setPreviewUrl] = useState(null);
//   const [markdown, setMarkdown] = useState("");
//   const [message, setMessage] = useState("");
//   const router = useRouter();
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [loading, setLoading] = useState(false);

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setFile(e.target.files[0]);
//       const file = e.target.files[0];
//       try {
//         setLoading(true);
//         const response = await axios.post("/api/upload", file, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });
//         console.log("Image URL:", response.data.imageURL);
//         const imageURL = response.data.imageURL;
//         setPreviewUrl(imageURL);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error uploading image:", error);
//       }
//     }
//   };

//   const insertMarkdownSyntax = (startTag: string, endTag: string = "") => {
//     if (textareaRef.current) {
//       const textarea = textareaRef.current;
//       const { selectionStart, selectionEnd, value } = textarea;
//       const selectedText = value.substring(selectionStart, selectionEnd);
//       const newText = `${startTag}${selectedText}${endTag}`;
//       setMarkdown(
//         `${value.substring(0, selectionStart)}${newText}${value.substring(
//           selectionEnd
//         )}`
//       );

//       // Set cursor position correctly after inserting syntax
//       setTimeout(() => {
//         // If there was selected text, place the cursor at the end of the selected text
//         // Otherwise, place the cursor between the start and end tags
//         const cursorPosition =
//           selectionStart +
//           startTag.length +
//           (selectedText ? selectedText.length : 0);
//         textarea.setSelectionRange(cursorPosition, cursorPosition);
//         textarea.focus();
//       }, 0);
//     }
//   };

//   const handleBold = () => insertMarkdownSyntax("**", "**");
//   const handleItalic = () => insertMarkdownSyntax("*", "*");
//   const handleStrikethrough = () => insertMarkdownSyntax("~~", "~~");
//   const handleUnderline = () => insertMarkdownSyntax("<u>", "</u>");
//   const handleUnorderedList = () => insertMarkdownSyntax("- ");
//   const handleOrderedList = () => insertMarkdownSyntax("1. ");
//   const handleCode = () => insertMarkdownSyntax("`", "`");
//   const handleCodeBlock = () => insertMarkdownSyntax("```\n", "\n```");
//   const handleHeading = () => insertMarkdownSyntax("# ");
//   const handleLink = () => insertMarkdownSyntax("[Link description](url)");
//   const handleHorizontalRule = () => insertMarkdownSyntax("\n---\n");
//   const handleTable = () =>
//     insertMarkdownSyntax(
//       "| Header1 | Header2 |\n| --- | --- |\n| Row1 | Row2 |"
//     );

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];

//       try {
//         const response = await axios.post("/api/upload", file, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });
//         console.log("Image URL:", response.data.imageURL);
//         const imageURL = response.data.imageURL;
//         insertMarkdownSyntax(`![Image description](${imageURL})`);
//       } catch (error) {
//         console.error("Error uploading image:", error);
//       }
//     }
//   };

//   const handleImage = () => {
//     if (textareaRef.current) {
//       const fileInput = document.createElement("input");
//       fileInput.type = "file";
//       fileInput.accept = "image/*";
//       fileInput.onchange = (e) =>
//         handleImageUpload(e as unknown as React.ChangeEvent<HTMLInputElement>);
//       fileInput.click();
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log(file);
//     console.log(title);
//     console.log(markdown);

//     if (!file || !title || !markdown) {
//       setMessage("Please fill in all fields and select a file.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("image", file);
//     formData.append("title", title);
//     formData.append("content", markdown);

//     try {
//       const response = await axios.post("/api/post", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setMessage("Post uploaded successfully!");
//       router.push("/allposts");
//     } catch (error) {
//       console.error("Error uploading post:", error);
//       setMessage("Error uploading post. Please try again.");
//     }
//   };

//   // console.log(process.env.NEXTAUTH_URL)
//   return (
//     <div
//       style={{
//         maxWidth: "800px",
//         margin: "0 auto",
//         padding: "20px",
//         backgroundColor: "#ccc",
//       }}
//     >
//       <h1>Create Post</h1>
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: "15px" }}>
//           <label htmlFor="image">
//             <div className="p-6">
//               <div className="flex flex-col items-center justify-center w-full h-64 bg-muted rounded-md border-2 border-dashed border-muted-foreground/50 cursor-pointer transition-colors hover:bg-muted/50 relative">
//                 {loading ? (
//                   <div className="flex items-center justify-center h-full w-full">
//                     <svg
//                       className="animate-spin h-8 w-8 text-muted-foreground"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                       ></path>
//                     </svg>
//                   </div>
//                 ) : previewUrl ? (
//                   <Image
//                     src={previewUrl}
//                     alt="Preview"
//                     width={300}
//                     height={200}
//                     className="w-full h-full object-cover rounded-md"
//                   />
//                 ) : (
//                   <>
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="w-12 h-12 text-muted-foreground"
//                     >
//                       <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//                       <polyline points="17 8 12 3 7 8"></polyline>
//                       <line x1="12" x2="12" y1="3" y2="15"></line>
//                     </svg>
//                     <p className="mt-4 text-sm text-muted-foreground">
//                       Drag and drop your cover picture or click to select a file
//                     </p>
//                   </>
//                 )}
//                 <input
//                   type="file"
//                   id="image"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                 />
//               </div>
//             </div>
//           </label>
//         </div>
//         <div style={{ marginBottom: "15px" }}>
//           <label htmlFor="title">Title:</label>
//           <input
//             type="text"
//             name="title"
//             id="title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             style={{
//               width: "100%",
//               padding: "10px",
//               fontSize: "16px",
//               marginTop: "10px",
//             }}
//             placeholder="Enter the title of your post"
//           />
//         </div>
//         <div style={{ marginBottom: "15px" }}>
//           <label htmlFor="markdown">Content:</label>
//           <div
//             className="text-center flex gap-9"
//             style={{ marginBottom: "10px" }}
//           >
//             <button title="Bold Text" type="button" onClick={handleBold}>
//               <BoldIcon className="h-6 w-6" />
//             </button>
//             <button title="Italic Text" type="button" onClick={handleItalic}>
//               <ItalicIcon className="h-6 w-6" />
//             </button>
//             <button
//               title="Strikethrough Text"
//               type="button"
//               onClick={handleStrikethrough}
//             >
//               <StrikethroughIcon className="h-6 w-6" />
//             </button>
//             <button
//               title="Underline Text"
//               type="button"
//               onClick={handleUnderline}
//             >
//               <UnderlineIcon className="h-6 w-6" />
//             </button>
//             <button
//               title=" Bullet List"
//               type="button"
//               onClick={handleUnorderedList}
//             >
//               <ListBulletIcon className="h-6 w-6" />
//             </button>
//             <button
//               title="Number List"
//               type="button"
//               onClick={handleOrderedList}
//             >
//               <NumberedListIcon className="h-6 w-6" />
//             </button>
//             <button title="Single line code" type="button" onClick={handleCode}>
//               <CodeBracketIcon className="h-6 w-6" />
//             </button>
//             <button title="Code Block" type="button" onClick={handleCodeBlock}>
//               <CodeBracketSquareIcon className="h-6 w-6" />
//             </button>
//             <button title="Header" type="button" onClick={handleHeading}>
//               <H1Icon className="h-6 w-6" />
//             </button>
//             <button title="Add Link" type="button" onClick={handleLink}>
//               <LinkIcon className="h-6 w-6" />
//             </button>
//             <button title="Add Image" type="button" onClick={handleImage}>
//               <PhotoIcon className="h-6 w-6" />
//             </button>
//             <button
//               title="Horizontal Rule"
//               type="button"
//               onClick={handleHorizontalRule}
//             >
//               <MinusIcon className="h-6 w-6" />
//             </button>
//             <button title="Table" type="button" onClick={handleTable}>
//               <TableCellsIcon className="h-6 w-6" />
//             </button>
//           </div>
//           <textarea
//             ref={textareaRef}
//             id="content"
//             value={markdown}
//             onChange={(e) => setMarkdown(e.target.value)}
//             style={{
//               width: "100%",
//               height: "200px",
//               marginTop: "10px",
//               padding: "10px",
//               fontFamily: "monospace",
//               fontSize: "16px",
//               lineHeight: "1.5",
//             }}
//             placeholder="Enter your content here"
//           />
//         </div>
//         <div
//           style={{
//             border: "1px solid #ccc",
//             padding: "10px",
//             marginBottom: "15px",
//           }}
//         >
//           <h2>Preview</h2>
//           <div
//             dangerouslySetInnerHTML={{
//               __html: marked.parse(markdown) as string,
//             }}
//             style={{ lineHeight: "1.5" }}
//           />
//         </div>
//         <button
//           type="submit"
//           className="bg-black text-white hover:bg-white hover:text-black"
//           style={{ padding: "10px 20px", fontSize: "16px" }}
//         >
//           Upload Post
//         </button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// }

"use client";
import React, { useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
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
} from "@heroicons/react/24/outline";
import Image from "next/image";

export default function CreatePost() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [markdown, setMarkdown] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      const file = e.target.files[0];
      try {
        setLoading(true);
        const response = await axios.post("/api/upload", file, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Image URL:", response.data.imageURL);
        const imageURL = response.data.imageURL;
        setPreviewUrl(imageURL);
        setLoading(false);
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
  const handleHorizontalRule = () => insertMarkdownSyntax("\n---\n");
  const handleTable = () =>
    insertMarkdownSyntax(
      "| Header1 | Header2 |\n| --- | --- |\n| Row1 | Row2 |"
    );

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(file);
    console.log(title);
    console.log(markdown);

    if (!file || !title || !markdown) {
      setMessage("Please fill in all fields and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("content", markdown);

    try {
      setLoading(true);
      const response = await axios.post("/api/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Post uploaded successfully!");

      router.push("/allposts");
      setLoading(false);
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
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Create Post</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="image">
            <div
              style={{
                flexDirection: "column",
                backgroundColor: "#e0e0e0",
                border: "2px dashed #ccc",
                transition: "background-color 0.3s",
              }}
              className="hover:bg-gray-300 p-2 flex items-center justify-center w-full h-64 rounded-md cursor-pointer relative"
            >
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <svg
                    className="animate-spin h-8 w-8 text-muted-foreground"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                </div>
              ) : previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={300}
                  height={200}
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "5px" }}
                />
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-12 h-12 text-muted-foreground"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" x2="12" y1="3" y2="15"></line>
                  </svg>
                  <p style={{ marginTop: "10px", fontSize: "14px", color: "#888" }}>
                    Drag and drop your cover picture or click to select a file
                  </p>
                </>
              )}
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
                style={{ position: "absolute", inset: "0", width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
              />
            </div>
          </label>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              marginTop: "10px",
              boxSizing: "border-box",
            }}
            placeholder="Enter the title of your post"
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="markdown">Content:</label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "10px",
            }}
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
            <button
              title="Horizontal Rule"
              type="button"
              onClick={handleHorizontalRule}
            >
              <MinusIcon className="h-6 w-6" />
            </button>
            <button title="Table" type="button" onClick={handleTable}>
              <TableCellsIcon className="h-6 w-6" />
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
              boxSizing: "border-box",
              borderRadius: "5px",
              borderColor: "#ccc",
            }}
            placeholder="Enter your content here"
          />
        </div>
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
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
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "black",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s, color 0.3s",
            width: "100%",
          }}
          className={"hover:bg-white hover:text-black cursor-pointer `${loading ? 'opacity-50 cursor-not-allowed' : ''}`"}
          disabled={loading}
        >
          {loading ? "Uploading Post" : "Upload Post"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
