import { create } from 'zustand';

export type EnsembleModes = 'edit' | 'timer' | 'handoff' | 'break';

type EnsembleMember = {
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
  timeRemaining: number;
  addMember: (member: { name: string }) => void;
  removeMember: (member: { id: number }) => void;
  ensembleMembers: EnsembleMember[];
  setTimeRemaining: () => void;
  newMemberName: string;
  setNewMemberName: (name: string) => void;
  startTurn: () => void;
  endTurn: () => void;
};

export const useAppStore = create<AppStore>()((set, get) => ({
  currentMode: 'handoff',
  timeStarted: 0,
  setTimeStarted: () => set((state) => ({ timeStarted: Date.now() })),
  timerLength: 5 * 60 * 1000,
  setTimerLength: (timerLength) => set(() => ({ timerLength })),
  breakLength: 5 * 60 * 1000,
  setBreakLength: (breakLength) => set(() => ({ breakLength: breakLength })),
  rotationsPerBreak: 10,
  currentRotation: 1,
  setRotationsPerBreak: (rotations) =>
    set(() => ({ rotationsPerBreak: rotations })),
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
      return {
        currentMode: 'handoff',
        currentRotation: state.currentRotation + 1,
      };
    }),
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
