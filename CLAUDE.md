# AMIRAM Simulation Platform - Project Configuration

## Project Overview

**AMIRAM Simulation Platform** is a comprehensive web application for studying and practicing the AMIRAM English proficiency exam in Israel. The platform provides an accessible, secure, and user-friendly environment for Hebrew-speaking users to prepare for their English certification.

### Core Mission
Enable Hebrew-speaking students to effectively prepare for the AMIRAM exam through high-quality practice simulations, detailed progress tracking, and comprehensive learning analytics.

## Project Values & Principles

### 1. Accessibility First
- **WCAG 2.1 AA compliance** is mandatory, not optional
- Strong color contrast (minimum 4.5:1 ratio)
- Screen reader compatibility with proper ARIA labels
- Keyboard navigation support for all interactive elements
- Touch-friendly mobile interface (minimum 44px touch targets)
- Support for users with varying technical abilities

### 2. Hebrew RTL Excellence
- Full right-to-left (RTL) layout support throughout the interface
- **Language isolation principle**: Never mix Hebrew and English in the same UI component
- English content (exam questions/passages) automatically switches to LTR within RTL containers
- Proper text direction handling for mixed-language content
- Hebrew typography optimization and font selection

### 3. Security by Design
- **Zero tolerance for XSS vulnerabilities** - all user content must be sanitized
- CSRF protection on all state-changing operations
- Secure authentication and session management
- Payment security compliance (PCI DSS considerations)
- Data protection and privacy compliance
- Regular security audits and vulnerability assessments

### 4. Clean, Intuitive Design
- Minimal, uncluttered interface design
- Clear visual hierarchy and information architecture
- Consistent design patterns across all pages
- Mobile-first responsive design approach
- Fast loading times and smooth interactions

## Technical Architecture

### Technology Stack
- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS (excellent RTL support)
- **Backend/Database**: Supabase (PostgreSQL, Authentication, Real-time)
- **Payment Processing**: Stripe (primary) + Israeli providers (Tranzila/Cardcom)
- **Hosting**: Netlify or Vercel
- **Monitoring**: Supabase Analytics + error tracking

### Core Features
- **Exam Simulation**: Multiple choice and reading comprehension questions
- **Progress Tracking**: Detailed analytics and performance insights
- **User Management**: Role-based access (Guest, Registered, Premium)
- **Admin Panel**: Question management with Excel/CSV import
- **Payment System**: Secure subscription management
- **Offline Support**: Progressive Web App capabilities

## User Roles & Permissions

### Guest Users (Unauthenticated)
```typescript
permissions: {
  canAccessPremiumContent: false,
  maxQuestionsPerDay: 5,
  canSaveProgress: false,
  hasDetailedAnalytics: false,
  examAttempts: 1,
  canBookmarkQuestions: false
}
```

### Registered Users (Free Account)
```typescript
permissions: {
  canAccessPremiumContent: false,
  maxQuestionsPerDay: 20,
  canSaveProgress: true,
  hasDetailedAnalytics: false,
  examAttempts: 3,
  canBookmarkQuestions: true,
  hasBasicProgress: true
}
```

### Premium Users (Paid Subscription)
```typescript
permissions: {
  canAccessPremiumContent: true,
  maxQuestionsPerDay: -1, // unlimited
  canSaveProgress: true,
  hasDetailedAnalytics: true,
  examAttempts: -1, // unlimited
  canBookmarkQuestions: true,
  hasAdvancedProgress: true,
  canExportResults: true,
  hasPersonalizedRecommendations: true
}
```

### Admin Users
```typescript
permissions: {
  // All premium permissions plus:
  canManageQuestions: true,
  canImportQuestions: true,
  canViewUserAnalytics: true,
  canManageUsers: true,
  canAccessAdminPanel: true
}
```

## Coding Standards & Conventions

### Code Quality Requirements
- **Readable code over clever code** - prioritize maintainability
- Comprehensive TypeScript typing (no `any` types except in rare, documented cases)
- Consistent naming conventions (camelCase for variables, PascalCase for components)
- Maximum function length: 30 lines (extract smaller functions when exceeded)
- Meaningful variable and function names that explain intent

### Component Structure
```typescript
// Preferred component structure
interface ComponentProps {
  // Props with clear TypeScript types
}

export const ComponentName: React.FC<ComponentProps> = ({ props }) => {
  // Hooks at the top
  // Event handlers
  // Render logic
  
  return (
    <div className="rtl-safe-container">
      {/* JSX with proper RTL considerations */}
    </div>
  );
};
```

### File Organization
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── exam/         # Exam-specific components
│   └── admin/        # Admin panel components
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
├── services/         # API and external service integrations
└── styles/           # Global styles and Tailwind config
```

### RTL-Specific Coding Guidelines
```css
/* Use logical properties instead of physical ones */
/* ❌ Wrong */
margin-left: 1rem;
text-align: left;

/* ✅ Correct */
margin-inline-start: 1rem;
text-align: start;

/* Use Tailwind RTL utilities */
/* ❌ Wrong */
<div className="ml-4 text-left">

