import { nanoid } from "nanoid";
import { IPiece, Piece } from "./";

export interface ICell {
  id: string;
  pieces: IPiece[];
}

export class Cell implements ICell {
  id: string;
  pieces: Piece[];
  constructor() {
    this.id = nanoid();
    this.pieces = [];
  }

  get biggestPiece(): Piece | null {
    if (this.pieces.length <= 0) return null;

    return this.pieces.reduce((prev, current) =>
      prev.size > current.size ? prev : current
    );
  }

  canPlace(piece: Piece) {
    if (piece.used) return false;

    const biggestPiece = this.biggestPiece;
    if (!biggestPiece) {
      return true;
    }
    if (piece.size > biggestPiece.size) {
      return true;
    }

    return false;
  }

  push(piece: Piece) {
    if (this.canPlace(piece)) {
      piece.used = true;
      this.pieces.push(piece);
    }
  }
}
