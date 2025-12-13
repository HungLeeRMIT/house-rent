package com.rentmate.repository;

import com.rentmate.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByLeaseId(Long leaseId);
    List<Payment> findByLeaseTenantId(Long tenantId);
    List<Payment> findByStatus(Payment.PaymentStatus status);
}

