import { create } from "zustand";
import { Socket } from "@/lib/socket";
import { useGlobalStore } from "./session.store";
import { User } from '@/lib/types';
import { Command } from "./types";

interface State {
  amount: number;
  recipient?: User;
}
const defaultState: State = {
  amount: NaN,
  recipient: undefined
}
function createRequestCommand(
  socket = Socket,
  globalStore = useGlobalStore
) {
  return create<Command<State>>((set, get) => ({
    ...defaultState,

    setState(state) {
      set(state)
    },

    async execute() {
      const { userId } = globalStore.getState()
      const { recipient, amount, clearState } = get()

      if (!recipient) {
        throw new Error('please select a recipient')
      }

      socket.instance.publish('transaction.request', {
        recipientId: recipient.id,
        originatorId: userId,
        amount: String(amount)
      })
      clearState()
    },

    clearState() {
      set(defaultState)
    },
  }))
}

export const useRequestCommand = createRequestCommand()