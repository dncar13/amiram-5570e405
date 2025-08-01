// Runtime accessibility checking utilities

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  element: HTMLElement;
  message: string;
  fix?: string;
}

/**
 * Checks for common accessibility issues in the DOM
 */
export const runAccessibilityCheck = (): AccessibilityIssue[] => {
  const issues: AccessibilityIssue[] = [];

  // Check for images without alt text
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        type: 'error',
        element: img,
        message: 'Image missing alt attribute',
        fix: 'Add descriptive alt text or alt="" for decorative images'
      });
    }
  });

  // Check for buttons without accessible names
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    const hasText = button.textContent?.trim();
    const hasAriaLabel = button.hasAttribute('aria-label');
    const hasAriaLabelledBy = button.hasAttribute('aria-labelledby');
    
    if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push({
        type: 'error',
        element: button,
        message: 'Button without accessible name',
        fix: 'Add visible text, aria-label, or aria-labelledby'
      });
    }
  });

  // Check for links without accessible names
  const links = document.querySelectorAll('a');
  links.forEach((link) => {
    const hasText = link.textContent?.trim();
    const hasAriaLabel = link.hasAttribute('aria-label');
    const hasAriaLabelledBy = link.hasAttribute('aria-labelledby');
    
    if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push({
        type: 'error',
        element: link,
        message: 'Link without accessible name',
        fix: 'Add descriptive link text or aria-label'
      });
    }
  });

  // Check for form inputs without labels
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    const hasLabel = document.querySelector(`label[for="${input.id}"]`);
    const hasAriaLabel = input.hasAttribute('aria-label');
    const hasAriaLabelledBy = input.hasAttribute('aria-labelledby');
    
    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy && (input as HTMLInputElement).type !== 'hidden') {
      issues.push({
        type: 'error',
        element: input as HTMLElement,
        message: 'Form control without label',
        fix: 'Add a label element or aria-label'
      });
    }
  });

  // Check heading hierarchy
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const h1Count = document.querySelectorAll('h1').length;
  
  if (h1Count === 0) {
    issues.push({
      type: 'error',
      element: document.body,
      message: 'Page missing h1 heading',
      fix: 'Add a single h1 heading to the page'
    });
  } else if (h1Count > 1) {
    issues.push({
      type: 'warning',
      element: document.body,
      message: 'Multiple h1 headings found',
      fix: 'Use only one h1 per page'
    });
  }

  // Check for skip links
  const skipLinks = document.querySelectorAll('a[href^="#"]');
  let hasSkipToMain = false;
  skipLinks.forEach((link) => {
    if (link.getAttribute('href') === '#main-content' || 
        link.textContent?.includes('דלג לתוכן') ||
        link.textContent?.includes('skip')) {
      hasSkipToMain = true;
    }
  });

  if (!hasSkipToMain) {
    issues.push({
      type: 'warning',
      element: document.body,
      message: 'No skip navigation found',
      fix: 'Add skip links for keyboard users'
    });
  }

  // Check for focus indicators
  const style = getComputedStyle(document.documentElement);
  if (!style.getPropertyValue('--ring-color') && 
      !document.querySelector('style')?.textContent?.includes(':focus-visible')) {
    issues.push({
      type: 'warning',
      element: document.body,
      message: 'Focus indicators may be missing',
      fix: 'Ensure visible focus indicators for keyboard navigation'
    });
  }

  return issues;
};

/**
 * Checks color contrast ratio (simplified implementation)
 */
export const checkColorContrast = (element: HTMLElement): boolean => {
  const computedStyle = getComputedStyle(element);
  const color = computedStyle.color;
  const backgroundColor = computedStyle.backgroundColor;
  
  // This is a simplified check - in production use a proper color contrast library
  if (color && backgroundColor && 
      color !== 'rgba(0, 0, 0, 0)' && 
      backgroundColor !== 'rgba(0, 0, 0, 0)') {
    // Placeholder for actual ratio calculation
    return true;
  }
  
  return false;
};

/**
 * Reports accessibility issues to console in development
 */
export const reportAccessibilityIssues = (): void => {
  if (process.env.NODE_ENV !== 'development') return;

  const issues = runAccessibilityCheck();
  
  if (issues.length === 0) {
    console.log('✅ No accessibility issues found');
    return;
  }

  console.group('🔍 Accessibility Issues Found');
  
  const errors = issues.filter(i => i.type === 'error');
  const warnings = issues.filter(i => i.type === 'warning');
  const info = issues.filter(i => i.type === 'info');

  if (errors.length > 0) {
    console.group('❌ Errors');
    errors.forEach(issue => {
      console.error(issue.message, issue.element);
      if (issue.fix) console.log('💡 Fix:', issue.fix);
    });
    console.groupEnd();
  }

  if (warnings.length > 0) {
    console.group('⚠️ Warnings');
    warnings.forEach(issue => {
      console.warn(issue.message, issue.element);
      if (issue.fix) console.log('💡 Fix:', issue.fix);
    });
    console.groupEnd();
  }

  if (info.length > 0) {
    console.group('ℹ️ Info');
    info.forEach(issue => {
      console.info(issue.message, issue.element);
      if (issue.fix) console.log('💡 Fix:', issue.fix);
    });
    console.groupEnd();
  }

  console.groupEnd();
};

/**
 * Validates ARIA attributes
 */
export const validateAriaAttributes = (element: HTMLElement): string[] => {
  const issues: string[] = [];
  const ariaAttributes = Array.from(element.attributes).filter(
    attr => attr.name.startsWith('aria-')
  );

  ariaAttributes.forEach(attr => {
    // Check for common ARIA mistakes
    if (attr.name === 'aria-labelledby' || attr.name === 'aria-describedby') {
      const ids = attr.value.split(' ');
      ids.forEach(id => {
        if (!document.getElementById(id)) {
          issues.push(`${attr.name} references non-existent ID: ${id}`);
        }
      });
    }

    // Check for invalid ARIA values
    if (attr.name === 'aria-expanded' || attr.name === 'aria-checked') {
      if (!['true', 'false'].includes(attr.value)) {
        issues.push(`${attr.name} should be "true" or "false", got: ${attr.value}`);
      }
    }
  });

  return issues;
};

/**
 * Auto-run accessibility check on page load (development only)
 */
if (process.env.NODE_ENV === 'development') {
  // Run check after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(reportAccessibilityIssues, 1000);
    });
  } else {
    setTimeout(reportAccessibilityIssues, 1000);
  }
}