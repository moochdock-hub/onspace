# Contributing Guide

Thank you for considering contributing to this project! This guide will help you get started.

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm installed
- Git for version control
- Code editor (VS Code recommended)

### Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd components

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Initialize git hooks
pnpm run prepare

# Start development server
pnpm start
```

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `fix/*` - Bug fixes
- `chore/*` - Maintenance tasks

### Making Changes

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow the coding standards
   - Add tests for new features
   - Update documentation as needed

3. **Test your changes**
   ```bash
   # Run tests
   pnpm test
   
   # Type check
   pnpm run type-check
   
   # Format code
   pnpm run format
   
   # Lint code
   pnpm run lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push and create pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Coding Standards

### TypeScript

- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid `any` types where possible
- Use strict mode settings

```typescript
// Good
interface UserProps {
  name: string;
  age: number;
}

// Bad
const user: any = { name: 'John', age: 30 };
```

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Include trailing commas
- Use semicolons
- Max line length: 100 characters

Prettier will automatically format your code when you save.

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_ITEMS`)
- **Types/Interfaces**: PascalCase (`UserData`)

```typescript
// Components
export const UserProfile: React.FC<Props> = () => { };

// Utilities
export function formatDate(date: Date): string { }

// Constants
export const API_TIMEOUT = 5000;

// Types
export interface UserData {
  id: string;
  name: string;
}
```

### File Organization

```
component/
├── ComponentName.tsx       # Main component
├── ComponentName.test.tsx  # Tests
├── ComponentName.styles.ts # Styles (if separate)
├── types.ts               # Component-specific types
└── index.ts               # Public exports
```

### Component Structure

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { validateInput } from '../utils/validation';
import { logInfo } from '../utils/logger';

interface Props {
  title: string;
  onPress?: () => void;
}

export const MyComponent: React.FC<Props> = ({ title, onPress }) => {
  // Hooks first
  const [state, setState] = React.useState('');

  // Effects
  React.useEffect(() => {
    logInfo('Component mounted');
  }, []);

  // Event handlers
  const handlePress = () => {
    if (onPress) onPress();
  };

  // Render
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
};
```

## Testing

### Writing Tests

- Write tests for all new features
- Test edge cases and error conditions
- Use descriptive test names
- Aim for good coverage

```typescript
describe('UserProfile', () => {
  it('should render user name correctly', () => {
    const { getByText } = render(<UserProfile name="John" />);
    expect(getByText('John')).toBeTruthy();
  });

  it('should handle missing data gracefully', () => {
    const { getByText } = render(<UserProfile name="" />);
    expect(getByText('Anonymous')).toBeTruthy();
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## Documentation

### Code Documentation

- Add JSDoc comments for functions and components
- Explain complex logic
- Document parameters and return values

```typescript
/**
 * Validates user input and sanitizes data
 * @param input - The input string to validate
 * @returns Validation result with sanitized input
 * @throws {ValidationError} If input is invalid
 */
export function validateInput(input: string): ValidationResult {
  // Implementation
}
```

### README Updates

- Update README when adding features
- Include usage examples
- Document environment variables
- Keep troubleshooting section current

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat: add user authentication
fix: resolve crash on startup
docs: update installation instructions
style: format code with prettier
refactor: simplify validation logic
test: add tests for analysis engine
chore: update dependencies
```

## Pull Request Process

1. **Create descriptive PR**
   - Clear title and description
   - Link related issues
   - List changes made
   - Include screenshots if UI changes

2. **PR Checklist**
   - [ ] Tests pass
   - [ ] Code is formatted
   - [ ] Types are correct
   - [ ] Documentation updated
   - [ ] No console errors
   - [ ] Reviewed own changes

3. **Review Process**
   - Address review comments
   - Keep discussions professional
   - Update based on feedback

4. **Merge Requirements**
   - All checks pass
   - Approved by reviewer
   - No merge conflicts
   - Up to date with base branch

## Best Practices

### Performance

- Avoid unnecessary re-renders
- Use React.memo for expensive components
- Implement proper list virtualization
- Optimize images and assets

### Security

- Validate all user input
- Sanitize data before display
- Never commit secrets
- Use environment variables
- Keep dependencies updated

### Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation
- Test with screen readers

### Error Handling

- Use try-catch for async operations
- Log errors appropriately
- Provide user-friendly messages
- Don't expose sensitive data

```typescript
try {
  await performOperation();
} catch (error) {
  logError('Operation failed', error as Error);
  showUserMessage('An error occurred. Please try again.');
}
```

## Common Issues

### Installation Problems

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Type Errors

```bash
# Regenerate types
pnpm run type-check
```

### Test Failures

```bash
# Clear test cache
pnpm test --clearCache
```

## Getting Help

- Check existing issues
- Read documentation
- Ask in discussions
- Contact maintainers

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn
- Follow project guidelines

## Recognition

Contributors will be recognized in:
- README contributors section
- Release notes
- Project credits

Thank you for contributing! 🎉
