import { Text, Button } from "react-native"
import { Link, useRouter } from "expo-router"
export default function Game() {
  const router = useRouter()
  return (
    <>
      <Text>Game</Text>
      <Link href='/(modals)/pay'>Pay</Link>
      <Link href='/(modals)/request'>Request</Link>

      <Button title='Simulate Requested' onPress={() => router.push('/(modals)/requested')}/>
    </>
  )
}

