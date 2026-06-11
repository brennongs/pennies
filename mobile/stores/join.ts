import { create } from "zustand";
import { Fetch } from "@/lib/fetch";
import { Socket } from "@/lib/socket";
import { useGlobalStore } from "./session";

interface Contract {
  shortCode: string;
  username: string;
  join(): Promise<void>;
  setState(state: { shortCode?: string; username?: string; }): void
}
function createJoinStore(
  fetch = Fetch,
  socket = Socket,
  globalStore = useGlobalStore
) {
  return create<Contract>((set, get) => ({
    shortCode: '',
    username: '',

    async join() {
      const { shortCode, username } = get()
      const {
        sessionId,
        userId
      } = await fetch.post<{
        sessionId: string,
        userId: string,
        username: string
      }>(
        `/games/${shortCode}/join`,
        {
          username
        }
      );

      socket.instance.publish('user.join', {
        sessionId,
        userId
      });
      globalStore.setState({
        sessionId,
        userId,
        shortCode
      })
    },

    setState(state) {
      set(state)
    }
  }))
}

export const useJoinStore = createJoinStore();