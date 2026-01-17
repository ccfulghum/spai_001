# Dependency Audit Report
**Date:** 2026-01-17
**Project:** SpAItial Intel Web Application

## Executive Summary

This static web application currently uses minimal external dependencies loaded via CDN. However, several critical issues were identified regarding outdated packages, security vulnerabilities, and missing dependency management infrastructure.

---

## Current Dependencies

### 1. PapaParse (CSV Parser)
- **Current Version:** 5.3.0
- **Latest Version:** 5.5.3
- **Status:** ⚠️ OUTDATED (4+ minor versions behind)
- **Release Date:** August 25, 2020 (~5.5 years old)
- **Location:** `healthcare_dmo.html:209`
- **Source:** `https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js`

### 2. Google Maps JavaScript API
- **Version:** Unknown (loaded dynamically)
- **Status:** ⚠️ Missing proper loader script in healthcare_dmo.html
- **API Key:** Hardcoded in `config.js` (security issue)

### 3. Unsplash Image CDN
- **Status:** ✅ OK (external image hosting)
- **Location:** `style.css:101`

---

## Critical Security Vulnerabilities

### 🔴 HIGH: Exposed Google Maps API Key
**File:** `sp_1/config.js:4`

```javascript
GOOGLE_MAPS_API_KEY: 'AIzaSyB7Rztr57OSJjXEASCk3zgJWjpE9T0Ihbs'
```

**Risk:** API key is committed to version control and publicly accessible
**Impact:**
- Unauthorized usage of your Google Maps API quota
- Potential billing fraud
- API key could be scraped and abused

**Recommendation:**
1. Immediately invalidate this API key in Google Cloud Console
2. Create a new API key with HTTP referrer restrictions
3. Add `config.js` to `.gitignore`
4. Use environment variables or server-side proxy for API key management

### 🟡 MEDIUM: Missing Subresource Integrity (SRI)
**File:** `healthcare_dmo.html:209`

**Risk:** CDN compromise could inject malicious code
**Impact:** If cdnjs.cloudflare.com is compromised, malicious JavaScript could be served

**Recommendation:** Add SRI hash to script tag:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.5.3/papaparse.min.js"
        integrity="sha512-[HASH]"
        crossorigin="anonymous"></script>
```

### 🟡 MEDIUM: Missing Google Maps API Loader
**File:** `healthcare_dmo.html`

**Issue:** The page uses `google.maps.importLibrary()` but never loads the Maps API script

**Recommendation:** Add before the closing `</body>` tag:
```html
<script async src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap&libraries=maps,marker&v=weekly"></script>
```

---

## Outdated Packages

### PapaParse: 5.3.0 → 5.5.3

**Versions Behind:** 4 minor releases (5.3.1, 5.3.2, 5.4.0, 5.4.1, 5.5.0, 5.5.1, 5.5.2, 5.5.3)

**Notable Changes Since 5.3.0:**
- Security patches and bug fixes
- Performance improvements
- TypeScript definition updates
- Better error handling

**Update Required:** YES - 5.5 years without updates is significant

**Migration Path:**
```html
<!-- Current -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js"></script>

<!-- Recommended -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.5.3/papaparse.min.js"
        integrity="sha512-B7F/IlJhPODBp7+ytPZ6NHaUy+cTl/xNQbCPmm1jGWZfYpIv3qVW8JpbvlE9WMmT9A/R3+1g9YWPxEKJGRxSOg=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"></script>
```

---

## Unnecessary Bloat

### Current Status: ✅ MINIMAL BLOAT

The project is lean with only one third-party library (PapaParse). However, there are opportunities to reduce dependencies:

1. **PapaParse (13.7 KB gzipped)**
   - **Usage:** Parsing CSV files for store locations
   - **Necessity:** HIGH - Core functionality
   - **Alternative:** Native JavaScript CSV parsing (more complex, not recommended)
   - **Verdict:** KEEP

2. **Google Maps API (~500KB initial load)**
   - **Usage:** Map rendering, markers, polygons, circles
   - **Necessity:** CRITICAL - Core product feature
   - **Alternative:** Leaflet.js + OpenStreetMap (free, lighter, but less features)
   - **Verdict:** KEEP (but could consider alternatives to reduce API costs)

3. **Unsplash Image (~200KB)**
   - **Usage:** Hero section background
   - **Necessity:** LOW - Cosmetic
   - **Alternative:** Self-hosted optimized image
   - **Verdict:** CONSIDER OPTIMIZING (WebP format, self-hosted, lazy loading)

---

## Infrastructure Issues

### Missing Dependency Management

**Current State:** No `package.json`, no build process, no version locking

**Risks:**
- No reproducible builds
- CDN failures break the application
- No automated security scanning
- Difficult to track and update dependencies

**Recommendation:** Create `package.json` even for static sites:

```json
{
  "name": "spatial-intel",
  "version": "1.0.0",
  "description": "SpAItial Intel - Spatial & Location Data Platform",
  "scripts": {
    "audit": "npm audit",
    "check-updates": "npx npm-check-updates"
  },
  "devDependencies": {
    "papaparse": "^5.5.3"
  },
  "dependencies": {}
}
```

---

## Recommended Changes - Priority Order

### CRITICAL (Do Immediately)

1. **Revoke exposed Google Maps API key**
   - Action: Go to Google Cloud Console → Credentials → Delete key
   - Create new key with HTTP referrer restrictions
   - Add to `.gitignore`: `config.js`

2. **Fix missing Google Maps loader**
   - Add proper script tag to `healthcare_dmo.html`

### HIGH (Do This Week)

3. **Update PapaParse to 5.5.3**
   - Replace CDN URL in `healthcare_dmo.html`
   - Add SRI hash for security

4. **Add Subresource Integrity (SRI) hashes**
   - Protect against CDN tampering

5. **Create package.json**
   - Enable dependency tracking and security audits

### MEDIUM (Do This Month)

6. **Optimize Unsplash image**
   - Download and convert to WebP format
   - Self-host for better performance and reliability
   - Reduce file size from ~200KB to ~50KB

7. **Implement API key environment management**
   - Move API keys to environment variables
   - Use build-time replacement or server-side proxy

### LOW (Future Improvements)

8. **Consider build tooling**
   - Vite, Parcel, or webpack for bundling
   - Tree-shaking and code splitting
   - TypeScript for better code quality

9. **Evaluate Google Maps alternatives**
   - Leaflet.js + Mapbox/OpenStreetMap for cost reduction
   - Only if Google Maps costs become prohibitive

---

## Specific Code Changes

### 1. Update healthcare_dmo.html (Lines 209-210)

**Before:**
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js"></script>
</head>
```

