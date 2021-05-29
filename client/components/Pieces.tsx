import { AspectRatio, Box, Grid, Square } from "@chakra-ui/react";
import { Piece } from "../classes";

const Pieces: React.FC<{
  pieces: Piece[];
  active: boolean;
  selectedPiece: Piece | null;
  onPieceClick: (piece: Piece) => void;
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
            cursor={active && !piece.used ? "pointer" : "auto"}
            visibility={piece.used ? "hidden" : "visible"}
            outline={
              active && piece.id === selectedPiece?.id ? "2px solid white" : ""
            }
            onClick={() => active && onPieceClick(piece)}
          >
            <Box>
              <Square
                border={`4px solid ${piece.color}`}
                borderRadius="50%"
                size={`${piece.size}%`}
              />
            </Box>
          </AspectRatio>
        );
      })}
    </Grid>
  );
};

export default Pieces;