"use client";

import React, { useEffect, useState } from "react";

import GameTable from "@/components/GameTable";
import LoadingSpinner from "@/components/ui/loadingSpinner";

import { pusherClient } from "@/lib/pusher";

import Team from "@/types/team";

async function getTeams() {
  const res = await fetch("/api/team", { method: "GET" });
  const data = await res.json();

  return data.teams;
}

const Page = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const channel = pusherClient.subscribe("channel");

  useEffect(() => {
    setIsLoading(true);
    getTeams()
      .then((teams) => {
        setTeams(teams);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setIsLoading(false);
      });

    channel.bind("addTeam", (team: Team) => {
      setTeams((prev) => [...prev, team]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    channel.unbind("placeBet");
    channel.bind("placeBet", placeBet);
  }, [JSON.stringify(teams)]);

  function placeBet({ teamId, bet }: { teamId: string; bet: number }) {
    const team = teams.find((t: Team) => t.id === teamId);
    if (team) {
      team.bet = bet;
      setTeams([...teams]);
    }
  }

  async function startGame() {
    await fetch("/api/game", { method: "POST" }).then((res) => {
      console.log(`Game Started ${res}`);
    });
  }

  return (
    <>
      <button onClick={startGame}>Start Game</button>
      <h2>ADMIN PAGE</h2>
      <div className="relative overflow-x-auto">
        <GameTable teams={teams} />
        {isLoading && <LoadingSpinner />}
      </div>
    </>
  );
};

export default Page;
