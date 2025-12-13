package com.rentmate.service;

import com.rentmate.model.AuditLog;
import com.rentmate.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Transactional
    public void logAction(Long userId, String username, AuditLog.ActionType actionType, 
                         AuditLog.Outcome outcome, String details, HttpServletRequest request) {
        AuditLog auditLog = AuditLog.builder()
                .userId(userId)
                .username(username)
                .actionType(actionType)
                .outcome(outcome)
                .actionDetails(details)
                .ipAddress(getClientIpAddress(request))
                .userAgent(request != null ? request.getHeader("User-Agent") : null)
                .createdAt(LocalDateTime.now())
                .build();
        
        auditLogRepository.save(auditLog);
    }

    @Transactional
    public void logAction(Long userId, String username, AuditLog.ActionType actionType, 
                         AuditLog.Outcome outcome, String details) {
        logAction(userId, username, actionType, outcome, details, null);
    }

    public Long countFailedLoginAttempts(Long userId, LocalDateTime since) {
        return auditLogRepository.countByUserIdAndActionTypeAndCreatedAtAfter(
                userId, AuditLog.ActionType.LOGIN_FAILURE, since);
    }

    private String getClientIpAddress(HttpServletRequest request) {
        if (request == null) return "unknown";
        
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}

