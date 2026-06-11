import { create } from "zustand";
import { Socket } from "@/lib/socket";
import { useGlobalStore } from "./session";
import { User } from '@/lib/types';

interface State {
  amount: number;
  recipient?: User;
}
interface Contract extends State {
  request(): void;
  setRequestState(state: Partial<State>): void
}
function createRequestStore(
  socket = Socket,
  globalStore = useGlobalStore
) {
  return create<Contract>((set, get) => ({
    amount: NaN,
    recipient: undefined,

    setRequestState(state) {
      set(state)
    },

    request() {
      const { userId } = globalStore.getState()
      const { recipient, amount } = get()

      if (!recipient) {
        throw new Error('please select a recipient')
      }

      socket.instance.publish('transaction.request', {
        recipientId: recipient.id,
        originatorId: userId,
        amount: String(amount)
      })
    }
  }))
}

export const useRequestStore = createRequestStore()