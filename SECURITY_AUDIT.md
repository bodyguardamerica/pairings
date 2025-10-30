# Security Audit Report - Pairings Project

**Date:** October 2025  
**Focus:** Code review for obvious security flaws

---

## ✅ Good Security Practices Found

### 1. Authentication & Authorization
- ✅ JWT-based authentication with token verification
- ✅ Role-based access control (Player, TO, Admin)
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ Proper token validation with expiration checking
- ✅ Authorization middleware properly checks user roles

### 2. Input Validation
- ✅ Express-validator used for request validation
- ✅ Email normalization in registration
- ✅ Password complexity requirements enforced
- ✅ Username character restrictions
- ✅ Content filtering for profanity/hate speech
- ✅ SQL parameterized queries (prevents SQL injection)

### 3. Security Headers & Protection
- ✅ Helmet.js for security headers
- ✅ CORS configured with specific allowed origins
- ✅ Rate limiting implemented (100 req/min default)
- ✅ HTTPS for database connections (SSL)

### 4. Database Security
- ✅ Parameterized queries throughout (prevents SQL injection)
- ✅ Connection pooling with limits
- ✅ Environment variables for sensitive data
- ✅ Database credentials in .env (not hardcoded)

---

## ⚠️ Security Issues Found

### 1. CRITICAL: Missing JWT Secret Validation
**File:** `backend/src/utils/jwt.js`  
**Issue:** While there's a check for JWT_SECRET, if it's missing the app exits. However, the secret should be strong enough.

```javascript
// Current: Exits if missing, but no strength validation
if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET is not set in environment variables');
  process.exit(1);
}
```

**Recommendation:**
- Ensure JWT_SECRET is at least 32 characters long
- Add check: `if (JWT_SECRET.length < 32) throw new Error('JWT_SECRET too weak')`

---

### 2. MEDIUM: No Brute Force Protection on Login
**File:** `backend/src/core/auth/authController.js`  
**Issue:** Login endpoint has no specific rate limiting beyond the general API rate limit. This makes it vulnerable to brute force attacks.

**Current:** Uses general rate limiter (100 req/min)

**Recommendation:**
```javascript
// Add specific rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: 'Too many login attempts, please try again later.'
});

// Apply to login route
router.post('/login', loginLimiter, authController.login);
```

---

### 3. MEDIUM: User Enumeration Vulnerability
**File:** `backend/src/core/auth/authController.js:102-107`  
**Issue:** Login returns the same error message whether the user exists or not, BUT the registration endpoint reveals if a user exists before checking password.

**Current:**
```javascript
// Line 23-26: Registration checks for existing user
// Returns 409 with "User with this email or username already exists"

// Line 102-107: Login returns same error for non-existent user or wrong password
// BUT timing might differ
```

**Recommendation:**
- ✅ Login currently gives same error (good!)
- ⚠️ Registration clearly enumerates users
- Consider: Add email verification before revealing account exists

---

### 4. MEDIUM: No Account Lockout
**File:** `backend/src/core/auth/authController.js`  
**Issue:** No account lockout after multiple failed login attempts. An attacker could keep trying passwords indefinitely (up to rate limit).

**Recommendation:**
```javascript
// Add account lockout table
// Track failed login attempts
// Lock account after X failed attempts
// Require email verification or admin unlock
```

---

### 5. MEDIUM: Weak Rate Limiting on Admin Endpoints
**File:** `backend/src/server.js:29-34`  
**Issue:** Admin endpoints use the same rate limiting as regular users. Admin actions should be more restricted.

**Current:** 100 requests per minute for all routes

**Recommendation:**
```javascript
// Add stricter rate limiting for admin routes
const adminLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 20, // Much lower for admin endpoints
});
app.use('/api/admin/', adminLimiter);
```

---

### 6. MEDIUM: Error Messages Leak Information
**File:** Multiple files  
**Issue:** Some error messages in development mode might reveal stack traces or sensitive information.

