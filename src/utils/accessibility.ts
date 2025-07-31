// Accessibility utility functions

/**
 * Generates a unique ID for form elements and ARIA relationships
 */
export const generateAccessibleId = (prefix: string = 'accessible'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Checks if an element is focusable
 */
export const isFocusable = (element: HTMLElement): boolean => {
  const focusableSelectors = [
    'button',
    'input',
    'select',
    'textarea',
    'a[href]',
    '[tabindex]',
    '[contenteditable]'
  ];
  
  return focusableSelectors.some(selector => {
    if (element.matches(selector)) {
      const tabIndex = element.getAttribute('tabindex');
      return tabIndex !== '-1' && !element.hasAttribute('disabled');
    }
    return false;
  });
};

/**
 * Gets all focusable elements within a container
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const selector = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ');
  
  return Array.from(container.querySelectorAll(selector)) as HTMLElement[];
};

/**
 * Manages focus within a modal or dialog
 */
export const trapFocus = (container: HTMLElement, event: KeyboardEvent): void => {
  if (event.key !== 'Tab') return;
  
  const focusableElements = getFocusableElements(container);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  if (event.shiftKey) {
    if (document.activeElement === firstElement) {
      event.preventDefault();
      lastElement?.focus();
    }
  } else {
    if (document.activeElement === lastElement) {
      event.preventDefault();
      firstElement?.focus();
    }
  }
};

/**
 * Announces a message to screen readers
 */
export const announceToScreenReader = (
  message: string, 
  priority: 'polite' | 'assertive' = 'polite'
): void => {
  const announcer = document.getElementById('accessibility-announcer');
  if (announcer) {
    announcer.setAttribute('aria-live', priority);
    announcer.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  }
};

/**
 * Creates or updates ARIA describedby relationships
 */
export const setAriaDescribedBy = (
  element: HTMLElement, 
  descriptorId: string
): void => {
  const existingDescribedBy = element.getAttribute('aria-describedby');
  if (existingDescribedBy) {
    const ids = existingDescribedBy.split(' ');
    if (!ids.includes(descriptorId)) {
      element.setAttribute('aria-describedby', `${existingDescribedBy} ${descriptorId}`);
    }
  } else {
    element.setAttribute('aria-describedby', descriptorId);
  }
};

/**
 * Removes an ID from aria-describedby
 */
export const removeAriaDescribedBy = (
  element: HTMLElement, 
  descriptorId: string
): void => {
  const existingDescribedBy = element.getAttribute('aria-describedby');
  if (existingDescribedBy) {
    const ids = existingDescribedBy.split(' ').filter(id => id !== descriptorId);
    if (ids.length > 0) {
      element.setAttribute('aria-describedby', ids.join(' '));
    } else {
      element.removeAttribute('aria-describedby');
    }
  }
};

/**
 * Checks color contrast ratio (simplified version)
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  // This is a simplified implementation
  // In production, you'd want to use a proper color contrast library
  const getLuminance = (color: string): number => {
    // Convert hex to RGB and calculate luminance
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const sRGB = [r, g, b].map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };
  
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Validates if contrast ratio meets WCAG standards
 */
export const meetsContrastStandard = (
  color1: string, 
  color2: string, 
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): boolean => {
  const ratio = getContrastRatio(color1, color2);
  const requiredRatio = level === 'AAA' 
    ? (isLargeText ? 4.5 : 7) 
    : (isLargeText ? 3 : 4.5);
  
  return ratio >= requiredRatio;
};

/**
 * Adds visually hidden text for screen readers
 */
export const addScreenReaderText = (
  element: HTMLElement, 
  text: string
): void => {
  const srSpan = document.createElement('span');
  srSpan.className = 'sr-only';
  srSpan.textContent = text;
  element.appendChild(srSpan);
};

/**
 * Manages skip links functionality
 */
export const handleSkipLink = (targetId: string): void => {
  const target = document.getElementById(targetId);
  if (target) {
    target.focus();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Add tabindex temporarily if element is not naturally focusable
    if (!isFocusable(target)) {
      target.setAttribute('tabindex', '-1');
      target.addEventListener('blur', () => {
        target.removeAttribute('tabindex');
      }, { once: true });
    }
  }
};

/**
 * Debounces announcements to prevent spam
 */
let announceTimeout: NodeJS.Timeout;
export const debouncedAnnounce = (
  message: string, 
  delay: number = 500,
  priority: 'polite' | 'assertive' = 'polite'
): void => {
  clearTimeout(announceTimeout);
  announceTimeout = setTimeout(() => {
    announceToScreenReader(message, priority);
  }, delay);
};