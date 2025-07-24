"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Position, Direction } from "@/types";
import { equalPos, getRandomPosition } from "@/utils/helpers";
import Snake from "./Snake";
import Food from "./Food";

const GRID_SIZE = 30;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 5, y: 5 }];

export default function Board() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(getRandomPosition(GRID_SIZE));
  const [dir, setDir] = useState<Direction | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameStarted = useRef(false);

  // ⬆️ Carrega recorde ao iniciar
  useEffect(() => {
    const saved = localStorage.getItem("snake-high-score");
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // ⌨️ Movimento do jogador
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

  // 🧠 Lógica do jogo
  useEffect(() => {
    if (!gameStarted.current || dir === null) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };

        if (dir === "UP") head.y -= 1;
        if (dir === "DOWN") head.y += 1;
        if (dir === "LEFT") head.x -= 1;
        if (dir === "RIGHT") head.x += 1;

        const newSnake = [head, ...prevSnake];

        const ateFood = equalPos(head, food);

        if (ateFood) {
          setFood(getRandomPosition(GRID_SIZE));
          setScore((prev) => prev + 1);
        } else {
          newSnake.pop(); // remove a cauda apenas se não comeu
        }

        const outOfBounds =
          head.x < 0 || head.y < 0 || head.x >= GRID_SIZE || head.y >= GRID_SIZE;
        const hitSelf = newSnake.slice(1).some((s) => equalPos(s, head));

        if (outOfBounds || hitSelf) {
          if (score > highScore) {
            localStorage.setItem("snake-high-score", score.toString());
            setHighScore(score);
          }
          alert(`Game Over! Pontuação: ${score}`);
          setDir(null);
          gameStarted.current = false;
          setScore(0);
          return INITIAL_SNAKE;
        }

        return newSnake;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [dir, food, score, highScore]);

  return (
    <div className="flex flex-col items-center mt-6 gap-2">
      <motion.div
        key={score}
        className="text-xl font-bold text-white"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 0.3 }}
      >
        Pontuação: <span className="text-green-400">{score}</span>
      </motion.div>

      <div className="text-sm text-gray-400">Recorde: {highScore}</div>

      <div
        className="relative bg-gray-900 border-2 border-white"
        style={{
          width: `${GRID_SIZE * CELL_SIZE}px`,
          height: `${GRID_SIZE * CELL_SIZE}px`,
        }}
      >
        <Snake segments={snake} />
        <Food position={food} />
      </div>
    </div>
  );
}
