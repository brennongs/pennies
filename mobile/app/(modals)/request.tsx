import { Text, TextInput, Button } from "react-native"
import { useRouter } from "expo-router"
import { useGameStore } from "@/stores/game"
import { useRequestStore } from "@/stores/request"
import { Dropdown } from "@/components/dropdown"

interface Props {
  useGame: typeof useGameStore;
  useRequest: typeof useRequestStore
}
export default function RequestModal({
  useGame = useGameStore,
  useRequest = useRequestStore
}: Props) {
  const { others } = useGame()
  console.log(others)
  const {
    request,
    amount,
    recipient,
    setRequestState 
  } = useRequest()
  const router = useRouter()
  return (
    <>
      <Text>Recipient</Text>
      <Dropdown
        value={recipient && { value: recipient.id, label: recipient.username }}
        options={others.map(u => ({
          value: u.id,
          label: u.username
        }))}
        onChange={(v) => setRequestState({
          recipient: others.find(u => u.id = v.value)
        })}
      />
      <Text>Amount</Text>
      <TextInput
        value={String(amount)}
        keyboardType="numeric"
        onChangeText={(v) => setRequestState({
          amount: Number(v)
        })}
      />
      <Button title='Request' onPress={() => {
        request()
        router.back()
      }}/>
    </>
  )
}
