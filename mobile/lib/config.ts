import { Platform } from "react-native";
import { Socket } from "./socket";
import { Fetch } from "./fetch";

Socket.url = Platform.select({
  android: 'ws://10.0.2.2:3031',
  ios: 'ws://192.168.1.37:3031',
  default: 'ws://localhost:3031'
});
Fetch.url = Platform.select({
  android: 'http://10.0.2.2:3031',
  ios: 'http://192.168.1.37:3031',
  default: 'http://localhost:3031',
});
