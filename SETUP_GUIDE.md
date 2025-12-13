# RentMate Setup Guide

Complete step-by-step guide to set up and run the RentMate application.

## 📋 Prerequisites Checklist

Before starting, ensure you have installed:

- [ ] Java Development Kit (JDK) 21 or later
- [ ] Node.js 20 or later
- [ ] MySQL 8.0 or later
- [ ] Docker Desktop (optional, for containerized setup)
- [ ] Git
- [ ] Your favorite IDE (IntelliJ IDEA, VS Code, etc.)

## 🎯 Setup Options

Choose the setup method that works best for you:

1. [Quick Start with Docker](#option-1-quick-start-with-docker) (Recommended)
2. [Manual Setup](#option-2-manual-setup) (For development)
3. [Hybrid Setup](#option-3-hybrid-setup) (MySQL in Docker, apps manual)

---

## Option 1: Quick Start with Docker

**Best for**: Quick demo, testing the complete application

### Steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rentmate.git
   cd rentmate
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Wait for services to start** (approximately 60 seconds)
   ```bash
   # Check status
   docker-compose ps
   
   # View logs
   docker-compose logs -f
   ```

4. **Access the application**
   - Frontend: http://localhost:80
   - Backend API: http://localhost:8080/api
   - MySQL: localhost:3306

5. **Create your first account**
   - Navigate to http://localhost:80
   - Click "Sign Up"
   - Fill in the registration form
   - Choose your role (Tenant, Landlord, or Property Manager)

6. **Stop the application**
   ```bash
   docker-compose down
   
   # To remove all data
   docker-compose down -v
   ```

---

## Option 2: Manual Setup

**Best for**: Active development, debugging, learning the codebase

### Step 1: Database Setup

1. **Start MySQL**
   ```bash
   # macOS (Homebrew)
   brew services start mysql
   
   # Linux
   sudo systemctl start mysql
   
   # Windows
   # Start MySQL from Services or MySQL Workbench
   ```

2. **Create database and user**
   ```bash
   mysql -u root -p
   ```
   
   In MySQL prompt:
   ```sql
   CREATE DATABASE rentmate;
   CREATE USER 'rentmate'@'localhost' IDENTIFIED BY 'rentmate123';
   GRANT ALL PRIVILEGES ON rentmate.* TO 'rentmate'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

3. **Verify connection**
   ```bash
   mysql -u rentmate -prentmate123 rentmate
   ```

### Step 2: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Verify Java version**
   ```bash
   java -version
   # Should show Java 21 or later
   ```

3. **Build the project**
   ```bash
   mvn clean install
   ```

4. **Run the application**
   ```bash
   # Option A: Using Maven
   mvn spring-boot:run
   
   # Option B: Using JAR file
   java -jar target/rentmate-backend-0.0.1-SNAPSHOT.jar
   ```

5. **Verify backend is running**
   ```bash
   curl http://localhost:8080/api/actuator/health
   # Should return: {"status":"UP"}
   ```

### Step 3: Frontend Setup

1. **Open a new terminal and navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Verify Node.js version**
   ```bash
   node -v
   # Should show v20 or later
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open your browser to http://localhost:3000

### Step 4: Test the Application

1. **Register a new user**
   - Click "Sign Up"
   - Fill in the form
   - Choose role: TENANT, LANDLORD, or PROPERTY_MANAGER

2. **Login**
   - Use your credentials to login
   - You'll be redirected to the dashboard

3. **Explore features**
   - Browse properties (no login required)
   - Access dashboard (login required)
   - Test search functionality

---

## Option 3: Hybrid Setup

**Best for**: Frontend development with stable backend, or vice versa

### Setup MySQL with Docker (Development)

```bash
# Start MySQL only
docker-compose -f docker-compose.dev.yml up -d

# MySQL will be available at localhost:3306
```

### Then follow backend and frontend manual steps from Option 2

---

## 🔧 Configuration

### Backend Configuration

Edit `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/rentmate
    username: rentmate
    password: rentmate123
  
server:
  port: 8080

jwt:
  secret: your-secret-key-here
  expiration: 86400000
```

### Frontend Configuration

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 🧪 Testing the Setup

### Backend Tests

```bash
cd backend
mvn test
```

Expected output:
```
[INFO] Tests run: X, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

### Frontend Tests

```bash
cd frontend
npm run test
```

### Integration Test

1. **Backend health check**
   ```bash
   curl http://localhost:8080/api/actuator/health
   ```

2. **Register a user**
   ```bash
   curl -X POST http://localhost:8080/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser",
       "email": "test@example.com",
       "password": "password123",
       "role": "TENANT"
     }'
   ```

3. **Login**
   ```bash
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser",
       "password": "password123"
     }'
   ```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: Port 8080 already in use**
```bash
# Find process using port 8080
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows

# Kill the process or change port in application.yml
```

**Problem: Cannot connect to MySQL**
- Check MySQL is running: `mysql.server status`
- Verify credentials in application.yml
- Check if database exists: `mysql -u root -p -e "SHOW DATABASES;"`

**Problem: Maven build fails**
```bash
# Clear Maven cache and rebuild
mvn clean install -U
```

### Frontend Issues

**Problem: Port 3000 already in use**
```bash
# Change port in vite.config.js
server: {
  port: 3001
}
```

**Problem: Cannot connect to backend**
- Verify backend is running on port 8080
- Check proxy configuration in vite.config.js
- Clear browser cache

**Problem: npm install fails**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Docker Issues

**Problem: Docker containers won't start**
```bash
# Check Docker is running
docker ps

# View logs
docker-compose logs

# Restart Docker Desktop
```

**Problem: Out of disk space**
```bash
# Clean up Docker
docker system prune -a
docker volume prune
```

---

## 📝 Development Workflow

### Daily Development

1. **Start MySQL** (if not using Docker)
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Start Backend** (in one terminal)
   ```bash
   cd backend
   mvn spring-boot:run
   ```

3. **Start Frontend** (in another terminal)
   ```bash
   cd frontend
   npm run dev
   ```

### Before Committing

1. **Run backend tests**
   ```bash
   cd backend
   mvn test
   ```

2. **Run frontend linter**
   ```bash
   cd frontend
   npm run lint
   ```

3. **Build both applications**
   ```bash
   cd backend && mvn clean package
   cd ../frontend && npm run build
   ```

---

## 🚀 Next Steps

After successful setup:

1. ✅ Read the [main README](README.md) for features overview
2. ✅ Check [API Documentation](README.md#api-documentation)
3. ✅ Review [Project Structure](README.md#project-structure)
4. ✅ Explore the codebase
5. ✅ Start developing new features!

---

## 💡 Tips

- Use IntelliJ IDEA for backend development (excellent Spring Boot support)
- Use VS Code for frontend development (excellent React support)
- Keep backend and frontend terminals visible for real-time logs
- Use Docker Desktop dashboard to monitor containers
- Enable hot reload in your IDE for faster development

---

## 📞 Getting Help

If you encounter issues:

1. Check this troubleshooting guide
2. Review the main README
3. Check GitHub Issues
4. Contact the team on Slack/Teams

Happy coding! 🎉

