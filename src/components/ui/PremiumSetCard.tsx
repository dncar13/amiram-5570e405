import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Lock, 
  Unlock, 
  Crown, 
  Star, 
  ArrowRight, 
  Shield,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { PremiumSet } from "@/services/premiumSetService";
import { useAuth } from "@/context/AuthContext";

interface PremiumSetCardProps {
  premiumSet: PremiumSet;
  onAccessAttempt: (setId: string) => void;
  onUpgradeClick: () => void;
}

export const PremiumSetCard: React.FC<PremiumSetCardProps> = ({
  premiumSet,
  onAccessAttempt,
  onUpgradeClick
}) => {
  const { currentUser, isPremium } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  // Determine card state based on user status
  const isLocked = !isPremium;
  const showUpgrade = !currentUser || !isPremium;

  const handleCardClick = () => {
    if (isLocked) {
      onUpgradeClick();
    } else {
      onAccessAttempt(premiumSet.id);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        className={`
          relative overflow-hidden cursor-pointer transition-all duration-300 border-2
          ${isLocked 
            ? 'border-gray-300 bg-gray-50 hover:border-gray-400' 
            : 'border-orange-200 bg-orange-50 hover:border-orange-300 hover:bg-orange-100'
          }
          ${isHovered ? 'shadow-lg' : 'shadow-md'}
        `}
        onClick={handleCardClick}
      >
        {/* Premium Badge */}
        <div className="absolute top-3 right-3 z-10">
          <Badge 
            className={`
              flex items-center gap-1 px-2 py-1 text-xs font-semibold
              ${isLocked 
                ? 'bg-gray-200 text-gray-600 border-gray-300' 
                : 'bg-orange-200 text-orange-800 border-orange-300'
              }
            `}
          >
            <Crown className="w-3 h-3" />
            פרימיום
          </Badge>
        </div>

        {/* Lock/Unlock Icon */}
        <div className="absolute top-3 left-3 z-10">
          <div className={`
            p-2 rounded-full transition-colors duration-300
            ${isLocked 
              ? 'bg-gray-200 text-gray-500' 
              : 'bg-orange-200 text-orange-600'
            }
          `}>
            {isLocked ? (
              <Lock className="w-4 h-4" />
            ) : (
              <Unlock className="w-4 h-4" />
            )}
          </div>
        </div>

        <CardHeader className="pt-12 pb-4">
          <CardTitle className={`
            text-lg font-bold flex items-center gap-2
            ${isLocked ? 'text-gray-600' : 'text-orange-800'}
          `}>
            <Star className="w-5 h-5" />
            {premiumSet.title}
          </CardTitle>
          
          <CardDescription className={`
            ${isLocked ? 'text-gray-500' : 'text-orange-700'}
          `}>
            {premiumSet.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          {/* Question Count */}
          <div className="mb-4">
            <div className={`
              flex items-center gap-2 text-sm
              ${isLocked ? 'text-gray-500' : 'text-orange-700'}
            `}>
              <Zap className="w-4 h-4" />
              <span>{premiumSet.questionCount} שאלות פרימיום</span>
            </div>
          </div>

          {/* Access Status */}
          {isLocked ? (
            <div className="space-y-3">
              <div className="bg-gray-100 border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">תוכן פרימיום</span>
                </div>
                <p className="text-xs text-gray-500">
                  {!currentUser 
                    ? "התחבר כדי לגשת לתוכן פרימיום"
                    : "התוכן זמין למנויי פרימיום בלבד"
                  }
                </p>
              </div>

              <Button 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpgradeClick();
                }}
              >
                <Crown className="w-4 h-4 mr-2" />
                {!currentUser ? "התחבר" : "שדרג לפרימיום"}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-orange-100 border border-orange-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-orange-700 text-sm mb-2">
                  <Crown className="w-4 h-4" />
                  <span className="font-medium">גישה פרימיום זמינה</span>
                </div>
                <p className="text-xs text-orange-600">
                  יש לך גישה לתוכן פרימיום מתקדם
                </p>
              </div>

              <Button 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onAccessAttempt(premiumSet.id);
                }}
              >
                התחל תרגול
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>

        {/* Locked Overlay Effect */}
        {isLocked && (
          <div className="absolute inset-0 bg-gray-100 bg-opacity-30 pointer-events-none" />
        )}
      </Card>
    </motion.div>
  );
};

export default PremiumSetCard;