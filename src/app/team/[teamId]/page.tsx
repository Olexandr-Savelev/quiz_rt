"use client";

import React, { useEffect, useState } from "react";

import LoadingSpinner from "@/components/ui/loadingSpinner";
import Team from "@/types/team";

async function getTeam(teamId: string) {
  const res = await fetch(`/api/team/${teamId}`);
  const data = await res.json();
  return data.team;
}

const Page = ({ params }: { params: { teamId: string } }) => {
  const [team, setTeam] = useState<Team | null>(null);
  useEffect(() => {
    getTeam(params.teamId).then((team) => {
      setTeam(team);
    });
  }, [params]);

  if (!team) return <LoadingSpinner />;

  return <div>{team.name}</div>;
};

export default Page;
