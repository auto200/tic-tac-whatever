import { Flex, Square } from "@chakra-ui/react";
import { Cell } from "../classes";

interface Props {
  ableToClick: boolean;
  onClick: () => void;
  cell: Cell;
  canPlace: boolean;
  showOnlyBiggesPiece: boolean;
}
const CellComponent: React.FC<Props> = ({
  onClick,
  ableToClick,
  cell,
  canPlace,
  showOnlyBiggesPiece,
}) => {
  const biggestPieceInCell = cell.biggestPiece;
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
      {showOnlyBiggesPiece && biggestPieceInCell ? (
        <Square
          position="absolute"
          margin="auto"
          cursor={canPlace ? "pointer" : ""}
          size={`${biggestPieceInCell.size}px`}
          border={`4px solid ${biggestPieceInCell.color}`}
          borderRadius="50%"
        />
      ) : (
        cell.pieces.map((piece) => {
          return (
            <Square
              key={piece.id}
              position="absolute"
              margin="auto"
              cursor={canPlace ? "pointer" : ""}
              size={`${piece.size}px`}
              border={`4px solid ${piece.color}`}
              borderRadius="50%"
            />
          );
        })
      )}
    </Flex>
  );
};

export default CellComponent;
