"use client";

import TeamForm from "../TeamForm";
import LoadingSpinner from "../ui/loadingSpinner";
import useGameStatus from "@/hooks/useGameStatus";

export default function GameStatus() {
  const { isGame, isGameLoading } = useGameStatus();

  if (isGame === null || isGameLoading) {
    return <LoadingSpinner />;
  }

  return isGame ? (
    <TeamForm />
  ) : (
    <span className="text-2xl text-center w-full">Game i not started yet</span>
  );
}
