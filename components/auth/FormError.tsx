"use client";

import React from "react";

interface FormErrorProps {
  error?: string | null;
}

export default function FormError({ error }: FormErrorProps) {
  if (!error) return null;

  return <p className="text-danger mb-10">{error}</p>;
}
