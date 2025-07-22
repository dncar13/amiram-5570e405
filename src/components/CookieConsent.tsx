// GDPR-Compliant Cookie Consent Component for Amiram Academy
// Handles user consent for analytics tracking and marketing cookies

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Cookie, Settings, Shield, BarChart, Target, Info } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const COOKIE_CONSENT_KEY = 'amiram_cookie_consent';
const COOKIE_PREFERENCES_KEY = 'amiram_cookie_preferences';

export const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    functional: false
  });
  
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

  const savePreferences = (newPreferences: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'given');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(newPreferences));
    setPreferences(newPreferences);
    
    // Update analytics service consent
    const hasTrackingConsent = newPreferences.analytics || newPreferences.marketing;
    updateConsent(hasTrackingConsent);
    
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    savePreferences(allAccepted);
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    savePreferences(necessaryOnly);
  };

  const handleSaveCustomPreferences = () => {
    savePreferences(preferences);
  };

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

  if (!showBanner) {
    return null;
  }

  return (
    <>
      {/* Main Cookie Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-lg p-4 md:p-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex-shrink-0">
                <Cookie className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  🍪 אנחנו משתמשים בעוגיות
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  אתר אמירם אקדמי משתמש בעוגיות כדי לשפר את חוויית הגלישה שלכם, 
                  לנתח את השימוש באתר ולהציג תוכן מותאם אישית. 
                  ניתן לנהל את העדפות העוגיות בכל עת.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Sheet open={showSettings} onOpenChange={setShowSettings}>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    הגדרות עוגיות
                  </Button>
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
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAcceptNecessary}
              >
                נחוצות בלבד
              </Button>
              
              <Button 
                size="sm"
                onClick={handleAcceptAll}
                className="bg-blue-600 hover:bg-blue-700"
              >
                אשר הכל
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Hook for checking cookie consent status
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
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const updatePreferences = (newPreferences: CookiePreferences) => {
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(newPreferences));
    setPreferences(newPreferences);
  };

  const revokeConsent = () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    localStorage.removeItem(COOKIE_PREFERENCES_KEY);
    setHasConsent(false);
    setPreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    });
  };

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