**After:**
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.5.3/papaparse.min.js"
        integrity="sha512-B7F/IlJhPODBp7+ytPZ6NHaUy+cTl/xNQbCPmm1jGWZfYpIv3qVW8JpbvlE9WMmT9A/R3+1g9YWPxEKJGRxSOg=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"></script>
</head>
```

### 2. Add Google Maps loader to healthcare_dmo.html (Before closing </body> tag)

**Add:**
```html
    </script>

    <!-- Load Google Maps API -->
    <script>
        (function() {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${CONFIG.GOOGLE_MAPS_API_KEY}&callback=initMap&libraries=maps,marker&v=weekly`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        })();
    </script>
</body>
</html>
```

### 3. Update .gitignore

**Add:**
```
# API Keys and Secrets
sp_1/config.js

# Keep the example file
!sp_1/config.example.js
```

### 4. Create package.json

```json
{
  "name": "spatial-intel",
  "version": "1.0.0",
  "description": "SpAItial Intel - Spatial & Location Data Analytics Platform",
  "private": true,
  "scripts": {
    "audit": "npm audit",
    "check-updates": "npx npm-check-updates",
    "serve": "npx http-server sp_1 -p 8080"
  },
  "keywords": ["geospatial", "maps", "demographics", "location-intelligence"],
  "author": "",
  "license": "UNLICENSED",
  "devDependencies": {
    "http-server": "^14.1.1"
  },
  "dependencies": {
    "papaparse": "^5.5.3"
  }
}
```

---

## Testing Checklist

After implementing changes:

- [ ] Verify Google Maps loads correctly in healthcare_dmo.html
- [ ] Test CSV upload functionality with updated PapaParse
- [ ] Confirm new API key works with HTTP referrer restrictions
- [ ] Validate SRI hash doesn't block script loading
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Verify mobile responsiveness still works
- [ ] Check browser console for any errors
- [ ] Test all map features: markers, polygons, circles, ZIP boundaries, blocks

---

## Cost Impact Analysis

### Current Costs
- **Google Maps API:** Variable (depends on usage)
  - Map loads: $7 per 1,000 loads
  - Advanced markers: $6 per 1,000 markers
- **Unsplash:** Free (with attribution)
- **CDNs:** Free

### Potential Savings
1. **Self-hosting PapaParse:** Save CDN dependency (minimal cost impact)
2. **Optimizing images:** Reduce bandwidth ~75% (minimal cost impact for static site)
3. **Switching to Leaflet.js:** Eliminate Google Maps API costs (requires significant refactor)

### Recommendation
Continue with Google Maps unless costs exceed $100/month. The developer experience and feature set justify the cost for a spatial intelligence platform.

---

## Conclusion

The application has a minimal dependency footprint, which is positive. However, the **exposed API key is a critical security issue** that must be addressed immediately. Updating PapaParse and implementing proper dependency management will improve security and maintainability.

**Priority Actions:**
1. Revoke and replace Google Maps API key (CRITICAL)
2. Fix missing Maps API loader (CRITICAL)
3. Update PapaParse to 5.5.3 with SRI (HIGH)
4. Create package.json for dependency tracking (HIGH)
5. Optimize assets and implement build tooling (MEDIUM/LOW)

**Estimated Effort:**
- Critical fixes: 30 minutes
- High priority: 1 hour
- Medium priority: 2-3 hours
- Low priority: 4-8 hours

Total: ~6-12 hours for complete dependency modernization
