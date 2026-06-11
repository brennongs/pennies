import { create } from "zustand";
import { Socket } from "@/lib/socket";
import { Fetch } from "@/lib/fetch";
import { useGlobalStore } from "./session";

interface Contract {
  username: string;
  nest: number;
  host(): Promise<void>;
  setArguments(args: { username?: string; nest?: number }): void;
}
function createHostStore(
  socket = Socket,
  fetch = Fetch,
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

      globalStore.setState({
        sessionId,
        userId,
        shortCode
      });
      socket.instance.publish('user.join', {
        sessionId,
        userId
      });
    },

    setArguments(args) {
      return set({...args})
    }
  }))

}

export const useHostStore = createHostStore()