import { useState } from "react";

import { cn } from "@/lib/utils";
import Team from "@/types/team";

interface GameTableProps {
  teams: Team[];
}

export default function GameTable({ teams }: GameTableProps) {
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);

  const handleRowClick = (teamId: string) => {
    setSelectedTeamIds((prevSelectedTeamIds) => {
      if (prevSelectedTeamIds.includes(teamId)) {
        return prevSelectedTeamIds.filter((id) => id !== teamId);
      } else {
        return [...prevSelectedTeamIds, teamId];
      }
    });
  };

  const calcPrizePool = () => {
    const pool = teams.reduce((acc, cur) => {
      return acc + cur.bet;
    }, 0);
    console.log(pool);
  };

  return (
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
              selectedTeamIds.includes(team.id) && "bg-green-100"
            )}
            onClick={() => handleRowClick(team.id)}
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
      <button onClick={calcPrizePool}>GET PRIZE POOL</button>
    </table>
  );
}
