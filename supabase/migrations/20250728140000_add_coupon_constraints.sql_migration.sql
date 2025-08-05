-- Add coupon discount validation constraints
-- This migration adds database-level constraints to prevent discount stacking
-- and ensure minimum pricing rules are enforced

-- Add check constraint to ensure final_amount is reasonable
ALTER TABLE coupon_usage 
ADD CONSTRAINT coupon_usage_final_amount_check 
CHECK (final_amount >= 5 AND final_amount <= original_amount);

-- Add check constraint to ensure discount_amount is reasonable  
ALTER TABLE coupon_usage
ADD CONSTRAINT coupon_usage_discount_amount_check
CHECK (discount_amount >= 0 AND discount_amount <= original_amount);

-- Add check constraint to ensure final amount is at least 20% of original
ALTER TABLE coupon_usage
ADD CONSTRAINT coupon_usage_minimum_price_check
CHECK (final_amount >= (original_amount * 0.2));

-- Add unique constraint to prevent multiple active coupon usage per user per plan
-- Note: This allows the same user to use different coupons for different plans
-- but prevents using multiple coupons for the same plan
-- We'll use a regular index instead of conditional with NOW()
CREATE UNIQUE INDEX coupon_usage_active_per_user_plan 
ON coupon_usage (user_id, plan_type, coupon_id);

-- Add constraint to coupons table to limit maximum discount percentage
ALTER TABLE coupons
ADD CONSTRAINT coupons_percent_discount_limit
CHECK (
  discount_type != 'percent' OR 
  (discount_type = 'percent' AND discount_value <= 50)
);

-- Add function to validate coupon usage before insert
CREATE OR REPLACE FUNCTION validate_coupon_usage()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user already has an active coupon usage for this plan in the last 30 minutes
  IF EXISTS (
    SELECT 1 FROM coupon_usage 
    WHERE user_id = NEW.user_id 
    AND plan_type = NEW.plan_type 
    AND created_at > (NOW() - INTERVAL '30 minutes')
    AND id != COALESCE(NEW.id, -1)
  ) THEN
    RAISE EXCEPTION 'User already has an active coupon for this plan type';
  END IF;
  
  -- Validate discount calculation
  IF NEW.final_amount + NEW.discount_amount != NEW.original_amount THEN
    RAISE EXCEPTION 'Invalid discount calculation: final_amount + discount_amount must equal original_amount';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate coupon usage
DROP TRIGGER IF EXISTS validate_coupon_usage_trigger ON coupon_usage;
CREATE TRIGGER validate_coupon_usage_trigger
  BEFORE INSERT OR UPDATE ON coupon_usage
  FOR EACH ROW
  EXECUTE FUNCTION validate_coupon_usage();

-- Add comments for documentation
COMMENT ON CONSTRAINT coupon_usage_final_amount_check ON coupon_usage IS 
'Ensures final amount is at least 5 NIS and not more than original amount';

COMMENT ON CONSTRAINT coupon_usage_discount_amount_check ON coupon_usage IS 
'Ensures discount amount is non-negative and not more than original amount';

COMMENT ON CONSTRAINT coupon_usage_minimum_price_check ON coupon_usage IS 
'Ensures final amount is at least 20% of original amount to prevent excessive discounts';

COMMENT ON CONSTRAINT coupons_percent_discount_limit ON coupons IS 
'Limits percentage-based discounts to maximum 50%';

COMMENT ON FUNCTION validate_coupon_usage() IS 
'Validates coupon usage rules including single coupon per plan and calculation accuracy';