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

**Key Testing Patterns**:

- ✅ Props validation and rendering
- ✅ User interactions (clicks, inputs)
- ✅ Conditional rendering logic
- ✅ Icon and text content verification
- ✅ CSS class applications

### Integration Testing

**Focus**: Component interaction and routing behavior

**Integration Test Coverage**:

- ✅ React Router navigation
- ✅ Component state management
- ✅ Props drilling and data flow
- ✅ Context providers
- ✅ External service integration

### End-to-End Testing with Playwright

**Approach**: Page Object Model with comprehensive user journey testing

**E2E Test Features**:

- ✅ API response mocking for predictable tests
- ✅ Page Object Model for maintainable tests
- ✅ Quiz automation and answer selection
- ✅ Counter validation and progress tracking
- ✅ Error handling and edge cases
- ✅ Mobile and desktop responsive testing
