# Copilot Instructions for Ensemble Timer

This is an Electron application built with React, Vite, TypeScript, and Zustand.

## Architecture & Code Organization

- **Framework**: Electron (Main process) + Vite React (Renderer process).
- **Styling**: Tailwind CSS + Shadcn UI (`src/components/ui/`) + `lucide-react` icons.
- **State Management**: Zustand (`src/state.ts/defaultState.ts`).

### Routing Strategy
The app uses **state-based routing** instead of a traditional URL router.
- **Controller**: `currentMode` property in `useAppStore`.
- **Modes**: 'edit' | 'timer' | 'handoff' | 'want-a-break?' | 'break' | etc.
- **View Switcher**: `src/App.tsx` conditionally renders page components based on `currentMode`.
- **Navigation**: Update `currentMode` via store actions (e.g., `goToEdit()`, `startTurn()`).

### IPC Architecture (Inter-Process Communication)
The app uses two distinct bridges for Renderer-to-Main communication:

1.  **Generic Window Bridge** (`mainCommChannelName`)
    -   **Purpose**: Call standard `BrowserWindow` methods directly from renderer.
    -   **Pattern**: Renderer sends `{ functionName: string, arguments: any[] }`. Main calls `win[functionName](...args)`.
    -   **Example**: Calling `win.minimize()` or `win.close()` from UI controls.
    -   **Implementation**: `electron/communicationBridge/mainCommunicationBridge.ts`.

2.  **Custom Command Bridge** (`customCommandChannelName`)
    -   **Purpose**: Execute complex main-process logic (window movement, focus).
    -   **Pattern**: Renderer sends a command string (e.g., `'move-to-bottom-right'`).
    -   **Implementation**: `electron/communicationBridge/customCommandReceiver.ts`.

## Key Files & Directories

- `electron/main.ts`: Main process entry point. Creates window and initializes IPC receivers.
- `src/App.tsx`: Main React component acting as the "Router".
- `src/state.ts/defaultState.ts`: Single source of truth. Contains all app logic, timer state, and member lists.
- `src/components/ui/`: Reusable Shadcn UI components.
- `src/communicationBridge/`: Client-side IPC utilities for the renderer.

## Type Definitions & Conventions

- **State Types**: Defined and exported in `src/state.ts/defaultState.ts` (e.g., `AppStore`, `EnsembleModes`).
- **Styles**: Use `cn()` utility from `src/lib/utils.ts` for merging Tailwind classes.
- **Icons**: Import from `lucide-react`.

## Workflow & Commands

- **Run Dev**: `npm run start` (Runs Vite in dev mode; Electron likely needs separate launch or is handled by vite-plugin-electron).
- **Build**: `npm run build` (tsc -> vite build -> electron-builder).
- **Platform Specifics**: Windows and Mac builds are configured in `package.json`.

## Common Tasks

- **Adding a new Page/View**:
    1.  Add new mode to `EnsembleModes` type in `defaultState.ts`.
    2.  Create component in `src/pages/`.
    3.  Add conditional render in `src/App.tsx`.
    4.  Add action to store to switch to this mode.

- **Adding Main Process Logic**:
    1.  If it's a window method, it might work out of the box via generic bridge.
    2.  If it requires custom logic, add a case to `createCustomCommandReceiver` in `electron/communicationBridge/customCommandReceiver.ts`.
