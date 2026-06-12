import { Text, Button, TextInput } from "react-native"
import { useRouter } from "expo-router"
import { useHostGameCommand } from "@/stores/host-game.command"

interface Props {
  useHostGame?: typeof useHostGameCommand 
}
export default function HostModal({ useHostGame = useHostGameCommand }: Props) {
  const { username, nest, ...hostGameCommand} = useHostGame();
  const router = useRouter()
  return (
    <>
      <Text>Host a new session</Text>

      <TextInput
        value={username}
        onChangeText={(v) => hostGameCommand.setState({ username: v })}
      />
      <TextInput
        value={String(nest)}
        onChangeText={(v) => hostGameCommand.setState({ nest: +v })}
        keyboardType="numeric"
      />
      <Button title='host' onPress={async () => {
        await hostGameCommand.execute()
        router.replace('/lobby')
      }}/>
    </>
  )
}