import { cn } from "@/lib/utils";
import Team from "@/types/team";

interface GameTableProps {
  teams: Team[];
  selectedTeams: Team[];
  handleSelectedTeams: (team: Team) => void;
  setTeamToEdit: (team: Team) => void;
}

export default function GameTable({
  teams,
  selectedTeams,
  handleSelectedTeams,
  setTeamToEdit,
}: GameTableProps) {
  const handleRowClick = (team: Team) => {
    handleSelectedTeams(team);
  };

  return (
    <>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-100 uppercase bg-gray-700">
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
              Bet
            </th>
            <th
              scope="col"
              className="px-6 py-3"
            >
              Actions
            </th>
            <th
              scope="col"
              className="px-6 py-3"
            >
              Points
            </th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr
              key={team.id}
              className={cn(
                "bg-gray-200 border-b-2 border-black text-black",
                selectedTeams.includes(team) && "bg-blue-400"
              )}
              onClick={() => handleRowClick(team)}
            >
              <th
                scope="row"
                className="px-6 py-4 font-bold text-xl text-gray-900 whitespace-nowrap"
              >
                {team.name}
              </th>

              <td className="px-6 py-4 font-bold">{team.bet}</td>
              <td className="px-6 py-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTeamToEdit(team);
                  }}
                >
                  Edit
                </button>
              </td>
              <td className="px-6 py-4 font-bold text-xl">{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
