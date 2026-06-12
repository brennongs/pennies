import { useEffect, useRef } from "react"
import { Text, FlatList } from "react-native"
import { Link } from "expo-router"
import { useLobbyStore } from "@/stores/lobby.store"

interface Props {
  useStore: typeof useLobbyStore
}
export default function Lobby({ useStore = useLobbyStore }: Props) {
  const { users, shortCode, init } = useStore();
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      init()
      mounted.current = true
    }

    return () => { mounted.current = false }
  }, [mounted, init]) 

  return (
    <>
      <Text>Lobby</Text>
      <Text>{shortCode}</Text>
      <FlatList
        data={users}
        renderItem={(item) => <Text>{item.item.username}</Text>}
      />
      <Link href='/game'>Start Game</Link>
    </>
  )
}

