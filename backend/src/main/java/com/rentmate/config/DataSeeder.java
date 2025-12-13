package com.rentmate.config;

import com.rentmate.model.Property;
import com.rentmate.model.User;
import com.rentmate.repository.PropertyRepository;
import com.rentmate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
@Profile("!test") // Don't run in test profile
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Strong password that meets requirements: 12+ chars, uppercase, lowercase, number, special char
    private static final String DEMO_PASSWORD = "DemoPass123!@#";

    @Override
    public void run(String... args) {
        // Check if we need to seed
        boolean hasUsers = userRepository.count() > 0;
        boolean hasProperties = propertyRepository.count() > 0;
        
        // Always seed properties if they don't exist
        if (hasProperties) {
            System.out.println("Properties already exist (" + hasProperties + "). Skipping property seed.");
            if (hasUsers) {
                System.out.println("Users already exist. Skipping user seed.");
                return;
            }
        }

        System.out.println("🌱 Seeding demo data...");
        
        // Create users only if they don't exist
        User landlord1, landlord2, landlord3, landlord4;
        User tenant1, tenant2;
        
        if (!hasUsers) {
            // Create landlords
            landlord1 = createUser("landlord1", "john.smith@rentmate.com", "John", "Smith", 
                    "555-0101", User.UserRole.LANDLORD);
            landlord2 = createUser("landlord2", "sarah.jones@rentmate.com", "Sarah", "Jones", 
                    "555-0102", User.UserRole.LANDLORD);
            landlord3 = createUser("landlord3", "mike.wilson@rentmate.com", "Mike", "Wilson", 
                    "555-0103", User.UserRole.LANDLORD);
            landlord4 = createUser("landlord4", "emily.brown@rentmate.com", "Emily", "Brown", 
                    "555-0104", User.UserRole.LANDLORD);

            // Create tenants
            tenant1 = createUser("tenant1", "alice.martin@rentmate.com", "Alice", "Martin", 
                    "555-0201", User.UserRole.TENANT);
            tenant2 = createUser("tenant2", "bob.taylor@rentmate.com", "Bob", "Taylor", 
                    "555-0202", User.UserRole.TENANT);
        } else {
            // Find existing users
            landlord1 = userRepository.findByUsername("landlord1").orElse(null);
            landlord2 = userRepository.findByUsername("landlord2").orElse(null);
            landlord3 = userRepository.findByUsername("landlord3").orElse(null);
            landlord4 = userRepository.findByUsername("landlord4").orElse(null);
            tenant1 = userRepository.findByUsername("tenant1").orElse(null);
            tenant2 = userRepository.findByUsername("tenant2").orElse(null);
            
            // If demo users don't exist, create them
            if (landlord1 == null) landlord1 = createUser("landlord1", "john.smith@rentmate.com", "John", "Smith", "555-0101", User.UserRole.LANDLORD);
            if (landlord2 == null) landlord2 = createUser("landlord2", "sarah.jones@rentmate.com", "Sarah", "Jones", "555-0102", User.UserRole.LANDLORD);
            if (landlord3 == null) landlord3 = createUser("landlord3", "mike.wilson@rentmate.com", "Mike", "Wilson", "555-0103", User.UserRole.LANDLORD);
            if (landlord4 == null) landlord4 = createUser("landlord4", "emily.brown@rentmate.com", "Emily", "Brown", "555-0104", User.UserRole.LANDLORD);
            if (tenant1 == null) tenant1 = createUser("tenant1", "alice.martin@rentmate.com", "Alice", "Martin", "555-0201", User.UserRole.TENANT);
            if (tenant2 == null) tenant2 = createUser("tenant2", "bob.taylor@rentmate.com", "Bob", "Taylor", "555-0202", User.UserRole.TENANT);
        }

        // Create properties with diverse data
        List<Property> properties = Arrays.asList(
            // Boston, MA properties
            createProperty("Cozy Studio in Downtown Boston", 
                "Perfect studio apartment in the heart of Boston. Walking distance to public transport and restaurants.",
                "123 Main St", "Boston", "MA", "02101", new BigDecimal("1800"), 
                Property.PropertyType.STUDIO, 0, 1, 450, landlord1, LocalDate.now()),
            
            createProperty("Modern 2BR Apartment - Back Bay", 
                "Beautiful 2-bedroom apartment in Back Bay with modern amenities. Close to shopping and dining.",
                "456 Beacon St", "Boston", "MA", "02115", new BigDecimal("3200"), 
                Property.PropertyType.APARTMENT, 2, 2, 1200, landlord1, LocalDate.now().plusDays(7)),
            
            createProperty("Spacious 3BR House - Cambridge", 
                "Large family home with backyard. Perfect for families. Near MIT and Harvard.",
                "789 Harvard Ave", "Cambridge", "MA", "02138", new BigDecimal("4500"), 
                Property.PropertyType.HOUSE, 3, 2, 2000, landlord2, LocalDate.now().plusDays(14),
                "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1568605117033-0c0b0a0b0b0b?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1568605117033-0c0b0a0b0b0c?w=800&h=600&fit=crop"),

            // New York, NY properties
            createProperty("Luxury 1BR Condo - Manhattan", 
                "Stunning condo in Upper East Side with city views. High-end finishes throughout.",
                "100 Park Ave", "New York", "NY", "10017", new BigDecimal("4200"), 
                Property.PropertyType.CONDO, 1, 1, 900, landlord2, LocalDate.now()),
            
            createProperty("Charming Studio - Brooklyn", 
                "Affordable studio in trendy Brooklyn neighborhood. Great for young professionals.",
                "200 Atlantic Ave", "Brooklyn", "NY", "11201", new BigDecimal("2200"), 
                Property.PropertyType.STUDIO, 0, 1, 500, landlord3, LocalDate.now().plusDays(30)),
            
            createProperty("Modern 2BR Apartment - Queens", 
                "Newly renovated 2-bedroom with balcony. Close to subway and shopping centers.",
                "300 Queens Blvd", "Queens", "NY", "11101", new BigDecimal("2800"), 
                Property.PropertyType.APARTMENT, 2, 1, 1100, landlord3, LocalDate.now()),

            // San Francisco, CA properties
            createProperty("Stylish 1BR Apartment - Mission District", 
                "Trendy apartment in vibrant Mission District. Walk to cafes, restaurants, and parks.",
                "400 Mission St", "San Francisco", "CA", "94103", new BigDecimal("3500"), 
                Property.PropertyType.APARTMENT, 1, 1, 750, landlord4, LocalDate.now().plusDays(21)),
            
            createProperty("Cozy Studio - North Beach", 
                "Charming studio in historic North Beach. Close to Fisherman's Wharf and Chinatown.",
                "500 Columbus Ave", "San Francisco", "CA", "94133", new BigDecimal("2400"), 
                Property.PropertyType.STUDIO, 0, 1, 500, landlord4, LocalDate.now()),
            
            createProperty("Elegant 3BR Townhouse - Pacific Heights", 
                "Beautiful townhouse with garden. Perfect for families. Stunning views of the bay.",
                "600 Pacific Ave", "San Francisco", "CA", "94117", new BigDecimal("5800"), 
                Property.PropertyType.TOWNHOUSE, 3, 3, 2200, landlord1, LocalDate.now().plusDays(45)),

            // Seattle, WA properties
            createProperty("Modern 2BR Condo - Capitol Hill", 
                "Contemporary condo in hip Capitol Hill. Close to nightlife and restaurants.",
                "700 Broadway Ave", "Seattle", "WA", "98102", new BigDecimal("2900"), 
                Property.PropertyType.CONDO, 2, 2, 1100, landlord2, LocalDate.now()),
            
            createProperty("Spacious 4BR House - Bellevue", 
                "Large family home in Bellevue. Great schools nearby. Large backyard for kids.",
                "800 Bellevue Way", "Bellevue", "WA", "98004", new BigDecimal("4200"), 
                Property.PropertyType.HOUSE, 4, 3, 2500, landlord3, LocalDate.now().plusDays(60),
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1600585154526-990dbe4eb5a3?w=800&h=600&fit=crop"),
            
            createProperty("Affordable 1BR Apartment - Downtown", 
                "Budget-friendly 1-bedroom in downtown Seattle. Close to public transport.",
                "900 3rd Ave", "Seattle", "WA", "98104", new BigDecimal("1800"), 
                Property.PropertyType.APARTMENT, 1, 1, 650, landlord4, LocalDate.now()),

            // Austin, TX properties
            createProperty("Hip 2BR Apartment - East Austin", 
                "Modern apartment in trendy East Austin. Close to music venues and food trucks.",
                "1000 E 6th St", "Austin", "TX", "78702", new BigDecimal("2100"), 
                Property.PropertyType.APARTMENT, 2, 2, 1000, landlord1, LocalDate.now().plusDays(14)),
            
            createProperty("Charming 3BR House - South Austin", 
                "Quaint house with character. Large yard and garage. Pet-friendly neighborhood.",
                "1100 S Lamar Blvd", "Austin", "TX", "78704", new BigDecimal("2800"), 
                Property.PropertyType.HOUSE, 3, 2, 1800, landlord2, LocalDate.now(),
                "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1600047509807-ba8f99d2cddf?w=800&h=600&fit=crop"),

            // Chicago, IL properties
            createProperty("Luxury 1BR Condo - River North", 
                "High-end condo in River North. Floor-to-ceiling windows with city views.",
                "1200 N State St", "Chicago", "IL", "60610", new BigDecimal("2800"), 
                Property.PropertyType.CONDO, 1, 1, 850, landlord3, LocalDate.now().plusDays(7)),
            
            createProperty("Spacious 2BR Apartment - Lincoln Park", 
                "Large 2-bedroom near Lincoln Park. Close to zoo and lakefront.",
                "1300 N Clark St", "Chicago", "IL", "60614", new BigDecimal("2400"), 
                Property.PropertyType.APARTMENT, 2, 1, 1200, landlord4, LocalDate.now()),

            // Portland, OR properties
            createProperty("Cozy Studio - Pearl District", 
                "Small but efficient studio in artsy Pearl District. Walk to galleries and cafes.",
                "1400 NW 11th Ave", "Portland", "OR", "97209", new BigDecimal("1400"), 
                Property.PropertyType.STUDIO, 0, 1, 400, landlord1, LocalDate.now().plusDays(30)),
            
            createProperty("Modern 2BR Townhouse - Alberta Arts", 
                "Contemporary townhouse in Alberta Arts District. Close to restaurants and shops.",
                "1500 NE Alberta St", "Portland", "OR", "97211", new BigDecimal("2200"), 
                Property.PropertyType.TOWNHOUSE, 2, 2, 1300, landlord2, LocalDate.now()),

            // Denver, CO properties
            createProperty("Bright 1BR Apartment - LoDo", 
                "Sunny apartment in Lower Downtown. Close to Coors Field and nightlife.",
                "1600 Wazee St", "Denver", "CO", "80202", new BigDecimal("1900"), 
                Property.PropertyType.APARTMENT, 1, 1, 700, landlord3, LocalDate.now()),
            
            createProperty("Family-Friendly 3BR House - Highlands", 
                "Perfect family home in Highlands. Great schools and parks nearby.",
                "1700 Federal Blvd", "Denver", "CO", "80211", new BigDecimal("3200"), 
                Property.PropertyType.HOUSE, 3, 2, 1900, landlord4, LocalDate.now().plusDays(21),
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop"),

            // Additional houses with images
            createProperty("Modern 5BR Luxury House - Beverly Hills", 
                "Stunning modern home with pool and tennis court. Perfect for luxury living.",
                "1800 Sunset Blvd", "Beverly Hills", "CA", "90210", new BigDecimal("12000"), 
                Property.PropertyType.HOUSE, 5, 4, 4500, landlord1, LocalDate.now(),
                "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1600566753190-17f0baa2a6c4?w=800&h=600&fit=crop"),
            
            createProperty("Classic 4BR Victorian House - San Francisco", 
                "Beautiful Victorian home with original details. Stunning views of the Golden Gate Bridge.",
                "1900 Lombard St", "San Francisco", "CA", "94123", new BigDecimal("8500"), 
                Property.PropertyType.HOUSE, 4, 3, 3200, landlord2, LocalDate.now().plusDays(30),
                "https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1600585154526-990dbe4eb5a3?w=800&h=600&fit=crop"),
            
            createProperty("Rustic 3BR Farmhouse - Napa Valley", 
                "Charming farmhouse on 2 acres. Vineyard views and outdoor entertaining area.",
                "2000 Silverado Trail", "Napa", "CA", "94558", new BigDecimal("5500"), 
                Property.PropertyType.HOUSE, 3, 2, 2400, landlord3, LocalDate.now().plusDays(45),
                "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1600047509807-ba8f99d2cddf?w=800&h=600&fit=crop"),
            
            createProperty("Contemporary 4BR House - Seattle", 
                "Sleek modern design with floor-to-ceiling windows. Stunning mountain views.",
                "2100 Queen Anne Ave", "Seattle", "WA", "98109", new BigDecimal("4800"), 
                Property.PropertyType.HOUSE, 4, 3, 2800, landlord4, LocalDate.now(),
                "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"),
            
            createProperty("Cozy 2BR Cottage - Portland", 
                "Adorable cottage with garden. Perfect for small families or couples.",
                "2200 SE Hawthorne Blvd", "Portland", "OR", "97214", new BigDecimal("2400"), 
                Property.PropertyType.HOUSE, 2, 1, 1200, landlord1, LocalDate.now().plusDays(14),
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop,https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=800&h=600&fit=crop")
        );

        propertyRepository.saveAll(properties);

        System.out.println("✅ Seeded " + properties.size() + " properties");
        if (!hasUsers) {
            System.out.println("✅ Seeded " + (4 + 2) + " users (4 landlords, 2 tenants)");
        }
        System.out.println("🏠 Properties with images: " + properties.stream()
                .filter(p -> p.getMainImageUrl() != null).count() + " houses");
        System.out.println("📝 Demo credentials:");
        System.out.println("   Landlords: landlord1, landlord2, landlord3, landlord4");
        System.out.println("   Tenants: tenant1, tenant2");
        System.out.println("   Password for all: " + DEMO_PASSWORD);
    }

    private User createUser(String username, String email, String firstName, String lastName, 
                           String phoneNumber, User.UserRole role) {
        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(DEMO_PASSWORD))
                .firstName(firstName)
                .lastName(lastName)
                .phoneNumber(phoneNumber)
                .role(role)
                .isActive(true)
                .failedLoginAttempts(0)
                .build();
        return userRepository.save(user);
    }

    private Property createProperty(String title, String description, String address, 
                                   String city, String state, String zipCode, BigDecimal price,
                                   Property.PropertyType propertyType, Integer bedrooms, 
                                   Integer bathrooms, Integer squareFeet, User landlord, 
                                   LocalDate availableFrom) {
        return createProperty(title, description, address, city, state, zipCode, price,
                propertyType, bedrooms, bathrooms, squareFeet, landlord, availableFrom, null, null);
    }

    private Property createProperty(String title, String description, String address, 
                                   String city, String state, String zipCode, BigDecimal price,
                                   Property.PropertyType propertyType, Integer bedrooms, 
                                   Integer bathrooms, Integer squareFeet, User landlord, 
                                   LocalDate availableFrom, String mainImageUrl, String imageUrls) {
        return Property.builder()
                .title(title)
                .description(description)
                .address(address)
                .city(city)
                .state(state)
                .zipCode(zipCode)
                .price(price)
                .propertyType(propertyType)
                .bedrooms(bedrooms)
                .bathrooms(bathrooms)
                .squareFeet(squareFeet)
                .isAvailable(true)
                .availableFrom(availableFrom)
                .mainImageUrl(mainImageUrl)
                .imageUrls(imageUrls)
                .landlord(landlord)
                .build();
    }
}

