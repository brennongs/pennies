import { create } from "zustand";
import { Socket } from "@/lib/socket";
import { useGlobalStore } from "./session.store";
import { Command } from "./types";
import { User } from "@/lib/types";

interface State {
  recipientId: string | undefined;
  amount: number;
}
const defaultState: State = {
  recipientId: undefined,
  amount: NaN,
}
function createPayCommand(
  socket = Socket,
  globalStore = useGlobalStore
) {
  return create<Command<State>>((set, get) => ({
    ...defaultState,
    setState(state) { set(state) },

    async execute(state?: State) {
      const { recipientId, amount, clearState } = get()
      const { userId } = globalStore.getState();
      const resolvedRecipientId = recipientId ?? state?.recipientId

      if (!resolvedRecipientId) throw new Error('please select a recipient')

      socket.instance.publish('transaction.pay', {
        originatorId: userId,
        recipientId: resolvedRecipientId,
        amount: String(state?.amount ?? amount)
      });
      clearState();
    },
    clearState() {
      set(defaultState)
    },
  }))
}

export const usePayCommand = createPayCommand();