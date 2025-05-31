
import React from "react";
import { cn } from "@/lib/utils";

interface RTLWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function RTLWrapper({ children, className }: RTLWrapperProps) {
  return (
    <div dir="rtl" className={cn("rtl text-right w-full overflow-x-hidden", className)}>
      {children}
    </div>
  );
}
