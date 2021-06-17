import { IPlayer, Player, ICell, Cell } from "./";

export interface IGame {
  id: string;
  state: "WAITING" | "PLAYING" | "ENDED";
  players: { [key: string]: IPlayer };
  playerTurn: string;
  board: ICell[];
  winnerId: string;
  draw: boolean;
}

export class Game implements IGame {
  id: string;
  state: "WAITING" | "PLAYING" | "ENDED";
  players: { [key: string]: Player };
  playerTurn: string;
  board: Cell[];
  winnerId: string;
  draw: boolean;

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
  }
  toTransport(): IGame {
    return {
      id: this.id,
      state: this.state,
      players: Object.fromEntries(
        Object.entries(this.players).map(([key, value]) => [
          key,
          value.toTransport(),
        ])
      ),
      playerTurn: this.playerTurn,
      board: this.board.map(({ toTransport }) => toTransport()),
      winnerId: this.winnerId,
      draw: this.draw,
    };
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

  //https://dev.to/bornasepic/pure-and-simple-tic-tac-toe-with-javascript-4pgn
  // const validateGameState = () => {
  //   for (const condition of WINNING_CONDITIONS) {
  //     const a = game.board[condition[0]].biggestPiece?.owner;
  //     const b = game.board[condition[1]].biggestPiece?.owner;
  //     const c = game.board[condition[2]].biggestPiece?.owner;
  //     if (!a || !b || !c) {
  //       continue;
  //     }
  //     if (a === b && b === c) {
  //       setGame((draft) => {
  //         draft.winner = draft.players.find(({ id }) => id === a)!;
  //       });
  //       return;
  //     }
  //   }

  //   //check for draw
  //   const player = game.players.find(({ id }) => id === game.playerTurn);
  //   const draw = !player?.pieces.some((piece) =>
  //     game.board.some((cell) => cell.canPlace(piece))
  //   );
  //   if (draw) {
  //     setGame((draft) => {
  //       draft.draw = true;
  //     });
  //   }
  // };
}
