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

interface Game {
  id: string;
  players: [Player, Player];
  playerTurn: string;
  board: ICell[];
  winner: string | null;
}

interface ICell {
  id: string;
  pieces: IPiece[];
  getBiggestPiece: () => IPiece | null;
}

interface Player {
  id: string;
  name: string;
  pieces: IPiece[];
}

interface IPiece {
  id: string;
  owner: string;
  size: number;
  used: boolean;
  color: string;
}

const getPlayer = (name: string = "player", pieceColor = "red"): Player => {
  const id = nanoid();
  return {
    id,
    name: name,
    pieces: [
      { id: nanoid(), owner: id, size: 100, used: false, color: pieceColor },
      { id: nanoid(), owner: id, size: 100, used: false, color: pieceColor },
      { id: nanoid(), owner: id, size: 60, used: false, color: pieceColor },
      { id: nanoid(), owner: id, size: 60, used: false, color: pieceColor },
      { id: nanoid(), owner: id, size: 20, used: false, color: pieceColor },
      { id: nanoid(), owner: id, size: 20, used: false, color: pieceColor },
    ],
  };
};

const Home = () => {
  const [game, setGame] = useImmer<Game>(() => ({
    id: nanoid(),
    players: [getPlayer("player2"), getPlayer("player1", "green")],
    playerTurn: "",
    board: new Array<ICell>(BOARD_SIZE * BOARD_SIZE)
      .fill(null)
      .map<ICell>(() => ({
        id: nanoid(),
        pieces: [],
        getBiggestPiece() {
          if ((this as ICell).pieces.length <= 0) return null;
          return (this as ICell).pieces.reduce((prev, current) =>
            prev.size > current.size ? prev : current
          );
        },
      })),
    winner: null,
  }));
  const [selectedPiece, setSelectedPiece] = useState<IPiece>();
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

  const selectPiece = (piece: IPiece) => {
    setSelectedPiece(piece);
  };

  const placePieceInCell = (cell: ICell) => {
    setGame((draft) => {
      const piece = { ...selectedPiece, used: true };

      draft.board.find(({ id }) => id === cell.id).pieces.push(piece);

      {
        const pieces = draft.players.find(
          ({ id }) => id === piece.owner
        ).pieces;
        pieces.splice(
          pieces.findIndex((oldPiece) => oldPiece.id === piece.id),
          1,
          piece
        );
      }

      draft.playerTurn = draft.players.find(
        ({ id }) => id !== draft.playerTurn
      ).id;
    });
    setSelectedPiece(null);
  };

  useEffect(() => {
    setGame((draft) => {
      draft.playerTurn = sample(game.players).id;
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
      <Box>{game.players[0].name}</Box>
      <PiecesContainer
        pieces={game.players[0].pieces}
        active={game.players[0].id == game.playerTurn}
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
            let canPlace = false;
            if (selectedPiece) {
              const biggestPiece = cell.getBiggestPiece();
              if (biggestPiece) {
                if (selectedPiece.size > biggestPiece.size) {
                  canPlace = true;
                }
              } else {
                canPlace = true;
              }
            } else {
              canPlace = false;
            }
            return (
              <Cell
                key={cell.id}
                ableToClick={canPlace}
                onClick={() => {
                  if (canPlace) {
                    placePieceInCell(cell);
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
        active={game.players[1].id == game.playerTurn}
        selectedPiece={selectedPiece}
        onPieceClick={selectPiece}
      />
      <Box>{game.players[1].name}</Box>
    </Flex>
  );
};

export default Home;

const Cell: React.FC<{
  ableToClick: boolean;
  onClick: () => void;
  cell: ICell;
  canPlace: boolean;
}> = ({ onClick, ableToClick, cell, canPlace }) => {
  return (
    <Flex
      position="relative"
      justifyContent="center"
      alignItems="center"
      bgColor="gray.800"
      cursor={ableToClick && "pointer"}
      _hover={ableToClick && { backgroundColor: "gray.900" }}
      onClick={() => ableToClick && onClick()}
    >
      {cell.pieces.map((piece) => {
        return (
          <Box
            key={piece.id}
            position="absolute"
            margin="auto"
            cursor={canPlace && "pointer"}
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
  pieces: IPiece[];
  active: boolean;
  selectedPiece: IPiece;
  onPieceClick: (piece: IPiece) => void;
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
            cursor={active && !piece.used && "pointer"}
            visibility={piece.used ? "hidden" : "visible"}
            outline={
              active && piece.id === selectedPiece?.id && "2px solid white"
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
