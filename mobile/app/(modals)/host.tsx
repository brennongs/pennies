import { Text, Button, TextInput } from "react-native"
import { useRouter } from "expo-router"
import { useHostStore } from "@/stores/host"

interface Props {
  useStore?: typeof useHostStore 
}
export default function HostModal({ useStore = useHostStore }: Props) {
  const { host, setArguments, nest, username } = useStore();
  const router = useRouter()
  return (
    <>
      <Text>Host a new session</Text>

      <TextInput
        value={username}
        onChangeText={(v) => setArguments({ username: v })}
      />
      <TextInput
        value={String(nest)}
        onChangeText={(v) => setArguments({ nest: +v })}
        keyboardType="numeric"
      />
      <Button title='host' onPress={async () => {
        await host()
        router.replace('/lobby')
      }}/>
    </>
  )
}