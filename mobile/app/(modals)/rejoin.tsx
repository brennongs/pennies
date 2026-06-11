import { Text, Button } from "react-native"
import { useRouter } from "expo-router"
export default function RejoinModal() {
  const router = useRouter()
  return (
    <>
      <Text>Rejoin</Text>
      <Button title='rejoin' onPress={() => router.replace('/lobby')}/>
    </>
  )
}
