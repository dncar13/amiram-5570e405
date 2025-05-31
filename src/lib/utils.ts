
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to calculate max height for images with responsive adjustments
export function getImageMaxHeight(size: 'small' | 'medium' | 'large' = 'medium'): string {
  switch(size) {
    case 'small':
      return 'max-h-[12rem] sm:max-h-[14rem] md:max-h-[16rem]';
    case 'large':
      return 'max-h-[18rem] sm:max-h-[20rem] md:max-h-[22rem]';
    case 'medium':
    default:
      return 'max-h-[14rem] sm:max-h-[16rem] md:max-h-[18rem]';
  }
}

// Helper function to create aspect ratio components with responsive sizing
export function getResponsiveAspectRatio(ratio: number = 16/9): string {
  return `aspect-[${ratio}] w-full`;
}
