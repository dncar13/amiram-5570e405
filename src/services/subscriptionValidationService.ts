import { supabase } from '@/integrations/supabase/client';

export interface ActiveSubscription {
  id: string;
  plan_type: string;
  start_date: string;
  end_date: string;
  status: string;
}

export interface SubscriptionValidationResult {
  hasActiveSubscription: boolean;
  activeSubscription?: ActiveSubscription;
  canUpgrade: boolean;
  availableUpgrades?: string[];
  message?: string;
}

// Plan hierarchy for upgrade logic (lowest to highest value)
const PLAN_HIERARCHY = {
  'daily': 1,
  'weekly': 2,
  'monthly': 3,
  'quarterly': 4
} as const;

export const subscriptionValidationService = {
  /**
   * Check if user has active subscription and determine upgrade options
   */
  async validateSubscriptionPurchase(
    userId: string,
    targetPlanType: string
  ): Promise<SubscriptionValidationResult> {
    try {
      if (!userId) {
        return {
          hasActiveSubscription: false,
          canUpgrade: true,
          message: 'נדרשת התחברות לחשבון'
        };
      }

      // Get active subscriptions for user
      const { data: activeSubscriptions, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .gte('end_date', new Date().toISOString())
        .order('end_date', { ascending: false });

      if (error) {
        console.error('Error checking subscriptions:', error);
        return {
          hasActiveSubscription: false,
          canUpgrade: true,
          message: 'שגיאה בבדיקת מנויים קיימים'
        };
      }

      if (!activeSubscriptions || activeSubscriptions.length === 0) {
        return {
          hasActiveSubscription: false,
          canUpgrade: true,
          message: 'אין מנוי פעיל - ניתן לרכוש'
        };
      }

      const currentSubscription = activeSubscriptions[0] as ActiveSubscription;
      const currentPlanLevel = PLAN_HIERARCHY[currentSubscription.plan_type as keyof typeof PLAN_HIERARCHY];
      const targetPlanLevel = PLAN_HIERARCHY[targetPlanType as keyof typeof PLAN_HIERARCHY];

      // Check if trying to purchase same or lower tier plan
      if (targetPlanLevel <= currentPlanLevel) {
        const availableUpgrades = Object.keys(PLAN_HIERARCHY)
          .filter(plan => PLAN_HIERARCHY[plan as keyof typeof PLAN_HIERARCHY] > currentPlanLevel);

        return {
          hasActiveSubscription: true,
          activeSubscription: currentSubscription,
          canUpgrade: false,
          availableUpgrades,
          message: this.getSubscriptionMessage(currentSubscription, targetPlanType, false)
        };
      }

      // Allow upgrade to higher tier
      return {
        hasActiveSubscription: true,
        activeSubscription: currentSubscription,
        canUpgrade: true,
        message: this.getSubscriptionMessage(currentSubscription, targetPlanType, true)
      };

    } catch (error) {
      console.error('Error in subscription validation:', error);
      return {
        hasActiveSubscription: false,
        canUpgrade: true,
        message: 'שגיאה בבדיקת מנויים'
      };
    }
  },

  /**
   * Get user's current active subscription
   */
  async getCurrentSubscription(userId: string): Promise<ActiveSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .gte('end_date', new Date().toISOString())
        .order('end_date', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - user has no active subscription
          return null;
        }
        throw error;
      }

      return data as ActiveSubscription;
    } catch (error) {
      console.error('Error getting current subscription:', error);
      return null;
    }
  },

  /**
   * Generate appropriate message based on subscription status
   */
  getSubscriptionMessage(
    currentSubscription: ActiveSubscription,
    targetPlanType: string,
    canUpgrade: boolean
  ): string {
    const planNames = {
      'daily': 'יום אחד',
      'weekly': 'שבוע אחד',
      'monthly': 'חודש אחד',
      'quarterly': '3 חודשים'
    };

    const currentPlanName = planNames[currentSubscription.plan_type as keyof typeof planNames];
    const targetPlanName = planNames[targetPlanType as keyof typeof planNames];
    
    const endDate = new Date(currentSubscription.end_date).toLocaleDateString('he-IL');

    if (!canUpgrade) {
      if (currentSubscription.plan_type === targetPlanType) {
        return `יש לך כבר מנוי ${currentPlanName} פעיל עד ${endDate}. לא ניתן לרכוש מנוי זהה.`;
      } else {
        return `יש לך מנוי ${currentPlanName} פעיל עד ${endDate}. לא ניתן לרכוש מנוי נמוך יותר.`;
      }
    } else {
      return `יש לך מנוי ${currentPlanName} פעיל עד ${endDate}. ניתן לשדרג ל${targetPlanName}.`;
    }
  },

  /**
   * Get plan display names in Hebrew
   */
  getPlanDisplayName(planType: string): string {
    const displayNames: Record<string, string> = {
      'daily': 'יום אחד',
      'weekly': 'שבוע אחד',
      'monthly': 'חודש אחד',
      'quarterly': '3 חודשים'
    };
    return displayNames[planType] || planType;
  }
};