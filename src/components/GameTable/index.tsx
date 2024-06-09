import { useState } from "react";

import { cn } from "@/lib/utils";
import Team from "@/types/team";

interface GameTableProps {
  teams: Team[];
  selectedTeams: Team[];
  handleSelectedTeams: (team: Team) => void;
}

export default function GameTable({
  teams,
  selectedTeams,
  handleSelectedTeams,
}: GameTableProps) {
  const handleRowClick = (team: Team) => {
    handleSelectedTeams(team);
  };

  return (
    <>
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
              className={cn(
                "bg-white border-b",
                selectedTeams.includes(team) && "bg-green-100"
              )}
              onClick={() => handleRowClick(team)}
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
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
    </>
  );
}
