import { create } from "zustand";

interface Contract {
  sessionId: string;
  shortCode: string;
  userId: string;
}

export const useGlobalStore = create<Contract>((set, get) => ({
  sessionId: '',
  shortCode: '',
  userId: ''
}))