import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { SupabaseAuthService, UserSubscription } from '@/services/supabaseAuth';
import { toast } from 'sonner';
import { CalendarIcon, CrownIcon, CheckIcon } from 'lucide-react';

interface PlanOption {
  type: 'day' | 'week' | 'month' | '3months';
  name: string;
  price: string;
  duration: string;
  popular?: boolean;
}

const PLAN_OPTIONS: PlanOption[] = [
  {
    type: 'day',
    name: 'יומי',
    price: '₪29',
    duration: 'יום אחד'
  },
  {
    type: 'week', 
    name: 'שבועי',
    price: '₪99',
    duration: 'שבוע',
    popular: true
  },
  {
    type: 'month',
    name: 'חודשי',
    price: '₪299',
    duration: 'חודש'
  },
  {
    type: '3months',
    name: '3 חודשים',
    price: '₪799',
    duration: '3 חודשים'
  }
];

export const SubscriptionManager: React.FC = () => {
  const { currentUser, isPremium, userData } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      loadSubscription();
    }
  }, [currentUser]);

  const loadSubscription = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const userSub = await SupabaseAuthService.getUserSubscription(currentUser.id);
      setSubscription(userSub);
    } catch (error) {
      console.error('Error loading subscription:', error);
      toast.error('שגיאה בטעינת פרטי המנוי');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (planType: PlanOption['type']) => {
    if (!currentUser) {
      toast.error('יש להתחבר תחילה');
      return;
    }

    try {
      setPurchasing(planType);
      
      // In a real implementation, this would integrate with a payment provider
      // For now, we'll create a subscription directly
      const result = await SupabaseAuthService.createSubscription(currentUser.id, planType);
      
      if (result.error) {
        toast.error('שגיאה ביצירת המנוי: ' + result.error.message);
        return;
      }

      toast.success('המנוי נוצר בהצלחה! 🎉');
      await loadSubscription();
      
      // Refresh the auth context to update premium status
      window.location.reload();
      
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      toast.error('שגיאה ברכישת המנוי');
    } finally {
      setPurchasing(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRemainingDays = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (!currentUser) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">יש להתחבר כדי לנהל מנויים</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CrownIcon className="h-5 w-5" />
            סטטוס מנוי
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPremium && subscription ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-orange-500">
                    פרימיום פעיל
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    סוג מנוי: {PLAN_OPTIONS.find(p => p.type === subscription.plan_type)?.name}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">
                    נותרו {getRemainingDays(subscription.end_date)} ימים
                  </p>
                  <p className="text-xs text-muted-foreground">
                    עד {formatDate(subscription.end_date)}
                  </p>
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-500" />
                  יתרונות הפרימיום שלך:
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• גישה לכל השאלות והסימולציות</li>
                  <li>• סטטיסטיקות מתקדמות</li>
                  <li>• שמירת שאלות ללא הגבלה</li>
                  <li>• תרגול ממוקד לפי נושאים</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">אין לך מנוי פרימיום פעיל</p>
              <Badge variant="outline">משתמש רגיל</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      <Card>
        <CardHeader>
          <CardTitle>מסלולי מנוי</CardTitle>
          <CardDescription>
            בחר את המסלול המתאים לך ותיהנה מגישה מלאה לכל התכנים
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {PLAN_OPTIONS.map((plan) => (
              <Card key={plan.type} className={`relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">פופולרי</Badge>
                  </div>
                )}
                <CardContent className="p-4 text-center">
                  <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
                  <div className="text-2xl font-bold text-primary mb-1">{plan.price}</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    <CalendarIcon className="inline h-4 w-4 ml-1" />
                    {plan.duration}
                  </p>
                  
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handlePurchase(plan.type)}
                    disabled={purchasing === plan.type || (isPremium && subscription?.plan_type === plan.type)}
                  >
                    {purchasing === plan.type ? (
                      'מעבד...'
                    ) : isPremium && subscription?.plan_type === plan.type ? (
                      'מנוי פעיל'
                    ) : (
                      'רכישה'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>🔒 תשלום מאובטח | 💰 ללא התחייבות | 🔄 חידוש ידני בלבד</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};