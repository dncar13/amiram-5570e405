// Core Analytics Service for Amiram Academy
// Comprehensive tracking with GTM, GA4, and Facebook Pixel integration

import {
  AnalyticsConfig,
  AnalyticsService,
  BaseEvent,
  AuthEvent,
  EcommerceEvent,
  PremiumEvent,
  SimulationEvent,
  EngagementEvent,
  ErrorEvent,
  FacebookPixelEvent,
  DataLayerEvent,
  UTMParameters,
  SessionInfo,
  UserContext
} from '@/types/analytics';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    gtm: any;
  }
}

class AmiramAnalyticsService implements AnalyticsService {
  private config: AnalyticsConfig;
  private initialized = false;
  private eventQueue: BaseEvent[] = [];
  private sessionInfo: SessionInfo;
  private userContext: UserContext = {};
  private utmParams: UTMParameters = {};

  constructor() {
    this.config = {
      gtmId: 'GTM-M95H8KJP',
      enabledServices: {
        gtm: true,
        ga4: true,
        facebookPixel: true
      },
      debugMode: import.meta.env.DEV,
      enableOfflineQueuing: true,
      retryAttempts: 3,
      retryDelay: 1000
    };

    this.sessionInfo = {
      session_id: this.generateSessionId(),
      session_start_time: Date.now(),
      page_count: 0,
      engagement_time_msec: 0
    };

    this.extractUTMParams();
    this.initializeDataLayer();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private extractUTMParams(): void {
    const urlParams = new URLSearchParams(window.location.search);
    this.utmParams = {
      utm_source: urlParams.get('utm_source') || undefined,
      utm_medium: urlParams.get('utm_medium') || undefined,
      utm_campaign: urlParams.get('utm_campaign') || undefined,
      utm_term: urlParams.get('utm_term') || undefined,
      utm_content: urlParams.get('utm_content') || undefined,
    };

    // Store UTM params in sessionStorage for cross-page persistence
    if (Object.values(this.utmParams).some(Boolean)) {
      sessionStorage.setItem('utm_params', JSON.stringify(this.utmParams));
    } else {
      // Try to retrieve from sessionStorage
      const stored = sessionStorage.getItem('utm_params');
      if (stored) {
        this.utmParams = JSON.parse(stored);
      }
    }
  }

  private initializeDataLayer(): void {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      
      // Initialize with UTM parameters if available
      if (Object.values(this.utmParams).some(Boolean)) {
        window.dataLayer.push({
          event: 'utm_params',
          ...this.utmParams
        });
      }
    }
  }

  public initialize(config?: Partial<AnalyticsConfig>): void {
    if (this.initialized) {
      console.warn('Analytics service already initialized');
      return;
    }

    this.config = { ...this.config, ...config };
    
    if (this.config.debugMode) {
      console.log('🔍 Analytics Debug Mode Enabled');
      console.log('📊 Analytics Config:', this.config);
      console.log('🎯 UTM Parameters:', this.utmParams);
    }

    this.initialized = true;
    
    // Process queued events
    this.processEventQueue();
    
    // Track initial page view
    this.trackPageView({
      event: 'page_view',
      page_title: document.title,
      page_location: window.location.href,
      ...this.utmParams
    });

    if (this.config.debugMode) {
      console.log('✅ Analytics service initialized successfully');
    }
  }

