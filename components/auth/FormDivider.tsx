"use client";

import React from "react";

interface FormDividerProps {
  text?: string;
}

export default function FormDivider({ text = "Or continue with" }: FormDividerProps) {
  return (
    <div className="divider-text-center">
      <span>{text}</span>
    </div>
  );
}
