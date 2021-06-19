import { useRouter } from "next/dist/client/router";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { IGame, IPlayer } from "utils/classes";
import { SOCKET_EVENTS } from "utils/SOCKET_EVENTS";

interface PlayerMap {
  ally: IPlayer;
  enemy: IPlayer;
}

interface IGameContext {
  game: IGame | null;
  createGame: () => void;
  playerMap: PlayerMap | null;
  selectPiece: (pieceId: string) => void;
  placeSelectedPieceInCell: (cellId: string) => void;
  endGame: () => void;
}

const GameContext = createContext<IGameContext>({
  game: null,
  createGame: () => {},
  playerMap: null,
  selectPiece: () => {},
  placeSelectedPieceInCell: () => {},
  endGame: () => {},
});

const GameProvider: React.FC = ({ children }) => {
  const [game, setGame] = useState<IGame | null>(null);
  const [socket, setSocket] = useState<Socket>();
  const [playerMap, setPlayerMap] = useState<PlayerMap | null>(null);

  const router = useRouter();

  const createGame = () => {
    socket?.emit(SOCKET_EVENTS.CREATE_GAME, (id: string) => {
      router.push({ pathname: "/game", query: { id } });
    });
  };

  const selectPiece = (pieceId: string) => {
    socket?.emit(SOCKET_EVENTS.SELECT_PIECE, pieceId);
  };

  const placeSelectedPieceInCell = (cellId: string) => {
    socket?.emit(SOCKET_EVENTS.PLACE_SELECTED_PIECE_IN_CELL, cellId);
  };

  const endGame = () => {
    setGame(null);
    router.push("/");
  };

  useEffect(() => {
    const socket = io();

    socket.on("connect", () => {
      setSocket(socket);
    });

    socket.on(SOCKET_EVENTS.GAME_UPDATE, (game) => setGame(game));

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    const { id } = router.query;
    if (!id) return;

    socket.emit(SOCKET_EVENTS.JOIN_GAME, id, (joined: boolean) => {
      if (!joined) {
        router.push("/");
      }
    });
  }, [socket, router]);

  useEffect(() => {
    if (!game) return;

    if (router.query.id !== game.id) {
      router.push({ pathname: "/game", query: { id: game.id } });
    }
  }, [game, router]);

  useEffect(() => {
    if (!socket || !game) return;
    const player = game.players?.[socket.id];
    if (!player?.enemyId) return;

    setPlayerMap({
      ally: player,
      enemy: game.players[player.enemyId]!,
    });
  }, [socket, game]);

  const value = {
    game,
    createGame,
    playerMap,
    selectPiece,
    placeSelectedPieceInCell,
    endGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export default GameProvider;

export const useGame = () => useContext(GameContext);
