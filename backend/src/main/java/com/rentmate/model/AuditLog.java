package com.rentmate.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id")
    private Long userId;
    
    @Column(name = "username")
    private String username;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false)
    private ActionType actionType;
    
    @Column(name = "action_details", columnDefinition = "TEXT")
    private String actionDetails;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "outcome", nullable = false)
    private Outcome outcome;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "user_agent")
    private String userAgent;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    public enum ActionType {
        LOGIN_SUCCESS,
        LOGIN_FAILURE,
        LOGOUT,
        PASSWORD_CHANGE,
        PASSWORD_RESET_REQUEST,
        PASSWORD_RESET_COMPLETE,
        ACCOUNT_LOCKED,
        ACCOUNT_UNLOCKED,
        TWO_FACTOR_ENABLED,
        TWO_FACTOR_DISABLED,
        TWO_FACTOR_VERIFIED,
        FILE_UPLOAD,
        FILE_DELETE,
        PERMISSION_DENIED,
        DATA_ACCESS,
        DATA_MODIFICATION,
        PROPERTY_CREATE,
        PROPERTY_UPDATE,
        PROPERTY_DELETE,
        LEASE_CREATE,
        LEASE_UPDATE,
        PAYMENT_RECORDED,
        MAINTENANCE_REQUEST_CREATED,
        MAINTENANCE_REQUEST_UPDATED
    }
    
    public enum Outcome {
        SUCCESS,
        FAILURE,
        DENIED,
        ERROR
    }
}

