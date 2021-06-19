import { AspectRatio, Grid, ScaleFade, Square } from "@chakra-ui/react";
import { IPiece } from "utils/classes/index";

const Pieces: React.FC<{
  pieces: IPiece[];
  color: string;
  turnActive: boolean;
  owner: "ENEMY" | "ALLY";
  selectedPieceId: string;
  onPieceClick: (pieceId: string) => void;
}> = ({ pieces, color, turnActive, owner, selectedPieceId, onPieceClick }) => {
  return (
    <Grid
      gridTemplateColumns="repeat(auto-fill, minmax(80px, 1fr))"
      gridGap="5px"
      p="5px"
      m="10px"
      w="100%"
      maxW="550px"
      outline={[null, turnActive ? `2px solid gray` : null]}
      bgColor={turnActive ? "gray.700" : "gray.800"}
    >
      {pieces.map((piece) => {
        const canClickOnPiece = owner === "ALLY" && turnActive && !piece.used;
        return (
          <AspectRatio
            ratio={1}
            key={piece.id}
            cursor={canClickOnPiece ? "pointer" : "auto"}
            outline={
              turnActive && piece.id === selectedPieceId
                ? "2px solid white"
                : ""
            }
            onClick={() => canClickOnPiece && onPieceClick(piece.id)}
          >
            <ScaleFade in={!piece.used}>
              <Square
                border={`4px solid ${color}`}
                borderRadius="50%"
                size={`${piece.size}%`}
              />
            </ScaleFade>
          </AspectRatio>
        );
      })}
    </Grid>
  );
};

export default Pieces;
