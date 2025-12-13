package com.rentmate.repository;

import com.rentmate.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByUserId(Long userId);
    List<AuditLog> findByActionType(AuditLog.ActionType actionType);
    List<AuditLog> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<AuditLog> findByUserIdAndCreatedAtBetween(Long userId, LocalDateTime start, LocalDateTime end);
    Long countByUserIdAndActionTypeAndCreatedAtAfter(Long userId, AuditLog.ActionType actionType, LocalDateTime after);
}

