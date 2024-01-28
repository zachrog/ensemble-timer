import { create } from 'zustand';

export type EnsembleModes = 'timer' | 'break' | 'edit';

export type AppStore = {
  currentMode: EnsembleModes;
  timeStarted: number;
  setTimeStarted: () => void;
  timerLength: number;
  setTimerLength: (timer: number) => void;
  timeRemaining: number;
  addMember: (member: { name: string }) => void;
  removeMember: (member: { id: number }) => void;
  ensembleMembers: { name: string; id: number }[];
  setTimeRemaining: () => void;
  newMemberName: string;
  setNewMemberName: (name: string) => void;
  startTurn: () => void;
  endTurn: () => void;
};

export const useAppStore = create<AppStore>()((set, get) => ({
  currentMode: 'edit',
  timeStarted: 0,
  setTimeStarted: () => set((state) => ({ timeStarted: Date.now() })),
  timerLength: 5 * 60 * 1000,
  setTimerLength: (timerLength) => set(() => ({ timerLength })),
  timeRemaining: 0,
  ensembleMembers: [
    { id: 1, name: 'Zach' },
    { id: 2, name: 'Rachel' },
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
  endTurn: () => set(() => ({ currentMode: 'edit' })),
}));
