import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  display_name?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_type: 'day' | 'week' | 'month' | '3months';
  start_date: string;
  end_date: string;
  status: 'active' | 'inactive' | 'expired';
  created_at: string;
  updated_at: string;
}

/**
 * Authentication service for Supabase
 */
export class SupabaseAuthService {
  
  /**
   * Sign up with email and password
   */
  static async signUp(email: string, password: string, displayName?: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            display_name: displayName || email.split('@')[0]
          }
        }
      });

      if (error) throw error;
      return { user: data.user, session: data.session, error: null };
    } catch (error: unknown) {
      return { user: null, session: null, error: error as Error };
    }
  }

  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { user: data.user, session: data.session, error: null };
    } catch (error: unknown) {
      return { user: null, session: null, error: error as Error };
    }
  }

  /**
   * Sign out
   */
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: unknown) {
      return { error: error as Error };
    }
  }

  /**
   * Get current user session
   */
  static async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { session, error: null };
    } catch (error: unknown) {
      return { session: null, error: error as Error };
    }
  }

  /**
   * Get user profile
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return { profile: data, error: null };
    } catch (error: unknown) {
      return { profile: null, error: error as Error };
    }
  }

  /**
   * Check if user has active premium subscription
   */
  static async hasActivePremium(userId: string): Promise<boolean> {
    try {
      console.log('🔍 Checking premium status for user:', userId);
      
      // Direct query instead of RPC to see exactly what's happening
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .gte('end_date', new Date().toISOString());

      if (error) {
        console.error('❌ Error checking premium status:', error);
        throw error;
      }
      
      const isActive = (data && data.length > 0);
      console.log('📊 Premium status check result:', { 
        userId, 
        hasActiveSubscriptions: isActive, 
        subscriptionsFound: data?.length || 0,
        subscriptions: data 
      });
      
      return isActive;
    } catch (error) {
      console.error('❌ Error checking premium status:', error);
      return false;
    }
  }

  /**
   * Get user's active subscription
   */
  static async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .gte('end_date', new Date().toISOString())
        .order('end_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as UserSubscription;
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }
  }

  /**
   * Create a new subscription for user
   */
  static async createSubscription(
    userId: string, 
    planType: 'day' | 'week' | 'month' | '3months'
  ) {
    try {
      const startDate = new Date();
      const endDate = new Date();

      // Calculate end date based on plan type
      switch (planType) {
        case 'day':
          endDate.setDate(startDate.getDate() + 1);
          break;
        case 'week':
          endDate.setDate(startDate.getDate() + 7);
          break;
        case 'month':
          endDate.setMonth(startDate.getMonth() + 1);
          break;
        case '3months':
          endDate.setMonth(startDate.getMonth() + 3);
          break;
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan_type: planType,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return { subscription: data as UserSubscription, error: null };
    } catch (error: unknown) {
      return { subscription: null, error: error as Error };
    }
  }

  /**
   * Cancel/deactivate user's active subscription
   * Legacy method - kept for backwards compatibility
   */
  static async cancelSubscription(userId: string) {
    try {
      console.log('🚫 Canceling subscription for user:', userId);
      
      // Use the new database function for proper cancellation
      const { data, error } = await supabase.rpc('cancel_user_subscription', {
        p_user_id: userId
      });

      if (error) {
        console.error('❌ Database function error canceling subscription:', error);
        throw error;
      }

      const result = data && data.length > 0 ? data[0] : null;
      console.log('✅ Subscription cancellation result:', result);
      
      // Force clear localStorage immediately
      localStorage.removeItem("isPremiumUser");
      
      // If no database subscription was found, treat as success for hardcoded premium users
      const isSuccess = result?.success || result?.updated_count === 0;
      
      return { 
        success: isSuccess, 
        error: null, 
        updatedCount: result?.updated_count || 0,
        message: result?.message || "Premium status removed successfully"
      };
    } catch (error: unknown) {
      console.error('❌ Error canceling subscription:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Cancel subscription with automatic refund processing
   * Uses the new edge function for complete cancellation and refund flow
   */
  static async cancelSubscriptionWithRefund(
    userId: string, 
    subscriptionId: string,
    cancellationReason?: string
  ) {
    try {
      console.log('🔄 Canceling subscription with refund:', { userId, subscriptionId });

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/cancel-subscription-refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          userId,
          subscriptionId,
          cancellationReason
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Subscription cancellation with refund result:', result);

      if (result.success) {
        // Force clear localStorage immediately
        localStorage.removeItem("isPremiumUser");
        
        return {
          success: true,
          error: null,
          message: result.message,
          refund: result.refund,
          subscription: result.subscription
        };
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (error: unknown) {
      console.error('❌ Error canceling subscription with refund:', error);
      return { 
        success: false, 
        error: error as Error,
        message: error instanceof Error ? error.message : 'שגיאה לא ידועה'
      };
    }
  }

  /**
   * Get user's subscription details for refund calculation
   */
  static async getUserSubscriptionForRefund(userId: string) {
    try {
      console.log('📊 Getting user subscription for refund calculation:', userId);

      // Get active subscription
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (subError) {
        console.error('❌ Error fetching subscription:', subError);
        return { subscriptionData: null, error: subError };
      }

      if (!subscription) {
        console.log('ℹ️ No active subscription found');
        return { subscriptionData: null, error: null };
      }

      // Get payment transaction for this subscription
      const { data: transaction, error: transError } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('subscription_id', subscription.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (transError || !transaction) {
        console.error('❌ Error fetching payment transaction:', transError);
        return { subscriptionData: null, error: transError };
      }

      const subscriptionData = {
        id: subscription.id,
        planType: subscription.plan_type,
        startDate: new Date(subscription.start_date),
        endDate: new Date(subscription.end_date),
        originalAmount: parseFloat(transaction.amount),
        transactionId: transaction.transaction_id
      };

      console.log('✅ Subscription data for refund:', subscriptionData);
      return { subscriptionData, error: null };
    } catch (error: unknown) {
      console.error('❌ Error getting subscription for refund:', error);
      return { subscriptionData: null, error: error as Error };
    }
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (session: Session | null, user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session, session?.user || null);
    });
  }
}