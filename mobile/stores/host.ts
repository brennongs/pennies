import { create } from "zustand";
import { Fetch } from "@/lib/fetch";
import { Socket } from "@/lib/socket";
import { useGlobalStore } from "./session";

interface Contract {
  username: string;
  nest: number;
  host(): Promise<void>;
  setArguments(args: { username?: string; nest?: number }): void;
}
function createHostStore(
  fetch = Fetch,
  socket = Socket,
  globalStore = useGlobalStore
) {
  return create<Contract>((set, get) => ({
    username: '',
    nest: 1500,

    async host() {
      const { username, nest } = get()

      const {
        sessionId,
        userId,
        shortCode 
      } = await fetch.post<{
        sessionId: string;
        userId: string;
        shortCode: string;
      }>('/games', {
        username,
        nest
      });

      socket.instance.publish('user.join', {
        sessionId,
        userId
      });
      globalStore.setState({
        sessionId,
        userId,
        shortCode
      });
    },

    setArguments(args) {
      return set({...args})
    }
  }))

}

export const useHostStore = createHostStore()