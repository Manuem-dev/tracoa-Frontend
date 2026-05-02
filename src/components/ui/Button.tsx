"use client";

import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "outline" | "secondary";
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  variant = "primary", 
  fullWidth = false, 
  className = "", 
  ...props 
}: ButtonProps) {
  let baseClass = "flex items-center justify-center gap-2 rounded-lg py-3.5 px-5 font-semibold text-sm transition-all ";
  
  if (fullWidth) {
    baseClass += "w-full ";
  }

  switch (variant) {
    case "primary":
      baseClass += "bg-tracao-cacao text-white hover:bg-tracao-cacao/90 active:scale-[0.98] ";
      break;
    case "outline":
      baseClass += "border border-tracao-border bg-transparent text-tracao-cacao hover:bg-tracao-cream-light active:scale-[0.98] ";
      break;
    case "secondary":
      baseClass += "bg-tracao-cream-mid text-tracao-choco hover:bg-tracao-cream-mid/80 active:scale-[0.98] ";
      break;
  }

  return (
    <button className={`${baseClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
