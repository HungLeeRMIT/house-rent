package com.rentmate.service;

import com.rentmate.model.AuditLog;
import com.rentmate.model.User;
import com.rentmate.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class RateLimitService {

    private static final int MAX_FAILED_ATTEMPTS = 10;
    private static final int LOCKOUT_DURATION_MINUTES = 10;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditService auditService;

    @Transactional
    public void recordFailedLoginAttempt(String username, HttpServletRequest request) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return; // Don't reveal if user exists
        }

        user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);

        // Check if we should lock the account
        if (user.getFailedLoginAttempts() >= MAX_FAILED_ATTEMPTS) {
            user.setAccountLockedUntil(LocalDateTime.now().plusMinutes(LOCKOUT_DURATION_MINUTES));
            auditService.logAction(user.getId(), user.getUsername(), 
                    AuditLog.ActionType.ACCOUNT_LOCKED, AuditLog.Outcome.SUCCESS,
                    "Account locked due to " + user.getFailedLoginAttempts() + " failed login attempts", request);
        }

        userRepository.save(user);
    }

    @Transactional
    public void resetFailedLoginAttempts(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user != null && user.getFailedLoginAttempts() > 0) {
            user.setFailedLoginAttempts(0);
            user.setAccountLockedUntil(null);
            userRepository.save(user);
        }
    }

    public boolean isAccountLocked(User user) {
        if (user.getAccountLockedUntil() == null) {
            return false;
        }
        
        if (LocalDateTime.now().isBefore(user.getAccountLockedUntil())) {
            return true;
        }
        
        // Lockout expired, unlock the account
        user.setAccountLockedUntil(null);
        user.setFailedLoginAttempts(0);
        userRepository.save(user);
        return false;
    }
}

