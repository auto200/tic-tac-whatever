import { nanoid } from "nanoid";

export interface IPiece {
  id: string;
  ownerId: string;
  size: number;
  used: boolean;
}

export class Piece implements IPiece {
  id: string;
  ownerId: string;
  size: number;
  used: boolean;
  constructor(ownerId: string, size: number) {
    this.id = nanoid();
    this.ownerId = ownerId;
    this.size = size;
    this.used = false;
  }

  toTransport(): IPiece {
    return {
      id: this.id,
      ownerId: this.ownerId,
      size: this.size,
      used: this.used,
    };
  }
}
