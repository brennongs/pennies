import { Text } from "react-native"
import { Link } from "expo-router"
export default function Lobby() {
  return (
    <>
      <Text>Lobby</Text>
      <Link href='/game'>Game</Link>
    </>
  )
}

