import { View, Text } from "react-native"
import { Link } from 'expo-router'
export default function Index() {
  return (
    <View>
      <Text>Home</Text>
      <Link href='/(modals)/host'>Host Game</Link>
      <Link href='/(modals)/join'>Join Game</Link>
      <Link href='/(modals)/rejoin'>Rejoin Game</Link>
    </View>
  )
}