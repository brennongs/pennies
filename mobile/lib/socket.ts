import { User } from './types';

// Mirrors IncomingWebsocketEvents in src/clients/client.gateway.ts —
// messages the RN client sends ("publish").
type ClientEvents = {
  'user.join': { sessionId: string; userId: string };
  'transaction.pay': { originatorId: string; recipientId: string; amount: string };
  'transaction.request': { originatorId: string; recipientId: string; amount: string };
};

// Mirrors OutgoingWebsocketEvents — messages the RN client receives ("subscribe").
type ServerEvents = {
  'transaction.posted': string;
  'user.added': { users: User[]; me: User };
  'balance.changed': { balance: number };
  'request.made': { message: string; originatorId: string; amount: string };
};

type Subscriptions = {
  [K in keyof ServerEvents]?: Set<(payload: ServerEvents[K]) => void>;
};

const INSTANCE = Symbol()
const REGISTRY = Symbol()
export class Socket {
  private static [INSTANCE]: Socket
  public static url: string;
  public static get instance() {
    if (!this[INSTANCE]) {
      this[INSTANCE] = new this()
    }

    return this[INSTANCE]
  }
  private socket: WebSocket
  private [REGISTRY]: Subscriptions = {}
  private constructor() {
    if (!Socket.url) {
      throw new Error('please provide a URL to the socket provider')
    }
    this.socket = new WebSocket(Socket.url)

    this.socket.addEventListener('message', ({ data }) => {
      const { event, payload } = JSON.parse(data);
      this[REGISTRY][event as keyof ServerEvents]?.forEach((handler) => {
        handler(payload);
      })
    })
  }

  public publish<Topic extends keyof ClientEvents>(
    topic: Topic,
    payload: ClientEvents[Topic]
  ): void {
    this.socket.send(JSON.stringify({ event: topic, data: payload }))
  }

  public subscribe<Topic extends keyof ServerEvents>(
    topic: Topic,
    handler: (payload: ServerEvents[Topic]) => void
  ): () => void {
    type GenericRegistry = Record<string, Set<(payload: any) => void>>
    const registry = this[REGISTRY] as GenericRegistry;
    const subscriptions = (registry[topic] ??= new Set())

    subscriptions.add(handler)

    return () => subscriptions.delete(handler)
  }
}