-- Events Validation SQL for GA4 → BigQuery Export
-- This query detects duplicate events and validates transaction uniqueness
-- Run this query regularly to monitor data quality

-- Set project and dataset variables
DECLARE project_id STRING DEFAULT 'your-ga4-project-id';
DECLARE dataset_id STRING DEFAULT 'analytics_XXXXXXXXXX'; -- Replace with your GA4 dataset

-- Main validation query
WITH 
  -- Extract all events from GA4 export
  all_events AS (
    SELECT 
      event_date,
      event_timestamp,
      event_name,
      user_pseudo_id,
      ga_session_id,
      -- Extract transaction_id from event parameters
      (SELECT value.string_value 
       FROM UNNEST(event_params) 
       WHERE key = 'transaction_id') AS transaction_id,
      -- Extract checksum from event parameters  
      (SELECT value.string_value 
       FROM UNNEST(event_params) 
       WHERE key = 'checksum') AS checksum,
      -- Extract value from event parameters
      (SELECT value.double_value 
       FROM UNNEST(event_params) 
       WHERE key = 'value') AS event_value,
      -- Extract currency
      (SELECT value.string_value 
       FROM UNNEST(event_params) 
       WHERE key = 'currency') AS currency,
      -- Extract plan_type
      (SELECT value.string_value 
       FROM UNNEST(event_params) 
       WHERE key = 'plan_type') AS plan_type,
      event_params
    FROM 
      `{project_id}.{dataset_id}.events_*`
    WHERE 
      -- Focus on the last 30 days
      _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY))
                         AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
      -- Focus on conversion events
      AND event_name IN ('purchase', 'refund', 'premium_purchase')
  ),

  -- Find duplicate transactions by transaction_id
  duplicate_transactions AS (
    SELECT 
      transaction_id,
      event_name,
      COUNT(*) as duplicate_count,
      ARRAY_AGG(STRUCT(
        event_date,
        event_timestamp,
        user_pseudo_id,
        checksum,
        event_value
      ) ORDER BY event_timestamp) as duplicate_events
    FROM 
      all_events 
    WHERE 
      transaction_id IS NOT NULL
    GROUP BY 
      transaction_id, event_name
    HAVING 
      COUNT(*) > 1
  ),

  -- Find events with missing transaction_id (should have them)
  missing_transaction_ids AS (
    SELECT 
      event_date,
      event_timestamp, 
      event_name,
      user_pseudo_id,
      ga_session_id,
      event_value,
      plan_type
    FROM 
      all_events
    WHERE 
      event_name IN ('purchase', 'premium_purchase', 'refund')
      AND transaction_id IS NULL
  ),

  -- Find events with invalid checksums (if checksum validation is enabled)
  invalid_checksums AS (
    SELECT 
      event_date,
      event_timestamp,
      event_name,
      user_pseudo_id,
      transaction_id,
      checksum,
      event_value
    FROM 
      all_events
    WHERE 
      event_name IN ('purchase', 'premium_purchase')
      AND checksum IS NOT NULL
      -- Add checksum validation logic here if needed
      AND LENGTH(checksum) != 16 -- Checksum should be 16 characters
  ),

  -- Find refund events that don't have corresponding purchase events
  orphaned_refunds AS (
    SELECT 
      r.event_date,
      r.event_timestamp,
      r.transaction_id,
      r.event_value as refund_value,
      r.user_pseudo_id
    FROM 
      all_events r
    WHERE 
      r.event_name = 'refund'
      AND NOT EXISTS (
        SELECT 1 
        FROM all_events p 
        WHERE p.event_name IN ('purchase', 'premium_purchase')
        AND (
          -- Match by original_transaction_id parameter
          (SELECT value.string_value FROM UNNEST(r.event_params) WHERE key = 'original_transaction_id') = p.transaction_id
          OR
          -- Match by same user and similar timestamp (fallback)
          (p.user_pseudo_id = r.user_pseudo_id 
           AND ABS(p.event_timestamp - r.event_timestamp) < 86400000000) -- Within 24 hours (microseconds)
        )
      )
  ),

  -- Summary statistics
  event_summary AS (
    SELECT 
      event_name,
      COUNT(*) as total_events,
      COUNT(DISTINCT transaction_id) as unique_transactions,
      COUNT(DISTINCT user_pseudo_id) as unique_users,
      SUM(event_value) as total_value,
      AVG(event_value) as avg_value,
      COUNT(CASE WHEN checksum IS NOT NULL THEN 1 END) as events_with_checksum,
      COUNT(CASE WHEN transaction_id IS NULL THEN 1 END) as events_missing_transaction_id
    FROM 
      all_events
    GROUP BY 
      event_name
  )

