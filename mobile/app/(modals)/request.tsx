import { Text, TextInput, Button } from "react-native"
import { useRouter } from "expo-router"
import { useGameStore } from "@/stores/game.store"
import { useRequestCommand } from "@/stores/request.command"
import { Dropdown } from "@/components/dropdown"

interface Props {
  useGame: typeof useGameStore;
  useRequest: typeof useRequestCommand
}
export default function RequestModal({
  useGame = useGameStore,
  useRequest = useRequestCommand
}: Props) {
  const { balance, others } = useGame()
  const { recipient, ...requestCommand} = useRequest()
  const router = useRouter()

  return (
    <>
      <Dropdown
        placeholder="Select a recipient"
        value={recipient && { value: recipient.id, label: recipient.username }}
        options={others.map(u => ({
          value: u.id,
          label: u.username
        }))}
        onChange={(v) => requestCommand.setState({
          recipient: others.find(u => u.id === v.value)
        })}
      />
      <TextInput
        placeholder="Enter an amount"
        keyboardType="numeric"
        onChangeText={(v) => requestCommand.setState({
          amount: Number(v)
        })}
      />
      <Text>Balance: {balance}</Text>
      <Button title='Request' onPress={() => {
        requestCommand.execute()
        router.back()
      }}/>
    </>
  )
}
