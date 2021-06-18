import { IPiece, Piece } from "./";

export interface IPlayer {
  id: string;
  enemyId: string;
  pieces: IPiece[];
  gameId: string;
  selectedPieceId: string;
  cellIdsThatPieceCanBePlacedIn: string[];
}

export class Player implements IPlayer {
  id: string;
  enemyId: string;
  pieces: Piece[];
  gameId: string;
  selectedPieceId: string;
  cellIdsThatPieceCanBePlacedIn: string[];

  constructor(id: string) {
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
    this.cellIdsThatPieceCanBePlacedIn = [];
  }
}
