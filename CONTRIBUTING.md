# Contributing to RentMate

First off, thank you for considering contributing to RentMate! It's people like you that make RentMate such a great tool.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Style Guidelines](#style-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/rentmate.git`
3. Add upstream remote: `git remote add upstream https://github.com/original/rentmate.git`
4. Create a branch: `git checkout -b feature/your-feature-name`

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, Java version, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case**: Why is this enhancement needed?
- **Proposed solution**
- **Alternative solutions** you've considered

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:
- `good first issue` - Simple issues perfect for beginners
- `help wanted` - Issues that need attention

### Pull Requests

1. Follow the [style guidelines](#style-guidelines)
2. Write meaningful commit messages
3. Update documentation as needed
4. Add tests for new features
5. Ensure all tests pass
6. Update the README if needed

## Style Guidelines

### Java/Spring Boot Code Style

```java
// Use meaningful variable names
String propertyTitle = "Cozy Apartment";  // Good
String pt = "Cozy Apartment";             // Bad

// Use Lombok annotations
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Property {
    private Long id;
    private String title;
}

// Follow REST naming conventions
@GetMapping("/properties")           // Good
@GetMapping("/getProperties")        // Bad

// Use proper exception handling
try {
    propertyService.save(property);
} catch (Exception e) {
    log.error("Error saving property", e);
    throw new ServiceException("Failed to save property", e);
}
```

### React/JavaScript Code Style

```javascript
// Use functional components with hooks
function PropertyCard({ property }) {  // Good
  const [loading, setLoading] = useState(false)
  // ...
}

// Use meaningful component names
export default PropertyCard  // Good
export default PC           // Bad

// Use async/await for promises
const fetchData = async () => {
  try {
    const response = await api.get('/properties')
    setData(response.data)
  } catch (error) {
    console.error('Error:', error)
  }
}

// Use destructuring
const { id, title, price } = property  // Good
const id = property.id                 // Less preferred
```

### CSS Style

```css
/* Use meaningful class names */
.property-card { }      /* Good */
.pc { }                 /* Bad */

/* Use CSS variables for colors */
color: var(--primary-color);  /* Good */
color: #2563eb;                /* Less preferred */

/* Mobile-first approach */
.container {
  padding: 16px;
}

@media (min-width: 768px) {
  .container {
    padding: 24px;
  }
}
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(backend): add payment tracking endpoint

Add new REST endpoint to track rent payments
- Create Payment entity and repository
- Implement PaymentService
- Add PaymentController with CRUD operations
- Add unit tests

Closes #123
```

```
fix(frontend): resolve login form validation issue

Fixed issue where email validation was not working properly
on the login form. Updated regex pattern to match valid emails.

Fixes #456
```

## Pull Request Process

1. **Update your fork**
   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write code
   - Add tests
   - Update documentation

4. **Test your changes**
   ```bash
   # Backend
   cd backend && mvn test
   
   # Frontend
   cd frontend && npm test
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**
   - Go to GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Link related issues

### PR Checklist

Before submitting your PR, ensure:

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] Commit messages follow guidelines
- [ ] PR description clearly describes changes
- [ ] Related issues are linked

## Development Workflow

### Backend Development

```bash
# Run in development mode
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Run tests
mvn test

# Run specific test
mvn test -Dtest=PropertyServiceTest

# Check code coverage
mvn test jacoco:report
```

### Frontend Development

```bash
# Start dev server
cd frontend
npm run dev

# Run linter
npm run lint

# Fix linting issues
npm run lint --fix

# Build for production
npm run build
```

## Testing

### Backend Tests

```java
@Test
void shouldCreateProperty() {
    // Given
    Property property = Property.builder()
        .title("Test Property")
        .price(new BigDecimal("1000"))
        .build();
    
    // When
    Property saved = propertyRepository.save(property);
    
    // Then
    assertNotNull(saved.getId());
    assertEquals("Test Property", saved.getTitle());
}
```

### Frontend Tests

```javascript
test('renders property card', () => {
  const property = {
    id: 1,
    title: 'Test Property',
    price: 1000
  }
  
  render(<PropertyCard property={property} />)
  
  expect(screen.getByText('Test Property')).toBeInTheDocument()
  expect(screen.getByText('$1000/month')).toBeInTheDocument()
})
```

## Documentation

- Update README.md for major changes
- Add JSDoc comments for complex functions
- Update API documentation for new endpoints
- Include setup instructions for new dependencies

## Questions?

Feel free to:
- Open an issue for discussion
- Contact maintainers
- Join our community chat

Thank you for contributing to RentMate! 🎉

