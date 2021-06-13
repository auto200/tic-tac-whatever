import { Heading, Input, Button, AspectRatio, Center } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import socketIO, { Socket } from "socket.io-client";
import { SOCKET_EVENTS } from "utils/SOCKET_EVENTS";

const Home = () => {
  const [game, setGame] = useState();
  const [socket, setSocket] = useState<Socket>();
  console.log(socket);
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

  return (
    <>
      <Heading my="25px">Upgraded Bersion of Tic Tac Toe</Heading>
      <AspectRatio w="100%" maxW="400px" ratio={0.85}>
        <video src="/game-preview.mp4" autoPlay muted loop />
      </AspectRatio>
      <Center mt="15px">
        <Input placeholder="Enter your name" />
        <Button px="28px" ml="5px">
          Create a Lobby
        </Button>
      </Center>
    </>
  );
};

export default Home;
