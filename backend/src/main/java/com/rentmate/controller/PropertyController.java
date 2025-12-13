package com.rentmate.controller;

import com.rentmate.dto.PropertyCreateRequest;
import com.rentmate.dto.PropertyDTO;
import com.rentmate.dto.PropertyUpdateRequest;
import com.rentmate.model.AuditLog;
import com.rentmate.model.Property;
import com.rentmate.model.User;
import jakarta.validation.Valid;
import com.rentmate.repository.PropertyRepository;
import com.rentmate.repository.UserRepository;
import com.rentmate.service.AuditService;
import com.rentmate.service.DataIsolationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/properties")
@CrossOrigin(origins = "*")
public class PropertyController {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DataIsolationService dataIsolationService;

    @Autowired
    private AuditService auditService;

    @GetMapping
    public ResponseEntity<List<PropertyDTO>> getAllProperties(Authentication authentication) {
        List<Property> properties;
        if (authentication != null && authentication.isAuthenticated()) {
            User user = userRepository.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            properties = dataIsolationService.getAccessibleProperties(user);
        } else {
            // Public access - only available properties
            properties = propertyRepository.findByIsAvailableTrue();
        }
        List<PropertyDTO> propertyDTOs = properties.stream()
                .map(PropertyDTO::fromEntity)
                .toList();
        return ResponseEntity.ok(propertyDTOs);
    }

    @GetMapping("/available")
    public ResponseEntity<List<PropertyDTO>> getAvailableProperties(Authentication authentication) {
        List<Property> properties;
        if (authentication != null && authentication.isAuthenticated()) {
            User user = userRepository.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            // Apply data isolation - landlords only see their own properties
            properties = dataIsolationService.getAccessibleProperties(user).stream()
                    .filter(Property::getIsAvailable)
                    .toList();
        } else {
            // Public access - only available properties
            properties = propertyRepository.findByIsAvailableTrue();
        }
        List<PropertyDTO> propertyDTOs = properties.stream()
                .map(PropertyDTO::fromEntity)
                .toList();
        return ResponseEntity.ok(propertyDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyDTO> getPropertyById(@PathVariable Long id, 
                                                       Authentication authentication,
                                                       HttpServletRequest request) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        // Apply data isolation for authenticated users
        if (authentication != null && authentication.isAuthenticated()) {
            try {
                User user = userRepository.findByUsername(authentication.getName())
                        .orElseThrow(() -> new RuntimeException("User not found"));
                
                // AC6 - Landlord access limited to owned properties
                if (user.getRole() == User.UserRole.LANDLORD) {
                    dataIsolationService.validateLandlordPropertyAccess(user, id);
                }
                
                auditService.logAction(user.getId(), user.getUsername(), 
                        AuditLog.ActionType.DATA_ACCESS, AuditLog.Outcome.SUCCESS,
                        "Accessed property: " + id, request);
            } catch (AccessDeniedException e) {
                User user = userRepository.findByUsername(authentication.getName())
                        .orElseThrow(() -> new RuntimeException("User not found"));
                auditService.logAction(user.getId(), user.getUsername(), 
                        AuditLog.ActionType.PERMISSION_DENIED, AuditLog.Outcome.DENIED,
                        "Access denied to property: " + id, request);
                throw e;
            }
        }

        // Convert to DTO to include landlord information safely
        PropertyDTO propertyDTO = PropertyDTO.fromEntity(property);
        return ResponseEntity.ok(propertyDTO);
    }

    @GetMapping("/search")
    public ResponseEntity<List<PropertyDTO>> searchProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Property.PropertyType propertyType,
            @RequestParam(required = false) Integer bedrooms,
            @RequestParam(required = false) String availableFrom,
            Authentication authentication) {
        
        LocalDate availableFromDate = null;
        if (availableFrom != null && !availableFrom.isEmpty()) {
            try {
                availableFromDate = LocalDate.parse(availableFrom, DateTimeFormatter.ISO_LOCAL_DATE);
            } catch (Exception e) {
                // Invalid date format, ignore
            }
        }
        
        // Determine landlord filter based on user role
        Long landlordId = null;
        Boolean includeUnavailable = false; // Default: only show available properties
        
        if (authentication != null && authentication.isAuthenticated()) {
            User user = userRepository.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Landlords can only search their own properties (including unlisted ones)
            if (user.getRole() == User.UserRole.LANDLORD) {
                landlordId = user.getId();
                includeUnavailable = true; // Landlords can see their unlisted properties in search
            }
            // Tenants see only available properties they have access to (handled by data isolation)
            // Admins and Property Managers see all available properties (no landlord filter)
        }
        
        List<Property> properties = propertyRepository.searchProperties(
                landlordId, city, state, minPrice, maxPrice, propertyType, bedrooms, 
                availableFromDate, includeUnavailable
        );
        
        // Apply additional data isolation for tenants (they can only see properties they have leases for)
        if (authentication != null && authentication.isAuthenticated()) {
            User user = userRepository.findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (user.getRole() == User.UserRole.TENANT) {
                List<Property> accessibleProperties = dataIsolationService.getAccessibleProperties(user);
                properties = properties.stream()
                        .filter(accessibleProperties::contains)
                        .toList();
            }
        }
        
        // Convert to DTOs to avoid lazy loading issues
        List<PropertyDTO> propertyDTOs = properties.stream()
                .map(PropertyDTO::fromEntity)
                .toList();
        
        return ResponseEntity.ok(propertyDTOs);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN')")
    public ResponseEntity<PropertyDTO> createProperty(@Valid @RequestBody PropertyCreateRequest request, 
                                                      Authentication authentication,
                                                      HttpServletRequest httpRequest) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Property property = Property.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .zipCode(request.getZipCode())
                .price(request.getPrice())
                .propertyType(request.getPropertyType())
                .bedrooms(request.getBedrooms())
                .bathrooms(request.getBathrooms())
                .squareFeet(request.getSquareFeet())
                .availableFrom(request.getAvailableFrom())
                .mainImageUrl(request.getMainImageUrl())
                .imageUrls(request.getImageUrls())
                .isAvailable(true) // New listings are available by default
                .landlord(user)
                .build();
        
        Property savedProperty = propertyRepository.save(property);
        
        // Audit log
        auditService.logAction(user.getId(), user.getUsername(), 
                AuditLog.ActionType.PROPERTY_CREATE, AuditLog.Outcome.SUCCESS,
                "Created property: " + savedProperty.getId(), httpRequest);
        
        PropertyDTO propertyDTO = PropertyDTO.fromEntity(savedProperty);
        return ResponseEntity.status(HttpStatus.CREATED).body(propertyDTO);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN')")
    public ResponseEntity<PropertyDTO> updateProperty(@PathVariable Long id, 
                                                      @Valid @RequestBody PropertyUpdateRequest request,
                                                      Authentication authentication,
                                                      HttpServletRequest httpRequest) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // AC6 - Validate landlord access (TC4 - Unauthorized edit attempt)
        Property property = dataIsolationService.validateLandlordPropertyAccess(user, id);
        
        // Update property fields
        property.setTitle(request.getTitle());
        property.setDescription(request.getDescription());
        property.setAddress(request.getAddress());
        property.setCity(request.getCity());
        property.setState(request.getState());
        property.setZipCode(request.getZipCode());
        property.setPrice(request.getPrice());
        property.setPropertyType(request.getPropertyType());
        property.setBedrooms(request.getBedrooms());
        property.setBathrooms(request.getBathrooms());
        property.setSquareFeet(request.getSquareFeet());
        property.setAvailableFrom(request.getAvailableFrom());
        property.setMainImageUrl(request.getMainImageUrl());
        property.setImageUrls(request.getImageUrls());
        
        // Allow updating availability status
        if (request.getIsAvailable() != null) {
            property.setIsAvailable(request.getIsAvailable());
        }
        
        Property updatedProperty = propertyRepository.save(property);
        
        // Audit log
        auditService.logAction(user.getId(), user.getUsername(), 
                AuditLog.ActionType.PROPERTY_UPDATE, AuditLog.Outcome.SUCCESS,
                "Updated property: " + id, httpRequest);
        
        PropertyDTO propertyDTO = PropertyDTO.fromEntity(updatedProperty);
        return ResponseEntity.ok(propertyDTO);
    }