**Current:** `backend/src/server.js:82-88`
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
```

**Recommendation:**
- ✅ Development only stack traces (good!)
- ⚠️ Ensure production never shows stack traces
- Consider: More generic error messages in production

---

### 7. LOW: No Request Size Limits
**File:** `backend/src/server.js:25-26`  
**Issue:** No explicit limits on request body size. Could allow DoS via large JSON payloads.

**Current:**
```javascript
app.use(express.json()); // Default limit is 100kb
app.use(express.urlencoded({ extended: true })); // Default limit is 100kb
```

**Recommendation:**
```javascript
app.use(express.json({ limit: '1mb' })); // Explicitly set limits
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
```

---

### 8. LOW: No CSRF Protection
**File:** Not implemented  
**Issue:** No CSRF tokens or protection mechanisms implemented.

**Note:** Less critical for API-only backend, but should be considered if adding cookie-based auth.

**Recommendation:**
- For API-only (JWT): CSRF is less critical
- If adding cookie sessions: Implement CSRF protection

---

### 9. LOW: Password Reset Not Implemented
**File:** Not implemented  
**Issue:** Login validation exists but password reset flow not implemented.

**Current:** See `authController.js:215-222` - loginValidation only checks for presence

**Recommendation:**
```javascript
// Add password reset flow
// Use secure tokens with expiration
// Send email with reset link
// Verify token before allowing password change
```

---

### 10. LOW: No Audit Logging
**File:** Not implemented  
**Issue:** No logging of sensitive actions (admin operations, role changes, password changes).

**Recommendation:**
```javascript
// Log all admin actions
// Log role changes
// Log security events
// Store in separate audit_log table
```

---

## 🔒 Additional Security Recommendations

### 1. Add HSTS Headers
```javascript
// In server.js
app.use(helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true
}));
```

### 2. Content Security Policy
```javascript
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    scriptSrc: ["'self'"],
    imgSrc: ["'self'", "data:", "https:"],
  }
}));
```

### 3. Database Query Timeout
```javascript
// In database.js
const pool = new Pool({
  // ... existing config
  query_timeout: 10000, // 10 second query timeout
});
```

### 4. Sensitive Data in Logs
**Issue:** Ensure passwords/hashes are never logged

**Current:** ✅ Passwords not logged in registration/login  
**Recommendation:** Review all console.log statements to ensure no sensitive data

---

## ✅ Security Measures Already in Place

1. ✅ SQL Injection Protection (parameterized queries)
2. ✅ XSS Protection (Helmet.js)
3. ✅ Rate Limiting
4. ✅ CORS Configuration
5. ✅ Password Hashing (bcrypt)
6. ✅ JWT Authentication
7. ✅ Role-Based Access Control
8. ✅ Input Validation (express-validator)
9. ✅ Content Filtering (profanity/hate speech)
10. ✅ Secure Headers (Helmet)

---

## Priority Fixes

### Immediate (Critical):
1. ⚠️ Add stronger JWT secret validation
2. ⚠️ Add brute force protection to login endpoint
3. ⚠️ Add request size limits

### Soon (Medium):
4. Add account lockout after failed attempts
5. Stricter rate limiting for admin endpoints
6. Implement password reset flow
7. Add audit logging for sensitive operations

### Future (Low):
8. CSRF protection (if needed)
9. Enhanced error message sanitization
10. Request timeout configuration

---

## Overall Security Assessment

**Grade: B+**

**Strengths:**
- Solid foundation with parameterized queries, JWT auth, rate limiting
- Good input validation practices
- Security headers implemented
- Password hashing properly implemented

**Weaknesses:**
- No brute force protection on login
- Missing account lockout mechanism
- No audit logging
- Weak error handling in some cases

**Recommendation:** Address the critical and medium issues before production deployment. Current security is good for development but needs hardening for production.

---

**Audited By:** Code review automation  
**Last Updated:** October 2025



