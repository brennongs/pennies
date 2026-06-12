import { create } from "zustand";
import { Fetch } from "@/lib/fetch";
import { Socket } from "@/lib/socket";
import { useGlobalStore } from "./session.store";
import { Command } from "./types";

interface State {
  username: string;
  nest: number;
}
const defaultState: State = {
  username: '',
  nest: 1500,
}
function createHostGameCommand(
  fetch = Fetch,
  socket = Socket,
  globalStore = useGlobalStore
) {
  return create<Command<State>>((set, get) => ({
    ...defaultState,
    async execute() {
      const { username, nest, clearState } = get()

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
      clearState();
    },

    setState(state) { set(state) },
    clearState() { set(defaultState) },
  }))

}

export const useHostGameCommand = createHostGameCommand()