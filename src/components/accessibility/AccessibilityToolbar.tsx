import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAccessibility } from '@/context/AccessibilityContext';
import { 
  Eye, 
  MousePointer, 
  Volume2, 
  Minus, 
  Plus, 
  RotateCcw,
  X,
  Accessibility
} from 'lucide-react';

const AccessibilityToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSettings, isAccessibilityMode } = useAccessibility();

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const resetSettings = () => {
    updateSettings({
      highContrast: false,
      reducedMotion: false,
      fontSize: 'medium',
      screenReaderOptimized: false,
      keyboardNavigationEnabled: true,
    });
  };

  const adjustFontSize = (direction: 'increase' | 'decrease') => {
    const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(settings.fontSize);
    
    if (direction === 'increase' && currentIndex < sizes.length - 1) {
      updateSettings({ fontSize: sizes[currentIndex + 1] });
    } else if (direction === 'decrease' && currentIndex > 0) {
      updateSettings({ fontSize: sizes[currentIndex - 1] });
    }
  };

  return (
    <>
      {/* Accessibility Button - Always visible */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={togglePanel}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          aria-label={isOpen ? "סגירת פאנל נגישות" : "פתיחת פאנל נגישות"}
          aria-expanded={isOpen}
          aria-controls="accessibility-panel"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Accessibility className="w-6 h-6" />}
          <span className="sr-only">הגדרות נגישות</span>
        </Button>
      </div>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed bottom-20 right-4 z-40"
          >
            <Card 
              id="accessibility-panel"
              className="w-80 max-h-96 overflow-y-auto shadow-2xl bg-white border border-gray-200"
              role="dialog"
              aria-labelledby="accessibility-panel-title"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 
                    id="accessibility-panel-title" 
                    className="text-lg font-semibold text-gray-900"
                  >
                    הגדרות נגישות
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetSettings}
                    aria-label="איפוס הגדרות נגישות"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {/* High Contrast */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Eye className="w-4 h-4 text-gray-600" />
                      <Label htmlFor="high-contrast" className="text-sm font-medium">
                        ניגודיות גבוהה
                      </Label>
                    </div>
                    <Switch
                      id="high-contrast"
                      checked={settings.highContrast}
                      onCheckedChange={(checked) => updateSettings({ highContrast: checked })}
                      aria-describedby="high-contrast-desc"
                    />
                  </div>
                  <p id="high-contrast-desc" className="text-xs text-gray-500 mr-6">
                    משפר את הניגודיות בין טקסט לרקע
                  </p>

                  <Separator />

                  {/* Reduced Motion */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <MousePointer className="w-4 h-4 text-gray-600" />
                      <Label htmlFor="reduced-motion" className="text-sm font-medium">
                        הפחתת אנימציות
                      </Label>
                    </div>
                    <Switch
                      id="reduced-motion"
                      checked={settings.reducedMotion}
                      onCheckedChange={(checked) => updateSettings({ reducedMotion: checked })}
                      aria-describedby="reduced-motion-desc"
                    />
                  </div>
                  <p id="reduced-motion-desc" className="text-xs text-gray-500 mr-6">
                    מפחית אנימציות ומעברים
                  </p>

                  <Separator />

                  {/* Font Size */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">גודל טקסט</Label>
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => adjustFontSize('decrease')}
                        disabled={settings.fontSize === 'small'}
                        aria-label="הקטנת גודל טקסט"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      
                      <span className="text-sm text-gray-600 px-4">
                        {settings.fontSize === 'small' && 'קטן'}
                        {settings.fontSize === 'medium' && 'בינוני'}
                        {settings.fontSize === 'large' && 'גדול'}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => adjustFontSize('increase')}
                        disabled={settings.fontSize === 'large'}
                        aria-label="הגדלת גודל טקסט"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Screen Reader Optimization */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Volume2 className="w-4 h-4 text-gray-600" />
                      <Label htmlFor="screen-reader" className="text-sm font-medium">
                        אופטימיזציה לקורא מסך
                      </Label>
                    </div>
                    <Switch
                      id="screen-reader"
                      checked={settings.screenReaderOptimized}
                      onCheckedChange={(checked) => updateSettings({ screenReaderOptimized: checked })}
                      aria-describedby="screen-reader-desc"
                    />
                  </div>
                  <p id="screen-reader-desc" className="text-xs text-gray-500 mr-6">
                    מייעל את האתר לשימוש עם קוראי מסך
                  </p>

                  <Separator />

                  {/* Current Status */}
                  {isAccessibilityMode && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium">
                        מצב נגישות פעיל
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        האתר מותאם כעת לצרכי נגישות
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccessibilityToolbar;