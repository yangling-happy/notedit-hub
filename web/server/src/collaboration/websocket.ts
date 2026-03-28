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
      // HocuspocusProvider 常见连接方式会先连到 url 本身（如 ws://host:port/）
      // 这里同时兼容根路径、固定路径与历史动态路径，避免握手阶段被直接关闭。
      wsApp.ws("/", (ws: WebSocket, req: IncomingMessage) => {
        hocuspocusServer.handleConnection(ws, req);
      });

      wsApp.ws("/collaboration", (ws: WebSocket, req: IncomingMessage) => {
        hocuspocusServer.handleConnection(ws, req);
      });

      wsApp.ws(
        "/collaboration/:documentName",
        (ws: WebSocket, req: IncomingMessage) => {
          hocuspocusServer.handleConnection(ws, req);
        },
      );
    },
  };
};
