import { Text, Button } from "react-native"
import { useRouter } from "expo-router"
export default function PayModal() {
  const router = useRouter()
  return (
    <>
      <Text>Pay</Text>
      <Button title='Pay' onPress={() => router.back()}/>
    </>
  )
}
