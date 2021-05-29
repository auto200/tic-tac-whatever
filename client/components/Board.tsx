import { Grid, Square } from "@chakra-ui/layout";
import { Cell, Piece, Player } from "../classes";
import CellComponent from "./Cell";

interface Props {
  size: number;
  board: Cell[];
  winner: Player | null;
  selectedPiece: Piece | null;
  placePieceInCell: (piece: Piece, cell: Cell) => void;
  showOnlyBiggesPieceInCell: boolean;
  myId: string;
  myPiecesColor: string;
  enemyPiecesColor: string;
}

const Board: React.FC<Props> = ({
  size,
  board,
  winner,
  selectedPiece,
  placePieceInCell,
  showOnlyBiggesPieceInCell,
  myId,
  myPiecesColor,
  enemyPiecesColor,
}) => {
  return (
    <Square size={size}>
      <Grid
        templateColumns="repeat(3, 1fr)"
        gridGap="10px"
        bgColor="gray.300"
        w="100%"
        maxW="500px"
        h="100%"
        maxH="500px"
      >
        {board.map((cell) => {
          const canPlace =
            !winner && selectedPiece ? cell.canPlace(selectedPiece) : false;
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
              showOnlyBiggesPiece={showOnlyBiggesPieceInCell}
              myId={myId}
              myPiecesColor={myPiecesColor}
              enemyPiecesColor={enemyPiecesColor}
            />
          );
        })}
      </Grid>
    </Square>
  );
};

export default Board;
