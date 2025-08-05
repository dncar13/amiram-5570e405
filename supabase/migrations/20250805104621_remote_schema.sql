drop trigger if exists "validate_coupon_usage_trigger" on "public"."coupon_usage";

drop trigger if exists "update_refund_logs_updated_at" on "public"."refund_logs";

drop policy "Service role can manage email logs" on "public"."email_logs";

drop policy "Users can view their own email logs" on "public"."email_logs";

drop policy "Admins can view all payment transactions" on "public"."payment_transactions";

drop policy "Service role can manage payment transactions" on "public"."payment_transactions";

drop policy "Users can view their own payment transactions" on "public"."payment_transactions";

drop policy "Admins can view all refund logs" on "public"."refund_logs";

drop policy "Service role can manage refund logs" on "public"."refund_logs";

revoke delete on table "public"."email_logs" from "anon";

revoke insert on table "public"."email_logs" from "anon";

revoke references on table "public"."email_logs" from "anon";

revoke select on table "public"."email_logs" from "anon";

revoke trigger on table "public"."email_logs" from "anon";

revoke truncate on table "public"."email_logs" from "anon";

revoke update on table "public"."email_logs" from "anon";

revoke delete on table "public"."email_logs" from "authenticated";

revoke insert on table "public"."email_logs" from "authenticated";

revoke references on table "public"."email_logs" from "authenticated";

revoke select on table "public"."email_logs" from "authenticated";

revoke trigger on table "public"."email_logs" from "authenticated";

revoke truncate on table "public"."email_logs" from "authenticated";

revoke update on table "public"."email_logs" from "authenticated";

revoke delete on table "public"."email_logs" from "service_role";

revoke insert on table "public"."email_logs" from "service_role";

revoke references on table "public"."email_logs" from "service_role";

revoke select on table "public"."email_logs" from "service_role";

revoke trigger on table "public"."email_logs" from "service_role";

revoke truncate on table "public"."email_logs" from "service_role";

revoke update on table "public"."email_logs" from "service_role";

alter table "public"."coupon_usage" drop constraint "coupon_usage_discount_amount_check";

alter table "public"."coupon_usage" drop constraint "coupon_usage_final_amount_check";

alter table "public"."coupon_usage" drop constraint "coupon_usage_minimum_price_check";

alter table "public"."coupons" drop constraint "coupons_percent_discount_limit";

alter table "public"."email_logs" drop constraint "email_logs_email_type_check";

alter table "public"."email_logs" drop constraint "email_logs_status_check";

alter table "public"."payment_transactions" drop constraint "payment_transactions_subscription_id_fkey";

alter table "public"."payment_transactions" drop constraint "payment_transactions_transaction_id_key";

alter table "public"."payment_transactions" drop constraint "payment_transactions_user_id_fkey";

alter table "public"."payment_transactions" drop constraint "unique_transaction_per_method";

alter table "public"."payment_transactions" drop constraint "payment_transactions_status_check";

drop function if exists "public"."get_user_payment_history"(user_uuid uuid);

drop function if exists "public"."get_user_refund_history"(user_uuid uuid);

drop function if exists "public"."send_immediate_welcome_email"();

drop function if exists "public"."send_welcome_email"();

drop function if exists "public"."validate_coupon_usage"();

alter table "public"."email_logs" drop constraint "email_logs_pkey";

drop index if exists "public"."coupon_usage_active_per_user_plan";

drop index if exists "public"."email_logs_pkey";

drop index if exists "public"."idx_email_logs_email_type";

drop index if exists "public"."idx_email_logs_recipient_email";

drop index if exists "public"."idx_email_logs_sent_at";

drop index if exists "public"."idx_email_logs_status";

drop index if exists "public"."idx_payment_transactions_date";

drop index if exists "public"."idx_payment_transactions_is_refund";

drop index if exists "public"."idx_payment_transactions_original_transaction_id";

drop index if exists "public"."idx_payment_transactions_transaction_id";

