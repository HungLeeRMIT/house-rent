package com.rentmate.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
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
@Table(name = "properties")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @NotBlank
    @Column(nullable = false)
    private String address;
    
    @NotBlank
    private String city;
    
    @NotBlank
    private String state;
    
    @Column(name = "zip_code")
    private String zipCode;
    
    @NotNull
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal price;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "property_type", nullable = false)
    private PropertyType propertyType;
    
    private Integer bedrooms;
    
    private Integer bathrooms;
    
    @Column(name = "square_feet")
    private Integer squareFeet;
    
    @Column(name = "is_available")
    private Boolean isAvailable = true;
    
    @Column(name = "available_from")
    private LocalDate availableFrom;
    
    @Column(name = "main_image_url")
    private String mainImageUrl;
    
    @Column(name = "image_urls", columnDefinition = "TEXT")
    private String imageUrls; // JSON array of image URLs stored as comma-separated or JSON
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "landlord_id", nullable = false)
    private User landlord;
    
    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL)
    private Set<Lease> leases = new HashSet<>();
    
    @OneToMany(mappedBy = "property", cascade = CascadeType.ALL)
    private Set<MaintenanceRequest> maintenanceRequests = new HashSet<>();
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum PropertyType {
        APARTMENT,
        HOUSE,
        CONDO,
        TOWNHOUSE,
        STUDIO,
        OTHER
    }
}

