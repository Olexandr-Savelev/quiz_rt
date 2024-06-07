import { useEffect, useState } from "react";

export default function useGameStatus() {
  const [isGame, setIsGame] = useState<boolean | null>(null);
  const [isGameLoading, setIsGameLoading] = useState<boolean | null>(null);

  async function getGameStatus() {
    try {
      setIsGameLoading(true);
      const res = await fetch("/api/game", { method: "GET" });
      const data = await res.json();
      if (data.game) {
        setIsGame(true);
      }
    } catch (error) {
      console.error(error);
    }
    setIsGameLoading(false);
  }

  async function startGame() {
    try {
      setIsGameLoading(true);
      const res = await fetch("/api/game", { method: "POST" });
      const data = await res.json();
      if (data.game) {
        setIsGame(true);
      }
    } catch (error) {
      console.error(error);
    }
    setIsGameLoading(false);
  }

  useEffect(() => {
    getGameStatus();
  }, []);

  async function endGame() {
    try {
      setIsGameLoading(true);
      const res = await fetch("/api/game", { method: "DELETE" });
      const data = await res.json();
      if (data.game) {
        setIsGame(false);
      }
    } catch (error) {
      console.error(error);
    }
    setIsGameLoading(false);
  }

  useEffect(() => {
    getGameStatus();
  }, []);

  return { isGame, isGameLoading, getGameStatus, startGame, endGame };
}
