package com.rentmate.repository;

import com.rentmate.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByLandlordId(Long landlordId);
    
    @Query("SELECT p FROM Property p LEFT JOIN FETCH p.landlord WHERE p.isAvailable = true")
    List<Property> findByIsAvailableTrue();
    
    @Query("SELECT DISTINCT p FROM Property p LEFT JOIN FETCH p.landlord WHERE " +
           "(:landlordId IS NULL OR p.landlord.id = :landlordId) AND " +
           "(:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "(:state IS NULL OR LOWER(p.state) LIKE LOWER(CONCAT('%', :state, '%'))) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:propertyType IS NULL OR p.propertyType = :propertyType) AND " +
           "(:bedrooms IS NULL OR p.bedrooms >= :bedrooms) AND " +
           "(:availableFrom IS NULL OR p.availableFrom IS NULL OR p.availableFrom <= :availableFrom) AND " +
           "(:includeUnavailable = true OR p.isAvailable = true)")
    List<Property> searchProperties(
        @Param("landlordId") Long landlordId,
        @Param("city") String city,
        @Param("state") String state,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("propertyType") Property.PropertyType propertyType,
        @Param("bedrooms") Integer bedrooms,
        @Param("availableFrom") LocalDate availableFrom,
        @Param("includeUnavailable") Boolean includeUnavailable
    );
}

