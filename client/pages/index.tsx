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
} from "@chakra-ui/react";
import { debounce, sample } from "lodash";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { Cell, Game, Piece, Player } from "../classes";
import Board from "../components/Board";
import Pieces from "../components/Pieces";
import {
  WINNING_CONDITIONS,
  MY_PIECES_COLOR,
  ENEMY_PIECES_COLOR,
} from "../utils/constants";

const getNewGame = (): Omit<Game, "checkForWinner"> => ({
  id: nanoid(),
  players: [new Player("player2"), new Player("player1")],
  playerTurn: "",
  board: new Array(3 * 3).fill(null).map(() => new Cell()),
  winner: null,
});

const Home = () => {
  const [game, setGame] = useImmer<Omit<Game, "checkForWinner">>(() =>
    getNewGame()
  );
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [boardSize, setBoardSize] = useState<number>(500);
  const [showOnlyBiggesPieceInCell, setShowOnlyBiggesPieceInCell] =
    useState<boolean>(false);

  const pickRandomPlayer = () => {
    setGame((draft) => {
      const randomPlayer = sample(draft.players);
      if (randomPlayer) {
        draft.playerTurn = randomPlayer.id;
      }
    });
  };

  useEffect(() => {
    pickRandomPlayer();
    const handleResize = debounce(() => {
      setBoardSize(
        Math.min(document.getElementsByTagName("body")[0].clientWidth, 500)
      );
    }, 300);
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const selectPiece = (piece: Piece) => {
    setSelectedPiece(piece);
  };

  //https://dev.to/bornasepic/pure-and-simple-tic-tac-toe-with-javascript-4pgn
  const checkForWinner = () => {
    for (let condition of WINNING_CONDITIONS) {
      const a = game.board[condition[0]].biggestPiece?.owner;
      const b = game.board[condition[1]].biggestPiece?.owner;
      const c = game.board[condition[2]].biggestPiece?.owner;
      if (!a || !b || !c) {
        continue;
      }
      if (a === b && b === c) {
        setGame((draft) => {
          const winner = draft.players.find(({ id }) => id === a);
          draft.winner = winner!;
        });
        break;
      }
    }
  };

  const placePieceInCell = (piece: Piece, cell: Cell) => {
    setGame((draft) => {
      if (!piece) return;

      cell.push(piece);

      checkForWinner();

      // toggle turn
      if (draft.playerTurn === draft.players[0].id) {
        draft.playerTurn = draft.players[1].id;
      } else {
        draft.playerTurn = draft.players[0].id;
      }
    });
    setSelectedPiece(null);
  };

  return (
    <>
      <Flex
        w="100%"
        h="100%"
        flexDir="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box>
          <Heading m="10px">
            {game.players[0].name}{" "}
            {game.winner?.id == game.players[0].id && "WINNER!!!"}
          </Heading>
        </Box>
        <Pieces
          pieces={game.players[0].pieces}
          color={ENEMY_PIECES_COLOR}
          active={!game.winner && game.players[0].id == game.playerTurn}
          selectedPiece={selectedPiece}
          onPieceClick={selectPiece}
        />
        <Board
          size={boardSize}
          board={game.board}
          winner={game.winner}
          selectedPiece={selectedPiece}
          placePieceInCell={placePieceInCell}
          showOnlyBiggesPieceInCell={showOnlyBiggesPieceInCell}
          myId={game.players[1].id}
          myPiecesColor={MY_PIECES_COLOR}
          enemyPiecesColor={ENEMY_PIECES_COLOR}
        />

        <Pieces
          pieces={game.players[1].pieces}
          color={MY_PIECES_COLOR}
          active={!game.winner && game.players[1].id == game.playerTurn}
          selectedPiece={selectedPiece}
          onPieceClick={selectPiece}
        />
        <Box>
          <Heading m="10px">
            {game.players[1].name}{" "}
            {game.winner?.id == game.players[1].id && "WINNER!!!"}
          </Heading>
        </Box>
      </Flex>
      <Center mt="50px">
        <Checkbox
          isChecked={showOnlyBiggesPieceInCell}
          onChange={(e) => setShowOnlyBiggesPieceInCell(e.target.checked)}
          size="lg"
          mr="5px"
        />
        Show only biggest piece in cell
      </Center>
      <Modal
        isOpen={!!game.winner}
        onClose={() => {
          setGame(getNewGame());
          setSelectedPiece(null);
          pickRandomPlayer();
        }}
        isCentered={true}
        motionPreset="scale"
      >
        <ModalOverlay />
        <ModalContent bgColor="transparent" boxShadow="">
          <ModalBody textAlign="center">
            <Heading>{game.winner?.name} is a winner</Heading>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Home;