/* ✅ Correct */
<div className="ms-4 text-start">
```

## Security Requirements

### Authentication & Authorization
- **Supabase Row Level Security (RLS)** must be enabled on all tables
- Session management with secure token handling
- Role-based access control enforced at database level
- Regular security token rotation

### Input Validation & Sanitization
```typescript
// All user inputs must be validated and sanitized
import DOMPurify from 'dompurify';

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], // No HTML tags allowed in most inputs
    ALLOWED_ATTR: []
  });
};
```

### API Security
- Rate limiting on all public endpoints
- Request size limits to prevent DoS attacks
- CORS properly configured for production domains
- API key rotation procedures documented

### Payment Security
- **Never store payment information** - use provider tokens only
- Webhook signature verification for payment events
- PCI DSS compliance considerations
- Secure payment flow with proper error handling

## User Experience Guidelines

### Critical UI Requirements
- **"Next", "Previous", "Submit Answer" buttons must always be prominent**
- Clear progress indicators throughout exam sessions
- Consistent navigation patterns across all pages
- Error messages in Hebrew with clear, actionable guidance
- Loading states for all async operations

### Mobile Optimization
- Touch targets minimum 44px × 44px
- Swipe gestures for question navigation (optional enhancement)
- Optimized keyboard input for mobile devices
- Portrait and landscape orientation support

### Accessibility Requirements
```typescript
// Example accessible component structure
<button
  aria-label="המשך לשאלה הבאה"
  className="prominent-button"
  disabled={!canProceed}
  onClick={handleNext}
>
  הבא
</button>
```

## Question Management System

### Question Data Structure
```typescript
interface Question {
  id: string;
  type: 'multiple-choice' | 'reading-comprehension';
  category: 'grammar' | 'vocabulary' | 'reading' | 'listening';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  passage?: string; // For reading comprehension
  options: string[];
  correctAnswer: number;
  explanation: string;
  timeLimit?: number; // seconds
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Content Management Guidelines
- All questions must include explanations for correct answers
- Hebrew instructions with English question content when applicable
- Consistent difficulty calibration across question sets
- Regular content review and updates

## Development Workflow

### Git Workflow
- **Main branch**: Production-ready code only
- **Develop branch**: Integration branch for features
- **Feature branches**: Individual feature development
- Pull request required for all merges to main
- Comprehensive testing before production deployment

### Code Review Requirements
- **Security review mandatory** for authentication, payment, and user data handling
- Accessibility testing on all UI changes
- RTL layout verification for Hebrew interface components
- Mobile responsiveness testing
- Performance impact assessment

### Testing Strategy
- Unit tests for utility functions and business logic
- Integration tests for API endpoints
- End-to-end tests for critical user flows (exam taking, payment)
- Accessibility testing with screen readers
- Cross-browser testing (Chrome, Firefox, Safari, Edge)

## Deployment & Operations

### Environment Configuration
```bash
# Required environment variables
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### Performance Requirements
- Initial page load: < 3 seconds
- Question navigation: < 500ms
- Search functionality: < 1 second
- Mobile performance optimization
- Progressive Web App capabilities

### Monitoring & Analytics
- User behavior analytics (privacy-compliant)
- Performance monitoring and error tracking
- Payment transaction monitoring
- Security event logging
- Regular backup procedures

## AI Development Guidelines

### When Working with AI Assistants
- **Always ask before making significant changes** to user-facing features
- Request comparisons for multiple implementation approaches
- Prioritize code readability and maintainability over cleverness
- Explain technical decisions in simple, non-developer language
- Provide step-by-step implementation plans for complex features

### Preferred Communication Style
- Use comparison tables for technical decisions
- Explain security implications in accessible language
- Provide realistic timelines for feature development
- Suggest best practices and industry standards
- Offer multiple solutions with clear trade-offs

## Additional Recommendations

### Performance Optimization
- Implement lazy loading for question content
- Use React.memo for heavy components
- Optimize images and assets for web delivery
- Consider CDN for static content
- Implement proper caching strategies

### User Engagement Features
- Progress gamification (optional)
- Study streak tracking
- Personalized study recommendations
- Social sharing of achievements (privacy-conscious)
- Email notifications for study reminders

### Business Intelligence
- A/B testing framework for UI improvements
- User feedback collection system
- Learning analytics dashboard for admins
- Conversion funnel analysis
- Retention and churn analysis

## Support & Maintenance

### Documentation Requirements
- API documentation for all endpoints
- User guide in Hebrew
- Admin panel documentation
- Troubleshooting guides
- Regular security update procedures

### Emergency Procedures
- Incident response plan for security breaches
- Payment system downtime procedures
- Data backup and recovery processes
- User communication templates for issues
- Rollback procedures for failed deployments

---

## Contact & Project Management

**For any questions or clarifications:**
- Prefer asking before implementing significant changes
- Use clear, non-technical language for explanations
- Provide multiple solutions with pros/cons analysis
- Document all decisions and rationale
- Regular check-ins for project alignment

**Remember**: This is an educational platform serving Hebrew-speaking students preparing for an important exam. Every design and technical decision should prioritize their success, security, and positive learning experience.