import { Text, Button } from "react-native"
import { useRouter } from "expo-router"
export default function RejoinModal() {
  const router = useRouter()
  // given a game code, select a user which was previously registered to this game and does not have a valid connection (how do I determine that?) and restore the connection
  return (
    <>
      
      <Text>Rejoin</Text>
      <Button title='rejoin' onPress={() => router.replace('/lobby')}/>
    </>
  )
}
