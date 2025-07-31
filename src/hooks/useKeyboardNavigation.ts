import { useEffect, useCallback, RefObject } from 'react';

interface KeyboardNavigationOptions {
  containerRef?: RefObject<HTMLElement>;
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onTab?: (event: KeyboardEvent) => void;
  trapFocus?: boolean;
  autoFocus?: boolean;
}

export const useKeyboardNavigation = (options: KeyboardNavigationOptions = {}) => {
  const {
    containerRef,
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    trapFocus = false,
    autoFocus = false,
  } = options;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        if (onEscape) {
          event.preventDefault();
          onEscape();
        }
        break;
      case 'Enter':
        if (onEnter) {
          event.preventDefault();
          onEnter();
        }
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp();
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown();
        }
        break;
      case 'ArrowLeft':
        if (onArrowLeft) {
          event.preventDefault();
          onArrowLeft();
        }
        break;
      case 'ArrowRight':
        if (onArrowRight) {
          event.preventDefault();
          onArrowRight();
        }
        break;
      case 'Tab':
        if (onTab) {
          onTab(event);
        }
        if (trapFocus && containerRef?.current) {
          handleFocusTrap(event, containerRef.current);
        }
        break;
    }
  }, [onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onTab, trapFocus, containerRef]);

  const handleFocusTrap = (event: KeyboardEvent, container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  const focusFirstElement = useCallback(() => {
    const container = containerRef?.current || document.body;
    const focusableElement = container.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;
    
    if (focusableElement) {
      focusableElement.focus();
    }
  }, [containerRef]);

  const focusLastElement = useCallback(() => {
    const container = containerRef?.current || document.body;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    if (lastElement) {
      lastElement.focus();
    }
  }, [containerRef]);

  useEffect(() => {
    const element = containerRef?.current || document;
    element.addEventListener('keydown', handleKeyDown);

    // Auto focus first element if requested
    if (autoFocus) {
      setTimeout(focusFirstElement, 100);
    }

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, autoFocus, focusFirstElement, containerRef]);

  return {
    focusFirstElement,
    focusLastElement,
  };
};

// Hook for managing focus restoration
export const useFocusRestore = () => {
  const restoreFocus = useCallback((previousActiveElement: HTMLElement | null) => {
    if (previousActiveElement && document.contains(previousActiveElement)) {
      previousActiveElement.focus();
    }
  }, []);

  const captureFocus = useCallback(() => {
    return document.activeElement as HTMLElement | null;
  }, []);

  return { captureFocus, restoreFocus };
};