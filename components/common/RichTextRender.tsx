"use client";

import React from "react";

interface RichTextRenderProps {
  content?: string; // HTML string từ Tiptap
}

const RichTextRender: React.FC<RichTextRenderProps> = ({ content }) => {
  if (!content) return null;

  return <div dangerouslySetInnerHTML={{ __html: content }} />;
};

export default RichTextRender;
