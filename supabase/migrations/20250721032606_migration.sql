-- Create coupons table for coupon management system
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'amount')),
  discount_value INTEGER NOT NULL CHECK (discount_value > 0),
  allowed_plans TEXT[] DEFAULT ARRAY['daily', 'weekly', 'monthly', 'quarterly'],
  expire_at TIMESTAMPTZ,
  usage_limit INTEGER DEFAULT NULL, -- NULL means unlimited
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  assigned_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL for general coupons
  assigned_user_email TEXT, -- Alternative to user_id for easier assignment
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT -- Admin notes about the coupon
);

-- Create coupon usage tracking table
CREATE TABLE public.coupon_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID REFERENCES public.coupons(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  used_at TIMESTAMPTZ DEFAULT now(),
  plan_type TEXT NOT NULL,
  original_amount INTEGER NOT NULL,
  discount_amount INTEGER NOT NULL,
  final_amount INTEGER NOT NULL,
  UNIQUE(coupon_id, user_id) -- Prevents same user from using same coupon multiple times
);

-- Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for coupons
CREATE POLICY "Public can view active coupons for validation" ON public.coupons
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all coupons" ON public.coupons
  FOR ALL USING (auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE email = 'admin@example.com' -- Replace with actual admin identification
  ));

-- RLS Policies for coupon usage
CREATE POLICY "Users can view their own coupon usage" ON public.coupon_usage
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service can insert coupon usage" ON public.coupon_usage
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all coupon usage" ON public.coupon_usage
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM public.profiles WHERE email = 'admin@example.com' -- Replace with actual admin identification
  ));

-- Indexes for performance
CREATE INDEX idx_coupons_code ON public.coupons(code);
CREATE INDEX idx_coupons_assigned_user_id ON public.coupons(assigned_user_id);
CREATE INDEX idx_coupons_assigned_user_email ON public.coupons(assigned_user_email);
CREATE INDEX idx_coupon_usage_coupon_id ON public.coupon_usage(coupon_id);
CREATE INDEX idx_coupon_usage_user_id ON public.coupon_usage(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_coupons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating updated_at
CREATE TRIGGER update_coupons_updated_at_trigger
  BEFORE UPDATE ON public.coupons
  FOR EACH ROW
  EXECUTE FUNCTION update_coupons_updated_at();

-- Insert some sample coupons
INSERT INTO public.coupons (code, discount_type, discount_value, allowed_plans, expire_at, usage_limit, notes) VALUES
('WELCOME10', 'percent', 10, ARRAY['daily', 'weekly', 'monthly', 'quarterly'], now() + interval '30 days', 100, 'Welcome discount for new users'),
('SAVE20', 'percent', 20, ARRAY['monthly', 'quarterly'], now() + interval '60 days', 50, 'Limited time 20% off'),
('STUDENT25', 'percent', 25, ARRAY['daily', 'weekly'], now() + interval '90 days', NULL, 'Student discount');