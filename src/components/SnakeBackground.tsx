"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

interface Snake {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  delay: number;
  path: string;
  rotation: number;
}

export default function SnakeBackground() {
  const [snakes, setSnakes] = useState<Snake[]>([]);
  const [screenWidth, setScreenWidth] = useState(1);
  const [screenHeight, setScreenHeight] = useState(1);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const parallaxX = useTransform(mouseX, [0, screenWidth], [-10, 10]);
  const parallaxY = useTransform(mouseY, [0, screenHeight], [-10, 10]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);

      const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [mouseX, mouseY]);

  useEffect(() => {
    const createSnake = (id: number): Snake => {
      const size = 80 + Math.random() * 120;
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const curve = 10 + Math.random() * 40;

      const path = `
        M0,0 
        C${curve},${-curve} ${curve * 2},${curve} ${curve * 3},0
        C${curve * 4},${-curve} ${curve * 5},${curve} ${curve * 6},0
      `;

      return {
        id,
        x: startX,
        y: startY,
        size,
        speed: 6 + Math.random() * 6,
        delay: Math.random() * 3,
        path,
        rotation: Math.random() * 360,
      };
    };

    const snakesArray = Array.from({ length: 10 }, (_, i) => createSnake(i));
    setSnakes(snakesArray);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {snakes.map((snake) => (
        <motion.svg
          key={snake.id}
          width={snake.size}
          height={snake.size / 4}
          viewBox={`0 0 ${snake.size} ${snake.size / 4}`}
          className="absolute"
          style={{
            top: `${snake.y}%`,
            left: `${snake.x}%`,
            rotate: `${snake.rotation}deg`,
            x: parallaxX,
            y: parallaxY,
          }}
        >
          <motion.path
            d={snake.path}
            stroke="limegreen"
            strokeWidth="4"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              repeat: Infinity,
              duration: snake.speed,
              ease: "easeInOut",
              delay: snake.delay,
              repeatType: "reverse",
            }}
          />
        </motion.svg>
      ))}
    </div>
  );
}
