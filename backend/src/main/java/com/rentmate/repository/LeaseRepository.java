package com.rentmate.repository;

import com.rentmate.model.Lease;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaseRepository extends JpaRepository<Lease, Long> {
    List<Lease> findByTenantId(Long tenantId);
    List<Lease> findByPropertyId(Long propertyId);
    List<Lease> findByPropertyLandlordId(Long landlordId);
    List<Lease> findByStatus(Lease.LeaseStatus status);
}

