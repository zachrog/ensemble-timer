import { create } from 'zustand';

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
  timeStarted: number;
  setTimeStarted: () => void;
  timerLength: number;
  setTimerLength: (timer: number) => void;
  breakLength: number;
  setBreakLength: (breakLength: number) => void;
  rotationsPerBreak: number;
  currentRotation: number;
  setRotationsPerBreak: (rotations: number) => void;
  previousDriver: () => void;
  nextDriver: () => void;
  timeRemaining: number;
  addMember: (member: { name: string }) => void;
  removeMember: (member: { id: number }) => void;
  ensembleMembers: EnsembleMember[];
  setTimeRemaining: () => void;
  newMemberName: string;
  setNewMemberName: (name: string) => void;
  startTurn: () => void;
  endTurn: () => void;
  skipBreak: () => void;
  takeBreak: () => void;
  endBreak: () => void;
};

export const useAppStore = create<AppStore>()((set, get) => ({
  currentMode: 'want-a-break?',
  timeStarted: 0,
  setTimeStarted: () => set((state) => ({ timeStarted: Date.now() })),
  timerLength: 1 * 60 * 1000,
  setTimerLength: (timerLength) => set(() => ({ timerLength })),
  breakLength: 1 * 60 * 1000,
  setBreakLength: (breakLength) => set(() => ({ breakLength: breakLength })),
  rotationsPerBreak: 1,
  currentRotation: 0,
  setRotationsPerBreak: (rotations) =>
    set(() => ({ rotationsPerBreak: rotations })),
  nextDriver: () =>
    set((state) => {
      const front = state.ensembleMembers.shift();
      if (!front) {
        return { ensembleMembers: [] };
      }
      state.ensembleMembers.push(front);
      return { ensembleMembers: state.ensembleMembers };
    }),
  previousDriver: () =>
    set((state) => {
      const back = state.ensembleMembers.pop();
      if (!back) {
        return { ensembleMembers: [] };
      }
      state.ensembleMembers.unshift(back);
      return { ensembleMembers: state.ensembleMembers };
    }),
  timeRemaining: 0,
  ensembleMembers: [
    { id: 1, name: 'Zach' },
    { id: 2, name: 'Rachel' },
    { id: 3, name: 'Cody' },
    { id: 4, name: 'Jon' },
    { id: 5, name: 'Tom' },
  ],
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
      state.ensembleMembers.splice(index, 1);

      return { ensembleMembers: state.ensembleMembers };
    }),
  setTimeRemaining: () =>
    set((state) => {
      const timeRemaining = state.timeStarted + state.timerLength - Date.now();
      const timeRemainingClamped = Math.max(timeRemaining, 0);
      return { timeRemaining: timeRemainingClamped };
    }),
  newMemberName: '',
  setNewMemberName: (name) => set(() => ({ newMemberName: name })),
  startTurn: () =>
    set((state) => {
      state.setTimeStarted();
      state.setTimeRemaining();
      return { currentMode: 'timer' };
    }),
  endTurn: () =>
    set((state) => {
      const currentRotation = state.currentRotation + 1;
      const currentMode =
        currentRotation === state.rotationsPerBreak
          ? 'want-a-break?'
          : 'handoff';

      return {
        currentMode,
        currentRotation,
      };
    }),
  skipBreak: () => set(() => ({ currentMode: 'handoff', currentRotation: 0 })),
  takeBreak: () =>
    set((state) => {
      state.setTimeStarted();
      state.setTimeRemaining();
      return { currentMode: 'break' };
    }),
  endBreak: () => set(() => ({ currentMode: 'handoff', currentRotation: 0 })),
}));

export function getCurrentNavigator({
  ensembleMembers,
  currentRotation,
}: {
  ensembleMembers: EnsembleMember[];
  currentRotation: number;
}): EnsembleMember {
  const index = (currentRotation + 1) % ensembleMembers.length;
  return ensembleMembers[index];
}

export function getCurrentDriver({
  ensembleMembers,
  currentRotation,
}: {
  ensembleMembers: EnsembleMember[];
  currentRotation: number;
}): EnsembleMember {
  const index = currentRotation % ensembleMembers.length;
  return ensembleMembers[index];
}
