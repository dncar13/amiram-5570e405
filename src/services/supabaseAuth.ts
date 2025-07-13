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
    } catch (error: any) {
      return { user: null, session: null, error };
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
    } catch (error: any) {
      return { user: null, session: null, error };
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
    } catch (error: any) {
      return { error };
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
    } catch (error: any) {
      return { session: null, error };
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
    } catch (error: any) {
      return { profile: null, error };
    }
  }

  /**
   * Check if user has active premium subscription
   */
  static async hasActivePremium(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc('has_active_premium', { user_id: userId });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Error checking premium status:', error);
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
    } catch (error: any) {
      return { subscription: null, error };
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