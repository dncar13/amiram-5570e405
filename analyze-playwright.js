#!/usr/bin/env node
// analyze-playwright.js
// usage: node analyze-playwright.js playwright-report.txt

const fs = require('fs');

// --- 1. הגדר תבניות שגיאה עיקריות ---
const CATEGORIES = {
  auth_redirect: {
    pattern: /TimeoutError:.*page\.waitForURL.*login/,
    desc: 'Authentication redirect timeout',
    fix: 'Check Supabase auth redirect & URLs'
  },
  element_missing: {
    pattern: /locator.*not found|toBeVisible.*not found/,
    desc: 'Elements not found on page',
    fix: 'Update selectors or check page loading'
  },
  page_404: {
    pattern: /404.*העמוד לא נמצא/,
    desc: '404 page errors',
    fix: 'Fix routing configuration'
  },
  form_timeout: {
    pattern: /TimeoutError: locator\.(fill|click)/,
    desc: 'Form interaction timeout',
    fix: 'Add waits or update form selectors'
  }
};

// --- 2. קרא את הדוח שהפקת מפליי־רייט ---
const reportPath = process.argv[2];
if (!reportPath) {
  console.error('❌  צריך לציין קובץ דוח: node analyze-playwright.js playwright-report.txt');
  process.exit(1);
}
const reportText = fs.readFileSync(reportPath, 'utf8');

// --- 3. ספור מופעים בכל קטגוריה ---
const summary = {};
for (const [key, cfg] of Object.entries(CATEGORIES)) {
  const matches = reportText.match(cfg.pattern) || [];
  summary[key] = { count: matches.length, ...cfg };
}

// --- 4. הפק דו״ח מקוצר ---
const condensed = {
  totalLines: reportText.split('\n').length,
  summary
};

fs.writeFileSync('condensed-report.json', JSON.stringify(condensed, null, 2));
console.log('✅ נוצר condensed-report.json');
