import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  X,
  Accessibility
} from 'lucide-react';

const AccessibilityToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIcon = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Accessibility Button - Always visible */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={toggleIcon}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          aria-label={isOpen ? "סגירת אייקון נגישות" : "הצגת אייקון נגישות"}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Accessibility className="w-6 h-6" />}
          <span className="sr-only">נגישות</span>
        </Button>
      </div>

    </>
  );
};

export default AccessibilityToolbar;