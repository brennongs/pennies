import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

import '@/lib/config';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name='index' options={{ title: 'Pennies' }} />
        <Stack.Screen name='lobby' options={{ title: 'Pennies - Lobby' }} />
        <Stack.Screen
          name='game'
          options={{
            title: 'Pennies - Game',
            headerLeft: () => null
            }}
          />

        <Stack.Screen name="(modals)/join" options={{ presentation: 'modal', title: 'Join Game' }} />
        <Stack.Screen name="(modals)/rejoin" options={{ presentation: 'modal', title: 'Rejoin Game' }} />
        <Stack.Screen name="(modals)/host" options={{ presentation: 'modal', title: 'Host Game' }} />
        <Stack.Screen name="(modals)/pay" options={{ presentation: 'modal', title: 'Pay' }} />
        <Stack.Screen name="(modals)/request" options={{ presentation: 'modal', title: 'Make a request' }} />
        <Stack.Screen name="(modals)/requested" options={{ presentation: 'modal', title: 'Respond to a request' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
