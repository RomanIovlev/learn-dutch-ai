# 🇳🇱 Learn Dutch AI - Testing-Focused Development

A comprehensive Dutch vocabulary learning application built with React and TypeScript, showcasing modern testing practices including unit tests with React Testing Library, integration testing, and end-to-end testing with Playwright.

## 🧪 Testing Overview

This project serves as a comprehensive example of modern testing practices in React applications, featuring three layers of testing:

- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: Component interaction and routing testing
- **End-to-End Tests**: Full user journey testing with Playwright

### Testing Philosophy

Our testing approach follows the Testing Pyramid:

- **70% Unit Tests**: Fast, isolated component testing
- **20% Integration Tests**: Component interaction testing
- **10% E2E Tests**: Critical user journey validation

## 🚀 Quick Start

### Installation

```bash
# Clone and install
git clone https://github.com/yourusername/learn-dutch-ai.git
cd learn-dutch-ai
git checkout testing_branch
npm install
```

for smoke tests need a backend

```bash
git clone https://github.com/anisa07/learning-language-api
git checkout language-api
```

### Development

```bash
# Start development server
npm start
```

### Testing Commands

```bash
# Unit & Integration Tests
npm test                           # Interactive test runner
npm test -- --coverage             # With coverage report
npm test -- --watchAll=false       # Run once and exit

# E2E Tests with Playwright
npm run e2e               # Run all E2E tests
npm run e2e:ui            # Run with UI mode
npm run e2e:headed        # Run in headed mode
npm run e2e:report        # View test report
```

## 🔬 Testing Architecture

### Unit Testing with React Testing Library

**Philosophy**: Test behavior, not implementation details

```typescript
// Example: Component props testing
test("renders loading spinner with different sizes", () => {
  render(<Loading size="small" />);
  const spinner = screen.getByRole("status");
  expect(spinner).toHaveClass("h-4 w-4");
});

// Example: User interaction testing
test("calls onClick when button is clicked", () => {
  const mockOnClick = jest.fn();
  render(<Actions onReset={mockOnClick} />);

  fireEvent.click(screen.getByText("Reset Progress"));
  expect(mockOnClick).toHaveBeenCalledTimes(1);
});
```

**Key Testing Patterns**:

- ✅ Props validation and rendering
- ✅ User interactions (clicks, inputs)
- ✅ Conditional rendering logic
- ✅ Icon and text content verification
- ✅ CSS class applications

### Integration Testing

**Focus**: Component interaction and routing behavior

```typescript
// Router integration testing with manual mocks
// __mocks__/react-router-dom.js
export const useNavigate = () => jest.fn();
export const useLocation = () => ({ pathname: "/quiz" });

// Integration test example
test("navigates correctly between routes", () => {
  const mockNavigate = useNavigate();
  render(<AppHeader />);

  fireEvent.click(screen.getByText("Vocabulary"));
  expect(mockNavigate).toHaveBeenCalledWith("/vocabulary");
});
```

**Integration Test Coverage**:

- ✅ React Router navigation
- ✅ Component state management
- ✅ Props drilling and data flow
- ✅ Context providers
- ✅ External service integration

### End-to-End Testing with Playwright

**Approach**: Page Object Model with comprehensive user journey testing

```typescript
// Page Object Pattern
export class QuizPageObject {
  constructor(private page: Page) {}

  async selectAnswer(optionText: string) {
    await this.page.locator(`text=${optionText}`).click();
  }

  async getQuestionText() {
    return await this.page
      .locator('[data-testid="quiz-question"]')
      .textContent();
  }
}

// E2E Test Example
test("complete quiz workflow with API mocking", async ({ page }) => {
  // Mock API responses for predictable testing
  await page.route("/api/words/**", (route) => {
    route.fulfill({ json: mockWordData });
  });

  const quizPage = new QuizPageObject(page);
  await quizPage.selectAnswer("apple");
  await expect(page.locator(".quiz-result")).toBeVisible();
});
```

**E2E Test Features**:

- ✅ API response mocking for predictable tests
- ✅ Page Object Model for maintainable tests
- ✅ Quiz automation and answer selection
- ✅ Counter validation and progress tracking
- ✅ Error handling and edge cases
- ✅ Mobile and desktop responsive testing

## 📊 Testing Coverage

### Current Test Coverage

- **Components**: 95%+ coverage across all major components
- **Utils**: 100% coverage of critical utility functions
- **Services**: 90%+ coverage of API and data services
- **E2E**: Critical user journeys fully automated

### Tested Components