drop index if exists "public"."idx_profiles_is_admin";

drop index if exists "public"."idx_refund_logs_created_at";

drop index if exists "public"."idx_refund_logs_status";

drop index if exists "public"."idx_refund_logs_subscription_id";

drop index if exists "public"."idx_refund_logs_user_id";

drop index if exists "public"."payment_transactions_transaction_id_key";

drop index if exists "public"."unique_transaction_per_method";

drop index if exists "public"."idx_questions_original_id_type";

drop table "public"."email_logs";

create table "public"."user_preferences" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "preferred_difficulty" text default 'medium'::text,
    "questions_per_session" integer default 10,
    "delivery_strategy" text default 'unseen_priority'::text,
    "show_explanations" boolean default true,
    "enable_sound" boolean default false,
    "enable_smart_delivery" boolean default true,
    "auto_advance_time" integer default 0,
    "adaptive_difficulty" boolean default false,
    "daily_reminder_enabled" boolean default false,
    "daily_reminder_time" time without time zone default '19:00:00'::time without time zone,
    "weekly_progress_email" boolean default true,
    "achievement_notifications" boolean default true,
    "theme" text default 'system'::text,
    "font_size" text default 'medium'::text,
    "reduce_animations" boolean default false,
    "allow_analytics" boolean default true,
    "share_anonymous_data" boolean default true,
    "updated_at" timestamp with time zone default now(),
    "created_at" timestamp with time zone default now()
);


alter table "public"."user_preferences" enable row level security;

create table "public"."user_progress_summary" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "difficulty" text not null,
    "total_questions_available" integer not null default 0,
    "questions_seen" integer not null default 0,
    "questions_correct" integer not null default 0,
    "questions_incorrect" integer not null default 0,
    "questions_flagged" integer not null default 0,
    "average_accuracy" numeric(5,2) default 0.00,
    "average_time_per_question" integer default 0,
    "total_practice_time" integer default 0,
    "current_streak_days" integer default 0,
    "longest_streak_days" integer default 0,
    "last_practice_date" date,
    "updated_at" timestamp with time zone default now(),
    "created_at" timestamp with time zone default now()
);


alter table "public"."user_progress_summary" enable row level security;

create table "public"."user_question_history" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "question_id" bigint not null,
    "answer_selected" integer,
    "is_correct" boolean not null,
    "time_spent_seconds" integer default 0,
    "simulation_session_id" uuid,
    "simulation_type" text,
    "difficulty" text not null,
    "flagged" boolean default false,
    "notes" text,
    "last_seen_at" timestamp with time zone default now(),
    "created_at" timestamp with time zone default now()
);


alter table "public"."user_question_history" enable row level security;

alter table "public"."payment_transactions" drop column "auth_number";

alter table "public"."payment_transactions" drop column "card_holder_name";

alter table "public"."payment_transactions" drop column "card_last_four";

alter table "public"."payment_transactions" drop column "coupon_code";

alter table "public"."payment_transactions" drop column "discount_amount";

alter table "public"."payment_transactions" drop column "low_profile_id";

alter table "public"."payment_transactions" drop column "original_amount";

alter table "public"."payment_transactions" drop column "payment_method";

alter table "public"."payment_transactions" drop column "transaction_date";

alter table "public"."payment_transactions" drop column "voucher_number";

alter table "public"."payment_transactions" add column "low_profile_code" text not null;

alter table "public"."payment_transactions" add column "plan_type" text not null;

alter table "public"."payment_transactions" alter column "amount" set data type integer using "amount"::integer;

alter table "public"."payment_transactions" alter column "metadata" set default '{}'::jsonb;

alter table "public"."payment_transactions" alter column "transaction_id" drop not null;

alter table "public"."profiles" drop column "is_admin";

CREATE INDEX idx_payment_transactions_low_profile_code ON public.payment_transactions USING btree (low_profile_code);

CREATE INDEX idx_user_preferences_user_id ON public.user_preferences USING btree (user_id);

