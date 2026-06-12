import { create } from "zustand";
import { Fetch } from "@/lib/fetch";
import { Socket } from "@/lib/socket";
import { useGlobalStore } from "./session.store";
import { Command } from "./types";

interface State {
  shortCode: string;
  username: string;
}
const defaultState: State = {
  shortCode: '',
  username: '',
}
function createJoinGameCommand(
  fetch = Fetch,
  socket = Socket,
  globalStore = useGlobalStore
) {
  return create<Command<State>>((set, get) => ({
    ...defaultState,
    async execute() {
      const { shortCode, username, clearState } = get()
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
      });
      clearState();
    },

    setState(state) {
      set(state)
    },

    clearState() {
      set(defaultState)
    },
  }))
}

export const useJoinGameCommand = createJoinGameCommand();