"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface ParagraphEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function ParagraphEditor({
  value,
  onChange,
  placeholder = "Start typing...",
}: ParagraphEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleBullet = () => editor.chain().focus().toggleBulletList().run();

  const isActive = (type: string) => editor.isActive(type);

  return (
    <div
      className="rounded overflow-hidden shadow-sm border"
      style={{ borderColor: "#e0e0e0" }}
    >
      {/* Toolbar */}
      <div
        className="d-flex gap-2 px-3 py-2 text-white"
        style={{ backgroundColor: "#3c65f5", borderColor: "#3c65f5" }}
      >
        {["bold", "italic", "bulletList"].map((cmd) => {
          const label = cmd === "bold" ? "B" : cmd === "italic" ? "I" : "•";
          const handler =
            cmd === "bold"
              ? toggleBold
              : cmd === "italic"
              ? toggleItalic
              : toggleBullet;
          return (
            <button
              key={cmd}
              type="button"
              onClick={handler}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: isActive(cmd) ? "#ffd700" : "#ffffff",
                fontWeight: cmd === "bold" ? 700 : 400,
                fontStyle: cmd === "italic" ? "italic" : "normal",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: 4,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = isActive(cmd)
                  ? "#ffe066"
                  : "#d0e0ff")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = isActive(cmd)
                  ? "#ffd700"
                  : "#ffffff")
              }
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="p-3"
        style={{
          minHeight: 120,
          backgroundColor: "#ffffff",
        }}
        data-placeholder={placeholder}
      />

      {/* Global styles for ProseMirror */}
      <style jsx>{`
        :global(.ProseMirror) {
          outline: none;
          font-family: "Inter", sans-serif;
          line-height: 1.5;
        }
        :global(.ProseMirror p) {
          margin: 0 0 1em 0;
        }
        :global(.ProseMirror em) {
          font-style: italic !important;
        }
        :global(.ProseMirror strong) {
          font-weight: 700 !important;
        }
        :global(.ProseMirror ul) {
          list-style-type: disc !important;
          padding-left: 20px !important;
        }
        :global(.ProseMirror p::before) {
          content: attr(data-placeholder);
          color: #999;
          float: left;
          height: 0;
          pointer-events: none;
          display: block;
        }
      `}</style>
    </div>
  );
}
