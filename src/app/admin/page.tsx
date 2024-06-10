"use client";

import React, { useEffect, useState } from "react";

import GameTable from "@/components/GameTable";
import LoadingSpinner from "@/components/ui/loadingSpinner";

import { pusherClient } from "@/lib/pusher/pusher";
import { mergeTeamsById } from "@/lib/helpers/mergeTeams";

import Team from "@/types/team";
import useGameStatus from "@/hooks/useGameStatus";
import {
  calcBetsSum,
  updateWinnersTeamsPoints,
} from "@/lib/helpers/pointsCalculations";

async function getTeams() {
  const res = await fetch("/api/team", { method: "GET" });
  const data = await res.json();

  return data.teams;
}

async function updateTeams(teams: Team[]) {
  console.log(teams);
  try {
    const res = await fetch("/api/team", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teams),
    });

    if (!res.ok) {
      throw new Error("Failed to submit the data. Please try again.");
    }

    const { updatedTeams } = await res.json();
    console.log(updatedTeams);
    return updatedTeams;
  } catch (error) {
    console.error(error);
  }
}

const Page = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isGame, startGame, endGame } = useGameStatus();

  const handleSelectedTeams = (team: Team) => {
    setSelectedTeams((prevSelectedTeams) => {
      const prevSelectedTeamIds = prevSelectedTeams.map(
        (team: Team) => team.id
      );
      const teamId = team.id;
      if (prevSelectedTeamIds.includes(teamId)) {
        return prevSelectedTeams.filter((team: Team) => team.id !== teamId);
      } else {
        return [...prevSelectedTeams, team];
      }
    });
  };

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

    channel.bind("addTeam", addTeam);

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    channel.unbind("placeBet");
    channel.bind("placeBet", placeBet);
  }, [JSON.stringify(teams)]);

  function addTeam(team: Team) {
    setTeams((prev) => [...prev, team]);
  }

  function placeBet({
    teamId,
    bet,
    points,
  }: {
    teamId: string;
    bet: number;
    points: number;
  }) {
    const team = teams.find((t: Team) => t.id === teamId);
    if (team) {
      team.bet = bet;
      team.points = points;
      setTeams([...teams]);
    }
  }

  const onRoundEnds = () => {
    if (teams.length === selectedTeams.length || selectedTeams.length === 0) {
      setSelectedTeams([]);
      return;
    }
    const prizePool = calcBetsSum(teams);
    const winnersTeams = updateWinnersTeamsPoints(selectedTeams, prizePool);
    const newTeams = mergeTeamsById(teams, winnersTeams);

    setSelectedTeams([]);

    updateTeams(newTeams).then((teams: Team[]) => {
      setTeams(teams);
    });
  };

  return (
    <>
      {!isGame ? (
        <button
          className="px-4 py-2 border border-black"
          onClick={startGame}
        >
          Start Game
        </button>
      ) : (
        <button
          className="px-4 py-2 border border-black"
          onClick={endGame}
        >
          Stop Game
        </button>
      )}
      <button
        className="px-4 py-2 border border-black"
        onClick={onRoundEnds}
      >
        End round
      </button>

      <h2>ADMIN PAGE</h2>
      <div className="relative overflow-x-auto">
        <GameTable
          teams={teams}
          selectedTeams={selectedTeams}
          handleSelectedTeams={handleSelectedTeams}
        />
        {isLoading && <LoadingSpinner />}
      </div>
    </>
  );
};

export default Page;
