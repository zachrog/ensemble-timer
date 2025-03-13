import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type EnsembleModes =
  | 'edit'
  | 'timer'
  | 'handoff'
  | 'want-a-break?'
  | 'break';

export type EnsembleMember = {
  name: string;
  id: number;
};

export type AppStore = {
  currentMode: EnsembleModes;
  previousMode: EnsembleModes | null;
  timeStarted: number;
  setTimeStarted: () => void;
  timerLength: number;
  setTimerLength: (timer: number) => void;
  breakLength: number;
  breakRotation: number;
  setBreakRotation: (breakRotation: number) => void;
  setBreakLength: (breakLength: number) => void;
  rotationsPerBreak: number;
  currentRotation: number;
  setRotationsPerBreak: (rotations: number) => void;
  previousDriver: () => void;
  nextDriver: () => void;
  timeRemaining: number;
  addMember: (member: { name: string }) => void;
  removeMember: (member: { id: number }) => void;
  randomizeMembers: () => void;
  ensembleMembers: EnsembleMember[];
  inactiveMembers: EnsembleMember[];
  removeInactiveMember: (member: { id: number }) => void;
  inactiveToActive: (member: { id: number }) => void;
  setTimeRemaining: () => void;
  newMemberName: string;
  setNewMemberName: (name: string) => void;
  startTurn: () => void;
  endTurn: () => void;
  skipBreak: () => void;
  takeBreak: () => void;
  endBreak: () => void;
  goToEdit: () => void;
  shouldRestoreWindowSize: boolean;
  resetShouldRestoreWindowSize: () => void;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      currentMode: 'edit',
      previousMode: null,
      shouldRestoreWindowSize: false,
      resetShouldRestoreWindowSize: () => set(() => ({ shouldRestoreWindowSize: false })),
      timeStarted: 0,
      setTimeStarted: () => set(() => ({ timeStarted: Date.now() })),
      timerLength: 5 * 60 * 1000,
      setTimerLength: (timerLength) => set(() => ({ timerLength })),
      breakLength: 5 * 60 * 1000,
      setBreakLength: (breakLength) =>
        set(() => ({ breakLength: breakLength })),
      rotationsPerBreak: 10,
      currentRotation: 1000000, // Start at high rotation so we do not get into negative number logic
      breakRotation: 0,
      setBreakRotation: (breakRotation) => set(() => ({ breakRotation })),
      setRotationsPerBreak: (rotations) =>
        set(() => ({ rotationsPerBreak: rotations })),
      nextDriver: () =>
        set((state) => {
          return { currentRotation: state.currentRotation + 1 };
        }),
      previousDriver: () =>
        set((state) => {
          return { currentRotation: state.currentRotation - 1 };
        }),
      timeRemaining: 0,
      ensembleMembers: [
        { id: 1, name: 'Person 1' },
        { id: 2, name: 'Person 2' },
      ],
      inactiveMembers: [{ id: 3, name: 'Person 3' }],
      removeInactiveMember: ({ id }) =>
        set((state) => {
          const index = state.inactiveMembers.findIndex(
            (inactiveMember) => inactiveMember.id === id,
          );
          state.inactiveMembers.splice(index, 1);

          return { inactiveMembers: state.inactiveMembers };
        }),
      inactiveToActive: ({ id }) =>
        set((state) => {
          const index = state.inactiveMembers.findIndex(
            (inactiveMember) => inactiveMember.id === id,
          );
          const removedMember = state.inactiveMembers.splice(index, 1);
          state.ensembleMembers.push(removedMember[0]);
          return {
            ensembleMembers: state.ensembleMembers,
            inactiveMembers: state.inactiveMembers,
          };
        }),
      addMember: ({ name }) =>
        set((state) => ({
          ensembleMembers: state.ensembleMembers.concat({
            name,
            id: Math.random(),
          }),
        })),
      removeMember: ({ id }) =>
        set((state) => {
          const index = state.ensembleMembers.findIndex(
            (ensembleMember) => ensembleMember.id === id,
          );
          const removedMember = state.ensembleMembers.splice(index, 1);
          state.inactiveMembers.push(removedMember[0]);

          return {
            ensembleMembers: state.ensembleMembers,
            inactiveMembers: state.inactiveMembers,
          };
        }),
      randomizeMembers: () =>
        set((state) => {
          const newOrder: EnsembleMember[] = [];
          const oldOrder = state.ensembleMembers;
          while (oldOrder.length) {
            const remainingCount = oldOrder.length;
            const randomPosition = Math.floor(Math.random() * remainingCount);
            const pluckedMember = oldOrder.splice(randomPosition, 1);
            newOrder.push(pluckedMember[0]);
          }
          return { ensembleMembers: newOrder };
        }),
      setTimeRemaining: () =>
        set((state) => {
          const timerLength =
            state.currentMode === 'break'
              ? state.breakLength
              : state.timerLength;
          const timeRemaining = state.timeStarted + timerLength - Date.now();
          const timeRemainingClamped = Math.max(timeRemaining, 0);
          return { timeRemaining: timeRemainingClamped };
        }),
      newMemberName: '',
      setNewMemberName: (name) => set(() => ({ newMemberName: name })),
      startTurn: () =>
        set((state) => {
          state.setTimeStarted();
          state.setTimeRemaining();
          return { previousMode: state.currentMode, currentMode: 'timer' };
        }),
      endTurn: () =>
        set((state) => {
          const currentRotation = state.currentRotation + 1;
          const breakRotation = state.breakRotation + 1;
          const newMode =
            breakRotation >= state.rotationsPerBreak
              ? 'want-a-break?'
              : 'handoff';

          // Save the previous mode to know we're coming from timer
          return {
            previousMode: state.currentMode,
            currentMode: newMode,
            currentRotation,
            breakRotation,
          };
        }),
      skipBreak: () =>
        set((state) => ({ previousMode: state.currentMode, currentMode: 'handoff', breakRotation: 0 })),
      takeBreak: () =>
        set((state) => {
          state.setTimeStarted();
          state.setTimeRemaining();
          return { previousMode: state.currentMode, currentMode: 'break' };
        }),
      endBreak: () => set((state) => ({ previousMode: state.currentMode, currentMode: 'handoff', breakRotation: 0 })),
      goToEdit: () => set((state) => { 
        // Set flag to restore window size if coming from timer mode
        const shouldRestore = state.currentMode === 'timer';
        console.log('goToEdit: previousMode =', state.currentMode, 'shouldRestoreWindowSize =', shouldRestore);
        return { 
          previousMode: state.currentMode,
          currentMode: 'edit',
          shouldRestoreWindowSize: shouldRestore
        };
      }),
    }),
    {
      name: 'ensemble-timer-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        ensembleMembers: state.ensembleMembers,
        rotationsPerBreak: state.rotationsPerBreak,
        breakLength: state.breakLength,
        timerLength: state.timerLength,
        inactiveMembers: state.inactiveMembers,
      }),
    },
  ),
);

export function getCurrentNavigator({
  ensembleMembers,
  currentRotation,
}: {
  ensembleMembers: EnsembleMember[];
  currentRotation: number;
}): EnsembleMember {
  const index = currentRotation % ensembleMembers.length;
  return ensembleMembers[index] || { id: Math.random(), name: '' };
}

export function getCurrentDriver({
  ensembleMembers,
  currentRotation,
}: {
  ensembleMembers: EnsembleMember[];
  currentRotation: number;
}): EnsembleMember {
  const index = (currentRotation + 1) % ensembleMembers.length;
  return ensembleMembers[index] || { id: Math.random(), name: '' };
}

