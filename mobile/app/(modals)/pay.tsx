import { Text, TextInput, Button } from "react-native"
import { Dropdown } from "@/components/dropdown"
import { useRouter } from "expo-router"
import { useGameStore } from "@/stores/game.store"
import { usePayCommand } from "@/stores/pay.command"

interface Props {
  useGame: typeof useGameStore
  usePay: typeof usePayCommand
}

export default function PayModal({
  useGame = useGameStore,
  usePay = usePayCommand 
}: Props) {
  const { balance, others } = useGame()
  const { recipientId, amount, ...payCommand } = usePay()
  const router = useRouter()
  const options = others.map(u => ({ value: u.id, label: u.username }))

  return (
    <>
      <Dropdown
        placeholder="Select a recipient"
        value={options.find(v => v.value === recipientId)}
        options={options}
        onChange={(v) => payCommand.setState({
          recipientId: v.value
        })}
      />
      <TextInput
        placeholder="Enter an amount"
        onChangeText={(v) => payCommand.setState({
          amount: Number(v)
        })}
        keyboardType="numeric"
      />
      <Text>Balance: {balance}</Text>
      <Button title='Pay' onPress={async () => {
        await payCommand.execute()
        router.back()
      }}/>
    </>
  )
}
