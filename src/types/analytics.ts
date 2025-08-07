// Analytics Type Definitions for Amiram Academy
// Comprehensive TypeScript interfaces for all tracking events

// Base event structure - now flexible to allow custom properties
export interface BaseEvent {
  event: string;
  timestamp?: number;
  user_id?: string;
  session_id?: string;
  transaction_id?: string;
  checksum?: string; // Cryptographic checksum for transaction validation
  [key: string]: unknown; // Allow any additional custom properties
}

// Google Analytics Enhanced Ecommerce Events
export interface GAEvent extends BaseEvent {
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, unknown>;
}

// Authentication Events - flexible for partial data
export interface AuthEvent extends BaseEvent {
  method?: 'google' | 'email' | 'signup';
  user_id?: string;
  email?: string;
  success?: boolean;
  error_message?: string;
}

// E-commerce Events - flexible for partial data
export interface EcommerceEvent extends BaseEvent {
  currency?: string;
  value?: number;
  items?: EcommerceItem[];
  transaction_id?: string;
  coupon?: string;
  payment_method?: string;
  method?: string; // Added for login/logout methods
}

export interface EcommerceItem {
  item_id: string;
  item_name: string;
  category: string;
  price: number;
  quantity: number;
}

// Premium/Subscription Events - flexible for partial data
export interface PremiumEvent extends BaseEvent {
  plan_type?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  plan_price?: number;
  original_price?: number;
  discount_amount?: number;
  coupon_code?: string;
  payment_status?: 'initiated' | 'completed' | 'failed';
}

// Simulation Events - flexible for additional properties
export interface SimulationEvent extends BaseEvent {
  simulation_type?: string;
  simulation_id?: string;
  topic?: string; // Dashboard requires this parameter
  difficulty_level?: string;
  question_count?: number;
  time_limit?: number;
  score?: number;
  completion_rate?: number;
  time_spent?: number; // in seconds
  current_score?: number;
  questions_answered?: number;
  [key: string]: unknown; // Allow additional simulation properties
}

// Extended event interfaces for type-safe property access
export interface EcommerceBaseEvent extends BaseEvent {
  transaction_id?: string;
  value?: number;
  plan_price?: number;
  checksum?: string;
  plan_type?: string;
}

export interface SimulationBaseEvent extends BaseEvent {
  simulation_id?: string;
  simulation_type?: string;
  user_id?: string;
}

// Event data interfaces for tracking methods
export interface PremiumEventData extends BaseEvent {
  event: string;
  plan_type?: string;
  plan_id?: string;
  value?: number;
  currency?: string;
  transaction_id?: string;
  items?: EcommerceItem[];
  coupon?: string;
  discount_amount?: number;
}

export interface TransactionEventData extends BaseEvent {
  transaction_id?: string;
  checksum?: string;
  timestamp?: number;
  user_id?: string;
}

// User Engagement Events - flexible for additional properties
export interface EngagementEvent extends BaseEvent {
  engagement_time_msec?: number;
  page_title?: string;
  page_location?: string;
  page_referrer?: string;
  content_group1?: string;
  [key: string]: unknown; // Allow additional engagement properties
}

// Facebook Pixel Events
export interface FacebookPixelEvent {
  eventName: 'PageView' | 'Lead' | 'Purchase' | 'CompleteRegistration' | 'InitiateCheckout';
  parameters?: Record<string, unknown>;
  eventID?: string;
}

// Coupon/Discount Events
export interface CouponEvent extends BaseEvent {
  coupon_code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  plan_type: string;
  status: 'applied' | 'removed' | 'invalid';
}

// Error Events
export interface ErrorEvent extends BaseEvent {
  error_type: string;
  error_message: string;
  component?: string;
  user_agent?: string;
  page_url?: string;
}

// Custom Analytics Configuration
export interface AnalyticsConfig {
  gtmId: string;
  measurementId?: string;
  ga4MeasurementId?: string;
  facebookPixelId?: string;
  enabledServices: {
    gtm: boolean;
    ga4: boolean;
    facebookPixel: boolean;
  };
  debugMode: boolean;
  enableOfflineQueuing: boolean;
  retryAttempts: number;
  retryDelay: number;
}

// DataLayer Event Structure (for GTM)
export interface DataLayerEvent {
  event: string;
  [key: string]: unknown;
}

// Analytics Service Interface
export interface AnalyticsService {
  initialize: (config: AnalyticsConfig) => Promise<void>;
  trackEvent: (event: BaseEvent) => Promise<void>;
  trackPageView: (pageData: EngagementEvent) => Promise<void>;
  trackAuth: (authEvent: AuthEvent) => Promise<void>;
  trackEcommerce: (ecommerceEvent: EcommerceEvent) => Promise<void>;
  trackPremium: (premiumEvent: PremiumEvent) => Promise<void>;
  trackSimulation: (simulationEvent: SimulationEvent) => Promise<void>;
  trackError: (errorEvent: ErrorEvent) => Promise<void>;
  setUserId: (userId: string) => void;
  setUserProperties: (properties: Record<string, unknown>) => void;
  consent: (granted: boolean) => void;
}

// UTM Parameters
export interface UTMParameters {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

// Session Information
export interface SessionInfo {
  session_id: string;
  session_start_time: number;
  page_count: number;
  engagement_time_msec: number;
}

// User Context
export interface UserContext {
  user_id?: string;
  subscription_status?: 'free' | 'premium';
  signup_date?: string;
  last_login?: string;
  total_simulations?: number;
  average_score?: number;
}