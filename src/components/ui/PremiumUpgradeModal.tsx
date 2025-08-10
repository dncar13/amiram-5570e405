import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Lock, 
  Star, 
  Zap, 
  Target, 
  CheckCircle,
  X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  setTitle?: string;
}

export const PremiumUpgradeModal: React.FC<PremiumUpgradeModalProps> = ({
  isOpen,
  onClose,
  setTitle = "תוכן פרימיום"
}) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = () => {
    onClose();
    navigate('/login');
  };

  const handleUpgrade = () => {
    onClose();
    navigate('/premium');
  };

  const premiumFeatures = [
    {
      icon: <Star className="w-5 h-5 text-cyan-400" />,
      title: "גישה מלאה לכל התרגולים",
      description: "פתח את כל הסטים והסיפורים ללא הגבלה"
    },
    {
      icon: <Target className="w-5 h-5 text-purple-400" />,
      title: "תרגולים ממוקדים",
      description: "מסלולים חכמים לשיפור מהיר ומדויק"
    },
    {
      icon: <Zap className="w-5 h-5 text-blue-400" />,
      title: "עדכונים שוטפים",
      description: "תוכן חדש ומעודכן שמתווסף באופן קבוע"
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
      title: "הסברים מפורטים",
      description: "הבנה עמוקה של כל שאלה ותשובה"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 p-5">
          <DialogHeader>
            <div className="flex items-center justify-between text-white">
              <DialogTitle className="flex items-center gap-2 text-white">
                <Crown className="w-6 h-6 text-white/90" />
                גישה לפרימיום
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-7 w-7 rounded-full text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription>
              <div className="flex items-center gap-2 mt-2 text-white/90">
                <Lock className="w-4 h-4" />
                <span>{setTitle}</span>
              </div>
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-5 bg-slate-950">
          {/* Premium Message */}
          <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 mb-5">
            <div className="flex items-center gap-2 mb-1 text-white">
              <Crown className="w-5 h-5 text-yellow-300" />
              <span className="font-semibold">תוכן זה פתוח למנויי פרימיום</span>
            </div>
            <p className="text-slate-300 text-sm">
              שדרג כדי ליהנות מגישה מלאה לכל התוכן המתקדם ומכלי לימוד מתקדמים.
            </p>
          </div>

          {/* Premium Features */}
          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-white text-sm">מה תקבלו כמנויי פרימיום</h4>
            <div className="grid grid-cols-1 gap-3">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="flex-shrink-0 mt-0.5">
                    {feature.icon}
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">
                      {feature.title}
                    </div>
                    <div className="text-slate-300 text-xs">
                      {feature.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <DialogFooter className="flex flex-col gap-2 sm:flex-col">
            {!currentUser ? (
              <>
                <Button 
                  onClick={handleSignIn}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white"
                >
                  התחברות
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  ביטול
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={handleUpgrade}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  שדרג לפרימיום
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  ביטול
                </Button>
              </>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumUpgradeModal;