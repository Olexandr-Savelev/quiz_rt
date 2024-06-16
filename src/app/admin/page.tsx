"use client";

import React, { useEffect, useState } from "react";

import GameTable from "@/components/GameTable";
import LoadingSpinner from "@/components/ui/loadingSpinner";

import { pusherClient } from "@/lib/pusher/pusher";

import Team from "@/types/team";
import Modal from "@/components/ui/modal";
import TeamForm from "@/components/TeamForm";
import AdminDashboard from "@/components/AdminDashboard";

async function getTeams() {
  const res = await fetch("/api/team", { method: "GET" });
  const data = await res.json();

  return data.teams;
}

const Page = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
  const [teamToEdit, setTeamToEdit] = useState<Team>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const resetSelectedTeams = () => {
    setSelectedTeams([]);
  };

  const handleAllTeams = (teams: Team[]) => {
    setTeams(teams);
  };

  const handleTeamToEdit = (team: Team) => {
    setTeamToEdit(team);
    setIsModalOpen(true);
  };

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
    channel.bind("updateTeam", updateTeam);
    channel.bind("deleteTeam", deleteTeam);

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    channel.unbind("placeBet");
    channel.bind("placeBet", placeBet);
  }, [JSON.stringify(teams)]);

  function deleteTeam(id: string) {
    setTeams((prev) => prev.filter((team) => team.id !== id));
  }

  function updateTeam(team: Team) {
    setTeams((prev) => prev.map((t) => (t.id === team.id ? team : t)));
  }

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

  return (
    <>
      <AdminDashboard
        allTeams={teams}
        selectedTeams={selectedTeams}
        setAllTeams={handleAllTeams}
        resetSelectedTeams={resetSelectedTeams}
      />

      <div className="relative overflow-x-auto">
        <GameTable
          teams={teams}
          selectedTeams={selectedTeams}
          handleSelectedTeams={handleSelectedTeams}
          setTeamToEdit={handleTeamToEdit}
        />
        {isLoading && <LoadingSpinner />}
      </div>
      {isModalOpen && (
        <Modal closeModal={closeModal}>
          <div className="flex flex-col gap-4 py-3 md:px-6 md:min-w-[640px]">
            <TeamForm
              type="edit"
              team={teamToEdit}
              closeModal={closeModal}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default Page;
