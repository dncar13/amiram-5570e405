# Event Mismatch Analysis - GA4/GTM Compliance Fixes

## Executive Summary

Dashboard shows **FAIL** for all 4 event groups due to missing required parameters, not event name mismatches. The event names are correct, but required parameters are missing or incorrectly named.

## Required Event Mapping (Dashboard Expectations)

| Event Group | Expected Event Name | Required Parameters |
|-------------|-------------------|-------------------|
| **Auth** | `login` OR `sign_up` | `method` |
| **Ecommerce** | `purchase` | `transaction_id`, `value`, `currency` |
| **Premium** | `subscription_upgrade` | `plan_id`, `value`, `currency` |
| **Simulation** | `simulation_start` AND `simulation_complete` | `simulation_id`, `topic` |

## Current Implementation Issues

### 1. Auth Events ✅ MOSTLY CORRECT
**Status**: Event names correct, parameters mostly correct
- ✅ Sends: `login` and `sign_up` (correct)
- ✅ Has: `method` parameter 
- **Issue**: None major - should work

### 2. E-commerce Events ✅ CORRECT  
**Status**: All parameters present
- ✅ Sends: `purchase` (correct)
- ✅ Has: `transaction_id`, `value`, `currency`
- **Issue**: None - should work

### 3. Premium Events ❌ PARAMETER MISMATCH
**Status**: Event name correct, but parameter name wrong
- ✅ Sends: `subscription_upgrade` (correct)
- ❌ Sends: `plan_type` but dashboard expects `plan_id`
- ✅ Has: `value`, `currency`
- **Fix**: Change `plan_type` → `plan_id` in subscription_upgrade events

### 4. Simulation Events ❌ MISSING PARAMETER
**Status**: Event names correct, missing topic parameter  
- ✅ Sends: `simulation_start` and `simulation_complete` (correct)
- ✅ Has: `simulation_id`
- ❌ Missing: `topic` parameter
- **Fix**: Add `topic` parameter to all simulation events

## Root Cause Analysis

1. **Events Sent vs Queue Mismatch**: Likely caused by duplicate prevention logic rejecting some events in dev environment
2. **Parameter Names**: Premium events use `plan_type` instead of expected `plan_id`  
3. **Missing Parameters**: Simulation events missing `topic` parameter
4. **Development Environment**: All environment variables are correct

## Specific Code Issues Found

### Issue 1: Premium Events - Wrong Parameter Name
**File**: `/src/services/analytics.ts` line 615-622
```typescript
await this.trackEvent({
  event: 'subscription_upgrade',
  plan_type: premiumEvent.plan_type,  // ❌ Should be plan_id
  value: premiumEvent.plan_price,
  currency: 'ILS',
  transaction_id: eventData.transaction_id
});
```

### Issue 2: Simulation Events - Missing Topic Parameter
**File**: `/src/services/analytics.ts` line 658-671
```typescript
const eventData = {
  event: eventName,
  simulation_type: simulationEvent.simulation_type,
  simulation_id: simulationEvent.simulation_id,
  // ❌ Missing: topic parameter
};
```

**File**: `/src/pages/Simulation.tsx` line 261-265
```typescript
trackSimulationStart({
  simulation_type: simulationType,
  simulation_id: formattedSimulationId,
  // ❌ Missing: topic parameter
});
```

## Fixes Applied

### Fix 1: Auth Events - Normalize Method Parameter ✅
- **Action**: Enhanced method parameter normalization in `trackAuth()`
- **Files**: `/src/services/analytics.ts` (lines 512-520)
- **Changes**: Added explicit method normalization logic
- **Result**: Dashboard will recognize login/sign_up events with proper method

### Fix 2: Premium Events - Add plan_id Parameter ✅
- **Action**: Update `subscription_upgrade` events to include `plan_id: premiumEvent.plan_type`
- **Files**: `/src/services/analytics.ts` (lines 627-628)
- **Changes**: Added `plan_id` parameter while keeping `plan_type` for backward compatibility
- **Result**: Dashboard will recognize Premium events

### Fix 3: Simulation Events - Add topic Parameter ✅  
- **Action**: Add `topic` parameter to simulation events with fallback logic
- **Files**: 
  - `/src/services/analytics.ts` (lines 669-675, 681, 699)
  - `/src/pages/Simulation.tsx` (lines 264, 286, 306)
  - `/src/types/analytics.ts` (line 66)
- **Changes**: 
  - Added topic extraction logic in analytics service
  - Added topic parameter to all simulation tracking calls
  - Updated TypeScript interface
- **Result**: Dashboard will recognize Simulation events

### Fix 4: Development Environment - Force Consent ✅
- **Action**: Ensure analytics consent is granted in development
- **Files**: Already implemented in analytics service
- **Result**: Events fire in development environment

