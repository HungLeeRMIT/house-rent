package com.rentmate.repository;

import com.rentmate.model.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByPropertyId(Long propertyId);
    List<MaintenanceRequest> findByTenantId(Long tenantId);
    List<MaintenanceRequest> findByPropertyLandlordId(Long landlordId);
    List<MaintenanceRequest> findByStatus(MaintenanceRequest.RequestStatus status);
    List<MaintenanceRequest> findByAssignedToId(Long assignedToId);
}

