# RentMate Security Features Implementation

This document describes the security features implemented according to the user story requirements.

## ✅ Implemented Features

### AC1 - Password Strength Rules Enforced

**Implementation:**
- Custom validator `@StrongPassword` annotation
- Minimum 12 characters required
- Must contain: uppercase, lowercase, number, and special character
- Applied to registration and password reset

**Usage:**
```java
@StrongPassword
private String password;
```

**Files:**
- `validation/StrongPassword.java`
- `validation/StrongPasswordValidator.java`
- `dto/RegisterRequest.java`
- `dto/PasswordResetConfirm.java`

---

### AC2 - Rate-Limited Failed Login Attempts

**Implementation:**
- Tracks failed login attempts per user
- Locks account after 10 failed attempts within 10 minutes
- Automatic unlock after lockout period expires
- Integrated with audit logging

**Configuration:**
- `MAX_FAILED_ATTEMPTS = 10`
- `LOCKOUT_DURATION_MINUTES = 10`

**Files:**
- `service/RateLimitService.java`
- `controller/AuthController.java`
- `model/User.java` (added `failedLoginAttempts` and `accountLockedUntil` fields)

---

### AC3 - Optional 2FA Available

**Implementation:**
- TOTP (Time-based One-Time Password) support
- Compatible with Google Authenticator, Authy, etc.
- Generate secret, enable/disable 2FA
- Verify codes during login

**Endpoints:**
- `POST /api/auth/2fa/generate` - Generate secret and QR code
- `POST /api/auth/2fa/enable` - Enable 2FA (requires verification code)
- `POST /api/auth/2fa/disable` - Disable 2FA
- `POST /api/auth/2fa/verify` - Verify a code

**Files:**
- `service/TwoFactorService.java`
- `controller/TwoFactorController.java`
- `model/User.java` (added `twoFactorEnabled` and `twoFactorSecret` fields)

---

### AC4 - Account Recovery Workflow

**Implementation:**
- Password reset request via email
- Secure token generation (32 bytes, Base64 URL-safe)
- Token expiry (1 hour)
- Identity verification through email
- Password reset confirmation with strong password validation

**Endpoints:**
- `POST /api/auth/password-reset/request` - Request password reset
- `POST /api/auth/password-reset/confirm` - Confirm password reset with token

**Files:**
- `service/PasswordResetService.java`
- `controller/PasswordResetController.java`
- `dto/PasswordResetRequest.java`
- `dto/PasswordResetConfirm.java`
- `model/User.java` (added `passwordResetToken` and `passwordResetTokenExpiry` fields)

**Note:** Email sending is not implemented. Token is currently logged to console. In production, integrate with email service.

---

### AC5 - Tenant Data Isolation

**Implementation:**
- Tenants can only access their own data
- Validation in `DataIsolationService`
- Throws `AccessDeniedException` if tenant tries to access another tenant's data
- Applied to all data access endpoints

**Files:**
- `service/DataIsolationService.java`
- `controller/PropertyController.java` (updated)

**Methods:**
- `validateTenantAccess(User currentUser, Long targetUserId)`
- `getAccessibleProperties(User currentUser)`
- `getAccessibleLeases(User currentUser)`
- `getAccessiblePayments(User currentUser)`
- `getAccessibleMaintenanceRequests(User currentUser)`

---

### AC6 - Landlord Access Limited to Owned Properties

**Implementation:**
- Landlords can only view/modify properties they own
- Validation in `DataIsolationService`
- Applied to property CRUD operations
- Throws `AccessDeniedException` if access denied

**Files:**
- `service/DataIsolationService.java`
- `controller/PropertyController.java` (updated)

**Methods:**
- `validateLandlordPropertyAccess(User currentUser, Long propertyId)`
- `getAccessibleProperties(User currentUser)` - Returns only owned properties for landlords

---

### AC7 - Sensitive Actions Logged

**Implementation:**
- Comprehensive audit logging system
- Logs: timestamp, user ID, username, action type, outcome, IP address, user agent
- Action types include: login, logout, password changes, 2FA, file operations, permission denials, data access/modification

