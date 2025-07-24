"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
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
  const [isRunning, setIsRunning] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);

  const eatSound = useRef<HTMLAudioElement | null>(null);
  const gameOverSound = useRef<HTMLAudioElement | null>(null);

  // Load sounds + record
  useEffect(() => {
    eatSound.current = new Audio("../sounds/eat.mp3");
    gameOverSound.current = new Audio("../sounds/gameover.mp3");

    const saved = localStorage.getItem("snake-high-score");
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(getRandomPosition(GRID_SIZE));
    setDir(null);
    setScore(0);
    setShowStartScreen(false);
    setIsRunning(true);
  };

  // Keyboard movement
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isRunning) return;

      let newDir: Direction | null = null;
      if (e.key === "ArrowUp" && dir !== "DOWN") newDir = "UP";
      if (e.key === "ArrowDown" && dir !== "UP") newDir = "DOWN";
      if (e.key === "ArrowLeft" && dir !== "RIGHT") newDir = "LEFT";
      if (e.key === "ArrowRight" && dir !== "LEFT") newDir = "RIGHT";

      if (newDir && dir !== newDir) {
        setDir(newDir);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dir, isRunning]);

  // Game logic
  useEffect(() => {
    if (!isRunning || dir === null) return;

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
          eatSound.current?.play();
          setFood(getRandomPosition(GRID_SIZE));
          setScore((prev) => prev + 1);
        } else {
          newSnake.pop();
        }

        const outOfBounds =
          head.x < 0 ||
          head.y < 0 ||
          head.x >= GRID_SIZE ||
          head.y >= GRID_SIZE;
        const hitSelf = newSnake.slice(1).some((s) => equalPos(s, head));

        if (outOfBounds || hitSelf) {
          gameOverSound.current?.play();
          if (score > highScore) {
            localStorage.setItem("snake-high-score", score.toString());
            setHighScore(score);
          }
          setIsRunning(false);
          setShowStartScreen(true);
          setDir(null);
          return INITIAL_SNAKE;
        }

        return newSnake;
      });
    }, 130); // animação mais fluida com intervalo menor

    return () => clearInterval(interval);
  }, [dir, food, score, highScore, isRunning]);

  return (
    <div className="flex flex-col items-center mt-6 gap-2 relative">
      {/* 🔷 Tela de início */}
      {showStartScreen && (
        <div className="absolute inset-0 bg-black/90 z-10 flex flex-col items-center justify-center gap-6 text-center p-6">
          <motion.h1
            className="text-4xl font-bold text-white"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            🐍 Snake Game
          </motion.h1>
          <motion.button
            onClick={startGame}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-xl font-bold shadow-md"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            Jogar
          </motion.button>
          <div className="text-white text-sm">Recorde: {highScore}</div>
        </div>
      )}

      {/* Placar animado */}
      <motion.div
        key={score}
        className="text-xl font-bold text-white"
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        Pontuação: <span className="text-green-400">{score}</span>
      </motion.div>

      <div className="text-sm text-gray-400">Recorde: {highScore}</div>

      {/* Tabuleiro */}
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
{isRunning && (
  <div className="md:hidden mt-6 flex flex-col items-center gap-4 z-10">
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setDir((prev) => (prev !== "DOWN" ? "UP" : prev))}
      className="w-16 h-16 rounded-full bg-white text-black text-2xl font-bold shadow-lg"
    >
      ↑
    </motion.button>

    <div className="flex gap-6">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setDir((prev) => (prev !== "RIGHT" ? "LEFT" : prev))}
        className="w-16 h-16 rounded-full bg-white text-black text-2xl font-bold shadow-lg"
      >
        ←
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setDir((prev) => (prev !== "UP" ? "DOWN" : prev))}
        className="w-16 h-16 rounded-full bg-white text-black text-2xl font-bold shadow-lg"
      >
        ↓
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setDir((prev) => (prev !== "LEFT" ? "RIGHT" : prev))}
        className="w-16 h-16 rounded-full bg-white text-black text-2xl font-bold shadow-lg"
      >
        →
      </motion.button>
    </div>
  </div>
)}
    </div>
  );
}
