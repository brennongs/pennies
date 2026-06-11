import { useEffect, useRef } from 'react';
import { Text, Button, FlatList } from "react-native"
import { Link, useRouter } from "expo-router"
import { useGameStore } from "@/stores/game"
interface Props {
  useStore: typeof useGameStore;
}
export default function Game({ useStore = useGameStore }: Props) {
  const { shortCode, trades, others, me, balance, init } = useStore()
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      init();
      mounted.current = true;
    }

    return () => { mounted.current = false }
  }, [mounted, init])

  const router = useRouter()
  return (
    <>
      <Text>{shortCode}</Text>
      <>
        <Text>{me?.username}</Text>
        <Text>{balance}</Text>
      </>

      <FlatList
        data={trades}
        renderItem={(item) => <Text>{item.item.message}</Text>}
      />

      <Link href='/(modals)/pay'>Pay</Link>
      <Link href='/(modals)/request'>Request</Link>

      <Button title='Simulate Requested' onPress={() => router.push('/(modals)/requested')}/>
    </>
  )
}