CREATE INDEX idx_user_progress_summary_user_id ON public.user_progress_summary USING btree (user_id);

CREATE INDEX idx_user_question_history_user_id ON public.user_question_history USING btree (user_id);

CREATE UNIQUE INDEX payment_transactions_low_profile_code_key ON public.payment_transactions USING btree (low_profile_code);

CREATE UNIQUE INDEX user_preferences_pkey ON public.user_preferences USING btree (id);

CREATE UNIQUE INDEX user_preferences_user_id_key ON public.user_preferences USING btree (user_id);

CREATE UNIQUE INDEX user_progress_summary_pkey ON public.user_progress_summary USING btree (id);

CREATE UNIQUE INDEX user_progress_summary_user_id_difficulty_key ON public.user_progress_summary USING btree (user_id, difficulty);

CREATE UNIQUE INDEX user_question_history_pkey ON public.user_question_history USING btree (id);

CREATE UNIQUE INDEX idx_questions_original_id_type ON public.questions USING btree (original_id, type) WHERE (original_id IS NOT NULL);

alter table "public"."user_preferences" add constraint "user_preferences_pkey" PRIMARY KEY using index "user_preferences_pkey";

alter table "public"."user_progress_summary" add constraint "user_progress_summary_pkey" PRIMARY KEY using index "user_progress_summary_pkey";

alter table "public"."user_question_history" add constraint "user_question_history_pkey" PRIMARY KEY using index "user_question_history_pkey";

alter table "public"."payment_transactions" add constraint "payment_transactions_low_profile_code_key" UNIQUE using index "payment_transactions_low_profile_code_key";

alter table "public"."payment_transactions" add constraint "payment_transactions_plan_type_check" CHECK ((plan_type = ANY (ARRAY['daily'::text, 'weekly'::text, 'monthly'::text, 'quarterly'::text]))) not valid;

alter table "public"."payment_transactions" validate constraint "payment_transactions_plan_type_check";

alter table "public"."user_preferences" add constraint "user_preferences_delivery_strategy_check" CHECK ((delivery_strategy = ANY (ARRAY['unseen_priority'::text, 'random_weighted'::text, 'spaced_repetition'::text, 'mistake_review'::text]))) not valid;

alter table "public"."user_preferences" validate constraint "user_preferences_delivery_strategy_check";

alter table "public"."user_preferences" add constraint "user_preferences_font_size_check" CHECK ((font_size = ANY (ARRAY['small'::text, 'medium'::text, 'large'::text]))) not valid;

alter table "public"."user_preferences" validate constraint "user_preferences_font_size_check";

alter table "public"."user_preferences" add constraint "user_preferences_preferred_difficulty_check" CHECK ((preferred_difficulty = ANY (ARRAY['easy'::text, 'medium'::text, 'hard'::text]))) not valid;

alter table "public"."user_preferences" validate constraint "user_preferences_preferred_difficulty_check";

alter table "public"."user_preferences" add constraint "user_preferences_theme_check" CHECK ((theme = ANY (ARRAY['light'::text, 'dark'::text, 'system'::text]))) not valid;

alter table "public"."user_preferences" validate constraint "user_preferences_theme_check";

alter table "public"."user_preferences" add constraint "user_preferences_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_preferences" validate constraint "user_preferences_user_id_fkey";

alter table "public"."user_preferences" add constraint "user_preferences_user_id_key" UNIQUE using index "user_preferences_user_id_key";

alter table "public"."user_progress_summary" add constraint "user_progress_summary_difficulty_check" CHECK ((difficulty = ANY (ARRAY['easy'::text, 'medium'::text, 'hard'::text]))) not valid;

alter table "public"."user_progress_summary" validate constraint "user_progress_summary_difficulty_check";

alter table "public"."user_progress_summary" add constraint "user_progress_summary_user_id_difficulty_key" UNIQUE using index "user_progress_summary_user_id_difficulty_key";

