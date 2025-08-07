// Core Analytics Service for Amiram Academy
// Comprehensive tracking with GTM, GA4, and Facebook Pixel integration

// Cryptographic utilities for checksum generation
const crypto = typeof window !== 'undefined' && window.crypto && window.crypto.subtle;

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
  UserContext,
  EcommerceBaseEvent,
  SimulationBaseEvent,
  PremiumEventData,
  TransactionEventData
} from '@/types/analytics';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    fbq: (...args: unknown[]) => void;
    gtm: Record<string, unknown>;
  }
}

class AmiramAnalyticsService implements AnalyticsService {
  private config: AnalyticsConfig;
  private initialized = false;
  private eventQueue: BaseEvent[] = [];
  private sessionInfo: SessionInfo;
  private userContext: UserContext = {};
  private utmParams: UTMParameters = {};
  private trackedEvents: Map<string, number> = new Map(); // For deduplication with timestamps
  private readonly SECRET_SALT = 'amiram_analytics_2025_salt_key'; // Move to env in production
  private lastPageViewUrl: string = '';
  private lastPageViewTimestamp: number = 0;
  private pageViewCooldown: number = 1000; // 1 second cooldown between page views
  
  // 🛡️ Event deduplication for business events
  private businessEventGuard: Map<string, number> = new Map();
  private businessEventCooldown: number = 2000; // 2 second cooldown for business events
  private userSyncedThisSession: boolean = false; // Prevent multiple user_id_set per session

  constructor() {
    this.config = {
      gtmId: import.meta.env.VITE_GTM_ID || 'GTM-M95H8KJP',
      measurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID,
      enabledServices: {
        gtm: true,
        ga4: true,
        facebookPixel: true
      },
      debugMode: import.meta.env.DEV || import.meta.env.VITE_ENABLE_ANALYTICS_DEV === 'true',
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
    this.initializePersistentDeduplication();
    this.setupSessionCleanup();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate cryptographic checksum for transaction ID validation
   * Format: SHA-256(timestamp + userId + SECRET_SALT)
   */
  private async generateChecksum(timestamp: number, userId: string): Promise<string> {
    try {
      if (!crypto) {
        // Fallback for environments without WebCrypto API
        const simpleHash = btoa(`${timestamp}_${userId}_${this.SECRET_SALT}`).replace(/[+/=]/g, '');
        return simpleHash.substring(0, 16); // Use first 16 chars
      }

      const data = `${timestamp}_${userId}_${this.SECRET_SALT}`;
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await crypto.digest('SHA-256', dataBuffer);
      
      // Convert to hex string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Return first 16 characters for compactness
      return hashHex.substring(0, 16);
    } catch (error) {
      console.warn('Checksum generation failed, using fallback:', error);
      const fallback = btoa(`${timestamp}_${userId}_${Date.now()}`).replace(/[+/=]/g, '');
      return fallback.substring(0, 16);
    }
  }

  /**
   * Validate transaction checksum
   */
  private async validateChecksum(timestamp: number, userId: string, providedChecksum: string): Promise<boolean> {
    try {
      const expectedChecksum = await this.generateChecksum(timestamp, userId);
      return expectedChecksum === providedChecksum;
    } catch (error) {
      console.warn('Checksum validation failed:', error);
      return false; // Fail secure - reject invalid checksums
    }
  }

  /**
   * Initialize persistent event deduplication with 24-hour sliding window
   * Uses localStorage for cross-session persistence
   */
  private initializePersistentDeduplication(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return; // Skip if not in browser or no localStorage
      }

      // Load existing tracked events from localStorage
      const storedEvents = localStorage.getItem('amiram_tracked_events');
      if (storedEvents) {
        const parsed = JSON.parse(storedEvents);
        this.trackedEvents = new Map(Object.entries(parsed));
      }

      // Clean up old events on initialization
      this.pruneOldEvents();

      // Set up periodic cleanup every 5 minutes
      setInterval(() => {
        this.pruneOldEvents();
      }, 5 * 60 * 1000);

      if (this.config.debugMode) {
        console.log('🕒 Persistent event deduplication initialized with', this.trackedEvents.size, 'events');
      }
    } catch (error) {
      console.warn('Failed to initialize persistent deduplication:', error);
    }
  }

