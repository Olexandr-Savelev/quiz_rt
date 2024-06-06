"use client";

import LoadingSpinner from "@/components/ui/loadingSpinner";
import { pusherClient } from "@/lib/pusher";
import Team from "@/types/team";
import React, { useEffect, useState } from "react";

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
      <h2>ADMIN PAGE </h2>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3"
              >
                Team name
              </th>
              <th
                scope="col"
                className="px-6 py-3"
              >
                Points
              </th>
              <th
                scope="col"
                className="px-6 py-3"
              >
                Bet
              </th>
              <th
                scope="col"
                className="px-6 py-3"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr
                key={team.id}
                className="bg-white border-b"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                >
                  {team.name}
                </th>
                <td className="px-6 py-4">{team.points}</td>
                <td className="px-6 py-4">{team.bet}</td>
                <td className="px-6 py-4">
                  <button>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && <LoadingSpinner />}
      </div>
    </>
  );
};

export default Page;
