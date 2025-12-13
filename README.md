# 🏠 RentMate - Smart Rental Property Management System

[![Backend CI/CD](https://github.com/yourusername/rentmate/workflows/Backend%20CI/CD/badge.svg)](https://github.com/yourusername/rentmate/actions)
[![Frontend CI/CD](https://github.com/yourusername/rentmate/workflows/Frontend%20CI/CD/badge.svg)](https://github.com/yourusername/rentmate/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

RentMate is a state-of-the-art property management web application designed to connect landlords, tenants, and property managers in one convenient platform. Whether users are searching for rental properties, managing lease agreements, or tracking payments and maintenance requests, RentMate ensures a seamless rental experience that is transparent, secure, and efficient.

## ✨ Features

### 🔍 Property Listings and Search
- Browse and filter properties by location, price range, property type, and availability
- Landlords can post and update property listings easily
- Advanced search functionality with multiple filters

### 💬 Tenant–Landlord Communication
- Secure in-app messaging for lease discussions
- Maintenance request communications
- General inquiry system

### 💰 Rent Payment Tracking
- Tenants can record payments and view transaction history
- Landlords can track due dates and receive payment notifications
- Simple payment reports generation

### 🔧 Maintenance Request Management
- Tenants can submit repair requests with photos and descriptions
- Landlords/property managers can assign and update request status
- Priority-based request handling

### 📄 Document Management
- Upload and store important rental documents
- Lease agreements, invoices, and receipts storage
- Secure document access control

### 📊 User-Friendly Interface
- Intuitive dashboards for both tenants and landlords
- View all relevant information in one place
- Responsive design for mobile and desktop

## 🛠 Technology Stack

### Backend
- **Language**: Java 21
- **Framework**: Spring Boot 3.2.1
- **Build Tool**: Maven
- **Database**: MySQL 8.0 (H2 for testing)
- **Security**: Spring Security + JWT
- **ORM**: Hibernate/JPA
- **Testing**: JUnit 5

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Styling**: CSS3 with custom design system

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions
- **Version Control**: Git/GitHub

## 🚀 Getting Started

### Prerequisites

- Java 21 or later
- Node.js 20 or later
- MySQL 8.0 or later
- Docker (optional, for containerized deployment)
- Git

### Quick Start with Docker

The easiest way to run the entire application:

```bash
# Clone the repository
git clone https://github.com/yourusername/rentmate.git
cd rentmate

# Start all services with Docker Compose
docker-compose up -d

# Access the application
# Frontend: http://localhost:80
# Backend API: http://localhost:8080/api
# MySQL: localhost:3306
```

### Manual Setup

#### 1. Database Setup

```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE rentmate;
CREATE USER 'rentmate'@'localhost' IDENTIFIED BY 'rentmate123';
GRANT ALL PRIVILEGES ON rentmate.* TO 'rentmate'@'localhost';
FLUSH PRIVILEGES;
exit;
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run

# Or run the JAR file
java -jar target/rentmate-backend-0.0.1-SNAPSHOT.jar
```

The backend will start on `http://localhost:8080`

#### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:3000`

### Development with Docker Compose (MySQL only)

For local development, you can run only MySQL in Docker:

```bash
# Start MySQL for development
docker-compose -f docker-compose.dev.yml up -d

# Run backend and frontend manually (see steps above)
```

## 📁 Project Structure

```
rentmate/
├── backend/                    # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/rentmate/
│   │   │   │       ├── config/       # Configuration classes
│   │   │   │       ├── controller/   # REST controllers
│   │   │   │       ├── dto/          # Data Transfer Objects
│   │   │   │       ├── model/        # JPA entities
│   │   │   │       ├── repository/   # Data repositories
│   │   │   │       ├── security/     # Security components
│   │   │   │       └── service/      # Business logic
│   │   │   └── resources/
│   │   │       └── application.yml   # Configuration
│   │   └── test/                     # Test files
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── store/             # State management
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
├── .github/
│   └── workflows/             # CI/CD workflows
├── docker-compose.yml         # Production Docker Compose
├── docker-compose.dev.yml     # Development Docker Compose
└── README.md
```

## 💻 Development

### Backend Development

```bash
cd backend

# Run tests
mvn test

# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Package application
mvn clean package

# Skip tests during build
mvn clean package -DskipTests
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start dev server with hot reload
npm run dev

# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database Migrations

The application uses Hibernate with `ddl-auto: update` for development. For production, consider using Flyway or Liquibase for managed migrations.

## 🌐 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Property Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/properties` | Get all properties | No |
| GET | `/api/properties/available` | Get available properties | No |
| GET | `/api/properties/{id}` | Get property by ID | No |
| GET | `/api/properties/search` | Search properties | No |
| POST | `/api/properties` | Create property | Yes (Landlord) |
| PUT | `/api/properties/{id}` | Update property | Yes (Landlord) |
| DELETE | `/api/properties/{id}` | Delete property | Yes (Landlord) |

### Example API Requests

#### Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "TENANT"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "password123"
  }'
```

#### Search Properties
```bash
curl -X GET "http://localhost:8080/api/properties/search?city=Boston&minPrice=1000&maxPrice=2000&bedrooms=2"
```

## 🚢 Deployment

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Environment Variables

#### Backend
- `SPRING_PROFILES_ACTIVE`: Application profile (dev, prod)
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_NAME`: Database name
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: JWT signing secret

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

### Integration Tests
```bash
# Run full integration tests with GitHub Actions locally
act -j integration-test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Code Style

### Backend
- Follow Java naming conventions
- Use Lombok for boilerplate reduction
- Write meaningful comments
- Maintain test coverage above 70%

### Frontend
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Use CSS modules or styled components

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Project Manager**: [Your Name]
- **Backend Developer**: [Your Name]
- **Frontend Developer**: [Your Name]
- **DevOps Engineer**: [Your Name]

## 📞 Support

For support, email support@rentmate.com or join our Slack channel.

## 🎓 Acknowledgments

- Spring Boot Documentation
- React Documentation
- Docker Documentation
- GitHub Actions Documentation

---

**Built with ❤️ by the RentMate Team**

