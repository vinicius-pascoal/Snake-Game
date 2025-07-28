"use client";

import { useEffect, useState, useRef } from "react";

interface SnakeSegment {
  x: number;
  y: number;
}

interface Snake {
  id: number;
  segments: SnakeSegment[];
  direction: "up" | "down" | "left" | "right";
  color: string;
  changeDirCooldown: number;
}

const randomDirection = (): Snake["direction"] => {
  const dirs = ["up", "down", "left", "right"] as const;
  return dirs[Math.floor(Math.random() * dirs.length)];
};

const COLORS = ["#22c55e", "#10b981", "#4ade80", "#86efac"];

export default function SnakeBackground() {
  const [snakes, setSnakes] = useState<Snake[]>([]);
  const canvasRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  useEffect(() => {
    const createSnake = (id: number): Snake => {
      const startX = Math.random() * size.width;
      const startY = Math.random() * size.height;
      const segments = Array.from({ length: 20 }, (_, i) => ({
        x: startX - i * 6,
        y: startY,
      }));
      return {
        id,
        segments,
        direction: randomDirection(),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        changeDirCooldown: Math.random() * 100 + 50,
      };
    };

    const newSnakes = Array.from({ length: 8 }, (_, i) => createSnake(i));
    setSnakes(newSnakes);
  }, [size]);

  useEffect(() => {
    let animationFrameId: number;

    const moveSnakes = () => {
      setSnakes((prev) =>
        prev.map((snake) => {
          const newSegments = [...snake.segments];
          const head = { ...newSegments[0] };
          const speed = 1.5;

          switch (snake.direction) {
            case "up":
              head.y -= speed;
              break;
            case "down":
              head.y += speed;
              break;
            case "left":
              head.x -= speed;
              break;
            case "right":
              head.x += speed;
              break;
          }

          newSegments.unshift(head);
          newSegments.pop();

          let cooldown = snake.changeDirCooldown - 1;
          let newDirection = snake.direction;

          if (cooldown <= 0) {
            newDirection = randomDirection();
            cooldown = Math.random() * 100 + 50;
          }

          return {
            ...snake,
            segments: newSegments,
            direction: newDirection,
            changeDirCooldown: cooldown,
          };
        })
      );

      animationFrameId = requestAnimationFrame(moveSnakes);
    };

    animationFrameId = requestAnimationFrame(moveSnakes);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#2c89f2_0%,_#00162e_100%)]" />
      <svg
        ref={canvasRef}
        width="100%"
        height="100%"
        className="absolute inset-0 opacity-20 pointer-events-none"
      >
        {snakes.map((snake) =>
          snake.segments.map((seg, i) => (
            <circle
              key={`${snake.id}-${i}`}
              cx={seg.x}
              cy={seg.y}
              r={8 - i * 0.3}
              fill={snake.color}
              opacity={1 - i * 0.05}
            />
          ))
        )}
      </svg>
    </div>
  );
}