-- Main results query
SELECT 
  'SUMMARY' as validation_type,
  event_name,
  total_events,
  unique_transactions,
  unique_users,
  ROUND(total_value, 2) as total_value,
  ROUND(avg_value, 2) as avg_value,
  events_with_checksum,
  events_missing_transaction_id,
  CASE 
    WHEN events_missing_transaction_id > 0 THEN 'WARNING: Missing transaction IDs'
    WHEN total_events > unique_transactions THEN 'WARNING: Potential duplicates detected'
    ELSE 'OK'
  END as status,
  NULL as details
FROM 
  event_summary

UNION ALL

-- Duplicate transaction violations
SELECT 
  'DUPLICATE_TRANSACTIONS' as validation_type,
  event_name,
  duplicate_count as total_events,
  1 as unique_transactions,
  NULL as unique_users,
  NULL as total_value,
  NULL as avg_value,
  NULL as events_with_checksum,
  NULL as events_missing_transaction_id,
  'ERROR: Duplicate transaction detected' as status,
  TO_JSON_STRING(duplicate_events) as details
FROM 
  duplicate_transactions

UNION ALL

-- Missing transaction ID violations  
SELECT 
  'MISSING_TRANSACTION_ID' as validation_type,
  event_name,
  1 as total_events,
  NULL as unique_transactions,
  NULL as unique_users,
  event_value as total_value,
  NULL as avg_value,
  NULL as events_with_checksum,
  NULL as events_missing_transaction_id,
  'ERROR: Missing required transaction_id' as status,
  CONCAT('Date: ', event_date, ', User: ', user_pseudo_id, ', Value: ', COALESCE(CAST(event_value AS STRING), 'NULL')) as details
FROM 
  missing_transaction_ids

UNION ALL

-- Invalid checksum violations
SELECT 
  'INVALID_CHECKSUM' as validation_type,
  event_name,
  1 as total_events,
  NULL as unique_transactions,
  NULL as unique_users,
  event_value as total_value,
  NULL as avg_value,
  NULL as events_with_checksum,
  NULL as events_missing_transaction_id,
  'WARNING: Invalid checksum format' as status,
  CONCAT('Transaction: ', transaction_id, ', Checksum: ', checksum, ', User: ', user_pseudo_id) as details
FROM 
  invalid_checksums

UNION ALL

-- Orphaned refund violations
SELECT 
  'ORPHANED_REFUND' as validation_type,
  'refund' as event_name,
  1 as total_events,
  NULL as unique_transactions,
  NULL as unique_users,
  refund_value as total_value,
  NULL as avg_value,
  NULL as events_with_checksum,
  NULL as events_missing_transaction_id,
  'WARNING: Refund without corresponding purchase' as status,
  CONCAT('Date: ', event_date, ', Transaction: ', transaction_id, ', User: ', user_pseudo_id) as details
FROM 
  orphaned_refunds

ORDER BY 
  validation_type, 
  event_name,
  CASE 
    WHEN status LIKE 'ERROR%' THEN 1
    WHEN status LIKE 'WARNING%' THEN 2
    ELSE 3
  END;

-- Additional query: Hourly event distribution to detect anomalies
-- Uncomment to include in your monitoring

/*
SELECT 
  DATE(TIMESTAMP_MICROS(event_timestamp)) as event_date,
  EXTRACT(HOUR FROM TIMESTAMP_MICROS(event_timestamp)) as event_hour,
  event_name,
  COUNT(*) as event_count,
  COUNT(DISTINCT transaction_id) as unique_transactions,
  COUNT(DISTINCT user_pseudo_id) as unique_users,
  SUM(CASE WHEN event_name = 'refund' THEN -ABS((SELECT value.double_value FROM UNNEST(event_params) WHERE key = 'value')) ELSE (SELECT value.double_value FROM UNNEST(event_params) WHERE key = 'value') END) as net_revenue
FROM 
  `{project_id}.{dataset_id}.events_*`
WHERE 
  _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY))
                     AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
  AND event_name IN ('purchase', 'refund', 'premium_purchase')
GROUP BY 
  event_date, event_hour, event_name
ORDER BY 
  event_date DESC, event_hour DESC, event_name;
*/