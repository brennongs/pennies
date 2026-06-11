import { Text, Button } from "react-native"
import { useRouter } from "expo-router"
export default function RequestModal() {
  const router = useRouter()
  return (
    <>
      <Text>Request</Text>
      <Button title='Request' onPress={() => router.back()}/>
    </>
  )
}
