
import { cn } from "@/lib/utils";
import React from "react";

interface HoverEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "outline";
  children: React.ReactNode;
}

export function HoverEffect({
  className,
  variant = "primary",
  children,
  ...props
}: HoverEffectProps) {
  return (
    <div
      className={cn(
        "transition-all duration-200 hover:shadow-md rounded-md",
        variant === "primary" && "hover:bg-electric-blue/10 hover:scale-[1.02]",
        variant === "secondary" && "hover:bg-electric-orange/10 hover:scale-[1.02]",
        variant === "outline" && "hover:bg-electric-gray/30 hover:scale-[1.01]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
