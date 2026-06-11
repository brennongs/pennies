import { View, Text } from "react-native"
import { Link } from 'expo-router'
// import { useHomeStore } from "@/stores/home"

// interface Props {
//   useStore: typeof useHomeStore
// }
export default function Index() {
  // const { join, host, rejoin } = useStore()
  return (
    <View>
      <Text>Home</Text>
      <Link href='/(modals)/host'>Host Game</Link>
      <Link href='/(modals)/join'>Join Game</Link>
      <Link href='/(modals)/rejoin'>Rejoin Game</Link>
    </View>
  )
}