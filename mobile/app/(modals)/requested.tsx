import { Text, Button } from "react-native"
import { useRouter } from "expo-router"
import { useGameStore } from "@/stores/game.store"
import { usePayCommand } from "@/stores/pay.command"

interface Props {
  useGame: typeof useGameStore;
  usePay: typeof usePayCommand;
}
export default function RequestedModal({
  useGame = useGameStore,
  usePay = usePayCommand 
}: Props) {
  const { activeRequest, ...gameStore } = useGame()
  const payCommand = usePay();
  const router = useRouter()

  if (!activeRequest) return;

  return (
    <>
      <Text>Requested</Text>
      <Text>{activeRequest?.message}</Text>
      <Button title='Pay' onPress={() => {
        payCommand.execute({
          amount: Number(activeRequest.amount),
          recipientId: activeRequest.originatorId
        });
        gameStore.setState({ activeRequest: undefined })
        router.back();
      }}/>
      <Button title='Reject' onPress={() => router.back()} />
    </>
  )
}
