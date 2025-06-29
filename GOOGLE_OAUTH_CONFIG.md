
# 🚨 URGENT: Google OAuth Configuration Fix

## Critical Issue
**Error**: `oauth2: "invalid_client" "Unauthorized"`
**Impact**: Users cannot sign in with Google at all

## Required Configuration in Supabase Dashboard

### Step 1: Supabase Authentication Settings
**Path**: Authentication → Providers → Google

**Required Settings**:
1. **Client ID**: Must match Google Cloud Console OAuth 2.0 Client ID
2. **Client Secret**: Must match Google Cloud Console OAuth 2.0 Client Secret
3. **Site URL**: `https://preview--amiram.lovable.app`
4. **Redirect URLs**: 
   - `https://preview--amiram.lovable.app/login`
   - `http://localhost:8080/login` (for development)

### Step 2: Google Cloud Console Settings
**Path**: Google Cloud Console → APIs & Services → Credentials

**Required Settings**:
1. **Authorized JavaScript origins**:
   - `https://preview--amiram.lovable.app`
   - `http://localhost:8080` (for development)

2. **Authorized redirect URIs**:
   - `https://llyunioulzfbgqvmeaxq.supabase.co/auth/v1/callback`
   - `https://preview--amiram.lovable.app/login`
   - `http://localhost:8080/login` (for development)

### Step 3: Verification
After configuration, test with:
```javascript
// This should work without "invalid_client" error
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/login`
  }
});
```

## 🔧 Manual Configuration Required
**You must manually configure these settings in:**
1. **Supabase Dashboard** - Authentication settings
2. **Google Cloud Console** - OAuth 2.0 credentials

**This cannot be automated and must be done through the web interfaces.**