  /**
   * 🛡️ Prevent duplicate business events within cooldown period
   * Returns true if event should be blocked (duplicate)
   */
  private shouldBlockBusinessEvent(eventName: string, identifier?: string): boolean {
    const key = identifier ? `${eventName}:${identifier}` : eventName;
    const now = Date.now();
    
    // Special handling for user_id_set - only once per session
    if (eventName === 'user_id_set' && this.userSyncedThisSession) {
      if (this.config.debugMode) {
        console.warn(`🚫 User sync blocked - already synced this session`);
      }
      return true;
    }
    
    const lastTime = this.businessEventGuard.get(key);
    if (lastTime && (now - lastTime) < this.businessEventCooldown) {
      if (this.config.debugMode) {
        console.warn(`🚫 Business event blocked - duplicate within ${this.businessEventCooldown}ms:`, key);
      }
      return true;
    }
    
    this.businessEventGuard.set(key, now);
    
    // Mark user as synced for this session
    if (eventName === 'user_id_set') {
      this.userSyncedThisSession = true;
    }
    
    return false;
  }

  /**
   * 🧹 Setup session cleanup - clear business event guards on page unload
   */
  private setupSessionCleanup(): void {
    if (typeof window === 'undefined') return;
    
    const cleanup = () => {
      // Clear business event guards but keep session tracking
      this.businessEventGuard.clear();
      this.userSyncedThisSession = false;
      
      if (this.config.debugMode) {
        console.log('🧹 Business event guards cleared on session end');
      }
    };
    
    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('pagehide', cleanup);
  }

  /**
   * Remove events older than 24 hours from the tracking map and localStorage
   */
  private pruneOldEvents(): void {
    try {
      const now = Date.now();
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
      let prunedCount = 0;

      // Remove old events from memory
      for (const [eventKey, timestamp] of this.trackedEvents.entries()) {
        if (now - timestamp > TWENTY_FOUR_HOURS) {
          this.trackedEvents.delete(eventKey);
          prunedCount++;
        }
      }

      // Update localStorage with pruned events
      if (typeof window !== 'undefined' && window.localStorage) {
        const eventsObj = Object.fromEntries(this.trackedEvents.entries());
        localStorage.setItem('amiram_tracked_events', JSON.stringify(eventsObj));
      }

      if (this.config.debugMode && prunedCount > 0) {
        console.log(`🧹 Pruned ${prunedCount} old events. Remaining: ${this.trackedEvents.size}`);
      }
    } catch (error) {
      console.warn('Failed to prune old events:', error);
    }
  }

