// useAnalytics Hook for Amiram Academy
// React hook providing easy access to analytics tracking functions

import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import analyticsService from '@/services/analytics';
import {
  AuthEvent,
  EcommerceEvent,
  PremiumEvent,
  SimulationEvent,
  EngagementEvent,
  ErrorEvent
} from '@/types/analytics';

export interface UseAnalyticsReturn {
  // Core tracking functions
  trackEvent: (event: any) => void;
  trackPageView: (pageData?: Partial<EngagementEvent>) => void;
  
  // Authentication tracking
  trackLogin: (method: 'google' | 'email', success: boolean, error?: string) => void;
  trackSignup: (method: 'google' | 'email', success: boolean, error?: string) => void;
  trackLogout: () => void;
  
  // E-commerce tracking
  trackPurchase: (purchaseData: Omit<EcommerceEvent, 'event'>) => void;
  trackBeginCheckout: (checkoutData: Partial<PremiumEvent>) => void;
  
  // Premium/Subscription tracking
  trackPremiumView: (planType: string) => void;
  trackPremiumPurchase: (premiumData: Omit<PremiumEvent, 'event'>) => void;
  trackCouponApplied: (couponCode: string, discountAmount: number, planType: string) => void;
  
  // Simulation tracking
  trackSimulationStart: (simulationData: Partial<SimulationEvent>) => void;
  trackSimulationProgress: (simulationData: Partial<SimulationEvent>) => void;
  trackSimulationComplete: (simulationData: Partial<SimulationEvent>) => void;
  
  // Form and interaction tracking
  trackFormStart: (formName: string) => void;
  trackFormSubmit: (formName: string, success: boolean, error?: string) => void;
  trackButtonClick: (buttonName: string, location?: string) => void;
  trackContentView: (contentType: string, contentId: string) => void;
  
  // Error tracking
  trackError: (error: Error | string, component?: string, context?: Record<string, any>) => void;
  
  // User properties
  setUserProperties: (properties: Record<string, any>) => void;
  
  // Consent management
  updateConsent: (granted: boolean) => void;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const { currentUser } = useAuth();
  const pageStartTime = useRef<number>(Date.now());
  const hasTrackedPageView = useRef<boolean>(false);

  // Set user ID when auth context changes
  useEffect(() => {
    if (currentUser?.id) {
      analyticsService.setUserId(currentUser.id);
      analyticsService.setUserProperties({
        subscription_status: localStorage.getItem('isPremiumUser') === 'true' ? 'premium' : 'free',
        user_email: currentUser.email,
        signup_date: currentUser.created_at
      });
    }
  }, [currentUser]);

