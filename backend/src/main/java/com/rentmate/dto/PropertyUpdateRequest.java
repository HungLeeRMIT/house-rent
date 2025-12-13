package com.rentmate.dto;

import com.rentmate.model.Property;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyUpdateRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotBlank(message = "Address is required")
    private String address;
    
    @NotBlank(message = "City is required")
    private String city;
    
    @NotBlank(message = "State is required")
    private String state;
    
    private String zipCode;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;
    
    @NotNull(message = "Property type is required")
    private Property.PropertyType propertyType;
    
    private Integer bedrooms;
    
    private Integer bathrooms;
    
    private Integer squareFeet;
    
    @NotNull(message = "Availability date is required")
    private LocalDate availableFrom;
    
    private String mainImageUrl;
    
    private String imageUrls; // Comma-separated URLs
    
    private Boolean isAvailable;
}

