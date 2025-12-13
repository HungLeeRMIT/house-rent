# Demo Data Seeder

This document describes the demo data that will be automatically seeded when you start the application.

## Overview

The `DataSeeder` component automatically creates demo users and properties when the application starts **only if the database is empty**. This provides realistic test data for demonstrating the property search and filtering features.

## Demo Users

### Landlords (4 users)
- **landlord1** - John Smith (john.smith@rentmate.com)
- **landlord2** - Sarah Jones (sarah.jones@rentmate.com)
- **landlord3** - Mike Wilson (mike.wilson@rentmate.com)
- **landlord4** - Emily Brown (emily.brown@rentmate.com)

### Tenants (2 users)
- **tenant1** - Alice Martin (alice.martin@rentmate.com)
- **tenant2** - Bob Taylor (bob.taylor@rentmate.com)

### Login Credentials
- **Username**: Any of the usernames above (landlord1, landlord2, tenant1, etc.)
- **Password**: `DemoPass123!@#`

> **Note**: The password meets all security requirements (12+ characters, uppercase, lowercase, number, special character)

## Demo Properties (20 properties)

The seeder creates 20 diverse properties across multiple cities and states:

### Locations
- **Boston, MA** (3 properties)
- **New York, NY** (3 properties - Manhattan, Brooklyn, Queens)
- **San Francisco, CA** (3 properties)
- **Seattle, WA** (3 properties - Seattle, Bellevue)
- **Austin, TX** (2 properties)
- **Chicago, IL** (2 properties)
- **Portland, OR** (2 properties)
- **Denver, CO** (2 properties)

### Property Types
- **STUDIO** (5 properties)
- **APARTMENT** (8 properties)
- **CONDO** (3 properties)
- **HOUSE** (3 properties)
- **TOWNHOUSE** (2 properties)

### Price Range
- **Low**: $1,400/month (Portland studio)
- **High**: $5,800/month (San Francisco townhouse)
- **Average**: ~$2,500/month

### Bedrooms
- **0 bedrooms** (Studios): 5 properties
- **1 bedroom**: 5 properties
- **2 bedrooms**: 6 properties
- **3 bedrooms**: 3 properties
- **4 bedrooms**: 1 property

### Availability Dates
- **Available now**: Properties available immediately
- **Future dates**: Properties available 7, 14, 21, 30, 45, or 60 days from now

## Testing Search Filters

You can test all the search filters with this demo data:

### Location Filter
- Search "Boston" → 3 properties
- Search "New York" → 3 properties
- Search "San Francisco" → 3 properties
- Search "Seattle" → 3 properties

### Price Range Filter
- Min: $1000, Max: $2000 → Studios and affordable apartments
- Min: $2000, Max: $3000 → Mid-range apartments and condos
- Min: $4000, Max: $6000 → Luxury properties

### Property Type Filter
- Select "STUDIO" → 5 properties
- Select "APARTMENT" → 8 properties
- Select "HOUSE" → 3 properties

### Bedrooms Filter
- Min 2 bedrooms → 10 properties
- Min 3 bedrooms → 4 properties

### Availability Date Filter
- Today's date → Properties available now
- 30 days from now → Properties available now + within 30 days

### Combined Filters
Try combining filters:
- City: "Boston" + Max Price: $3000 → 2 properties
- Property Type: "APARTMENT" + Min Bedrooms: 2 → 6 properties
- State: "CA" + Min Price: $3000 → 1 property

## Resetting Demo Data

If you want to reset and reseed the demo data:

### Option 1: Clear Database Tables
```sql
-- Connect to MySQL
mysql -u root -p

-- Use the database
USE rentmate;

-- Clear tables (in order due to foreign keys)
DELETE FROM properties;
DELETE FROM users;
```

Then restart the application.

### Option 2: Drop and Recreate Database
```sql
DROP DATABASE rentmate;
CREATE DATABASE rentmate;
```

Then restart the application. Hibernate will recreate the schema and the seeder will populate it.

### Option 3: Use Spring Profile
The seeder runs automatically unless you're using the `test` profile. To disable seeding, you can modify the `@Profile` annotation in `DataSeeder.java`.

## Sample API Calls

### Get All Available Properties
```bash
curl http://localhost:8080/api/properties/available
```

### Search Properties
```bash
# Search by city
curl "http://localhost:8080/api/properties/search?city=Boston"

# Search by price range
curl "http://localhost:8080/api/properties/search?minPrice=2000&maxPrice=3000"

# Search by property type
curl "http://localhost:8080/api/properties/search?propertyType=APARTMENT"

# Search by bedrooms
curl "http://localhost:8080/api/properties/search?bedrooms=2"

# Search by availability date
curl "http://localhost:8080/api/properties/search?availableFrom=2024-02-01"

# Combined search
curl "http://localhost:8080/api/properties/search?city=Boston&minPrice=1500&maxPrice=2500&propertyType=APARTMENT&bedrooms=2"
```

### Get Property Details
```bash
curl http://localhost:8080/api/properties/1
```

## Notes

- The seeder only runs if the database is empty (no users exist)
- All passwords are hashed using BCrypt
- Properties are distributed across different landlords
- Availability dates vary to test date filtering
- Property descriptions are realistic and varied

