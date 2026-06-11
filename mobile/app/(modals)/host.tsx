import { Text, Button } from "react-native"
import { useRouter } from "expo-router"
export default function HostModal() {
  const router = useRouter()
  return (
    <>
      <Text>Host</Text>
      <Button title='host' onPress={() => router.replace('/lobby')}/>
    </>
  )
}