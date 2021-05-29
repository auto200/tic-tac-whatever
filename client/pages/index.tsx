import { Box, Center, Checkbox, Flex } from "@chakra-ui/react";
import { debounce, sample } from "lodash";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { Cell, Game, Piece, Player } from "../classes";
import Board from "../components/Board";
import Pieces from "../components/Pieces";
import { WINNING_CONDITIONS } from "../utils/constants";

const Home = () => {
  const [game, setGame] = useImmer<Omit<Game, "checkForWinner">>({
    id: nanoid(),
    players: [new Player("player2", "red"), new Player("player1", "green")],
    playerTurn: "",
    board: new Array(3 * 3).fill(null).map(() => new Cell()),
    winner: null,
  });
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [boardSize, setBoardSize] = useState<number>(500);
  const [showOnlyBiggesPieceInCell, setShowOnlyBiggesPieceInCell] =
    useState<boolean>(false);

  useEffect(() => {
    setGame((draft) => {
      const randomPlayer = sample(draft.players);
      if (randomPlayer) {
        draft.playerTurn = randomPlayer.id;
      }
    });

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
          draft.winner = a;
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
          {game.players[0].name}{" "}
          {game.winner == game.players[0].id && "WINNER!!!"}
        </Box>
        <Pieces
          pieces={game.players[0].pieces}
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
        />

        <Pieces
          pieces={game.players[1].pieces}
          active={!game.winner && game.players[1].id == game.playerTurn}
          selectedPiece={selectedPiece}
          onPieceClick={selectPiece}
        />
        <Box>
          {game.players[1].name}{" "}
          {game.winner == game.players[1].id && "WINNER!!!"}
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
    </>
  );
};

export default Home;