**Action Types:**
- Authentication: `LOGIN_SUCCESS`, `LOGIN_FAILURE`, `LOGOUT`
- Password: `PASSWORD_CHANGE`, `PASSWORD_RESET_REQUEST`, `PASSWORD_RESET_COMPLETE`
- Account: `ACCOUNT_LOCKED`, `ACCOUNT_UNLOCKED`
- 2FA: `TWO_FACTOR_ENABLED`, `TWO_FACTOR_DISABLED`, `TWO_FACTOR_VERIFIED`
- Files: `FILE_UPLOAD`, `FILE_DELETE`
- Access: `PERMISSION_DENIED`, `DATA_ACCESS`, `DATA_MODIFICATION`
- Properties: `PROPERTY_CREATE`, `PROPERTY_UPDATE`, `PROPERTY_DELETE`
- And more...

**Files:**
- `model/AuditLog.java`
- `repository/AuditLogRepository.java`
- `service/AuditService.java`
- Integrated into all controllers

**Query Examples:**
```java
// Get all audit logs for a user
List<AuditLog> logs = auditLogRepository.findByUserId(userId);

// Get failed login attempts in last hour
Long failures = auditService.countFailedLoginAttempts(userId, LocalDateTime.now().minusHours(1));

// Get logs by action type
List<AuditLog> loginLogs = auditLogRepository.findByActionType(AuditLog.ActionType.LOGIN_SUCCESS);
```

---

## Database Schema Updates

### User Table Additions:
- `two_factor_enabled` (BOOLEAN)
- `two_factor_secret` (VARCHAR)
- `failed_login_attempts` (INTEGER)
- `account_locked_until` (DATETIME)
- `password_reset_token` (VARCHAR)
- `password_reset_token_expiry` (DATETIME)

### New Table: audit_logs
- `id` (BIGINT, PRIMARY KEY)
- `user_id` (BIGINT)
- `username` (VARCHAR)
- `action_type` (ENUM)
- `action_details` (TEXT)
- `outcome` (ENUM)
- `ip_address` (VARCHAR)
- `user_agent` (VARCHAR)
- `created_at` (DATETIME)

---

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register (with password strength validation)
- `POST /api/auth/login` - Login (with rate limiting and 2FA check)

### Password Reset
- `POST /api/auth/password-reset/request` - Request password reset
- `POST /api/auth/password-reset/confirm` - Confirm password reset

### Two-Factor Authentication
- `POST /api/auth/2fa/generate` - Generate 2FA secret
- `POST /api/auth/2fa/enable` - Enable 2FA
- `POST /api/auth/2fa/disable` - Disable 2FA
- `POST /api/auth/2fa/verify` - Verify 2FA code

### Properties (with data isolation)
- `GET /api/properties` - Get accessible properties (role-based)
- `GET /api/properties/{id}` - Get property (with access validation)
- `POST /api/properties` - Create property (landlord only, with audit)
- `PUT /api/properties/{id}` - Update property (owner validation, audit)
- `DELETE /api/properties/{id}` - Delete property (owner validation, audit)

---

## Testing Recommendations

1. **Password Strength:**
   - Test with weak passwords (< 12 chars, missing complexity)
   - Test with strong passwords

2. **Rate Limiting:**
   - Attempt 11 failed logins
   - Verify account is locked
   - Wait 10 minutes and verify unlock

3. **2FA:**
   - Generate secret
   - Enable with valid code
   - Try login with 2FA enabled
   - Verify code during login

4. **Password Reset:**
   - Request reset
   - Use token to reset password
   - Verify token expiry

5. **Data Isolation:**
   - Login as tenant, try to access another tenant's data
   - Login as landlord, try to access another landlord's property
   - Verify access denied errors

6. **Audit Logging:**
   - Perform various actions
   - Query audit logs
   - Verify all sensitive actions are logged

---

## Security Best Practices Implemented

✅ Strong password requirements  
✅ Account lockout after failed attempts  
✅ Secure token generation for password reset  
✅ TOTP-based 2FA  
✅ Role-based access control  
✅ Data isolation by role  
✅ Comprehensive audit logging  
✅ IP address and user agent tracking  
✅ Password reset token expiry  

---

## Future Enhancements

- [ ] Email service integration for password reset
- [ ] SMS-based 2FA option
- [ ] Backup codes for 2FA
- [ ] Session management and timeout
- [ ] IP whitelisting for sensitive operations
- [ ] Advanced audit log analytics dashboard
- [ ] Security notifications (email alerts for suspicious activity)

