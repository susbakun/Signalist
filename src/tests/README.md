# Testing Documentation for Signalist

## Overview

This directory contains tests for the Signalist application. The tests are written using Vitest and React Testing Library, which are modern testing tools for React applications.

## Test Structure

The tests are organized in a structure that mirrors the application's structure:

- `components/` - Tests for React components
  - `Signal/` - Tests for Signal-related components
  - `Post/` - Tests for Post-related components
  - `Message/` - Tests for Message-related components
- `hooks/` - Tests for custom hooks
- `pages/` - Tests for page components
- `utils/` - Test utilities and helpers

## Running Tests

To run the tests, you can use the following commands:

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm test -- --watch

# Run tests with coverage report
npm test -- --coverage
```

## Test Utilities

The `utils/test-utils.tsx` file contains helper functions and mock data that can be used across tests. This includes:

- `renderWithProviders` - A custom render function that wraps components with necessary providers (Redux, Router)
- Mock data for users, signals, and posts
- Common mock setup functions

## Writing New Tests

When writing new tests, follow these guidelines:

1. Place tests in the appropriate directory based on what you're testing
2. Use the `test-utils.tsx` helpers to reduce boilerplate
3. Mock external dependencies and Redux state
4. Test component rendering, user interactions, and state changes
5. Keep tests focused on a single aspect of functionality

## Mocking Strategy

The tests use Vitest's mocking capabilities to mock:

- Redux hooks and state
- Custom hooks
- API services
- External libraries
- File system operations (FileReader, URL.createObjectURL)
- UI components (Avatar, Emoji Picker, Image Preview)
- Appwrite client and storage services

This allows components to be tested in isolation without requiring the entire application to be running.
