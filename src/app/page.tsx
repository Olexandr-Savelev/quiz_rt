import GameStatus from "@/components/GameStatus";

export default function Home() {
  return (
    <>
      <h1
        className="text-4xl bold text-center uppercase
       my-4"
      >
        Welcome to Quiz Time
      </h1>
      <GameStatus />
    </>
  );
}
