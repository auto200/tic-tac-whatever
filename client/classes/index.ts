import { nanoid } from "nanoid";

export class Game {
  id: string;
  players: [Player, Player];
  playerTurn: string;
  board: Cell[];
  winner: string | null;

  constructor() {
    this.id = nanoid();
    this.players = [
      new Player("player2", "red"),
      new Player("player1", "green"),
    ];
    this.playerTurn = "";
    this.board = new Array<Cell>(3 * 3)
      .fill(null as unknown as Cell)
      .map(() => new Cell());
    this.winner = null;
  }

  //   checkForWinner(): string | null {
  //     for (let condition of WINNING_CONDITIONS) {
  //       const a = this.board[condition[0]].biggestPiece?.owner;
  //       const b = this.board[condition[1]].biggestPiece?.owner;
  //       const c = this.board[condition[2]].biggestPiece?.owner;
  //       if (!a || !b || !c) {
  //         continue;
  //       }
  //       if (a === b && b === c) {
  //         this.winner = a;
  //         return a;
  //       }
  //     }
  //     return null;
  //   }
}
export class Cell {
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

export class Player {
  id: string;
  name: string;
  pieces: Piece[];
  constructor(name: string, color: string) {
    this.id = nanoid();
    this.name = name;
    this.pieces = [
      new Piece(this.id, 100, color),
      new Piece(this.id, 100, color),
      new Piece(this.id, 60, color),
      new Piece(this.id, 60, color),
      new Piece(this.id, 20, color),
      new Piece(this.id, 20, color),
    ];
  }
}

export class Piece {
  id: string;
  owner: string;
  size: number;
  used: boolean;
  color: string;
  constructor(owner: string, size: number, color: string) {
    this.id = nanoid();
    this.owner = owner;
    this.size = size;
    this.used = false;
    this.color = color;
  }
}