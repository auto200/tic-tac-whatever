import { AspectRatio, Box, Flex, Grid, Square } from "@chakra-ui/react";
import { debounce, sample } from "lodash";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";

const BOARD_SIZE = 3;

const WINNING_CONDITIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

class Game {
  id: string;
  players: [Player, Player];
  playerTurn: string;
  board: Cell[];
  winner: string | null;
  // [immerable] = true;

  constructor(boardSize: number = 3) {
    this.id = nanoid();
    this.players = [
      new Player("player2", "red"),
      new Player("player1", "green"),
    ];
    this.playerTurn = "";
    this.board = new Array<Cell>(boardSize * boardSize)
      .fill(null as unknown as Cell)
      .map(() => new Cell());
    this.winner = null;
  }

  checkForWinner(): string | null {
    for (let condition of WINNING_CONDITIONS) {
      const a = this.board[condition[0]].biggestPiece?.owner;
      const b = this.board[condition[1]].biggestPiece?.owner;
      const c = this.board[condition[2]].biggestPiece?.owner;
      if (!a || !b || !c) {
        continue;
      }
      if (a === b && b === c) {
        this.winner = a;
        return a;
      }
    }
    return null;
  }
}
class Cell {
  id: string;
  pieces: Piece[];
  constructor() {
    this.id = nanoid();
    this.pieces = [];
  }

  get biggestPiece(): Piece | null {
    if (this.pieces.length <= 0) return null;
    return this.pieces.reduce((prev, current) =>
      prev.size > current.size ? prev : current
    );
  }

  canPlace(piece: Piece) {
    const biggestPiece = this.biggestPiece;
    if (!biggestPiece) {
      return true;
    }
    if (piece.size > biggestPiece.size) {
      return true;
    }

    return false;
  }

  push(piece: Piece) {
    if (this.canPlace(piece)) {
      this.pieces.push(piece);
    }
  }
}

class Player {
  id: string;
  name: string;
  pieces: Piece[];
  constructor(name: string, color: string) {
    this.id = nanoid();
    this.name = name;
    this.pieces = [
      new Piece(this.id, 100, color),
      new Piece(this.id, 100, color),
      new Piece(this.id, 60, color),
      new Piece(this.id, 60, color),
      new Piece(this.id, 20, color),
      new Piece(this.id, 20, color),
    ];
  }
}

class Piece {
  id: string;
  owner: string;
  size: number;
  used: boolean;
  color: string;
  constructor(owner: string, size: number, color: string) {
    this.id = nanoid();
    this.owner = owner;
    this.size = size;
    this.used = false;
    this.color = color;
  }
}

const Home = () => {
  const [game, setGame] = useImmer<Omit<Game, "checkForWinner">>({
    id: nanoid(),
    players: [new Player("player2", "red"), new Player("player1", "green")],
    playerTurn: "",
    board: new Array(BOARD_SIZE * BOARD_SIZE).fill(null).map(() => new Cell()),
    winner: null,
  });
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [boardSize, setBoardSize] = useState<number>(500);

  useEffect(() => {
    const setLimitedSize = () => {
      setBoardSize(window.innerWidth <= 500 ? window.innerWidth : 500);
    };
    setLimitedSize();

    const handleResize = debounce(() => {
      setLimitedSize();
    }, 300);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const selectPiece = (piece: Piece) => {
    setSelectedPiece(piece);
  };

  const checkForWinner = (): boolean => {
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
        return true;
      }
    }
    return false;
  };

  const placePieceInCell = (piece: Piece, cell: Cell) => {
    setGame((draft) => {
      if (!selectedPiece) return;

      cell.push(selectedPiece);

      piece.used = true;

      checkForWinner();

      // toggle turn
      if (draft.players[0].id === draft.playerTurn) {
        draft.playerTurn = draft.players[1].id;
      } else {
        draft.playerTurn = draft.players[0].id;
      }
    });
    setSelectedPiece(null);
  };

  useEffect(() => {
    setGame((draft) => {
      const randomPlayer = sample(draft.players);
      if (randomPlayer) {
        draft.playerTurn = randomPlayer.id;
      }
    });
  }, []);

  return (
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
      <PiecesContainer
        pieces={game.players[0].pieces}
        active={!game.winner && game.players[0].id == game.playerTurn}
        selectedPiece={selectedPiece}
        onPieceClick={selectPiece}
      />
      <Square size={boardSize}>
        <Grid
          templateColumns="repeat(3, 1fr)"
          gridGap="10px"
          bgColor="gray.300"
          w="100%"
          maxW="500px"
          h="100%"
          maxH="500px"
        >
          {game.board.map((cell) => {
            const canPlace =
              selectedPiece && !game.winner
                ? cell.canPlace(selectedPiece)
                : false;
            return (
              <CellComponent
                key={cell.id}
                ableToClick={canPlace}
                onClick={() => {
                  if (canPlace) {
                    placePieceInCell(selectedPiece!, cell);
                  }
                }}
                cell={cell}
                canPlace={canPlace}
              />
            );
          })}
        </Grid>
      </Square>
      <PiecesContainer
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
  );
};

export default Home;

const CellComponent: React.FC<{
  ableToClick: boolean;
  onClick: () => void;
  cell: Cell;
  canPlace: boolean;
}> = ({ onClick, ableToClick, cell, canPlace }) => {
  return (
    <Flex
      position="relative"
      justifyContent="center"
      alignItems="center"
      bgColor="gray.800"
      cursor={ableToClick ? "pointer" : ""}
      _hover={ableToClick ? { backgroundColor: "gray.900" } : {}}
      onClick={() => ableToClick && onClick()}
    >
      {cell.pieces.map((piece) => {
        return (
          <Box
            key={piece.id}
            position="absolute"
            margin="auto"
            cursor={canPlace ? "pointer" : ""}
            width={`${piece.size}px`}
            height={`${piece.size}px`}
            border={`4px solid ${piece.color}`}
            borderRadius="50%"
          ></Box>
        );
      })}
    </Flex>
  );
};

const PiecesContainer: React.FC<{
  pieces: Piece[];
  active: boolean;
  selectedPiece: Piece | null;
  onPieceClick: (piece: Piece) => void;
}> = ({ pieces, active, selectedPiece, onPieceClick }) => {
  return (
    <Grid
      gridTemplateColumns="repeat(auto-fill, minmax(80px, 1fr))"
      gridGap="5px"
      m="10px"
      w="100%"
      maxW="550px"
      outline={active ? `2px solid gray` : ""}
    >
      {pieces.map((piece) => {
        return (
          <AspectRatio
            ratio={1}
            key={piece.id}
            cursor={active && !piece.used ? "pointer" : "auto"}
            visibility={piece.used ? "hidden" : "visible"}
            outline={
              active && piece.id === selectedPiece?.id ? "2px solid white" : ""
            }
            onClick={() => active && onPieceClick(piece)}
          >
            <Box>
              <Box
                border={`4px solid ${piece.color}`}
                borderRadius="50%"
                w={`${piece.size}%`}
                h={`${piece.size}%`}
              />
            </Box>
          </AspectRatio>
        );
      })}
    </Grid>
  );
};
