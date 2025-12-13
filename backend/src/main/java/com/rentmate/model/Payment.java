package com.rentmate.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lease_id", nullable = false)
    private Lease lease;
    
    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @NotNull
    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;
    
    @NotNull
    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;
    
    @Column(name = "transaction_id")
    private String transactionId;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    public enum PaymentStatus {
        PENDING,
        COMPLETED,
        FAILED,
        REFUNDED
    }
    
    public enum PaymentMethod {
        CASH,
        CHECK,
        BANK_TRANSFER,
        CREDIT_CARD,
        DEBIT_CARD,
        ONLINE_PAYMENT
    }
}

