# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- Start development server: `npm run start`
- Build for production: `npm run build` (creates Windows and Mac executables)
- Lint code: `npm run lint`
- Preview build: `npm run preview`

## Project Architecture

This is an Electron-based ensemble programming timer application built with React, TypeScript, and Tailwind CSS. The application helps teams manage rotation timers for pair/ensemble programming sessions.

### Key Architecture Components

**State Management:**
- Uses Zustand for global state management with localStorage persistence
- Main state store in `src/state.ts/defaultState.ts` manages timer modes, ensemble members, and rotation logic
- State includes timer lengths, break settings, current rotation, and member management

**Application Modes:**
The app operates in distinct modes managed by the `currentMode` state:
- `edit`: Configure ensemble members and timer settings
- `timer`: Active coding session with countdown
- `handoff`: Transition between drivers
- `want-a-break?`: Break decision point
- `break`: Active break period

**Electron Architecture:**
- Main process: `electron/main.ts` handles window creation and IPC communication
- Preload script: `electron/preload.ts` for secure renderer-main communication
- Communication bridge pattern in `electron/communicationBridge/` for IPC management
- Frameless window design for overlay functionality

**UI Structure:**
- `src/App.tsx`: Main app component with mode-based rendering
- `src/pages/`: Mode-specific page components
- `src/components/`: Reusable UI components using Radix UI primitives
- Tailwind CSS for styling with dark theme (`bg-zinc-800`)

### Key Files

- `src/state.ts/defaultState.ts`: Global state management and business logic
- `src/App.tsx`: Main application component with mode routing
- `electron/main.ts`: Electron main process entry point
- `electron/communicationBridge/`: IPC communication layer

### Development Notes

- The app uses a frameless window design for overlay functionality
- State persists to localStorage for session continuity
- Multiple window support requires careful IPC message handling
- Build process creates both Windows (.exe) and Mac (.dmg) executables