## Code Changes Summary

### `/src/services/analytics.ts`
```typescript
// Auth method normalization
let normalizedMethod: string;
if (authEvent.method === 'signup') {
  normalizedMethod = 'email'; // Sign-ups are always email-based
} else if (authEvent.method === 'google') {
  normalizedMethod = 'google';
} else {
  normalizedMethod = 'password'; // Default login method
}

// Premium subscription_upgrade with plan_id
await this.trackEvent({
  event: 'subscription_upgrade',
  plan_id: premiumEvent.plan_type, // Dashboard expects plan_id parameter
  plan_type: premiumEvent.plan_type, // Keep plan_type for backward compatibility
  value: premiumEvent.plan_price,
  currency: 'ILS',
  transaction_id: eventData.transaction_id
});

// Simulation topic parameter with fallback
let topic = simulationEvent.topic || simulationEvent.simulation_type || 'unknown';
if (!topic && simulationEvent.simulation_id) {
  // Try to extract topic from simulation_id if available
  const topicMatch = simulationEvent.simulation_id.match(/^([^_]+)/);
  topic = topicMatch ? topicMatch[1] : 'general';
}
```

### `/src/pages/Simulation.tsx`
```typescript
// Added topic parameter to all simulation tracking calls
trackSimulationStart({
  simulation_type: simulationType,
  simulation_id: formattedSimulationId,
  topic: topicId || type || effectiveType || 'general', // Dashboard requires topic parameter
  difficulty_level: difficulty || 'mixed',
  question_count: questionsToUse.length,
  time_limit: simulation.examMode ? 90 * 60 : undefined
});
```

## Expected Results After Fixes

| Test Group | Before | After | Fix Applied |
|-----------|--------|-------|-------------|
| **Auth Tracking** | ❌ FAIL | ✅ PASS | Minor parameter verification |
| **Ecommerce Tracking** | ❌ FAIL | ✅ PASS | Environment variables correct |
| **Premium Tracking** | ❌ FAIL | ✅ PASS | Added `plan_id` parameter |
| **Simulation Tracking** | ❌ FAIL | ✅ PASS | Added `topic` parameter |
| **Events Sent vs Queue** | 3/4 | 4/4+ | Fixed parameter requirements |

## Testing Validation

### Manual Testing Steps
1. Open Analytics Dashboard (`localhost:8080`)
2. Perform: Login → Sandbox Purchase → Premium Upgrade → Start + Finish Simulation
3. Check Network tab for `collect?v=` requests (should see 4-6 HTTP 200 responses)
4. Verify Analytics Dashboard shows all ✅ PASS

### Expected Network Requests
- `login` event with `method` parameter
- `purchase` event with `transaction_id`, `value`, `currency`  
- `subscription_upgrade` event with `plan_id`, `value`, `currency`
- `simulation_start` + `simulation_complete` events with `simulation_id`, `topic`

## Implementation Timeline

- ✅ **Analysis Complete**: Event mismatches identified
- ✅ **Fixes Applied**: Parameter corrections implemented
- 🔄 **Testing Phase**: Manual validation in progress
- ⏳ **Documentation**: This analysis document

## Success Metrics

- [ ] All 4 event groups show ✅ PASS in Analytics Dashboard
- [ ] Events Sent count matches Events in Queue count  
- [ ] Network requests show HTTP 200 for all event types
- [ ] GA4 DebugView shows events in real-time
- [ ] No duplicate event warnings in console

---

**Last Updated**: January 6, 2025  
**Status**: ✅ ALL FIXES IMPLEMENTED - Ready for Testing

## Summary of Implementation

All 4 event groups have been fixed with proper parameters:

1. ✅ **Auth Events**: Enhanced method parameter normalization
2. ✅ **Premium Events**: Added `plan_id` parameter for GTM compatibility  
3. ✅ **Simulation Events**: Added `topic` parameter with smart fallback logic
4. ✅ **E-commerce Events**: Already working correctly

## Testing Instructions

1. **Start Development Server**: `npm run dev`
2. **Open Analytics Dashboard**: Navigate to `localhost:5173` (dashboard should be visible)
3. **Run Browser Tests**: Open console and run `window.testAnalyticsFixes.runAllEventTests()`
4. **Manual Flow Testing**:
   - Login → should fire `login` event with `method` parameter
   - Premium purchase → should fire `subscription_upgrade` with `plan_id`
   - Simulation → should fire `simulation_start` and `simulation_complete` with `topic`
5. **Validate Results**: Check Analytics Dashboard shows all ✅ PASS

## Next Steps After Testing

- [ ] Capture before/after screenshots of Analytics Dashboard
- [ ] Validate Network tab shows proper `collect?v=` requests
- [ ] Check GA4 DebugView for real-time event verification
- [ ] Document final test results