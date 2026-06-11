// import { create } from 'zustand';
// import { Fetch } from '@/lib/fetch';
// import { Socket } from '@/lib/socket';
// import { useGlobalStore } from './session';
// import { User } from '@/lib/types';

// interface Contract {
//   lobby: User[];
//   init(): void;
//   join(shortCode: string, username: string): void;
//   host(username: string, nest?: number): void;
//   rejoin(shortCode: string, username: string): void;
// }
// export function createHomeStore(
//   fetch = Fetch,
//   socket = Socket.instance,
//   sessionStore = useGlobalStore
// ) {
//   return create<Contract>((set, get) => ({
//     lobby: [],

//     init() {
//       socket.subscribe('user.added', ({ users, me }) => {
//         set(({ lobby }) => {
//           const newUsers = users.filter(u => !lobby.find(l => l.id === u.id))

//           return {
//             lobby: [...lobby, ...newUsers]
//           }
//         })
//       })
//     },

//     async host(username, nest) {
//       const { sessionId, shortCode, userId } = await fetch.post<{
//         sessionId: string;
//         shortCode: string;
//         userId: string;
//       }>('/games', {
//         username,
//         nest
//       })
      
//       sessionStore.setState({
//         sessionId,
//         shortCode
//       });
//       socket.publish('user.join', {
//         sessionId,
//         userId
//       })
//     },

//     async join(shortCode, username) { },
//     rejoin(shortCode, username) {}
//   }))
// }

// export const useHomeStore = createHomeStore()