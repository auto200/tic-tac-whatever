import express, { Request, Response } from "express";
import { sample } from "lodash";
import { nanoid } from "nanoid";
import next from "next";
import { Server as SocketIOServer, Socket } from "socket.io";
import { Game, Player } from "utils/classes";
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

    const _games: { [key: string]: Game | undefined } = {};

    io.on("connection", (socket: Socket) => {
      let player = new Player(socket.id);

      socket.on("disconnect", () => {
        console.log("client disconnected");
      });

      socket.on(SOCKET_EVENTS.CREATE_GAME, (cb) => {
        if (player.gameId) {
          return;
        }
        const id = nanoid();
        _games[id] = new Game(id);
        cb(id);
      });

      socket.on(
        SOCKET_EVENTS.JOIN_GAME,
        (gameId: string, cb: (canJoin: boolean) => void) => {
          const game = _games[gameId];
          const canJoin = !player.gameId && game?.state === "WAITING";
          if (canJoin && game) {
            player.gameId = game.id;
            game.players[player.id] = player;
            socket.join(game.id);

            if (Object.keys(game.players).length === 2) {
              const [player1, player2] = Object.values(game.players);
              player1.enemyId = player2.id;
              player2.enemyId = player1.id;
              game.state = "PLAYING";
              game.playerTurn = sample(Object.values(game.players))!.id;
            }

            console.log("sending udate message");
            console.log(game);
            io.to(gameId).emit(SOCKET_EVENTS.GAME_UPDATE, game);
          }
          cb(canJoin);
        }
      );

      socket.on(SOCKET_EVENTS.SELECT_PIECE, (pieceId: string) => {
        const game = _games[player.gameId];
        if (game?.playerTurn !== player.id) return;

        const piece = player.pieces.find(({ id }) => id === pieceId);
        if (!piece) return;

        player.selectedPieceId = piece.id;
        player.cellIdsThatPieceCanBePlacedIn = game.board
          .filter((cell) => cell.canPlace(piece))
          .map(({ id }) => id);

        socket.emit(SOCKET_EVENTS.GAME_UPDATE, game);
      });

      socket.on(
        SOCKET_EVENTS.PLACE_SELECTED_PIECE_IN_CELL,
        (cellId: string) => {
          const game = _games[player.gameId];
          if (game?.playerTurn !== player.id) return;

          const cell = game.board.find(({ id }) => id === cellId);
          const piece = player.pieces.find(
            ({ id }) => id === player.selectedPieceId
          );
          if (!cell || !piece) return;

          if (player.cellIdsThatPieceCanBePlacedIn.includes(cell.id)) {
            cell.push(piece);
            player.selectedPieceId = "";
            player.cellIdsThatPieceCanBePlacedIn = [];
            const gameEnded = game.validateGameState();
            io.to(player.gameId).emit(SOCKET_EVENTS.GAME_UPDATE, game);

            if (gameEnded) {
              delete _games[player.gameId];
              player = new Player(socket.id);
            }
          }
        }
      );
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
