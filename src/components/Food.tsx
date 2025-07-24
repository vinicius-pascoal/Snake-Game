import { Position } from "@/types";

export default function Food({ position }: { position: Position }) {
  return (
    <div
      className="absolute w-5 h-5 bg-red-500 rounded-full"
      style={{
        transform: `translate(${position.x * 20}px, ${position.y * 20}px)`,
      }}
    />
  );
}
