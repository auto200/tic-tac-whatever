import express, { Request, Response } from "express";
import next from "next";
import { Server as SocketIOServer, Socket } from "socket.io";
import { SOCKET_EVENTS } from "utils/SOCKET_EVENTS";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

(async () => {
  try {
    await app.prepare();
    const server = express();

    server.all("*", (req: Request, res: Response) => {
      return handle(req, res);
    });

    const expressServer = server.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
    });

    const io = new SocketIOServer(expressServer);

    io.on("connection", (socket: Socket) => {
      console.log("connection");
      socket.emit(SOCKET_EVENTS.GAME_UPDATE, "Hello from Socket.io");

      socket.on("disconnect", () => {
        console.log("client disconnected");
      });
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
