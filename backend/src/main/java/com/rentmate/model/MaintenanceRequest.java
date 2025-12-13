package com.rentmate.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private User tenant;
    
    @NotBlank
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status;
    
    @Column(name = "photo_url")
    private String photoUrl;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(columnDefinition = "TEXT")
    private String resolutionNotes;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum Priority {
        LOW,
        MEDIUM,
        HIGH,
        URGENT
    }
    
    public enum RequestStatus {
        SUBMITTED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }
}

