"use client";

import { useEffect, useState } from "react";
import TeamForm from "../TeamForm";
import LoadingSpinner from "../ui/loadingSpinner";

async function getGameStatus() {
  const res = await fetch("/api/game", { method: "GET" });
  const data = await res.json();
  return data.game;
}

export default function GameStatus() {
  const [isGame, setIsGame] = useState<boolean | null>(null);

  useEffect(() => {
    getGameStatus().then((game) => {
      const gameStarted = !!game.id;
      setIsGame(gameStarted);
    });
  }, []);

  if (isGame === null) {
    return <LoadingSpinner />;
  }

  return isGame ? (
    <TeamForm />
  ) : (
    <span className="text-2xl text-center w-full">Game i not started yet</span>
  );
}
