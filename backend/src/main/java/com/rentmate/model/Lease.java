package com.rentmate.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "leases")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lease {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private User tenant;
    
    @NotNull
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @NotNull
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;
    
    @NotNull
    @Column(name = "monthly_rent", precision = 10, scale = 2, nullable = false)
    private BigDecimal monthlyRent;
    
    @Column(name = "security_deposit", precision = 10, scale = 2)
    private BigDecimal securityDeposit;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeaseStatus status;
    
    @Column(name = "payment_due_day")
    private Integer paymentDueDay;
    
    @Column(columnDefinition = "TEXT")
    private String terms;
    
    @OneToMany(mappedBy = "lease", cascade = CascadeType.ALL)
    private Set<Payment> payments = new HashSet<>();
    
    @OneToMany(mappedBy = "lease", cascade = CascadeType.ALL)
    private Set<Document> documents = new HashSet<>();
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum LeaseStatus {
        PENDING,
        ACTIVE,
        EXPIRED,
        TERMINATED
    }
}

