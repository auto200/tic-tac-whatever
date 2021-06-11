import { AspectRatio, Grid, ScaleFade, Square } from "@chakra-ui/react";
import { Piece } from "../classes";

const Pieces: React.FC<{
  pieces: Piece[];
  color: string;
  turnActive: boolean;
  selectedPiece: Piece | null;
  onPieceClick: (piece: Piece) => void;
}> = ({ pieces, color, turnActive, selectedPiece, onPieceClick }) => {
  return (
    <Grid
      gridTemplateColumns="repeat(auto-fill, minmax(80px, 1fr))"
      gridGap="5px"
      p="5px"
      m="10px"
      w="100%"
      maxW="550px"
      outline={[null, null, turnActive ? `2px solid gray` : ""]}
      bgColor={turnActive ? "gray.700" : "gray.800"}
    >
      {pieces.map((piece) => {
        return (
          <AspectRatio
            ratio={1}
            key={piece.id}
            cursor={turnActive && !piece.used ? "pointer" : "auto"}
            outline={
              turnActive && piece.id === selectedPiece?.id
                ? "2px solid white"
                : ""
            }
            onClick={() => !piece.used && onPieceClick(piece)}
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
