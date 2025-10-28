# Architecture Overview

## Project Structure

```
/workspaces/components/
├── app/                      # Expo Router pages
│   ├── (tabs)/              # Tab-based navigation
│   ├── audit.tsx            # Main audit interface
│   ├── disclaimer.tsx       # User disclaimer
│   ├── history.tsx          # Audit history
│   ├── results.tsx          # Analysis results
│   └── index.tsx            # Entry point
├── components/              # Reusable UI components
│   ├── AnalysisSection.tsx  # Analysis result sections
│   ├── ErrorBoundary.tsx    # Error handling component
│   ├── HighlightedText.tsx  # Text with glow effects
│   ├── TechHeader.tsx       # Styled header component
│   └── TerminalText.tsx     # Terminal-style text
├── constants/               # App constants and themes
│   ├── Colors.ts            # Color definitions
│   └── theme.ts             # Theme configuration
├── hooks/                   # Custom React hooks
│   ├── useColorScheme.ts    # Color scheme hook
│   └── useThemeColor.ts     # Theme color hook
├── providers/               # React Context providers
│   └── AuditProvider.tsx    # Audit state management
├── supabase/                # Supabase Edge Functions
│   └── functions/
│       └── ego-auditor-analysis/
│           └── index.ts     # AI analysis endpoint
├── types/                   # TypeScript type definitions
│   └── audit.ts             # Audit-related types
└── utils/                   # Utility functions
    ├── aiPromptTemplate.ts  # AI system prompt
    ├── analysisEngine.ts    # Core analysis logic
    ├── logger.ts            # Logging utility
    └── validation.ts        # Input validation

```

## Core Components

### 1. Analysis Engine (`utils/analysisEngine.ts`)

The heart of the application, responsible for:
- Narrative analysis
- Crisis detection
- AI integration via Supabase Edge Functions
- Fallback analysis when API is unavailable
- Input validation and sanitization
- Comprehensive logging

**Key Features:**
- Singleton pattern for consistent state
- Validates and sanitizes all inputs
- Logs all operations for debugging
- Graceful degradation with fallback analysis
- Crisis detection with immediate intervention protocols

### 2. Validation System (`utils/validation.ts`)

Ensures data integrity and security:
- Input validation using Zod schemas
- XSS prevention through sanitization
- Environment variable validation
- Comprehensive error messages

**Security Features:**
- HTML tag removal
- JavaScript protocol blocking
- Event handler stripping
- Length constraints (10-10,000 characters)

### 3. Logging System (`utils/logger.ts`)

Structured logging for debugging and monitoring:
- Multiple log levels (DEBUG, INFO, WARN, ERROR)
- Contextual information capture
- Log storage and export
- Configurable output

**Benefits:**
- Easy debugging in development
- Production error tracking
- Performance monitoring
- Audit trails

### 4. Error Boundary (`components/ErrorBoundary.tsx`)

React error handling:
- Catches component errors
- Prevents app crashes
- User-friendly error display
- Error logging integration
- Recovery mechanism

## Data Flow

```
User Input (Narrative)
    ↓
Validation & Sanitization
    ↓
Analysis Engine
    ↓
Supabase Edge Function
    ↓
OpenAI API (gpt-4o)
    ↓
Response Transformation
    ↓
UI Display (AnalysisSection)
```

### Error Handling Flow

```
Error Occurs
    ↓
Logger.error() called
    ↓
Error Boundary catches (if React error)
    ↓
Fallback UI or Analysis shown
    ↓
User can retry or continue
```

## State Management

### Context Providers

**AuditProvider** manages global audit state:
- Current session
- Session history
- Analysis state
- User preferences

### Local State

Components use React hooks for local state:
- `useState` for simple state
- `useCallback` for memoized functions
- `useMemo` for expensive calculations

## API Integration

### Supabase Edge Function

Located at: `supabase/functions/ego-auditor-analysis/index.ts`

**Responsibilities:**
- Secure API key management
- OpenAI API integration
- Crisis detection
- Response formatting
- CORS handling

**Security:**
- API keys stored server-side only
- Input validation
- Rate limiting (recommended to add)
- Request sanitization

## Testing Strategy

### Unit Tests
- `utils/__tests__/analysisEngine.test.ts`: Core logic testing
- `components/__tests__/AnalysisSection.test.tsx`: Component testing

### Test Coverage Goals
- Critical paths: 100%
- Utils: 90%+
- Components: 80%+
- Integration: Key user flows

## Performance Considerations

### Optimization Techniques
1. **Memoization**: Using React.memo for expensive components
2. **Lazy Loading**: Components loaded on demand
3. **Request Caching**: Previous analyses cached locally
4. **Debouncing**: Input validation debounced
5. **Virtual Lists**: For long session history

### Bundle Size
- Code splitting with Expo Router
- Tree shaking for unused code
- Compressed assets
- Lazy imports for heavy dependencies

## Security

### Client-Side
- Input validation and sanitization
- XSS prevention
- No sensitive data in client code
- Secure storage for user preferences

### Server-Side (Edge Function)
- API key protection
- Request validation
- Crisis detection
- Error handling without information leakage

### Best Practices
- Environment variables for secrets
- HTTPS only
- Content Security Policy
- Regular dependency updates

## Deployment

### Environment Setup
```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Initialize git hooks
pnpm run prepare

# Run tests
pnpm test

# Type check
pnpm run type-check

# Format code
pnpm run format
```

### Production Checklist
- [ ] Environment variables configured
- [ ] Edge function deployed
- [ ] API rate limits set
- [ ] Error tracking configured
- [ ] Analytics setup
- [ ] Performance monitoring
- [ ] Security audit completed
- [ ] Tests passing
- [ ] Documentation updated

## Future Enhancements

### High Priority
1. Rate limiting implementation
2. Offline support with IndexedDB
3. Analytics integration
4. Error tracking (Sentry)
5. Performance monitoring

### Medium Priority
1. A/B testing framework
2. Feature flags
3. Advanced caching strategies
4. GraphQL migration
5. Real-time updates

### Low Priority
1. Theming system
2. Internationalization
3. Accessibility improvements
4. Advanced animations
5. PWA support

## Troubleshooting

### Common Issues

**TypeScript Errors**
- Run `pnpm run type-check`
- Check tsconfig.json paths
- Ensure dependencies are installed

**API Connection Issues**
- Verify environment variables
- Check Supabase Edge Function logs
- Test connection with `testConnection()`

**Build Errors**
- Clear cache: `expo start -c`
- Delete node_modules and reinstall
- Check for dependency conflicts

**Runtime Errors**
- Check Error Boundary logs
- Review logger output
- Verify input validation

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## Support

For issues and questions:
- Check [FAQ](./FAQ.md)
- Review error logs
- Contact development team
