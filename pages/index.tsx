import { Heading, Button, AspectRatio, Center } from "@chakra-ui/react";
import { useGame } from "contexts/gameContext";

const Home = () => {
  const { createGame } = useGame();

  return (
    <>
      <Heading my="25px">Upgraded Bersion of Tic Tac Toe</Heading>
      <AspectRatio w="100%" maxW="400px" ratio={0.85}>
        <video src="/game-preview.mp4" autoPlay muted loop />
      </AspectRatio>
      <Center mt="15px">
        <Button
          colorScheme="blue"
          px="28px"
          ml="5px"
          onClick={() => {
            createGame();
          }}
        >
          Create Game
        </Button>
      </Center>
    </>
  );
};

export default Home;
