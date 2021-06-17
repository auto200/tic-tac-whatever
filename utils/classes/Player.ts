import { nanoid } from "nanoid";
import { IPiece, Piece } from "./";

export interface IPlayer {
  id: string;
  enemyId: string;
  pieces: IPiece[];
  gameId: string;
  selectedPieceId: string;
}

export class Player {
  id: string;
  enemyId: string;
  pieces: Piece[];
  gameId: string;
  selectedPieceId: string;
  constructor(id: string = nanoid()) {
    this.id = id;
    this.enemyId = "";
    this.pieces = [
      new Piece(this.id, 100),
      new Piece(this.id, 100),
      new Piece(this.id, 60),
      new Piece(this.id, 60),
      new Piece(this.id, 20),
      new Piece(this.id, 20),
    ];
    this.gameId = "";
    this.selectedPieceId = "";
  }

  toTransport(): IPlayer {
    return {
      id: this.id,
      enemyId: this.enemyId,
      pieces: this.pieces.map(({ toTransport }) => toTransport()),
      gameId: this.gameId,
      selectedPieceId: this.selectedPieceId,
    };
  }
}
