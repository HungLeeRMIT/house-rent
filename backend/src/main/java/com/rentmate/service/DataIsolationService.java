package com.rentmate.service;

import com.rentmate.model.Lease;
import com.rentmate.model.MaintenanceRequest;
import com.rentmate.model.Payment;
import com.rentmate.model.Property;
import com.rentmate.model.User;
import com.rentmate.repository.LeaseRepository;
import com.rentmate.repository.MaintenanceRequestRepository;
import com.rentmate.repository.PaymentRepository;
import com.rentmate.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DataIsolationService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private LeaseRepository leaseRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private MaintenanceRequestRepository maintenanceRequestRepository;

    /**
     * AC5 - Tenant data isolation
     * Ensures tenants can only access their own data
     */
    public void validateTenantAccess(User currentUser, Long targetUserId) {
        if (currentUser.getRole() == User.UserRole.TENANT && 
            !currentUser.getId().equals(targetUserId)) {
            throw new AccessDeniedException("Access denied: Tenants can only access their own data");
        }
    }

    /**
     * AC6 - Landlord access limited to owned properties
     * Ensures landlords can only access properties they own
     */
    public Property validateLandlordPropertyAccess(User currentUser, Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        if (currentUser.getRole() == User.UserRole.LANDLORD && 
            !property.getLandlord().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Access denied: You can only access properties you own");
        }

        return property;
    }

    public List<Property> getAccessibleProperties(User currentUser) {
        if (currentUser.getRole() == User.UserRole.LANDLORD) {
            return propertyRepository.findByLandlordId(currentUser.getId());
        } else if (currentUser.getRole() == User.UserRole.TENANT) {
            // Tenants can see properties they have leases for
            List<Lease> leases = leaseRepository.findByTenantId(currentUser.getId());
            return leases.stream()
                    .map(Lease::getProperty)
                    .distinct()
                    .toList();
        } else if (currentUser.getRole() == User.UserRole.ADMIN || 
                   currentUser.getRole() == User.UserRole.PROPERTY_MANAGER) {
            // Admins and property managers can see all properties
            return propertyRepository.findAll();
        }
        return List.of();
    }

    public List<Lease> getAccessibleLeases(User currentUser) {
        if (currentUser.getRole() == User.UserRole.TENANT) {
            return leaseRepository.findByTenantId(currentUser.getId());
        } else if (currentUser.getRole() == User.UserRole.LANDLORD) {
            return leaseRepository.findByPropertyLandlordId(currentUser.getId());
        } else if (currentUser.getRole() == User.UserRole.ADMIN || 
                   currentUser.getRole() == User.UserRole.PROPERTY_MANAGER) {
            return leaseRepository.findAll();
        }
        return List.of();
    }

    public List<Payment> getAccessiblePayments(User currentUser) {
        if (currentUser.getRole() == User.UserRole.TENANT) {
            return paymentRepository.findByLeaseTenantId(currentUser.getId());
        } else if (currentUser.getRole() == User.UserRole.LANDLORD) {
            // Landlords see payments for their properties
            List<Lease> leases = leaseRepository.findByPropertyLandlordId(currentUser.getId());
            return leases.stream()
                    .flatMap(lease -> paymentRepository.findByLeaseId(lease.getId()).stream())
                    .toList();
        } else if (currentUser.getRole() == User.UserRole.ADMIN || 
                   currentUser.getRole() == User.UserRole.PROPERTY_MANAGER) {
            return paymentRepository.findAll();
        }
        return List.of();
    }

    public List<MaintenanceRequest> getAccessibleMaintenanceRequests(User currentUser) {
        if (currentUser.getRole() == User.UserRole.TENANT) {
            return maintenanceRequestRepository.findByTenantId(currentUser.getId());
        } else if (currentUser.getRole() == User.UserRole.LANDLORD) {
            return maintenanceRequestRepository.findByPropertyLandlordId(currentUser.getId());
        } else if (currentUser.getRole() == User.UserRole.ADMIN || 
                   currentUser.getRole() == User.UserRole.PROPERTY_MANAGER) {
            return maintenanceRequestRepository.findAll();
        }
        return List.of();
    }
}

