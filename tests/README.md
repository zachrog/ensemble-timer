# Ensemble Timer Tests

This directory contains automated tests for the Ensemble Timer application.

## Fully Automated Window Size Persistence Test

We've created a fully automated test that builds the application and verifies that window size persistence works correctly. This test does not require any manual intervention.

To run the test:

```bash
npm run test:window-size
```

This will:

1. Build the application
2. Run the window size persistence tests across multiple window sizes
3. Generate detailed logs and screenshots
4. Produce an HTML test report

The test verifies that:
- User-defined window sizes are saved correctly
- Window sizes are restored after the timer transitions
- Window state is preserved correctly (not maximized when it shouldn't be)
- Window size persists across app restarts

### Test Output

The automated test produces comprehensive output:

- Terminal output with key test events
- Detailed log file with all steps and window state
- Screenshots at key points during the test
- HTML test report with results
- All output is organized by timestamp in `tests/logs/<timestamp>/`

## E2E Tests

E2E tests use Playwright to drive the Electron application and verify functionality.

### Setup

First, install the test dependencies:

```bash
npm run test:install
```

### Running Tests

To run individual E2E tests:

```bash
npm run test:e2e
```

## Debugging Tools

### Window Size Debug Utility

For manual debugging, this utility helps diagnose window size persistence issues by logging all window events and state changes:

```bash
npm run debug:window
```

While the debug utility is running:

1. Resize the window manually
2. Start the timer
3. Exit the timer with Escape
4. Observe the logs to see if window size is properly restored

The log output will show you:
- All window events (resize, maximize, minimize, etc.)
- The window dimensions and position after each event
- Window state checks every 2 seconds

This will help pinpoint where the window size restoration is failing.

## Test Files

- `window-size-persistence.test.js` - Automated tests for window size persistence
- `window-debug.js` - Standalone utility for debugging window events and state
- `run-window-size-test.js` - Fully automated test runner that builds and tests

## Common Issues

If the window size is not being restored, check:

1. Is `savedWindowSize` being properly set when the window is resized?
2. Is the resize event being triggered at all?
3. Is the window being maximized when it shouldn't be?
4. Are there timing issues with unmaximize/resize operations?
5. Is the restore function being called at the right time?
6. Are there conflicts between parallel resize operations?