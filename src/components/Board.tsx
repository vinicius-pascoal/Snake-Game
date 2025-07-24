"use client";
import { useEffect, useState } from "react";
import { Position, Direction } from "@/types";
import { equalPos, getRandomPosition } from "@/utils/helpers";
import Snake from "./Snake";
import Food from "./Food";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 8, y: 8 }];

export default function Board() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(getRandomPosition(GRID_SIZE));
  const [dir, setDir] = useState<Direction>("RIGHT");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" && dir !== "DOWN") setDir("UP");
      if (e.key === "ArrowDown" && dir !== "UP") setDir("DOWN");
      if (e.key === "ArrowLeft" && dir !== "RIGHT") setDir("LEFT");
      if (e.key === "ArrowRight" && dir !== "LEFT") setDir("RIGHT");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dir]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };
        if (dir === "UP") head.y -= 1;
        if (dir === "DOWN") head.y += 1;
        if (dir === "LEFT") head.x -= 1;
        if (dir === "RIGHT") head.x += 1;

        const newSnake = [head, ...prev];
        const ateFood = equalPos(head, food);

        if (!ateFood) newSnake.pop();
        else setFood(getRandomPosition(GRID_SIZE));

        const outOfBounds =
          head.x < 0 || head.y < 0 || head.x >= GRID_SIZE || head.y >= GRID_SIZE;
        const hitSelf = newSnake.slice(1).some((s) => equalPos(s, head));

        if (outOfBounds || hitSelf) {
          alert("Game Over");
          return INITIAL_SNAKE;
        }

        return newSnake;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [dir, food]);

  return (
    <div className="relative w-[400px] h-[400px] bg-gray-900 border-2 border-white mx-auto mt-10">
      <Snake segments={snake} />
      <Food position={food} />
    </div>
  );
}
