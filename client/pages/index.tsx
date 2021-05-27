import { Box, Flex, SimpleGrid } from "@chakra-ui/react";
import { sample } from "lodash";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";

const BOARD_SIZE = 3;

interface Game {
  id: string;
  players: [Player, Player];
  playerTurn: string;
  board: ICell[];
  winner: string | null;
}

interface ICell {
  id: string;
  pieces: Piece[];
  getBiggestPiece: () => Piece | null;
}

interface Player {
  id: string;
  name: string;
  pieces: Piece[];
}

interface Piece {
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
  const [selectedPiece, setSelectedPiece] = useState<Piece>();

  const selectPiece = (piece: Piece) => {
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
  console.log(game);

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
      <SimpleGrid columns={BOARD_SIZE} spacing="2" bgColor="gray.300">
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
      </SimpleGrid>
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
      w="200px"
      h="200px"
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
  pieces: Piece[];
  active: boolean;
  selectedPiece: Piece;
  onPieceClick: (piece: Piece) => void;
}> = ({ pieces, active, selectedPiece, onPieceClick }) => {
  return (
    <Flex m="10px" alignItems="center" outline={active ? `2px solid gray` : ""}>
      {pieces.map((piece) => {
        console.log(piece.used);

        return (
          <Box
            key={piece.id}
            cursor={active && !piece.used && "pointer"}
            margin="10px"
            width={`${piece.size}px`}
            visibility={piece.used ? "hidden" : "visible"}
            height={`${piece.size}px`}
            border={`4px solid ${piece.color}`}
            borderRadius="50%"
            outline={
              active && piece.id === selectedPiece?.id && "2px solid white"
            }
            onClick={() => active && onPieceClick(piece)}
          ></Box>
        );
      })}
    </Flex>
  );
};

export default Home;
