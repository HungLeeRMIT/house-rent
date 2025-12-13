# RentMate Frontend

React frontend for the RentMate property management system.

## Technology Stack

- **React**: 18.2
- **Vite**: Build tool
- **React Router**: v6 for routing
- **Zustand**: State management
- **Axios**: HTTP client
- **CSS3**: Styling with custom design system

## Prerequisites

- Node.js 20 or later
- npm 9 or later

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── Navbar.jsx
│   │   └── Navbar.css
│   ├── pages/          # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── PropertyList.jsx
│   │   ├── PropertyDetails.jsx
│   │   └── Dashboard.jsx
│   ├── services/       # API services
│   │   └── api.js
│   ├── store/          # State management
│   │   └── authStore.js
│   ├── App.jsx         # Main app component
│   ├── App.css
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## Available Scripts

### Development
```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Proxy Configuration

The Vite config includes a proxy for API requests in development:

```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    }
  }
}
```

## Features

### Authentication
- User registration (Tenant, Landlord, Property Manager)
- Login with JWT token
- Protected routes
- Persistent authentication with localStorage

### Property Management
- Browse available properties
- Advanced search with filters
- Property details view
- Create/edit properties (landlords only)

### Dashboard
- User-specific dashboard
- Quick statistics
- Quick actions based on user role

### Responsive Design
- Mobile-first approach
- Responsive navigation
- Adaptive layouts

## Styling

### CSS Variables
```css
--primary-color: #2563eb
--primary-dark: #1e40af
--secondary-color: #64748b
--success-color: #10b981
--danger-color: #ef4444
--warning-color: #f59e0b
```

### Component Styling
- Each component has its own CSS file
- Global styles in `index.css`
- App-wide styles in `App.css`

## State Management

Using Zustand for lightweight state management:

```javascript
// Auth store example
const { user, token, setAuth, logout } = useAuthStore()
```

## API Integration

### API Service Structure

```javascript
// services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
})

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem('auth-storage')
  if (authStorage) {
    const { state } = JSON.parse(authStorage)
    if (state?.token) {
      config.headers.Authorization = `Bearer ${state.token}`
    }
  }
  return config
})
```

### Making API Calls

```javascript
// Example: Fetch properties
import { propertyAPI } from '../services/api'

const fetchProperties = async () => {
  try {
    const response = await propertyAPI.getAvailable()
    setProperties(response.data)
  } catch (error) {
    console.error('Error:', error)
  }
}
```

## Routing

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/properties` - Property listings
- `/properties/:id` - Property details

### Protected Routes
- `/dashboard` - User dashboard (requires authentication)

## Docker

```bash
# Build image
docker build -t rentmate-frontend .

# Run container
docker run -p 80:80 rentmate-frontend
```

## Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

## Building for Production

```bash
# Create production build
npm run build

# Output will be in dist/ directory
```

### Production Optimization
- Code splitting
- Tree shaking
- Minification
- Asset optimization

## Deployment

### Nginx Configuration

The project includes an `nginx.conf` for production deployment:

```nginx
server {
  listen 80;
  location / {
    try_files $uri $uri/ /index.html;
  }
  location /api {
    proxy_pass http://backend:8080;
  }
}
```

## Performance

### Optimization Tips
1. Use React.memo for expensive components
2. Implement lazy loading for routes
3. Optimize images
4. Use production build
5. Enable gzip compression

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Change port in vite.config.js
   server: {
     port: 3001
   }
   ```

2. **API connection failed**
   - Check backend is running on port 8080
   - Verify proxy configuration
   - Check CORS settings in backend

3. **Build fails**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## Contributing

1. Follow React best practices
2. Use functional components with hooks
3. Keep components small and focused
4. Write meaningful component names
5. Add comments for complex logic
6. Update documentation

## Design System

### Colors
- Primary: Blue (`#2563eb`)
- Secondary: Gray (`#64748b`)
- Success: Green (`#10b981`)
- Danger: Red (`#ef4444`)
- Warning: Orange (`#f59e0b`)

### Typography
- Font Family: System fonts
- Base Size: 14px
- Headings: Bold, scaled sizes

### Spacing
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px

## Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

## Future Enhancements

- [ ] Add real-time messaging with WebSocket
- [ ] Implement file upload for property images
- [ ] Add payment gateway integration
- [ ] Implement advanced analytics
- [ ] Add multi-language support
- [ ] Implement dark mode

