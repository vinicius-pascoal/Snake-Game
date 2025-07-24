import Board from "@/components/Board";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Snake Game</h1>
      <Board />
    </main>
  );
}
