import { Grid, Square } from "@chakra-ui/layout";
import { ICell } from "utils/classes";
// import { IPiece } from "utils/classes";
import CellComponent from "./Cell";

interface Props {
  size: number;
  board: ICell[];
  active: boolean;
  cellIdsThatPieceCanBePlacedIn: string[];
  placeSelectedPieceInCell: (cellId: string) => void;
  // showOnlyBiggesPieceInCell: boolean;
  myId: string;
  allyColor: string;
  enemyColor: string;
}

const Board: React.FC<Props> = ({
  size,
  board,
  active,
  cellIdsThatPieceCanBePlacedIn,
  placeSelectedPieceInCell,
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
          const canPlace =
            active && cellIdsThatPieceCanBePlacedIn.includes(cell.id);
          return (
            <CellComponent
              key={cell.id}
              ableToClick={canPlace}
              onClick={() => {
                placeSelectedPieceInCell(cell.id);
              }}
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
