import { Text, Button } from "react-native"
import { useRouter } from "expo-router"
export default function JoinModal() {
  const router = useRouter();

  return (
    <>
      <Text>Join</Text>
      <Button title='join' onPress={() => router.replace('/lobby')}/>
    </>
  )
}