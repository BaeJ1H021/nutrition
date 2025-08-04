import { create } from 'zustand';

interface ProfileState {
  gender: 'male' | 'female' | null;
  birthday: string; // 'YYYY-MM-DD'
  height: number | null;
  weight: number | null;
  setGender: (gender: 'male' | 'female') => void;
  setBirthday: (birthday: string) => void;
  setHeight: (height: number) => void;
  setWeight: (weight: number) => void;
  reset: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  gender: null,
  birthday: '',
  height: null,
  weight: null,
  setGender: (gender) => set({ gender }),
  setBirthday: (birthday) => set({ birthday }),
  setHeight: (height) => set({ height }),
  setWeight: (weight) => set({ weight }),
  reset: () =>
    set({
      gender: null,
      birthday: '',
      height: null,
      weight: null,
    }),
}));
