package com.rentmate.service;

import com.rentmate.model.AuditLog;
import com.rentmate.model.User;
import com.rentmate.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
public class PasswordResetService {

    private static final int TOKEN_LENGTH = 32;
    private static final int TOKEN_VALIDITY_HOURS = 1;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuditService auditService;

    @Transactional
    public boolean requestPasswordReset(String email, HttpServletRequest request) {
        User user = userRepository.findByEmail(email).orElse(null);
        
        // Don't reveal if email exists (security best practice)
        if (user == null) {
            return true; // Return success even if user doesn't exist
        }

        // Generate secure token
        String token = generateSecureToken();
        user.setPasswordResetToken(token);
        user.setPasswordResetTokenExpiry(LocalDateTime.now().plusHours(TOKEN_VALIDITY_HOURS));
        userRepository.save(user);

        // Audit log
        auditService.logAction(user.getId(), user.getUsername(), 
                AuditLog.ActionType.PASSWORD_RESET_REQUEST, AuditLog.Outcome.SUCCESS,
                "Password reset token generated", request);

        // TODO: Send email with reset link
        // For now, we'll return the token in the response (in production, send via email)
        System.out.println("Password reset token for " + email + ": " + token);
        
        return true;
    }

    @Transactional
    public boolean confirmPasswordReset(String token, String newPassword, HttpServletRequest request) {
        User user = userRepository.findByPasswordResetToken(token).orElse(null);
        
        if (user == null) {
            return false;
        }

        // Check if token is expired
        if (user.getPasswordResetTokenExpiry() == null || 
            LocalDateTime.now().isAfter(user.getPasswordResetTokenExpiry())) {
            auditService.logAction(user.getId(), user.getUsername(), 
                    AuditLog.ActionType.PASSWORD_RESET_COMPLETE, AuditLog.Outcome.FAILURE,
                    "Password reset token expired", request);
            return false;
        }

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        user.setFailedLoginAttempts(0); // Reset failed attempts
        user.setAccountLockedUntil(null); // Unlock account if locked
        userRepository.save(user);

        // Audit log
        auditService.logAction(user.getId(), user.getUsername(), 
                AuditLog.ActionType.PASSWORD_RESET_COMPLETE, AuditLog.Outcome.SUCCESS,
                "Password reset completed successfully", request);

        return true;
    }

    private String generateSecureToken() {
        SecureRandom random = new SecureRandom();
        byte[] tokenBytes = new byte[TOKEN_LENGTH];
        random.nextBytes(tokenBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
    }
}

