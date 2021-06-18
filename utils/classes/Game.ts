import { WINNING_CONDITIONS } from "utils/CONSTANTS";
import { IPlayer, Player, ICell, Cell } from "./";

export interface IGame {
  id: string;
  state: "WAITING" | "PLAYING" | "ENDED";
  players: { [key: string]: IPlayer };
  playerTurn: string;
  board: ICell[];
  winnerId: string;
  draw: boolean;
  winningCellsIds: string[];
}

export class Game implements IGame {
  id: string;
  state: "WAITING" | "PLAYING" | "ENDED";
  players: { [key: string]: Player };
  playerTurn: string;
  board: Cell[];
  winnerId: string;
  draw: boolean;
  winningCellsIds: string[];

  constructor(id: string) {
    this.id = id;
    this.state = "WAITING";
    this.players = {};
    this.playerTurn = "";
    this.board = new Array<Cell>(3 * 3)
      .fill(null as unknown as Cell)
      .map(() => new Cell());
    this.winnerId = "";
    this.draw = false;
    this.winningCellsIds = [];
  }

  //https://dev.to/bornasepic/pure-and-simple-tic-tac-toe-with-javascript-4pgn
  validateGameState(): boolean {
    for (const [condA, condB, condC] of WINNING_CONDITIONS) {
      const cellA = this.board[condA];
      const cellB = this.board[condB];
      const cellC = this.board[condC];

      const cellAOwner = cellA.biggestPiece?.ownerId;
      const cellBOwner = cellB.biggestPiece?.ownerId;
      const cellCOwner = cellC.biggestPiece?.ownerId;
      if (!cellAOwner || !cellBOwner || !cellCOwner) {
        continue;
      }

      if (cellAOwner === cellBOwner && cellBOwner === cellCOwner) {
        this.winnerId = cellAOwner;
        this.winningCellsIds = [cellA.id, cellB.id, cellC.id];
        this.state = "ENDED";
        return true;
      }
    }

    //check for draw
    const currentTurnPlayer = this.players[this.playerTurn];
    const nextTurnPlayer = this.players[currentTurnPlayer.enemyId];

    const draw = !nextTurnPlayer?.pieces.some((piece) =>
      this.board.some((cell) => cell.canPlace(piece))
    );
    if (draw) {
      this.draw = true;
      this.state = "ENDED";

      return true;
    }

    //toggle turn
    this.playerTurn = nextTurnPlayer.id;

    return false;
  }
}
