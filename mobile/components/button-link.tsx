import { Button, ButtonProps } from "react-native";
import { useRouter, Route } from "expo-router";

interface Props extends ButtonProps {
  href: Route;
}
export function ButtonLink({ href, ...props }: Props) {
  const router = useRouter();

  return (
    <Button
      {...props}
      onPress={(e) => {
        if (props.onPress) {
          props.onPress(e);
        } else {
          e.preventDefault();
        }

        router.push(href)
      }}
    />
  )
}