#!/bin/bash
# run-after-database-migration.cjs - Test database after migration
echo "🧪 Testing Database After Migration"
echo "==================================="
echo
echo "Running database check..."
node check-database-status.cjs
echo
echo "If you see ✅ Database is ready - proceed to Google Cloud Storage setup!"
echo "If you see ❌ errors - check the SQL migration results in Supabase"