alter table "public"."user_progress_summary" add constraint "user_progress_summary_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_progress_summary" validate constraint "user_progress_summary_user_id_fkey";

alter table "public"."user_question_history" add constraint "user_question_history_difficulty_check" CHECK ((difficulty = ANY (ARRAY['easy'::text, 'medium'::text, 'hard'::text]))) not valid;

alter table "public"."user_question_history" validate constraint "user_question_history_difficulty_check";

alter table "public"."user_question_history" add constraint "user_question_history_simulation_type_check" CHECK ((simulation_type = ANY (ARRAY['quick'::text, 'full'::text, 'custom'::text, 'practice'::text]))) not valid;

alter table "public"."user_question_history" validate constraint "user_question_history_simulation_type_check";

alter table "public"."user_question_history" add constraint "user_question_history_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_question_history" validate constraint "user_question_history_user_id_fkey";

alter table "public"."payment_transactions" add constraint "payment_transactions_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text, 'cancelled'::text]))) not valid;

alter table "public"."payment_transactions" validate constraint "payment_transactions_status_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.calculate_refund_amount(p_original_amount numeric, p_start_date timestamp with time zone, p_end_date timestamp with time zone, p_cancel_date timestamp with time zone, p_plan_type text)
 RETURNS TABLE(refund_amount numeric, cancellation_fee numeric, unused_days integer, total_days integer, eligible_for_refund boolean)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  v_total_days integer;
  v_unused_days integer;
  v_refund_before_fee decimal;
  v_cancellation_fee decimal;
  v_final_refund decimal;
BEGIN
  -- Daily subscriptions are not eligible for refunds
  IF p_plan_type = 'daily' THEN
    RETURN QUERY SELECT 0::decimal, 0::decimal, 0, 1, false;
    RETURN;
  END IF;

  -- Calculate total days and unused days
  v_total_days := CEIL(EXTRACT(EPOCH FROM (p_end_date - p_start_date)) / 86400);
  v_unused_days := GREATEST(0, CEIL(EXTRACT(EPOCH FROM (p_end_date - p_cancel_date)) / 86400));

  -- If no unused days, no refund
  IF v_unused_days <= 0 THEN
    RETURN QUERY SELECT 0::decimal, 0::decimal, v_unused_days, v_total_days, false;
    RETURN;
  END IF;

  -- Calculate proportional refund before fee
  v_refund_before_fee := p_original_amount * (v_unused_days::decimal / v_total_days::decimal);
  
  -- Calculate cancellation fee (5% or ₪100, whichever is lower)
  v_cancellation_fee := LEAST(p_original_amount * 0.05, 100);
  
  -- Calculate final refund amount
  v_final_refund := GREATEST(0, v_refund_before_fee - v_cancellation_fee);
  
  -- Round to 2 decimal places
  v_final_refund := ROUND(v_final_refund, 2);
  v_cancellation_fee := ROUND(v_cancellation_fee, 2);

  -- Check if refund meets minimum threshold (₪2)
  IF v_final_refund < 2 THEN
    RETURN QUERY SELECT 0::decimal, 0::decimal, v_unused_days, v_total_days, false;
    RETURN;
  END IF;

  RETURN QUERY SELECT v_final_refund, v_cancellation_fee, v_unused_days, v_total_days, true;
END;
$function$
;

grant delete on table "public"."user_preferences" to "anon";

grant insert on table "public"."user_preferences" to "anon";

grant references on table "public"."user_preferences" to "anon";

grant select on table "public"."user_preferences" to "anon";

grant trigger on table "public"."user_preferences" to "anon";

grant truncate on table "public"."user_preferences" to "anon";

grant update on table "public"."user_preferences" to "anon";

grant delete on table "public"."user_preferences" to "authenticated";

grant insert on table "public"."user_preferences" to "authenticated";

grant references on table "public"."user_preferences" to "authenticated";

grant select on table "public"."user_preferences" to "authenticated";

