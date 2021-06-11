import { useEffect, useState } from "react";
import socketIO, { Socket } from "socket.io-client";
import { SOCKET_EVENTS } from "utils/SOCKET_EVENTS";

const Home = () => {
  const [game, setGame] = useState();
  const [socket, setSocket] = useState<Socket>();
  console.log(socket)
  useEffect(() => {
    const socket = socketIO();
    setSocket(socket);
    //@ts-ignore
    window.socket = socket;

    socket.on(SOCKET_EVENTS.GAME_UPDATE, (game) => setGame(game));

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log(game);
  }, [game]);

  return <></>;
};

export default Home;
