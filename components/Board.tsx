import { Grid, Square } from "@chakra-ui/layout";
import { ICell } from "utils/classes";
// import { IPiece } from "utils/classes";
import CellComponent from "./Cell";

interface Props {
  size: number;
  board: ICell[];
  // allyTurn: boolean;
  // selectedPiece: IPiece | null;
  // placePieceInCell: (piece: IPiece, cell: ICell) => void;
  // showOnlyBiggesPieceInCell: boolean;
  myId: string;
  allyColor: string;
  enemyColor: string;
}

const Board: React.FC<Props> = ({
  size,
  board,
  // allyTurn,
  // selectedPiece,
  // placePieceInCell,
  // showOnlyBiggesPieceInCell,
  myId,
  allyColor,
  enemyColor,
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
          // const canPlace = !!selectedPiece && cell.canPlace(selectedPiece);
          return (
            <CellComponent
              key={cell.id}
              // ableToClick={canPlace}
              // onClick={() => {
              //   if (canPlace) {
              //     placePieceInCell(selectedPiece!, cell);
              //   }
              // }}
              cell={cell}
              // canPlace={canPlace}
              // showOnlyBiggesPiece={showOnlyBiggesPieceInCell}
              myId={myId}
              myPiecesColor={allyColor}
              enemyPiecesColor={enemyColor}
            />
          );
        })}
      </Grid>
    </Square>
  );
};

export default Board;
