import Board from "@/components/Board";
import SnakeBackground from "@/components/SnakeBackground";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <SnakeBackground />
      <Board />
    </main>
  );
}
