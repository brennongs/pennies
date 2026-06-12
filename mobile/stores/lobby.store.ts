import { create } from "zustand";
import { Fetch } from "@/lib/fetch";
import { Socket } from "@/lib/socket";
import { useGlobalStore } from "./session.store";
import { User } from "@/lib/types";

interface Contract {
  users: User[];
  shortCode: string;
  init(): void;
}
function createLobbyStore(
  fetch = Fetch,
  socket = Socket,
  globalStore = useGlobalStore
) {
  return create<Contract>((set, get) => ({
    users: [],
    shortCode: '',

    async init() {
      const { shortCode } = globalStore.getState();
      socket.instance.subscribe('user.added', ({ users }) => {
        console.log(users)
        set({ users })
      })

      const response = await fetch.get<{
        sessionId: string,
        users: User[]
      }>(`/games/${shortCode}/users`)

      set((state) => ({
        users: [...state.users, ...response.users.filter(u => !state.users.find(s => s.id === u.id))],
        shortCode
      }));
    }
  }))
}

export const useLobbyStore = createLobbyStore()