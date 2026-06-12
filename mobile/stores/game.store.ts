import { create } from 'zustand'
import { Socket } from '@/lib/socket'
import { Fetch } from '@/lib/fetch'
import { useGlobalStore } from './session.store'
import { User, Transaction } from '@/lib/types'

interface RequestTransaction extends Omit<Transaction, 'sessionId'> {
  amount: string;
  originatorId: string;
}
interface State {
  shortCode: string;
  trades: Transaction[];
  others: User[];
  me: User | null;
  balance: number;
  activeRequest?: RequestTransaction
}
interface Contract extends State {
  init(): Promise<void>;
  setState(state: Partial<State>): void;
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
    activeRequest: undefined,

    setState(state) { set(state) },

    async init() {
      socket.instance.subscribe('balance.changed', ({ balance }) => set({ balance }))
      socket.instance.subscribe('request.made', (payload) => {
        const { activeRequest } = get()
        if (!activeRequest) {
          set({ activeRequest: payload })
        }
      })
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

      set({
        others,
        me,
        trades,
        balance: me.balance,
        shortCode
      })
    },
  }))
}

export const useGameStore = createGameStore()