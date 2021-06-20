import {
  Box,
  Center,
  Checkbox,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  Button,
  Text,
  useToast,
  Image,
} from "@chakra-ui/react";
import { FiShare2 } from "react-icons/fi";
import { debounce, sample } from "lodash";
import { useEffect, useState } from "react";
import Board from "../components/Board";
import Pieces from "../components/Pieces";
import { ALLY_PIECES_COLOR, ENEMY_PIECES_COLOR } from "utils/CONSTANTS";
import { useGame } from "contexts/gameContext";
import { useRouter } from "next/dist/client/router";

const WHILE_WAITING_GIFS = [
  "https://media.giphy.com/media/l1Et6k00qp9fMTP8s/giphy.gif",
  "https://media.giphy.com/media/26grMgCg1xZh28AF2/giphy.gif",
  "https://media.giphy.com/media/3o85xu3OLHOVvzZNra/giphy.gif",
  "https://media.giphy.com/media/M8b747E4YlcuXSh71N/giphy.gif",
  "https://media.giphy.com/media/YnZPEeeC7q6pQEZw1I/giphy.gif",
];

const Home = () => {
  const {
    game,
    joinGame,
    playerMap,
    selectPiece,
    placeSelectedPieceInCell,
    endGame,
  } = useGame();
  const [boardSize, setBoardSize] = useState<number>(500);
  const [showOnlyBiggesPieceInCell, setShowOnlyBiggesPieceInCell] =
    useState<boolean>(false);
  const toast = useToast();
  const [whileWaitingGIFSrc] = useState<string>(
    () => sample(WHILE_WAITING_GIFS)!
  );
  const router = useRouter();

  useEffect(() => {
    const MAX_BOARD_WIDTH = 500;
    const handleResize = debounce(() => {
      setBoardSize(
        Math.min(
          document.getElementsByTagName("body")[0].clientWidth,
          MAX_BOARD_WIDTH
        )
      );
    }, 300);
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const { id } = router.query;
    if (!id || typeof id !== "string") return;
    joinGame(id);
  }, [router]);

  return (
    <>
      {game ? (
        <>
          {game.state === "WAITING" && (
            <Box m="auto">
              <Heading>Waiting for other player to join</Heading>
              <Image src={whileWaitingGIFSrc} my={4} />
              <Button
                onClick={async () => {
                  try {
                    await window.navigator.clipboard.writeText(
                      window.location.href
                    );
                    toast({
                      title: "Link copied!",
                      duration: 2000,
                    });
                  } catch (err) {
                    toast({
                      title: "Could not copy link",
                      description: "Please copy link manually from the URL bar",
                      duration: 5000,
                      status: "error",
                    });
                  }
                }}
                rightIcon={<FiShare2 />}
              >
                Copy sharable link
              </Button>
            </Box>
          )}
          {game.state !== "WAITING" && playerMap && (
            <>
              <Box>
                <Heading m="10px">
                  ENEMY
                  {game.winnerId === playerMap.enemy.id && " WON"}
                </Heading>
              </Box>
              <Pieces
                pieces={playerMap.enemy.pieces}
                color={ENEMY_PIECES_COLOR}
                turnActive={
                  game.state === "PLAYING" &&
                  game.playerTurn === playerMap.enemy.id
                }
                owner="ENEMY"
                selectedPieceId={playerMap.enemy.selectedPieceId}
                onPieceClick={selectPiece}
              />
              <Board
                size={boardSize}
                board={game.board}
                active={
                  game.playerTurn === playerMap.ally.id &&
                  !!playerMap.ally.selectedPieceId
                }
                cellIdsThatPieceCanBePlacedIn={
                  playerMap.ally.cellIdsThatPieceCanBePlacedIn
                }
                placeSelectedPieceInCell={placeSelectedPieceInCell}
                showOnlyBiggesPieceInCell={showOnlyBiggesPieceInCell}
                myId={playerMap.ally.id}
                allyColor={ALLY_PIECES_COLOR}
                enemyColor={ENEMY_PIECES_COLOR}
                winningCellsIds={game.winningCellsIds}
              />

              <Pieces
                pieces={playerMap.ally.pieces}
                color={ALLY_PIECES_COLOR}
                turnActive={
                  game.state === "PLAYING" &&
                  game.playerTurn === playerMap.ally.id
                }
                owner="ALLY"
                selectedPieceId={playerMap.ally.selectedPieceId}
                onPieceClick={selectPiece}
              />
              <Box>
                <Heading m="10px">
                  YOU
                  {game.winnerId === playerMap.ally.id && " WON!!!"}
                </Heading>
              </Box>
              <Center mt="50px">
                <Checkbox
                  isChecked={showOnlyBiggesPieceInCell}
                  onChange={(e) =>
                    setShowOnlyBiggesPieceInCell(e.target.checked)
                  }
                  size="lg"
                  mr="5px"
                />
                Show only biggest piece in cell
              </Center>
            </>
          )}
        </>
      ) : (
        <Center m="auto" flexDir="column">
          <Spinner size="lg" />
          <Text>Loading</Text>
        </Center>
      )}
      <Modal
        isOpen={game?.state === "ENDED"}
        onClose={endGame}
        isCentered={true}
        motionPreset="scale"
      >
        <ModalOverlay />
        <ModalContent bgColor="transparent" boxShadow="">
          <ModalBody textAlign="center">
            <Heading>
              {game?.draw && `Draw`}
              {game?.winnerId &&
                playerMap &&
                `${
                  Object.entries(playerMap).find(
                    ([_, player]) => player.id === game.winnerId
                  )![0] === "ally"
                    ? "You"
                    : "Enemy"
                } win`}
            </Heading>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Home;
