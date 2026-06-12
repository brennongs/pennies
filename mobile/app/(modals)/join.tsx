import { Text, Button, TextInput } from "react-native"
import { useRouter } from "expo-router"
import { useJoinGameCommand } from "@/stores/join-game.command";

interface Props {
  useJoinGame: typeof useJoinGameCommand
}
export default function JoinModal({ useJoinGame = useJoinGameCommand }: Props) {
  const { shortCode, username, ...joinGameCommand} = useJoinGame();
  const router = useRouter();

  return (
    <>
      <Text>Join</Text>
      <TextInput
        value={shortCode}
        onChangeText={(v) => joinGameCommand.setState({
          shortCode: v
        })}
        placeholder="short code"
      />
      <TextInput
        value={username}
        onChangeText={(v) => joinGameCommand.setState({
          username: v
        })}
        placeholder="username"
      />
      <Button
        title='join'
        onPress={async () => {
          await joinGameCommand.execute()
          router.replace('/lobby')
        }}
      />
    </>
  )
}