package com.rentmate.dto;

import com.rentmate.model.Property;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropertyDTO {
    private Long id;
    private String title;
    private String description;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private BigDecimal price;
    private Property.PropertyType propertyType;
    private Integer bedrooms;
    private Integer bathrooms;
    private Integer squareFeet;
    private Boolean isAvailable;
    private LocalDate availableFrom;
    private String mainImageUrl;
    private String imageUrls; // JSON array or comma-separated URLs
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Landlord information
    private Long landlordId;
    private String landlordName;
    private String landlordEmail;
    private String landlordPhone;

    public static PropertyDTO fromEntity(Property property) {
        PropertyDTO dto = PropertyDTO.builder()
                .id(property.getId())
                .title(property.getTitle())
                .description(property.getDescription())
                .address(property.getAddress())
                .city(property.getCity())
                .state(property.getState())
                .zipCode(property.getZipCode())
                .price(property.getPrice())
                .propertyType(property.getPropertyType())
                .bedrooms(property.getBedrooms())
                .bathrooms(property.getBathrooms())
                .squareFeet(property.getSquareFeet())
                .isAvailable(property.getIsAvailable())
                .availableFrom(property.getAvailableFrom())
                .mainImageUrl(property.getMainImageUrl())
                .imageUrls(property.getImageUrls())
                .createdAt(property.getCreatedAt())
                .updatedAt(property.getUpdatedAt())
                .build();

        // Include landlord information if available
        if (property.getLandlord() != null) {
            dto.setLandlordId(property.getLandlord().getId());
            String firstName = property.getLandlord().getFirstName() != null ? property.getLandlord().getFirstName() : "";
            String lastName = property.getLandlord().getLastName() != null ? property.getLandlord().getLastName() : "";
            String fullName = (firstName + " " + lastName).trim();
            if (fullName.isEmpty()) {
                dto.setLandlordName(property.getLandlord().getUsername());
            } else {
                dto.setLandlordName(fullName);
            }
            dto.setLandlordEmail(property.getLandlord().getEmail());
            dto.setLandlordPhone(property.getLandlord().getPhoneNumber());
        }

        return dto;
    }
}

