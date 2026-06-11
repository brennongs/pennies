import { Text, Button, TextInput } from "react-native"
import { useRouter } from "expo-router"
import { useJoinStore } from "@/stores/join";

interface Props {
  useStore: typeof useJoinStore
}
export default function JoinModal({ useStore = useJoinStore }: Props) {
  const { shortCode, username, setState, join } = useStore();
  const router = useRouter();

  return (
    <>
      <Text>Join</Text>
      <TextInput value={shortCode} onChangeText={(v) => setState({ shortCode: v })} placeholder="short code"/>
      <TextInput value={username} onChangeText={(v) => setState({ username: v })} placeholder="username"/>
      <Button title='join' onPress={async () => {
        await join()
        router.replace('/lobby')
      }}/>
    </>
  )
}