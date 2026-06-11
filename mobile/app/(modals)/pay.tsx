import { Text, Button } from "react-native"
import { useRouter } from "expo-router"
import { useGameStore } from "@/stores/game"

interface Props {
  useStore: typeof useGameStore
}

export default function PayModal({ useStore = useGameStore }: Props) {
  const router = useRouter()
  return (
    <>
      <Text>Pay</Text>
      <Button title='Pay' onPress={() => router.back()}/>
    </>
  )
}
