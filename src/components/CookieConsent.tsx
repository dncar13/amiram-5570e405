// Elegant Mobile-Optimized Cookie Consent Component for Amiram Academy
// Modern design with smooth animations and excellent mobile UX

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Cookie, Settings, Shield, BarChart, Target, Info, X, ChevronUp } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const COOKIE_CONSENT_KEY = 'amiram_cookie_consent';
const COOKIE_PREFERENCES_KEY = 'amiram_cookie_preferences';

// Memoized button component for better performance
const AnimatedButton = React.memo(({ 
  children, 
  onClick, 
  className, 
  variant = "default",
  size = "sm",
  ariaLabel,
  buttonRef
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  variant?: "default" | "outline";
  size?: "sm" | "default";
  ariaLabel?: string;
  buttonRef?: React.RefObject<HTMLButtonElement>;
}) => (
  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
    <Button 
      ref={buttonRef}
      variant={variant}
      size={size}
      onClick={onClick}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </Button>
  </motion.div>
));

AnimatedButton.displayName = 'AnimatedButton';

export const CookieConsent: React.FC = React.memo(() => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    functional: false
  });
  
  const bannerRef = useRef<HTMLDivElement>(null);
  const firstButtonRef = useRef<HTMLButtonElement>(null);
  const { updateConsent } = useAnalytics();

  // Check if consent has been given
  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 2000);
    } else {
      // Load saved preferences
      if (savedPreferences) {
        const prefs = JSON.parse(savedPreferences) as CookiePreferences;
        setPreferences(prefs);
        updateConsent(prefs.analytics || prefs.marketing);
      }
    }
  }, [updateConsent]);

  const savePreferences = useCallback((newPreferences: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'given');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(newPreferences));
    setPreferences(newPreferences);
    
    // Update analytics service consent
    const hasTrackingConsent = newPreferences.analytics || newPreferences.marketing;
    updateConsent(hasTrackingConsent);
    
    setShowBanner(false);
    setShowSettings(false);
  }, [updateConsent]);

  const handleAcceptAll = useCallback(() => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    savePreferences(allAccepted);
  }, [savePreferences]);

  const handleAcceptNecessary = useCallback(() => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    savePreferences(necessaryOnly);
  }, [savePreferences]);

  const handleSaveCustomPreferences = useCallback(() => {
    savePreferences(preferences);
  }, [preferences, savePreferences]);

  // Touch handlers for mobile swipe to dismiss
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart - touchEnd;
    
    // Swipe up to minimize (diff > 50)
    if (diff > 50 && !isMinimized) {
      setIsMinimized(true);
    }
    // Swipe down to expand (diff < -50)
    else if (diff < -50 && isMinimized) {
      setIsMinimized(false);
    }
  }, [touchStart, isMinimized]);

  // Focus management for accessibility
  useEffect(() => {
    if (showBanner && !isMinimized) {
      // Focus the first interactive element when banner appears
      const timer = setTimeout(() => {
        firstButtonRef.current?.focus();
      }, 600); // After animation completes
      return () => clearTimeout(timer);
    }
  }, [showBanner, isMinimized]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      // ESC to minimize or close
      if (!isMinimized) {
        setIsMinimized(true);
      } else {
        // Directly call the same logic as handleAcceptNecessary to avoid dependency issues
        const necessaryOnly: CookiePreferences = {
          necessary: true,
          analytics: false,
          marketing: false,
          functional: false
        };
        savePreferences(necessaryOnly);
      }
    } else if (e.key === 'Enter' && e.currentTarget === bannerRef.current) {
      // Enter to expand when minimized
      if (isMinimized) {
        setIsMinimized(false);
      }
    }
  }, [isMinimized, savePreferences]);

  const cookieCategories = [
    {
      id: 'necessary' as keyof CookiePreferences,
      title: 'עוגיות נחוצות',
      description: 'עוגיות אלה הכרחיות לפעולת האתר ולא ניתן להשבית אותן.',
      icon: Shield,
      required: true,
      examples: 'מידע התחברות, העדפות שפה, עגלת קניות'
    },
    {
      id: 'analytics' as keyof CookiePreferences,
      title: 'עוגיות אנליטיקה',
      description: 'עוגיות אלה עוזרות לנו להבין כיצד משתמשים באתר ולשפר את החוויה.',
      icon: BarChart,
      required: false,
      examples: 'Google Analytics, מדדי ביצועים, נתוני שימוש'
    },
    {
      id: 'marketing' as keyof CookiePreferences,
      title: 'עוגיות שיווק',
      description: 'עוגיות אלה משמשות להצגת פרסומות מותאמות אישית.',
      icon: Target,
      required: false,
      examples: 'Facebook Pixel, Google Ads, פרסומות ממוקדות'
    },
    {
      id: 'functional' as keyof CookiePreferences,
      title: 'עוגיות פונקציונליות',
      description: 'עוגיות אלה מאפשרות תכונות משופרות ופונקציונליות מותאמת אישית.',
      icon: Settings,
      required: false,
      examples: 'העדפות משתמש, תכונות אינטראקטיביות'
    }
  ];

  // Animation variants for smooth transitions
  const bannerVariants = {
    hidden: { 
      y: '100%', 
      opacity: 0,
      scale: 0.95
    },
    visible: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 200,
        duration: 0.6
      }
    },
    minimized: {
      y: '75%',
      scale: 0.98,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300
      }
    },
    exit: { 
      y: '100%', 
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: 'easeInOut'
      }
    }
  };

  const contentVariants = {
    expanded: {
      height: 'auto',
      opacity: 1,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2, delay: 0.1 }
      }
    },
    minimized: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 }
      }
    }
  };

  if (!showBanner) {
    return null;
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-50 pointer-events-none"
          initial="hidden"
          animate={isMinimized ? "minimized" : "visible"}
          exit="exit"
          variants={bannerVariants}
        >
          {/* Modern Glassmorphism Banner */}
          <div 
            ref={bannerRef}
            className="pointer-events-auto mx-2 mb-2 md:mx-4 md:mb-4 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-consent-title"
            aria-describedby="cookie-consent-description"
            tabIndex={isMinimized ? 0 : -1}
          >
            {/* Minimize/Expand Indicator */}
            <motion.div 
              className="absolute top-2 right-1/2 transform translate-x-1/2 md:hidden"
              whileTap={{ scale: 0.9 }}
            >
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={isMinimized ? "הרחב הודעה" : "מזער הודעה"}
              >
                <ChevronUp className={`w-4 h-4 transition-transform duration-300 ${isMinimized ? 'rotate-180' : ''}`} />
              </button>
            </motion.div>

            {/* Main Content */}
            <motion.div 
              className="p-4 md:p-6"
              variants={contentVariants}
              animate={isMinimized ? "minimized" : "expanded"}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                {/* Icon and Text */}
                <div className="flex items-start gap-4 flex-1">
                  <motion.div 
                    className="flex-shrink-0 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Cookie className="w-6 h-6 text-blue-600" />
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <motion.h3 
                      id="cookie-consent-title"
                      className="text-lg font-bold text-gray-900 mb-2 leading-tight"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      🍪 אנחנו משתמשים בעוגיות
                    </motion.h3>
                    <motion.p 
                      id="cookie-consent-description"
                      className="text-gray-600 text-sm leading-relaxed pr-4"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      אתר אמירם אקדמי משתמש בעוגיות כדי לשפר את חוויית הגלישה שלכם, 
                      לנתח את השימוש באתר ולהציג תוכן מותאם אישית.
                      <span className="hidden sm:inline"> ניתן לנהל את העדפות העוגיות בכל עת.</span>
                    </motion.p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto lg:flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {/* Settings Button */}
                  <Sheet open={showSettings} onOpenChange={setShowSettings}>
                    <SheetTrigger asChild>
                      <AnimatedButton
                        variant="outline"
                        onClick={() => setShowSettings(true)}
                        className="flex items-center gap-2 bg-white/80 hover:bg-white border-gray-300 hover:border-gray-400 transition-all duration-200"
                        ariaLabel="פתח הגדרות עוגיות מפורטות"
                        buttonRef={firstButtonRef}
                      >
                        <Settings className="w-4 h-4" aria-hidden="true" />
                        <span className="hidden sm:inline">הגדרות עוגיות</span>
                        <span className="sm:hidden">הגדרות</span>
                      </AnimatedButton>
                    </SheetTrigger>
                
                <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
                  <SheetHeader className="mb-6">
                    <SheetTitle className="text-right text-xl">
                      הגדרות עוגיות ופרטיות
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-blue-900">מדוע אנחנו משתמשים בעוגיות?</h4>
                      </div>
                      <p className="text-blue-800 text-sm">
                        עוגיות עוזרות לנו לספק לכם חוויה מותאמת אישית, לשפר את האתר 
                        ולהבין כיצד תוכלו להפיק את המירב מהשירותים שלנו.
                      </p>
                    </div>

                    {cookieCategories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <Card key={category.id} className="border-2">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                  <IconComponent className="w-5 h-5 text-gray-700" />
                                </div>
                                <div>
                                  <CardTitle className="text-base">{category.title}</CardTitle>
                                  {category.required && (
                                    <Badge variant="secondary" className="mt-1 text-xs">
                                      נדרש
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <Switch
                                checked={preferences[category.id]}
                                onCheckedChange={(checked) => {
                                  if (!category.required) {
                                    setPreferences(prev => ({
                                      ...prev,
                                      [category.id]: checked
                                    }));
                                  }
                                }}
                                disabled={category.required}
                              />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600 text-sm mb-3">
                              {category.description}
                            </p>
                            <div className="bg-gray-50 rounded-md p-3">
                              <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                דוגמאות:
                              </Label>
                              <p className="text-xs text-gray-600 mt-1">
                                {category.examples}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}

                    <div className="flex gap-3 pt-6 border-t">
                      <Button 
                        onClick={handleSaveCustomPreferences}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        שמור העדפות
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowSettings(false)}
                        className="flex-1"
                      >
                        ביטול
                      </Button>
                    </div>
                  </div>
                </SheetContent>
                  </Sheet>
                  
                  {/* Necessary Only Button */}
                  <AnimatedButton
                    variant="outline"
                    onClick={handleAcceptNecessary}
                    className="bg-white/80 hover:bg-white border-gray-300 hover:border-gray-400 transition-all duration-200"
                    ariaLabel="אשר רק עוגיות נחוצות ודחה את כל השאר"
                  >
                    <span className="hidden sm:inline">נחוצות בלבד</span>
                    <span className="sm:hidden">נחוצות</span>
                  </AnimatedButton>
                  
                  {/* Accept All Button */}
                  <AnimatedButton
                    onClick={handleAcceptAll}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    ariaLabel="אשר את כל סוגי העוגיות כולל אנליטיקה ושיווק"
                  >
                    <span className="font-medium">אשר הכל</span>
                  </AnimatedButton>
                </motion.div>
              </div>
            </motion.div>

            {/* Minimized State Indicator */}
            {isMinimized && (
              <motion.div 
                className="px-4 pb-3 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-xs text-gray-500">החלק מעלה כדי להרחיב • הקש להגדרות עוגיות</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

CookieConsent.displayName = 'CookieConsent';

// Optimized hook for checking cookie consent status
export const useCookieConsent = () => {
  const [hasConsent, setHasConsent] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    
    setHasConsent(!!consent);
    
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.warn('Failed to parse cookie preferences:', error);
      }
    }
  }, []);

  const updatePreferences = useCallback((newPreferences: CookiePreferences) => {
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(newPreferences));
    setPreferences(newPreferences);
  }, []);

  const revokeConsent = useCallback(() => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    localStorage.removeItem(COOKIE_PREFERENCES_KEY);
    setHasConsent(false);
    setPreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    });
  }, []);

  return {
    hasConsent,
    preferences,
    updatePreferences,
    revokeConsent,
    canUseAnalytics: preferences.analytics,
    canUseMarketing: preferences.marketing,
    canUseFunctional: preferences.functional
  };
};

export default CookieConsent;