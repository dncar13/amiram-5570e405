import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CursorPosition {
  x: number;
  y: number;
}

interface CustomCursorProps {
  enabled?: boolean;
  variant?: 'default' | 'premium' | 'interactive';
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ 
  enabled = false, 
  variant = 'default' 
}) => {
  const [cursorPos, setCursorPos] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const updateCursor = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a, input, [role="button"]')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('button, a, input, [role="button"]')) {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Add event listeners
    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    // Hide default cursor
    document.body.style.cursor = 'none';
    document.body.style.setProperty('--cursor-hidden', 'none');

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);

      // Restore default cursor
      document.body.style.cursor = 'auto';
      document.body.style.removeProperty('--cursor-hidden');
    };
  }, [enabled]);

  if (!enabled) return null;

  const getCursorStyles = () => {
    const baseClasses = "fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference";
    
    switch (variant) {
      case 'premium':
        return `${baseClasses} w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full`;
      case 'interactive':
        return `${baseClasses} w-6 h-6 bg-blue-500 rounded-full border-2 border-white`;
      default:
        return `${baseClasses} w-4 h-4 bg-black rounded-full`;
    }
  };

  const getTrailStyles = () => {
    if (variant !== 'premium') return '';
    return "fixed top-0 left-0 pointer-events-none z-[9998] w-12 h-12 border-2 border-blue-300 rounded-full";
  };

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className={getCursorStyles()}
        style={{
          x: cursorPos.x - (variant === 'premium' ? 16 : variant === 'interactive' ? 12 : 8),
          y: cursorPos.y - (variant === 'premium' ? 16 : variant === 'interactive' ? 12 : 8),
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
          opacity: isClicking ? 0.8 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      />

      {/* Trail effect for premium variant */}
      {variant === 'premium' && (
        <motion.div
          className={getTrailStyles()}
          style={{
            x: cursorPos.x - 24,
            y: cursorPos.y - 24,
          }}
          animate={{
            scale: isHovering ? 1.2 : 1,
            opacity: isHovering ? 0.6 : 0.3,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.1,
          }}
        />
      )}

      {/* Click ripple effect */}
      {isClicking && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9997] w-16 h-16 border-2 border-blue-400 rounded-full"
          style={{
            x: cursorPos.x - 32,
            y: cursorPos.y - 32,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      )}

      {/* Add CSS to hide all default cursors */}
      <style>{`
        * {
          cursor: none !important;
        }
        
        /* Special handling for text inputs */
        input[type="text"], 
        input[type="email"], 
        input[type="password"], 
        textarea {
          cursor: text !important;
        }
      `}</style>
    </>
  );
};

// Hook to manage cursor state
export const useCursor = () => {
  const [cursorEnabled, setCursorEnabled] = useState(false);
  const [cursorVariant, setCursorVariant] = useState<'default' | 'premium' | 'interactive'>('default');

  const enableCursor = (variant: 'default' | 'premium' | 'interactive' = 'default') => {
    setCursorVariant(variant);
    setCursorEnabled(true);
  };

  const disableCursor = () => {
    setCursorEnabled(false);
  };

  return {
    cursorEnabled,
    cursorVariant,
    enableCursor,
    disableCursor,
  };
};
