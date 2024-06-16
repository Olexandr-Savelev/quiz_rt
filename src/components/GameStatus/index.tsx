"use client";

import TeamForm from "../TeamForm";
import AnimatedLine from "../ui/animatedLine";
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
    <div className="flex flex-col justify-center gap-4">
      <AnimatedLine />
      <span className="text-3xl text-center w-full">
        Game i not started yet
      </span>
    </div>
  );
}
