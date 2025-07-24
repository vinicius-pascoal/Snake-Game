"use client";
import { useEffect, useState, useRef } from "react";
import { Position, Direction } from "@/types";
import { equalPos, getRandomPosition } from "@/utils/helpers";
import Snake from "./Snake";
import Food from "./Food";

const GRID_SIZE = 30; // 🔧 aumentamos de 20 → 30
const CELL_SIZE = 20; // em pixels
const INITIAL_SNAKE = [{ x: 5, y: 5 }];

export default function Board() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(getRandomPosition(GRID_SIZE));
  const [dir, setDir] = useState<Direction | null>(null); // começa parado
  const gameStarted = useRef(false); // impede movimento antes da primeira tecla

  // ⌨️ Captura de teclas
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      let newDir: Direction | null = null;
      if (e.key === "ArrowUp" && dir !== "DOWN") newDir = "UP";
      if (e.key === "ArrowDown" && dir !== "UP") newDir = "DOWN";
      if (e.key === "ArrowLeft" && dir !== "RIGHT") newDir = "LEFT";
      if (e.key === "ArrowRight" && dir !== "LEFT") newDir = "RIGHT";

      if (newDir) {
        setDir(newDir);
        gameStarted.current = true;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dir]);

  // 🎮 Lógica do jogo
  useEffect(() => {
    if (!gameStarted.current || dir === null) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };
        if (dir === "UP") head.y -= 1;
        if (dir === "DOWN") head.y += 1;
        if (dir === "LEFT") head.x -= 1;
        if (dir === "RIGHT") head.x += 1;

        const newSnake = [head, ...prev];

        const ateFood = equalPos(head, food);
        if (!ateFood) {
          newSnake.pop(); // remover último segmento
        } else {
          setFood(getRandomPosition(GRID_SIZE)); // 🍎 nova comida
        }

        const outOfBounds =
          head.x < 0 || head.y < 0 || head.x >= GRID_SIZE || head.y >= GRID_SIZE;
        const hitSelf = newSnake.slice(1).some((s) => equalPos(s, head));

        if (outOfBounds || hitSelf) {
          alert("Game Over");
          setDir(null);
          gameStarted.current = false;
          return INITIAL_SNAKE;
        }

        return newSnake;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [dir, food]);

  return (
    <div
      className="relative bg-gray-900 border-2 border-white mx-auto mt-10"
      style={{
        width: `${GRID_SIZE * CELL_SIZE}px`,
        height: `${GRID_SIZE * CELL_SIZE}px`,
      }}
    >
      <Snake segments={snake} />
      <Food position={food} />
    </div>
  );
}
