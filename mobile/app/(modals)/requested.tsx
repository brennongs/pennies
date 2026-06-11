import { Text, Button } from "react-native"
import { useRouter } from "expo-router"
export default function RequestedModal() {
  const router = useRouter()
  return (
    <>
      <Text>Requested</Text>
      <Button title='Pay' onPress={() => router.back()}/>
      <Button title='Reject' onPress={() => router.back()} />
    </>
  )
}
