import { Server as HttpServer, IncomingMessage } from "http";
import { WebSocket } from "ws";
import type { Instance as WsInstance } from "express-ws";
import { hocuspocusServer } from "./hocuspocus.js";
export interface WebSocketHandler {
  setup: (httpServer: HttpServer, wsApp: WsInstance["app"]) => void;
}

export const createWebSocketHandler = (): WebSocketHandler => {
  return {
    setup: (httpServer, wsApp) => {
      wsApp.ws(
        "/collaboration/:documentName",
        (ws: WebSocket, req: IncomingMessage) => {
          hocuspocusServer.handleConnection(ws, req);
        },
      );
    },
  };
};