  /**
   * Save tracked events to localStorage for persistence
   */
  private persistTrackedEvents(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const eventsObj = Object.fromEntries(this.trackedEvents.entries());
        localStorage.setItem('amiram_tracked_events', JSON.stringify(eventsObj));
      }
    } catch (error) {
      console.warn('Failed to persist tracked events:', error);
    }
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

  public async initialize(config?: Partial<AnalyticsConfig>): Promise<void> {
    if (this.initialized) {
      console.warn('Analytics service already initialized');
      return;
    }

    this.config = { ...this.config, ...config };
    
    if (this.config.debugMode) {
      console.log('🔍 Analytics Debug Mode Enabled');
      console.log('📊 Analytics Config:', this.config);
      console.log('🎯 UTM Parameters:', this.utmParams);
      console.log('🔧 GA4 Measurement ID:', this.config.measurementId);
    }

    // Force consent in development mode
    if (this.config.debugMode || import.meta.env.VITE_ENABLE_ANALYTICS_DEV === 'true') {
      this.consent(true);
    }

    this.initialized = true;
    
    // Process queued events
    await this.processEventQueue();
    
    // Track initial page view
    await this.trackPageView({
      event: 'page_view',
      page_title: document.title,
      page_location: window.location.href,
      ...this.utmParams
    });

    if (this.config.debugMode) {
      console.log('✅ Analytics service initialized successfully');
    }
  }

  private async processEventQueue(): Promise<void> {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (event) {
        await this.trackEvent(event);
      }
    }
  }

  private async generateEventKey(event: BaseEvent): Promise<string> {
    // Create a unique key for purchase/subscription events to prevent duplicates
    if (event.event === 'purchase' || event.event === 'premium_purchase' || event.event === 'subscription_upgrade') {
      const ecommerceEvent = event as EcommerceBaseEvent;
      const transactionId = ecommerceEvent.transaction_id;
      const planType = ecommerceEvent.plan_type;
      const value = ecommerceEvent.value || ecommerceEvent.plan_price;
      const checksum = ecommerceEvent.checksum;
      
      if (transactionId && checksum) {
        return `${event.event}_${transactionId}_${checksum}`;
      } else if (transactionId) {
        return `${event.event}_${transactionId}`;
      } else {
        // Fallback key for events without transaction_id
        return `${event.event}_${this.userContext.user_id}_${planType}_${value}_${Date.now()}`;
      }
    }

    // For simulation events, create unique keys by simulation_id to prevent duplicates
    if (event.event.startsWith('simulation_')) {
      const simulationEvent = event as SimulationBaseEvent;
      const simulationId = simulationEvent.simulation_id;
      const simulationType = simulationEvent.simulation_type;
      const userId = simulationEvent.user_id || this.userContext.user_id;
      
      if (simulationId) {
        return `${event.event}_${simulationId}_${userId}`;
      } else {
        return `${event.event}_${simulationType}_${userId}_${Date.now()}`;
      }
    }
    
    // For other events, allow duplicates (or create more specific keys if needed)
    return `${event.event}_${Date.now()}_${Math.random()}`;
  }

  private async isDuplicateEvent(event: BaseEvent): Promise<boolean> {
    const eventKey = await this.generateEventKey(event);
    const now = Date.now();
    
    // Check for duplicates on purchase, subscription, and critical simulation events
    const criticalEvents = ['purchase', 'premium_purchase', 'subscription_upgrade', 'simulation_complete'];
    const isSimulationStart = event.event === 'simulation_start';
    
    if (criticalEvents.includes(event.event) || isSimulationStart) {
      // Check if event exists and is within appropriate window
      const existingEventTime = this.trackedEvents.get(eventKey);
      if (existingEventTime) {
        // Different deduplication windows for different event types
        const deduplicationWindow = isSimulationStart ? 
          5 * 60 * 1000 : // 5 minutes for simulation starts (allow retries)
          24 * 60 * 60 * 1000; // 24 hours for purchases/completions
        
        const isWithinWindow = now - existingEventTime <= deduplicationWindow;
        
        if (isWithinWindow) {
          if (this.config.debugMode) {
            const timeAgo = isSimulationStart ? 
              Math.round((now - existingEventTime) / (60 * 1000)) : 
              Math.round((now - existingEventTime) / (60 * 60 * 1000) * 10) / 10;
            const unit = isSimulationStart ? 'min' : 'h';
            console.warn(`🔄 Duplicate event detected (${timeAgo}${unit} ago), skipping:`, eventKey);
          }
          return true;
        } else {
          // Event is older than deduplication window, remove it and allow new one
          this.trackedEvents.delete(eventKey);
        }
      }
      
      // Add event to tracking with current timestamp
      this.trackedEvents.set(eventKey, now);
      
      // Persist to localStorage
      this.persistTrackedEvents();
      
      // Periodic cleanup to maintain memory efficiency
      if (this.trackedEvents.size > 500) {
        this.pruneOldEvents();
      }
      
      if (this.config.debugMode) {
        const window = isSimulationStart ? '5min' : '24h';
        console.log(`✅ Event tracked for ${window} deduplication:`, eventKey, `(${this.trackedEvents.size} total)`);
      }
    }
    
    return false;
  }

  private async enrichEvent(event: BaseEvent): Promise<BaseEvent> {
    const enrichedEvent = {
      ...event,
      timestamp: event.timestamp || Date.now(),
      user_id: event.user_id || this.userContext.user_id,
      session_id: this.sessionInfo.session_id,
      ...this.utmParams
    };

    // Add checksum for purchase events if not already present
    if ((event.event === 'purchase' || event.event === 'premium_purchase') && !enrichedEvent.checksum) {
      const timestamp = enrichedEvent.timestamp;
      const userId = enrichedEvent.user_id;
      
      if (timestamp && userId) {
        enrichedEvent.checksum = await this.generateChecksum(timestamp, userId);
        
        if (this.config.debugMode) {
          console.log('🔐 Generated checksum for transaction:', {
            timestamp,
            userId,
            checksum: enrichedEvent.checksum
          });
        }
      }
    }

    return enrichedEvent;
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

    setTimeout(async () => {
      if (navigator.onLine) {
        await this.trackEvent(event);
      } else {
        this.retryEvent(event, attempt + 1);
      }
    }, this.config.retryDelay * attempt);
  }

  public async trackEvent(event: BaseEvent): Promise<void> {
    if (!this.initialized) {
      this.eventQueue.push(event);
      return;
    }

    const enrichedEvent = await this.enrichEvent(event);

    // Validate checksum for purchase events if present
    if ((event.event === 'purchase' || event.event === 'premium_purchase') && enrichedEvent.checksum) {
      const isValidChecksum = await this.validateChecksum(
        enrichedEvent.timestamp || Date.now(),
        enrichedEvent.user_id || '',
        enrichedEvent.checksum
      );
      
      if (!isValidChecksum) {
        console.error('❌ Invalid transaction checksum detected, rejecting event:', {
          event: enrichedEvent.event,
          transaction_id: enrichedEvent.transaction_id,
          checksum: enrichedEvent.checksum
        });
        
        // Track security event directly to avoid circular call
        this.pushToDataLayer({
          event: 'security_violation',
          error_type: 'invalid_checksum',
          error_message: 'Transaction checksum validation failed',
          transaction_id: enrichedEvent.transaction_id,
          timestamp: Date.now(),
          session_id: this.sessionInfo.session_id
        });
        return; // Reject invalid event
      }
    }

    // Check for duplicate events before tracking
    if (await this.isDuplicateEvent(enrichedEvent)) {
      return; // Skip duplicate event
    }

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
      
      // Track error directly to avoid circular call
      this.pushToDataLayer({
        event: 'analytics_error',
        error_type: 'tracking_failure',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
        session_id: this.sessionInfo.session_id
      });

      // Retry if enabled
      if (!navigator.onLine && this.config.enableOfflineQueuing) {
        this.retryEvent(enrichedEvent);
      }
    }
  }

  public async trackPageView(pageData: EngagementEvent): Promise<void> {
    const currentUrl = pageData.page_location || window.location.href;
    const currentTime = Date.now();
    
    // 🛡️ Prevent duplicate page views for same URL within cooldown period
    if (this.lastPageViewUrl === currentUrl && 
        (currentTime - this.lastPageViewTimestamp) < this.pageViewCooldown) {
      if (this.config.debugMode) {
        console.warn(`🚫 Page view blocked - duplicate within ${this.pageViewCooldown}ms:`, currentUrl);
      }
      return;
    }
    
    this.sessionInfo.page_count++;
    this.lastPageViewUrl = currentUrl;
    this.lastPageViewTimestamp = currentTime;
    
    if (this.config.debugMode) {
      console.log(`📄 Tracking page view (${this.sessionInfo.page_count}):`, currentUrl);
    }
    
    await this.trackEvent({
      event: 'page_view',
      ...pageData,
      session_page_count: this.sessionInfo.page_count
    });
  }

  public async trackAuth(authEvent: AuthEvent): Promise<void> {
    // Use GTM-friendly event names
    let event: string;
    if (authEvent.method === 'signup') {
      event = authEvent.success ? 'sign_up' : 'sign_up_failed';
    } else {
      event = authEvent.success ? 'login' : 'login_failed';
    }
    
    // Ensure method parameter is always present and normalized for GA4
    let normalizedMethod: string;
    if (authEvent.method === 'signup') {
      normalizedMethod = 'email'; // Sign-ups are always email-based
    } else if (authEvent.method === 'google') {
      normalizedMethod = 'google';
    } else {
      normalizedMethod = 'password'; // Default login method
    }
    
    const eventData = {
      event,
      method: normalizedMethod, // Always include method parameter
      success: authEvent.success,
      user_id: authEvent.user_id,
      error_message: authEvent.error_message
    };

    // For development/testing, also send direct gtag events
    if (this.config.debugMode && typeof window !== 'undefined' && window.gtag) {
      try {
        if (authEvent.success && authEvent.method !== 'signup') {
          // Direct GA4 login event
          window.gtag('event', 'login', {
            method: authEvent.method === 'google' ? 'Google' : 'password',
            user_id: authEvent.user_id
          });
        }
        if (authEvent.method === 'signup' && authEvent.success) {
          // Direct GA4 sign_up event  
          window.gtag('event', 'sign_up', {
            method: 'email',
            user_id: authEvent.user_id
          });
        }
      } catch (error) {
        console.warn('Direct gtag call failed:', error);
      }
    }

    await this.trackEvent(eventData);

    // Facebook Pixel for successful signup
    if (authEvent.method === 'signup' && authEvent.success) {
      this.trackFacebookPixel({
        eventName: 'CompleteRegistration',
        parameters: {
          method: 'email'
        }
      });
    }

    // Update user context on successful login or signup
    if (authEvent.success && authEvent.user_id) {
      this.setUserId(authEvent.user_id);
    }
  }

  public async trackEcommerce(ecommerceEvent: EcommerceEvent): Promise<void> {
    await this.trackEvent({
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

  public async trackPremium(premiumEvent: PremiumEvent): Promise<void> {
    // Different events based on payment status
    const eventMap = {
      initiated: 'begin_checkout',
      completed: 'purchase', // Changed from 'premium_purchase' to match GTM expectation
      failed: 'checkout_failed'
    };

    const event = eventMap[premiumEvent.payment_status] || 'subscription_upgrade';
    
    // 🛡️ Prevent duplicate business events
    const identifier = premiumEvent.transaction_id || premiumEvent.plan_type;
    if (this.shouldBlockBusinessEvent(event, identifier)) {
      return;
    }
    
    // Special handling for premium_view
    if (premiumEvent.event === 'premium_view') {
      if (this.shouldBlockBusinessEvent('premium_view', premiumEvent.plan_type)) {
        return;
      }
    }

    const eventData: PremiumEventData = {
      event,
      plan_type: premiumEvent.plan_type,
      value: premiumEvent.plan_price,
      currency: 'ILS',
      transaction_id: premiumEvent.transaction_id || `premium_${premiumEvent.plan_type}_${Date.now()}`,
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

    // For development, also track as subscription_upgrade for GTM compatibility
    if (premiumEvent.payment_status === 'completed') {
      await this.trackEvent({
        event: 'subscription_upgrade',
        plan_id: premiumEvent.plan_type, // Dashboard expects plan_id parameter
        plan_type: premiumEvent.plan_type, // Keep plan_type for backward compatibility
        value: premiumEvent.plan_price,
        currency: 'ILS',
        transaction_id: eventData.transaction_id
      });
    }

    await this.trackEvent(eventData);

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
    } else if (premiumEvent.payment_status === 'completed') {
      this.trackFacebookPixel({
        eventName: 'Purchase',
        parameters: {
          value: premiumEvent.plan_price,
          currency: 'ILS',
          content_ids: [`premium_${premiumEvent.plan_type}`],
          content_type: 'subscription'
        }
      });
    }
  }

  public async trackSimulation(simulationEvent: SimulationEvent): Promise<void> {
    // Determine the correct event name based on the input event or context
    let eventName = simulationEvent.event || 'simulation_interaction';
    
    // Normalize event names to match GTM expectations
    if (eventName === 'simulation_interaction') {
      eventName = 'simulation_start'; // Default interaction is start
    }

    // Ensure topic parameter is always present (required by dashboard)
    let topic = simulationEvent.topic || simulationEvent.simulation_type || 'unknown';
    if (!topic && simulationEvent.simulation_id) {
      // Try to extract topic from simulation_id if available
      const topicMatch = simulationEvent.simulation_id.match(/^([^_]+)/);
      topic = topicMatch ? topicMatch[1] : 'general';
    }

    const eventData = {
      event: eventName,
      simulation_type: simulationEvent.simulation_type,
      simulation_id: simulationEvent.simulation_id,
      topic: topic, // Dashboard requires this parameter
      difficulty_level: simulationEvent.difficulty_level,
      question_count: simulationEvent.question_count,
      score: simulationEvent.score,
      completion_rate: simulationEvent.completion_rate,
      time_spent: simulationEvent.time_spent,
      current_score: simulationEvent.current_score,
      questions_answered: simulationEvent.questions_answered
    };

    await this.trackEvent(eventData);

    // Track completion as separate event if completion rate is 100%
    if (simulationEvent.completion_rate === 100 && eventName !== 'simulation_complete') {
      await this.trackEvent({
        event: 'simulation_complete',
        simulation_type: simulationEvent.simulation_type,
        simulation_id: simulationEvent.simulation_id,
        topic: topic, // Dashboard requires this parameter
        score: simulationEvent.score,
        time_spent: simulationEvent.time_spent,
        completion_rate: 100
      });
    }
  }

  public async trackError(errorEvent: ErrorEvent): Promise<void> {
    await this.trackEvent({
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
    // 🛡️ Prevent duplicate user_id_set in same session
    if (this.shouldBlockBusinessEvent('user_id_set', userId)) {
      return;
    }
    
    this.userContext.user_id = userId;
    
    this.pushToDataLayer({
      event: 'user_id_set',
      user_id: userId
    });

    if (this.config.debugMode) {
      console.log('👤 User ID set:', userId);
    }
  }

  public setUserProperties(properties: Record<string, unknown>): void {
    this.userContext = { ...this.userContext, ...properties };
    
    this.pushToDataLayer({
      event: 'user_properties_set',
      user_properties: properties
    });
  }

  public consent(granted: boolean): void {
    // Force consent in development/testing mode
    if (this.config.debugMode || import.meta.env.VITE_ENABLE_ANALYTICS_DEV === 'true') {
      granted = true;
      if (this.config.debugMode) {
        console.log('🔒 Development mode: Forcing analytics consent to granted');
      }
    }

    this.pushToDataLayer({
      event: 'consent_update',
      analytics_consent: granted ? 'granted' : 'denied',
      ad_storage_consent: granted ? 'granted' : 'denied',
      analytics_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied'
    });

    // Also send direct gtag consent update
    if (typeof window !== 'undefined' && window.gtag) {
      try {
        window.gtag('consent', 'update', {
          analytics_storage: granted ? 'granted' : 'denied',
          ad_storage: granted ? 'granted' : 'denied',
          ad_user_data: granted ? 'granted' : 'denied',
          ad_personalization: granted ? 'granted' : 'denied'
        });
      } catch (error) {
        console.warn('Direct gtag consent call failed:', error);
      }
    }

    if (this.config.debugMode) {
      console.log('🔒 Consent updated:', granted ? 'granted' : 'denied');
    }
  }

  // Utility methods for specific Amiram Academy events
  public async trackCouponApplied(couponCode: string, discountAmount: number, planType: string): Promise<void> {
    await this.trackEvent({
      event: 'coupon_applied',
      coupon_code: couponCode,
      discount_amount: discountAmount,
      plan_type: planType
    });
  }

  /**
   * Enhanced transaction tracking with automatic checksum generation
   */
  public async trackTransactionWithChecksum(
    transactionId: string,
    timestamp: number,
    userId: string,
    eventData: TransactionEventData
  ): Promise<void> {
    const checksum = await this.generateChecksum(timestamp, userId);
    
    await this.trackEvent({
      ...eventData,
      transaction_id: transactionId,
      checksum,
      timestamp,
      user_id: userId
    });
  }

  /**
   * Track refund events with negative values and proper deduplication
   */
  public async trackRefund(refundData: {
    original_transaction_id: string;
    refund_transaction_id?: string;
    refund_amount: number;
    original_amount: number;
    currency?: string;
    refund_reason?: string;
    plan_type?: string;
    user_id?: string;
    subscription_id?: string;
  }): Promise<void> {
    const refundEvent = {
      event: 'refund',
      transaction_id: refundData.refund_transaction_id || `refund_${refundData.original_transaction_id}_${Date.now()}`,
      original_transaction_id: refundData.original_transaction_id,
      value: -Math.abs(refundData.refund_amount), // Always negative for refunds
      original_value: refundData.original_amount,
      currency: refundData.currency || 'ILS',
      refund_reason: refundData.refund_reason,
      plan_type: refundData.plan_type,
      user_id: refundData.user_id,
      subscription_id: refundData.subscription_id,
      items: [{
        item_id: `refund_${refundData.plan_type}`,
        item_name: `Refund for ${refundData.plan_type} subscription`,
        category: 'refund',
        price: -Math.abs(refundData.refund_amount),
        quantity: 1
      }]
    };

    if (this.config.debugMode) {
      console.log('💰 Tracking refund event:', refundEvent);
    }

    await this.trackEvent(refundEvent);

    // Also track Facebook Pixel refund event (if applicable)
    if (refundData.refund_amount > 0) {
      this.trackFacebookPixel({
        eventName: 'Purchase', // Facebook doesn't have a specific refund event
        parameters: {
          value: -Math.abs(refundData.refund_amount), // Negative value for refund
          currency: refundData.currency || 'ILS',
          content_type: 'subscription_refund'
        }
      });
    }
  }

  public async trackFormInteraction(formName: string, fieldName: string, action: 'focus' | 'blur' | 'error'): Promise<void> {
    await this.trackEvent({
      event: 'form_interaction',
      form_name: formName,
      field_name: fieldName,
      action
    });
  }

  public async trackContentEngagement(contentType: string, contentId: string, engagementTime: number): Promise<void> {
    await this.trackEvent({
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
  analyticsService.initialize().catch(error => {
    console.error('Failed to initialize analytics service:', error);
  });
}

export default analyticsService;