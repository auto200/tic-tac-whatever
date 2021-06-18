import {
  Box,
  Center,
  Checkbox,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
} from "@chakra-ui/react";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import Board from "../components/Board";
import Pieces from "../components/Pieces";
import { ALLY_PIECES_COLOR, ENEMY_PIECES_COLOR } from "utils/CONSTANTS";
import { useGame } from "contexts/gameContext";

const Home = () => {
  const { game, playerMap, selectPiece, placeSelectedPieceInCell } = useGame();
  const [boardSize, setBoardSize] = useState<number>(500);
  const [showOnlyBiggesPieceInCell, setShowOnlyBiggesPieceInCell] =
    useState<boolean>(false);

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

  return (
    <>
      {game ? (
        <>
          {game.state === "WAITING" && "Waiting for other player to join"}
          {game.state === "PLAYING" && playerMap && (
            <>
              <Box>
                <Heading m="10px">
                  ENEMY
                  {game.winnerId === playerMap.enemy.id && " WINNER!!!"}
                </Heading>
              </Box>
              <Pieces
                pieces={playerMap.enemy.pieces}
                color={ENEMY_PIECES_COLOR}
                turnActive={
                  !game.winnerId && game.playerTurn == playerMap.enemy.id
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
                // showOnlyBiggesPieceInCell={showOnlyBiggesPieceInCell}
                myId={playerMap.ally.id}
                allyColor={ALLY_PIECES_COLOR}
                enemyColor={ENEMY_PIECES_COLOR}
              />

              <Pieces
                pieces={playerMap.ally.pieces}
                color={ALLY_PIECES_COLOR}
                turnActive={
                  !game.winnerId && game.playerTurn === playerMap.ally.id
                }
                owner="ALLY"
                selectedPieceId={playerMap.ally.selectedPieceId}
                onPieceClick={selectPiece}
              />
              <Box>
                <Heading m="10px">
                  YOU
                  {game.winnerId === playerMap.ally.id && " WINNER!!!"}
                </Heading>
              </Box>
            </>
          )}
        </>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default Home;
