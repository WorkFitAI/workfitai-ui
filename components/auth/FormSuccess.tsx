"use client";

import React from "react";

interface FormSuccessProps {
  message?: string | null;
}

export default function FormSuccess({ message }: FormSuccessProps) {
  if (!message) return null;

  return <p className="text-success mb-10">{message}</p>;
}
