// Analytics Type Definitions for Amiram Academy
// Comprehensive TypeScript interfaces for all tracking events

// Base event structure
export interface BaseEvent {
  event: string;
  timestamp?: number;
  user_id?: string;
  session_id?: string;
  // Common analytics properties
  engagement_time_msec?: number;
  page_title?: string;
  page_location?: string;
  plan_type?: string;
  form_name?: string;
  button_name?: string;
  content_type?: string;
  current_score?: number;
  questions_answered?: number;
  questions_correct?: number;
  session_page_count?: number;
  method?: string;
  transaction_id?: string;
  simulation_type?: string;
  simulation_id?: string;
  description?: string;
  coupon_code?: string;
  test_parameter?: any;
  success?: boolean;
  click_location?: string;
  content_id?: string;
  value?: number;
  score?: number;
  fatal?: boolean;
  discount_amount?: number;
  field_name?: string;
  error_message?: string;
  currency?: string;
  difficulty_level?: string;
  time_spent?: number;
  error_type?: string;
  action?: string;
  question_count?: number;
  time_limit?: number;
  completion_rate?: number;
  items?: any[];
  component?: string;
  coupon?: string;
  page_url?: string;
  payment_method?: string;
}

// Google Analytics Enhanced Ecommerce Events
export interface GAEvent extends BaseEvent {
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// Authentication Events
export interface AuthEvent extends BaseEvent {
  method: 'google' | 'email' | 'signup';
  user_id: string;
  email?: string;
  success: boolean;
  error_message?: string;
}

// E-commerce Events
export interface EcommerceEvent extends BaseEvent {
  currency: string;
  value: number;
  items?: EcommerceItem[];
  transaction_id?: string;
  coupon?: string;
  payment_method?: string;
}

export interface EcommerceItem {
  item_id: string;
  item_name: string;
  category: string;
  price: number;
  quantity: number;
}

// Premium/Subscription Events
export interface PremiumEvent extends BaseEvent {
  plan_type: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  plan_price: number;
  original_price?: number;
  discount_amount?: number;
  coupon_code?: string;
  payment_status: 'initiated' | 'completed' | 'failed';
}

// Simulation Events
export interface SimulationEvent extends BaseEvent {
  simulation_type: string;
  simulation_id: string;
  difficulty_level?: string;
  question_count?: number;
  time_limit?: number;
  score?: number;
  completion_rate?: number;
  time_spent?: number; // in seconds
}

// User Engagement Events
export interface EngagementEvent extends BaseEvent {
  engagement_time_msec?: number;
  page_title?: string;
  page_location?: string;
  content_group1?: string;
}

// Facebook Pixel Events
export interface FacebookPixelEvent {
  eventName: 'PageView' | 'Lead' | 'Purchase' | 'CompleteRegistration' | 'InitiateCheckout';
  parameters?: Record<string, any>;
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
  [key: string]: any;
}

// Analytics Service Interface
export interface AnalyticsService {
  initialize: (config: AnalyticsConfig) => void;
  trackEvent: (event: BaseEvent) => void;
  trackPageView: (pageData: EngagementEvent) => void;
  trackAuth: (authEvent: AuthEvent) => void;
  trackEcommerce: (ecommerceEvent: EcommerceEvent) => void;
  trackPremium: (premiumEvent: PremiumEvent) => void;
  trackSimulation: (simulationEvent: SimulationEvent) => void;
  trackError: (errorEvent: ErrorEvent) => void;
  setUserId: (userId: string) => void;
  setUserProperties: (properties: Record<string, any>) => void;
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