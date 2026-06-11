import { Platform } from "react-native";
import { Socket } from "./socket";
import { Fetch } from "./fetch";

const baseUrl = Platform.select({
  android: 'ws://10.0.2.2:3000',
  ios: 'ws://192.168.1.37:3000',
  default: 'ws://localhost:3000'
})

Socket.url = baseUrl;
Fetch.url = baseUrl;
