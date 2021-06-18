import { Box, Flex, ScaleFade, Square } from "@chakra-ui/react";
import { ICell } from "utils/classes";

interface Props {
  ableToClick: boolean;
  onClick: () => void;
  cell: ICell;
  showOnlyBiggesPiece: boolean;
  biggestPieceId: string;
  myId: string;
  myPiecesColor: string;
  enemyPiecesColor: string;
  highlight: boolean;
}
const CellComponent: React.FC<Props> = ({
  onClick,
  ableToClick,
  cell,
  showOnlyBiggesPiece,
  biggestPieceId,
  myId,
  myPiecesColor,
  enemyPiecesColor,
  highlight,
}) => {
  const filtredPieces = showOnlyBiggesPiece
    ? cell.pieces.filter(({ id }) => id === biggestPieceId)
    : cell.pieces;

  return (
    <Flex
      position="relative"
      justifyContent="center"
      alignItems="center"
      bgColor={highlight ? "gray.900" : "gray.800"}
      cursor={ableToClick ? "pointer" : ""}
      _hover={ableToClick ? { backgroundColor: "gray.900" } : {}}
      onClick={() => ableToClick && onClick()}
    >
      {filtredPieces.map((piece) => {
        return (
          <Square
            key={piece.id}
            position="absolute"
            margin="auto"
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
    </Flex>
  );
};

export default CellComponent;