    @PatchMapping("/{id}/unlist")
    @PreAuthorize("hasAnyRole('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN')")
    public ResponseEntity<PropertyDTO> unlistProperty(@PathVariable Long id,
                                                      Authentication authentication,
                                                      HttpServletRequest httpRequest) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // AC6 - Validate landlord access (TC5 - Unlist hides listing)
        Property property = dataIsolationService.validateLandlordPropertyAccess(user, id);
        
        property.setIsAvailable(false);
        Property updatedProperty = propertyRepository.save(property);
        
        // Audit log
        auditService.logAction(user.getId(), user.getUsername(), 
                AuditLog.ActionType.PROPERTY_UPDATE, AuditLog.Outcome.SUCCESS,
                "Unlisted property: " + id, httpRequest);
        
        PropertyDTO propertyDTO = PropertyDTO.fromEntity(updatedProperty);
        return ResponseEntity.ok(propertyDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('LANDLORD', 'PROPERTY_MANAGER', 'ADMIN')")
    public ResponseEntity<?> deleteProperty(@PathVariable Long id,
                                           Authentication authentication,
                                           HttpServletRequest request) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // AC6 - Validate landlord access
        Property property = dataIsolationService.validateLandlordPropertyAccess(user, id);
        
        propertyRepository.delete(property);
        
        // Audit log
        auditService.logAction(user.getId(), user.getUsername(), 
                AuditLog.ActionType.PROPERTY_DELETE, AuditLog.Outcome.SUCCESS,
                "Deleted property: " + id, request);
        
        return ResponseEntity.ok().build();
    }
}
