import { Box, Flex, ScaleFade, Square } from "@chakra-ui/react";
import { ICell } from "utils/classes";

interface Props {
  ableToClick: boolean;
  onClick: () => void;
  cell: ICell;
  // canPlace: boolean;
  // showOnlyBiggesPiece: boolean;
  myId: string;
  myPiecesColor: string;
  enemyPiecesColor: string;
}
const CellComponent: React.FC<Props> = ({
  onClick,
  ableToClick,
  cell,
  // canPlace,
  // showOnlyBiggesPiece,
  myId,
  myPiecesColor,
  enemyPiecesColor,
}) => {
  // const biggestPieceInCell = cell.biggestPiece;
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
      {/* {showOnlyBiggesPiece && biggestPieceInCell ? (
        <Square
          position="absolute"
          margin="auto"
          cursor={canPlace ? "pointer" : ""}
          size={`${biggestPieceInCell.size}px`}
          border={`4px solid ${
            biggestPieceInCell.owner === myId ? myPiecesColor : enemyPiecesColor
          }`}
          borderRadius="50%"
        />
      ) : ( */}
      {cell.pieces.map((piece) => {
        return (
          <Square
            key={piece.id}
            position="absolute"
            margin="auto"
            // cursor={canPlace ? "pointer" : ""}
            size={`${piece.size}px`}
          >
            <ScaleFade in={true} style={{ width: "100%", height: "100%" }}>
              <Box
                w="100%"
                h="100%"
                border={`4px solid ${
                  piece.ownerId === myId ? myPiecesColor : enemyPiecesColor
                }`}
                borderRadius="50%"
              ></Box>
            </ScaleFade>
          </Square>
        );
      })}
      {/* )} */}
    </Flex>
  );
};

export default CellComponent;
