-- Full Hardening (excluding reserved auth schema changes)
BEGIN;

/* 1) PAYMENT TRANSACTIONS (Payment + Refund info) */
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Drop old/duplicate policies safely
DROP POLICY IF EXISTS select_own_transactions ON public.payment_transactions;
DROP POLICY IF EXISTS select_refund_transactions ON public.payment_transactions;
DROP POLICY IF EXISTS select_own_refunds ON public.payment_transactions;
DROP POLICY IF EXISTS service_role_all ON public.payment_transactions;

-- Authenticated users: read only own transactions
CREATE POLICY select_own_transactions
ON public.payment_transactions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Optional separate refunds policy (redundant but explicit)
CREATE POLICY select_own_refunds
ON public.payment_transactions
FOR SELECT
TO authenticated
USING (user_id = auth.uid() AND is_refund = true);

-- Service role: full access
CREATE POLICY service_role_all
ON public.payment_transactions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

/* 2) USERS TABLE (Customer emails)
   Skipped intentionally: auth.users is a Supabase-reserved schema. Use public.profiles (already RLS-protected) for customer emails. */

/* 3) RPC Permissions Hardening */
REVOKE ALL ON FUNCTION public.get_user_payment_transactions(integer, integer) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_user_payment_transactions(integer, integer) TO authenticated;

REVOKE ALL ON FUNCTION public.get_latest_user_transaction_for_subscription(uuid) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_latest_user_transaction_for_subscription(uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.get_public_homepage_stats() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_public_homepage_stats() TO authenticated;

/* 4) Sanity Check – report security mode (invoker/definer) */
-- Note: get_public_homepage_stats intentionally remains SECURITY DEFINER to bypass RLS for global aggregates.

COMMIT;