  private processEventQueue(): void {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (event) {
        this.trackEvent(event);
      }
    }
  }

  private enrichEvent(event: BaseEvent): BaseEvent {
    return {
      ...event,
      timestamp: event.timestamp || Date.now(),
      user_id: event.user_id || this.userContext.user_id,
      session_id: this.sessionInfo.session_id,
      ...this.utmParams
    };
  }

  private pushToDataLayer(data: DataLayerEvent): void {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(data);
      
      if (this.config.debugMode) {
        console.log('📤 DataLayer Push:', data);
      }
    }
  }

  private retryEvent(event: BaseEvent, attempt: number = 1): void {
    if (!this.config.enableOfflineQueuing || attempt > this.config.retryAttempts) {
      return;
    }

    setTimeout(() => {
      if (navigator.onLine) {
        this.trackEvent(event);
      } else {
        this.retryEvent(event, attempt + 1);
      }
    }, this.config.retryDelay * attempt);
  }

  public trackEvent(event: BaseEvent): void {
    if (!this.initialized) {
      this.eventQueue.push(event);
      return;
    }

    const enrichedEvent = this.enrichEvent(event);

    try {
      // Send to Google Tag Manager
      if (this.config.enabledServices.gtm) {
        this.pushToDataLayer({
          event: enrichedEvent.event,
          ...enrichedEvent
        });
      }

      if (this.config.debugMode) {
        console.log('📊 Event Tracked:', enrichedEvent);
      }
    } catch (error) {
      console.error('❌ Analytics tracking error:', error);
      this.trackError({
        event: 'analytics_error',
        error_type: 'tracking_failure',
        error_message: error instanceof Error ? error.message : 'Unknown error'
      });

      // Retry if enabled
      if (!navigator.onLine && this.config.enableOfflineQueuing) {
        this.retryEvent(enrichedEvent);
      }
    }
  }

  public trackPageView(pageData: EngagementEvent): void {
    this.sessionInfo.page_count++;
    
    this.trackEvent({
      event: 'page_view',
      ...pageData,
      session_page_count: this.sessionInfo.page_count
    });
  }

  public trackAuth(authEvent: AuthEvent): void {
    const event = authEvent.success ? 'login' : 'login_failed';
    
    this.trackEvent({
      event,
      method: authEvent.method,
      success: authEvent.success,
      error_message: authEvent.error_message
    });

    // Track signup separately
    if (authEvent.method === 'signup' && authEvent.success) {
      this.trackEvent({
        event: 'sign_up',
        method: authEvent.method
      });

      // Facebook Pixel
      this.trackFacebookPixel({
        eventName: 'CompleteRegistration',
        parameters: {
          method: authEvent.method
        }
      });
    }

    // Update user context on successful login
    if (authEvent.success && authEvent.user_id) {
      this.setUserId(authEvent.user_id);
    }
  }

  public trackEcommerce(ecommerceEvent: EcommerceEvent): void {
    this.trackEvent({
      event: 'purchase',
      transaction_id: ecommerceEvent.transaction_id,
      value: ecommerceEvent.value,
      currency: ecommerceEvent.currency,
      items: ecommerceEvent.items,
      coupon: ecommerceEvent.coupon,
      payment_method: ecommerceEvent.payment_method
    });

    // Facebook Pixel Purchase Event
    this.trackFacebookPixel({
      eventName: 'Purchase',
      parameters: {
        value: ecommerceEvent.value,
        currency: ecommerceEvent.currency,
        content_ids: ecommerceEvent.items?.map(item => item.item_id),
        content_type: 'product'
      }
    });
  }

  public trackPremium(premiumEvent: PremiumEvent): void {
    // Different events based on payment status
    const eventMap = {
      initiated: 'begin_checkout',
      completed: 'purchase',
      failed: 'checkout_failed'
    };

    const event = eventMap[premiumEvent.payment_status] || 'premium_interaction';

    const eventData: any = {
      event,
      plan_type: premiumEvent.plan_type,
      value: premiumEvent.plan_price,
      currency: 'ILS',
      items: [{
        item_id: `premium_${premiumEvent.plan_type}`,
        item_name: `Premium ${premiumEvent.plan_type}`,
        category: 'subscription',
        price: premiumEvent.plan_price,
        quantity: 1
      }]
    };

    if (premiumEvent.coupon_code) {
      eventData.coupon = premiumEvent.coupon_code;
      eventData.discount_amount = premiumEvent.discount_amount;
    }

    this.trackEvent(eventData);

    // Facebook Pixel Events
    if (premiumEvent.payment_status === 'initiated') {
      this.trackFacebookPixel({
        eventName: 'InitiateCheckout',
        parameters: {
          value: premiumEvent.plan_price,
          currency: 'ILS',
          content_ids: [`premium_${premiumEvent.plan_type}`]
        }
      });
    }
  }

  public trackSimulation(simulationEvent: SimulationEvent): void {
    this.trackEvent({
      event: 'simulation_interaction',
      simulation_type: simulationEvent.simulation_type,
      simulation_id: simulationEvent.simulation_id,
      difficulty_level: simulationEvent.difficulty_level,
      question_count: simulationEvent.question_count,
      score: simulationEvent.score,
      completion_rate: simulationEvent.completion_rate,
      time_spent: simulationEvent.time_spent
    });

    // Track completion as separate event
    if (simulationEvent.completion_rate === 100) {
      this.trackEvent({
        event: 'simulation_complete',
        simulation_type: simulationEvent.simulation_type,
        score: simulationEvent.score,
        time_spent: simulationEvent.time_spent
      });
    }
  }

  public trackError(errorEvent: ErrorEvent): void {
    this.trackEvent({
      event: 'exception',
      description: errorEvent.error_message,
      fatal: errorEvent.error_type === 'critical',
      error_type: errorEvent.error_type,
      component: errorEvent.component,
      page_url: errorEvent.page_url || window.location.href
    });
  }

  private trackFacebookPixel(pixelEvent: FacebookPixelEvent): void {
    if (!this.config.enabledServices.facebookPixel || typeof window.fbq !== 'function') {
      return;
    }

    try {
      window.fbq('track', pixelEvent.eventName, pixelEvent.parameters);
      
      if (this.config.debugMode) {
        console.log('👥 Facebook Pixel Event:', pixelEvent);
      }
    } catch (error) {
      console.error('❌ Facebook Pixel error:', error);
    }
  }

  public setUserId(userId: string): void {
    this.userContext.user_id = userId;
    
    this.pushToDataLayer({
      event: 'user_id_set',
      user_id: userId
    });

    if (this.config.debugMode) {
      console.log('👤 User ID set:', userId);
    }
  }

  public setUserProperties(properties: Record<string, any>): void {
    this.userContext = { ...this.userContext, ...properties };
    
    this.pushToDataLayer({
      event: 'user_properties_set',
      user_properties: properties
    });
  }

  public consent(granted: boolean): void {
    this.pushToDataLayer({
      event: 'consent_update',
      analytics_consent: granted ? 'granted' : 'denied',
      ad_storage_consent: granted ? 'granted' : 'denied'
    });

    if (this.config.debugMode) {
      console.log('🔒 Consent updated:', granted ? 'granted' : 'denied');
    }
  }

  // Utility methods for specific Amiram Academy events
  public trackCouponApplied(couponCode: string, discountAmount: number, planType: string): void {
    this.trackEvent({
      event: 'coupon_applied',
      coupon_code: couponCode,
      discount_amount: discountAmount,
      plan_type: planType
    });
  }

  public trackFormInteraction(formName: string, fieldName: string, action: 'focus' | 'blur' | 'error'): void {
    this.trackEvent({
      event: 'form_interaction',
      form_name: formName,
      field_name: fieldName,
      action
    });
  }

  public trackContentEngagement(contentType: string, contentId: string, engagementTime: number): void {
    this.trackEvent({
      event: 'content_engagement',
      content_type: contentType,
      content_id: contentId,
      engagement_time_msec: engagementTime
    });
  }
}

// Singleton instance
export const analyticsService = new AmiramAnalyticsService();

// Initialize immediately in browser environment
if (typeof window !== 'undefined') {
  analyticsService.initialize();
}

export default analyticsService;