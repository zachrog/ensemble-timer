# Ensemble Timer Development Guide

## Commands

- Build: `npm run build`
- Dev: `npm run dev`
- Lint: `npm run lint`
- E2E Tests: `npm run test:e2e`
- Window Size Tests: `npm run test:window-size`
- Simple Tests: `npm run test:simple`
- Direct Window Test: `npm run test:direct`
- Window Debug: `npm run debug:window`

## Code Style Guidelines

- TypeScript with strict type checking
- React functional components preferred
- File naming: PascalCase for components, camelCase for utilities
- State management via Zustand
- Styling: Tailwind CSS with shadcn/ui components
- ESLint standard React/TS rules
- Prettier: single quotes, semicolons, 80-char width
- Electron IPC channels for main/renderer communication

## Architecture

- Electron app with main and renderer processes
- Custom ipc bridge for cross-process communication
- Recent focus: window size persistence and positioning

## GitHub

- The workspace may be a fork of the open-source https://github.com/zachrog/ensemble-timer.git
- Pull requests (PRs) are created against the upstream remote
