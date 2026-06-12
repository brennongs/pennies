import { View, Text } from "react-native"
import { ButtonLink } from "@/components/button-link"

export default function Index() {
  return (
    <View>
      <Text>Home</Text>
      <ButtonLink href='/(modals)/host' title='Host Game' />
      <ButtonLink href='/(modals)/join' title='Join Game' />
      <ButtonLink href='/(modals)/rejoin' title='Rejoin Game' />
    </View>
  )
}