| Component      | Unit Tests | Integration Tests | E2E Tests |
| -------------- | ---------- | ----------------- | --------- |
| VocabularyQuiz | ✅         | ✅                | ✅        |
| VocabularyList | ✅         | ✅                | ⏳        |
| Loading        | ✅         | N/A               | N/A       |
| Actions        | ✅         | ✅                | ✅        |
| AppHeader      | ✅         | ✅                | ✅        |
| EmptyState     | ✅         | N/A               | N/A       |

## 🛠️ Testing Setup and Configuration

### React Testing Library Configuration

```typescript
// setupTests.ts
import "@testing-library/jest-dom";

// Enhanced matchers for better assertions
expect.extend({
  toHaveClass: (received, className) => {
    const pass = received.classList.contains(className);
    return {
      pass,
      message: () => `Expected ${received} to have class ${className}`,
    };
  },
});
```

### Playwright Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
```

### Advanced Testing Techniques

**API Mocking in E2E Tests**:

```typescript
// Comprehensive API mocking
await page.route("/api/**", async (route) => {
  const url = route.request().url();
  if (url.includes("/words")) {
    await route.fulfill({ json: mockWordData });
  } else if (url.includes("/progress")) {
    await route.fulfill({ json: mockProgressData });
  }
});
```

**Request Tracking**:

```typescript
// Track API calls during tests
const apiCalls = [];
page.on("request", (request) => {
  if (request.url().includes("/api/")) {
    apiCalls.push(request.url());
  }
});
```

## 🏗️ Project Structure

```
src/
├── components/           # React components with tests
│   ├── __tests__/           # Component unit tests
│   ├── VocabularyQuiz.tsx   # Main quiz (fully tested)
│   └── VocabularyList.tsx   # Vocabulary browser
├── __mocks__/           # Manual mocks
│   └── react-router-dom.js  # Router mocking
├── data/                # Test data and fixtures
├── utils/               # Utilities with 100% coverage
└── types/               # TypeScript interfaces

e2e/                     # End-to-end tests
├── pages/               # Page Object Models
│   └── quiz-po.ts          # Quiz page object
├── specs/               # Test specifications
│   └── vocabulary-quiz.spec.ts
└── fixtures/            # Test data fixtures
```

## 🧪 Testing Best Practices Demonstrated

### Unit Testing Best Practices

1. **Test Behavior, Not Implementation**

   ```typescript
   // ❌ Testing implementation details
   expect(component.state.isLoading).toBe(true);

   // ✅ Testing user-observable behavior
   expect(screen.getByRole("status")).toBeInTheDocument();
   ```

2. **Descriptive Test Names**

   ```typescript
   // ✅ Clear, behavior-focused test names
   test("shows loading spinner when isLoading is true");
   test("calls onReset when reset button is clicked");
   test("renders correct icon based on type prop");
   ```

3. **Proper Mocking Strategy**
   ```typescript
   // Manual mocks for complex dependencies
   // Minimal mocking to preserve real behavior
   // Mock at the boundary, not internals
   ```

### E2E Testing Best Practices

1. **Page Object Model**

   - Encapsulate page interactions
   - Reusable and maintainable
   - Clear separation of concerns

2. **API Mocking**

   - Predictable test data
   - Isolated from backend changes
   - Comprehensive error scenarios

3. **Async Handling**
   ```typescript
   // Proper waiting for dynamic content
   await expect(page.locator(".result")).toBeVisible();
   ```

## 📈 Continuous Integration

### GitHub Actions Configuration

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: "18"
      - name: Install dependencies
        run: npm ci
      - name: Run unit tests
        run: npm test -- --coverage --watchAll=false
      - name: Run E2E tests
        run: npx playwright test
```

## 🎯 Application Features (Testing Context)

This Dutch vocabulary learning app demonstrates testing in the context of:

- **Interactive Quiz System** - Complex user interactions tested
- **Progress Tracking** - State management and persistence testing
- **Routing** - Navigation and route-based component testing
- **API Integration** - Service layer and data flow testing
- **Responsive Design** - Cross-device testing with Playwright

## 🚀 Getting Started with Testing

1. **Run Unit Tests**

   ```bash
   npm test
   # View HTML coverage report at coverage/lcov-report/index.html
   ```

2. **Run E2E Tests**

   ```bash
   npx playwright test
   npx playwright show-report
   ```

3. **Study Test Examples**
   - Check `src/components/__tests__/` for unit test patterns
   - Review `e2e/specs/` for E2E test examples
   - Examine `__mocks__/` for mocking strategies

## 🤝 Contributing to Testing

When contributing, please:

1. **Write Tests First** - TDD approach preferred
2. **Maintain Coverage** - Keep coverage above 90%
3. **Update E2E Tests** - For new user-facing features
4. **Document Test Patterns** - Help others learn

## 📚 Learning Resources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro)
- [Playwright Documentation](https://playwright.dev/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Master testing while learning Dutch!** 🧪🇳🇱
