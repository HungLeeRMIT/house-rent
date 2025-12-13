# RentMate Backend

Spring Boot backend for the RentMate property management system.

## Technology Stack

- **Java**: 21
- **Spring Boot**: 3.2.1
- **Spring Security**: JWT-based authentication
- **Spring Data JPA**: Database access
- **MySQL**: Production database
- **H2**: Testing database
- **Maven**: Build tool
- **Lombok**: Reduce boilerplate code

## Prerequisites

- JDK 21 or later
- Maven 3.6 or later
- MySQL 8.0 or later

## Getting Started

### Database Setup

```sql
CREATE DATABASE rentmate;
CREATE USER 'rentmate'@'localhost' IDENTIFIED BY 'rentmate123';
GRANT ALL PRIVILEGES ON rentmate.* TO 'rentmate'@'localhost';
FLUSH PRIVILEGES;
```

### Running the Application

```bash
# Development mode
mvn spring-boot:run

# With specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Build JAR
mvn clean package

# Run JAR
java -jar target/rentmate-backend-0.0.1-SNAPSHOT.jar
```

## Configuration

### Application Profiles

- `application.yml` - Default configuration
- `application-dev.yml` - Development configuration
- `application-prod.yml` - Production configuration
- `application-test.yml` - Testing configuration

### Environment Variables

```bash
export SPRING_PROFILES_ACTIVE=dev
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=rentmate
export DB_USERNAME=rentmate
export DB_PASSWORD=rentmate123
export JWT_SECRET=your-secret-key
```

## API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "1234567890",
  "role": "TENANT"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "role": "TENANT"
}
```

### Protected Endpoints

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-token>
```

## Testing

```bash
# Run all tests
mvn test

# Run specific test
mvn test -Dtest=UserRepositoryTest

# Run with coverage
mvn test jacoco:report

# Skip tests
mvn clean install -DskipTests
```

## Database Schema

### Main Entities

- **User**: System users (tenants, landlords, property managers)
- **Property**: Rental properties
- **Lease**: Lease agreements
- **Payment**: Rent payments
- **MaintenanceRequest**: Maintenance and repair requests
- **Document**: Uploaded documents
- **Message**: In-app messages

## Security

- JWT-based authentication
- Password encryption using BCrypt
- Role-based access control (RBAC)
- CORS configuration for frontend integration

## Error Handling

The API returns standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Docker

```bash
# Build image
docker build -t rentmate-backend .

# Run container
docker run -p 8080:8080 \
  -e DB_HOST=mysql \
  -e DB_PASSWORD=password \
  rentmate-backend
```

## Development Tips

### Hot Reload with Spring Boot DevTools

Add to `pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

### Debugging

```bash
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Change port in application.yml
   server:
     port: 8081
   ```

2. **Database connection failed**
   - Check MySQL is running
   - Verify credentials in application.yml
   - Ensure database exists

3. **Build fails**
   ```bash
   # Clean and rebuild
   mvn clean install -U
   ```

## Contributing

1. Follow Java naming conventions
2. Use Lombok annotations
3. Write unit tests for new features
4. Update API documentation
5. Follow REST best practices

