import { Position } from "@/types";

export const equalPos = (a: Position, b: Position): boolean =>
  a.x === b.x && a.y === b.y;

export const getRandomPosition = (gridSize: number): Position => ({
  x: Math.floor(Math.random() * gridSize),
  y: Math.floor(Math.random() * gridSize),
});
