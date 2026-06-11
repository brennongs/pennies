import { create } from 'zustand'
import { Socket } from '@/lib/socket'
import { Fetch } from '@/lib/fetch'
import { useGlobalStore } from './session'
import { User, Transaction } from '@/lib/types'


interface Contract {
  shortCode: string;
  trades: Transaction[];
  others: User[];
  me: User | null;
  balance: number;
  init(): void;
  request(recipientId: string, amount: number): void;
}
function createGameStore(
  socket = Socket,
  fetch = Fetch,
  globalStore = useGlobalStore
) {
  return create<Contract>((set, get) => ({
    shortCode: '',
    trades: [],
    others: [],
    me: null,
    balance: NaN,

    async init() {
      socket.instance.subscribe('balance.changed', ({ balance }) => set({ balance }))
      socket.instance.subscribe('request.made', () => {})
      socket.instance.subscribe('user.added', () => {})
      socket.instance.subscribe('transaction.posted', (message) => {
        const { sessionId } = globalStore.getState()

        set(({ trades }) => ({
          trades: [...trades, { message, sessionId }]
        }))
      })
      
      const { sessionId, userId } = globalStore.getState();
      const {
        others,
        me,
        trades,
        shortCode 
      } = await fetch.get<{
        me: User;
        others: User[];
        trades: Transaction[];
        shortCode: string;
      }>(`/games/${sessionId}/${userId}`)
      console.log(others)

      set({
        others,
        me,
        trades,
        balance: me.balance,
        shortCode
      })
    },

    request(recipientId, amount) {
      const { userId } = globalStore.getState();
      socket.instance.publish('transaction.request', {
        originatorId: userId,
        recipientId,
        amount: String(amount)
      })
    }
  }))
}

export const useGameStore = createGameStore()