grant trigger on table "public"."user_preferences" to "authenticated";

grant truncate on table "public"."user_preferences" to "authenticated";

grant update on table "public"."user_preferences" to "authenticated";

grant delete on table "public"."user_preferences" to "service_role";

grant insert on table "public"."user_preferences" to "service_role";

grant references on table "public"."user_preferences" to "service_role";

grant select on table "public"."user_preferences" to "service_role";

grant trigger on table "public"."user_preferences" to "service_role";

grant truncate on table "public"."user_preferences" to "service_role";

grant update on table "public"."user_preferences" to "service_role";

grant delete on table "public"."user_progress_summary" to "anon";

grant insert on table "public"."user_progress_summary" to "anon";

grant references on table "public"."user_progress_summary" to "anon";

grant select on table "public"."user_progress_summary" to "anon";

grant trigger on table "public"."user_progress_summary" to "anon";

grant truncate on table "public"."user_progress_summary" to "anon";

grant update on table "public"."user_progress_summary" to "anon";

grant delete on table "public"."user_progress_summary" to "authenticated";

grant insert on table "public"."user_progress_summary" to "authenticated";

grant references on table "public"."user_progress_summary" to "authenticated";

grant select on table "public"."user_progress_summary" to "authenticated";

grant trigger on table "public"."user_progress_summary" to "authenticated";

grant truncate on table "public"."user_progress_summary" to "authenticated";

grant update on table "public"."user_progress_summary" to "authenticated";

grant delete on table "public"."user_progress_summary" to "service_role";

grant insert on table "public"."user_progress_summary" to "service_role";

grant references on table "public"."user_progress_summary" to "service_role";

grant select on table "public"."user_progress_summary" to "service_role";

grant trigger on table "public"."user_progress_summary" to "service_role";

grant truncate on table "public"."user_progress_summary" to "service_role";

grant update on table "public"."user_progress_summary" to "service_role";

grant delete on table "public"."user_question_history" to "anon";

grant insert on table "public"."user_question_history" to "anon";

grant references on table "public"."user_question_history" to "anon";

grant select on table "public"."user_question_history" to "anon";

grant trigger on table "public"."user_question_history" to "anon";

grant truncate on table "public"."user_question_history" to "anon";

grant update on table "public"."user_question_history" to "anon";

grant delete on table "public"."user_question_history" to "authenticated";

grant insert on table "public"."user_question_history" to "authenticated";

grant references on table "public"."user_question_history" to "authenticated";

grant select on table "public"."user_question_history" to "authenticated";

grant trigger on table "public"."user_question_history" to "authenticated";

grant truncate on table "public"."user_question_history" to "authenticated";

grant update on table "public"."user_question_history" to "authenticated";

grant delete on table "public"."user_question_history" to "service_role";

grant insert on table "public"."user_question_history" to "service_role";

grant references on table "public"."user_question_history" to "service_role";

grant select on table "public"."user_question_history" to "service_role";

grant trigger on table "public"."user_question_history" to "service_role";

grant truncate on table "public"."user_question_history" to "service_role";

grant update on table "public"."user_question_history" to "service_role";

create policy "Service role can manage all transactions"
on "public"."payment_transactions"
as permissive
for all
to public
using ((current_setting('role'::text) = 'service_role'::text));


create policy "Users can insert their own transactions"
on "public"."payment_transactions"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can view their own transactions"
on "public"."payment_transactions"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users can manage their own simulation sessions"
on "public"."simulation_sessions"
as permissive
for all
to public
using ((auth.uid() = user_id));


create policy "Users can manage their own preferences"
on "public"."user_preferences"
as permissive
for all
to public
using ((auth.uid() = user_id));


create policy "Users can manage their own progress summary"
on "public"."user_progress_summary"
as permissive
for all
to public
using ((auth.uid() = user_id));


create policy "Users can manage their own question history"
on "public"."user_question_history"
as permissive
for all
to public
using ((auth.uid() = user_id));



