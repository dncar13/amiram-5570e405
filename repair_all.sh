#!/bin/bash

# רשימת כל מזהי המיגרציות שהמערכת דרשה לתקן:
reverted_ids=(
  20250709045514
  20250709045809
  20250709045914
  20250709050238
  20250710122017
  20250713061854
  20250713080433
  20250714082826
  20250714104929
  20250715071542
  20250715072215
  20250715102359
  20250719100642
  20250720060056
  20250720063911
  20250720065052
  20250720110851
  20250720111628
  20250721032601
  20250724105825
  20250724111414
  20250726032023
  20250726041057
  20250726043516
  20250726045122
  20250726052804
  20250728091049
  20250730074116
  20250730095047
  20250730095150
  20250730095311
  20250804083839
)

applied_ids=(
  20250713061857
  20250713080337
  20250713080438
  20250714082834
  20250714104933
  20250714
  20250715071546
  20250715102408
  20250715192224
  20250719100648
  20250720060100
  20250720063915
  20250720065057
  20250720110857
  20250720111632
  20250721032606
  20250721120000
  20250724105829
  20250724111419
  20250726152029
  20250726161103
  20250726163440
  20250726163520
  20250726165130
  20250726172810
  20250728120000
  20250728140000
  20250730074123
  20250730094909
  20250730094944
  20250730095026
  20250730095053
  20250730095155
  20250730095229
  20250730095316
  20250730095351
  20250804083848
  20250804120000
  20250805120000
  20250805120001
)

echo "🔧 Starting Supabase migration repair process..."
echo "⏳ This may take a few minutes..."
echo ""

echo "📋 Running reverted repairs..."
for id in "${reverted_ids[@]}"
do
  echo "🔄 supabase migration repair --status reverted $id"
  supabase migration repair --status reverted $id
  if [ $? -eq 0 ]; then
    echo "✅ Successfully repaired reverted migration: $id"
  else
    echo "❌ Failed to repair reverted migration: $id"
  fi
  echo ""
done

echo "📋 Running applied repairs..."
for id in "${applied_ids[@]}"
do
  echo "🔄 supabase migration repair --status applied $id"
  supabase migration repair --status applied $id
  if [ $? -eq 0 ]; then
    echo "✅ Successfully repaired applied migration: $id"
  else
    echo "❌ Failed to repair applied migration: $id"
  fi
  echo ""
done

echo "🎉 Migration repair process completed!"
echo ""
echo "📝 Next steps:"
echo "1️⃣  supabase db pull"
echo "2️⃣  supabase db push"
echo ""
echo "✨ Run these commands to sync your database:"
echo "   supabase db pull && supabase db push"
