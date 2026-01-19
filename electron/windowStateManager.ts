import { BrowserWindow } from 'electron';

// Window state tracking
let savedNormalBounds: { x: number; y: number; width: number; height: number } | null = null;
let isTimerMode = false;
let resizeSaveTimeout: NodeJS.Timeout | null = null;

export function setSavedNormalBounds(bounds: { x: number; y: number; width: number; height: number } | null) {
  savedNormalBounds = bounds;
}

export function getSavedNormalBounds() {
  return savedNormalBounds;
}

export function setIsTimerMode(enabled: boolean) {
  isTimerMode = enabled;
}

export function setupWindowStateTracking(window: BrowserWindow) {
  // Save bounds when window is resized or moved (debounced)
  const saveBoundsIfNormal = () => {
    if (resizeSaveTimeout) clearTimeout(resizeSaveTimeout);
    
    resizeSaveTimeout = setTimeout(() => {
      if (!isTimerMode && window) {
        savedNormalBounds = window.getBounds();
        console.log('Saved normal bounds:', savedNormalBounds);
      }
    }, 300); // 300ms debounce
  };

  window.on('resize', saveBoundsIfNormal);
  window.on('move', saveBoundsIfNormal);
}
