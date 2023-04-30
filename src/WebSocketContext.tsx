import { createContext } from "react";
import { ReadyState, SendMessage } from "react-use-websocket";

interface WebsocketContextProps {
  lastMessage: MessageEvent<any> | null;
  readyState: ReadyState | null;
  sendMessage: SendMessage | null;
}

export default createContext<WebsocketContextProps>({
  lastMessage: null,
  readyState: null,
  sendMessage: null,
});
