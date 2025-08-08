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
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      title: "שאלות פרימיום",
      description: "גישה לשאלות מתקדמות וייחודיות"
    },
    {
      icon: <Target className="w-5 h-5 text-blue-500" />,
      title: "תרגולים מתקדמים",
      description: "סטים מיוחדים לשיפור הביצועים"
    },
    {
      icon: <Zap className="w-5 h-5 text-green-500" />,
      title: "תוכן מעודכן",
      description: "שאלות חדשות שמתווספות קבוע"
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-purple-500" />,
      title: "הסברים מפורטים",
      description: "הסברים מקיפים לכל שאלה"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-orange-800">
              <Crown className="w-6 h-6 text-yellow-600" />
              גישה פרימיום נדרשת
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-2">
              <Lock className="w-4 h-4 text-gray-500" />
              <span>{setTitle}</span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Premium Message */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-800">
                התוכן זמין למנויי פרימיום בלבד
              </span>
            </div>
            <p className="text-orange-700 text-sm">
              שדרג לפרימיום כדי לקבל גישה לתוכן מתקדם ושאלות ייחודיות
            </p>
          </div>

          {/* Premium Features */}
          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-gray-800 text-sm">מה כלול במנוי פרימיום:</h4>
            <div className="grid grid-cols-1 gap-3">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">
                    {feature.icon}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">
                      {feature.title}
                    </div>
                    <div className="text-gray-600 text-xs">
                      {feature.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Badge */}
          <div className="text-center mb-4">
            <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2">
              <Crown className="w-4 h-4 mr-2" />
              החל מ-₪29 לחודש
            </Badge>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-col">
          {!currentUser ? (
            <>
              <Button 
                onClick={handleSignIn}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                התחבר כדי להמשיך
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="w-full"
              >
                ביטול
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white"
              >
                <Crown className="w-4 h-4 mr-2" />
                שדרג לפרימיום
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="w-full"
              >
                ביטול
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumUpgradeModal;