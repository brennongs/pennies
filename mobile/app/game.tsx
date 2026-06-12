import { useEffect, useRef } from 'react';
import { Text, Button, FlatList } from "react-native"
import { useRouter } from 'expo-router';
import { ButtonLink } from '@/components/button-link';
import { useGameStore } from "@/stores/game.store"
interface Props {
  useGame: typeof useGameStore;
}
export default function Game({ useGame = useGameStore }: Props) {
  const { shortCode, trades, balance, activeRequest, ...gameStore } = useGame()
  const router = useRouter();
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      gameStore.init();
      mounted.current = true;
    }

    return () => { mounted.current = false }
  }, [mounted, gameStore])

  useEffect(() => {
    if (activeRequest) {
      router.push('/(modals)/requested')
    }
  }, [activeRequest, router])

  return (
    <>
      <Text>{shortCode}</Text>
      <Text>Balance: {balance}</Text>

      <FlatList
        data={trades}
        renderItem={(item) => <Text>{item.item.message}</Text>}
      />

      <ButtonLink href='/(modals)/pay' title='Pay' />
      <ButtonLink href='/(modals)/request' title='Request' />
      <ButtonLink href='/(modals)/requested' title='Simulate Requested' />
    </>
  )
}