  // Auto-track page views with engagement time
  useEffect(() => {
    if (!hasTrackedPageView.current) {
      const pageData: EngagementEvent = {
        event: 'page_view',
        page_title: document.title,
        page_location: window.location.href,
        content_group1: getContentGroup()
      };
      
      analyticsService.trackPageView(pageData);
      hasTrackedPageView.current = true;
      pageStartTime.current = Date.now();
    }

    // Track page engagement on unload
    const handleUnload = () => {
      const engagementTime = Date.now() - pageStartTime.current;
      if (engagementTime > 5000) { // Only track if engaged for more than 5 seconds
        analyticsService.trackEvent({
          event: 'page_engagement',
          engagement_time_msec: engagementTime,
          page_title: document.title,
          page_location: window.location.href
        });
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  const getContentGroup = useCallback((): string => {
    const path = window.location.pathname;
    if (path.includes('/login')) return 'Authentication';
    if (path.includes('/premium')) return 'Premium';
    if (path.includes('/simulation')) return 'Simulation';
    if (path.includes('/thank-you')) return 'Conversion';
    if (path === '/') return 'Homepage';
    return 'Other';
  }, []);

  const trackEvent = useCallback((event: any) => {
    analyticsService.trackEvent(event);
  }, []);

  const trackPageView = useCallback((pageData?: Partial<EngagementEvent>) => {
    const data: EngagementEvent = {
      event: 'page_view',
      page_title: document.title,
      page_location: window.location.href,
      content_group1: getContentGroup(),
      ...pageData
    };
    analyticsService.trackPageView(data);
  }, [getContentGroup]);

  const trackLogin = useCallback((method: 'google' | 'email', success: boolean, error?: string) => {
    const authEvent: AuthEvent = {
      event: success ? 'login' : 'login_failed',
      method,
      success,
      user_id: success && currentUser?.id ? currentUser.id : '',
      email: currentUser?.email,
      error_message: error
    };
    analyticsService.trackAuth(authEvent);
  }, [currentUser]);

  const trackSignup = useCallback((method: 'google' | 'email', success: boolean, error?: string) => {
    const authEvent: AuthEvent = {
      event: success ? 'sign_up' : 'signup_failed',
      method: 'signup',
      success,
      user_id: success && currentUser?.id ? currentUser.id : '',
      email: currentUser?.email,
      error_message: error
    };
    analyticsService.trackAuth(authEvent);
  }, [currentUser]);

  const trackLogout = useCallback(() => {
    analyticsService.trackEvent({
      event: 'logout',
      user_id: currentUser?.id
    });
  }, [currentUser]);

  const trackPurchase = useCallback((purchaseData: Omit<EcommerceEvent, 'event'>) => {
    const ecommerceEvent: EcommerceEvent = {
      event: 'purchase',
      ...purchaseData
    };
    analyticsService.trackEcommerce(ecommerceEvent);
  }, []);

  const trackBeginCheckout = useCallback((checkoutData: Partial<PremiumEvent>) => {
    const premiumEvent: PremiumEvent = {
      event: 'begin_checkout',
      plan_type: 'monthly', // default
      plan_price: 0,
      payment_status: 'initiated',
      ...checkoutData
    };
    analyticsService.trackPremium(premiumEvent);
  }, []);

  const trackPremiumView = useCallback((planType: string) => {
    analyticsService.trackEvent({
      event: 'premium_view',
      plan_type: planType,
      page_location: window.location.href
    });
  }, []);

  const trackPremiumPurchase = useCallback((premiumData: Omit<PremiumEvent, 'event'>) => {
    const premiumEvent: PremiumEvent = {
      event: 'premium_purchase',
      ...premiumData
    };
    analyticsService.trackPremium(premiumEvent);
  }, []);

  const trackCouponApplied = useCallback((couponCode: string, discountAmount: number, planType: string) => {
    analyticsService.trackCouponApplied(couponCode, discountAmount, planType);
  }, []);

  const trackSimulationStart = useCallback((simulationData: Partial<SimulationEvent>) => {
    const simEvent: SimulationEvent = {
      event: 'simulation_start',
      simulation_type: 'unknown',
      simulation_id: 'unknown',
      ...simulationData
    };
    analyticsService.trackSimulation(simEvent);
  }, []);

  const trackSimulationProgress = useCallback((simulationData: Partial<SimulationEvent>) => {
    const simEvent: SimulationEvent = {
      event: 'simulation_progress',
      simulation_type: 'unknown',
      simulation_id: 'unknown',
      ...simulationData
    };
    analyticsService.trackSimulation(simEvent);
  }, []);

  const trackSimulationComplete = useCallback((simulationData: Partial<SimulationEvent>) => {
    const simEvent: SimulationEvent = {
      event: 'simulation_complete',
      simulation_type: 'unknown',
      simulation_id: 'unknown',
      completion_rate: 100,
      ...simulationData
    };
    analyticsService.trackSimulation(simEvent);
  }, []);

  const trackFormStart = useCallback((formName: string) => {
    analyticsService.trackEvent({
      event: 'form_start',
      form_name: formName,
      page_location: window.location.href
    });
  }, []);

  const trackFormSubmit = useCallback((formName: string, success: boolean, error?: string) => {
    analyticsService.trackEvent({
      event: success ? 'form_submit_success' : 'form_submit_failed',
      form_name: formName,
      success,
      error_message: error
    });
  }, []);

  const trackButtonClick = useCallback((buttonName: string, location?: string) => {
    analyticsService.trackEvent({
      event: 'button_click',
      button_name: buttonName,
      click_location: location || window.location.pathname,
      page_title: document.title
    });
  }, []);

  const trackContentView = useCallback((contentType: string, contentId: string) => {
    analyticsService.trackEvent({
      event: 'content_view',
      content_type: contentType,
      content_id: contentId,
      page_location: window.location.href
    });
  }, []);

  const trackError = useCallback((error: Error | string, component?: string, context?: Record<string, any>) => {
    const errorEvent: ErrorEvent = {
      event: 'error',
      error_type: error instanceof Error ? error.name : 'CustomError',
      error_message: error instanceof Error ? error.message : error,
      component,
      user_agent: navigator.userAgent,
      page_url: window.location.href,
      ...context
    };
    analyticsService.trackError(errorEvent);
  }, []);

  const setUserProperties = useCallback((properties: Record<string, any>) => {
    analyticsService.setUserProperties(properties);
  }, []);

  const updateConsent = useCallback((granted: boolean) => {
    analyticsService.consent(granted);
  }, []);

  return {
    trackEvent,
    trackPageView,
    trackLogin,
    trackSignup,
    trackLogout,
    trackPurchase,
    trackBeginCheckout,
    trackPremiumView,
    trackPremiumPurchase,
    trackCouponApplied,
    trackSimulationStart,
    trackSimulationProgress,
    trackSimulationComplete,
    trackFormStart,
    trackFormSubmit,
    trackButtonClick,
    trackContentView,
    trackError,
    setUserProperties,
    updateConsent
  };
};

export default useAnalytics;