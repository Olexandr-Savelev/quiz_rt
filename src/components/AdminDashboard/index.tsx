import { useState } from "react";
import {
  calcBetsSum,
  returnBets,
  updateWinnersTeamsPoints,
} from "@/lib/helpers/pointsCalculations";
import Button from "../ui/button";
import useGameStatus from "@/hooks/useGameStatus";
import { mergeTeamsById } from "@/lib/helpers/mergeTeams";
import Team from "@/types/team";

interface AdminDashboardProps {
  allTeams: Team[];
  setAllTeams: (teams: Team[]) => void;
  selectedTeams: Team[];
  resetSelectedTeams: () => void;
}

export default function AdminDashboard({
  allTeams,
  selectedTeams,
  setAllTeams,
  resetSelectedTeams,
}: AdminDashboardProps) {
  const [loading, setLoading] = useState<boolean>();
  const { isGame, startGame, endGame } = useGameStatus();

  async function updateTeams(teams: Team[]) {
    setLoading(true);
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

      setAllTeams(updatedTeams);
      resetSelectedTeams();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  const onRoundEnds = () => {
    const winnersBetSum = calcBetsSum(selectedTeams);
    if (
      allTeams.length === selectedTeams.length ||
      selectedTeams.length === 0 ||
      winnersBetSum === 0
    ) {
      const newTeams = returnBets(allTeams);
      updateTeams(newTeams);
    } else {
      const prizePool = calcBetsSum(allTeams);
      const winnersTeams = updateWinnersTeamsPoints(
        selectedTeams,
        prizePool,
        winnersBetSum
      );
      const newTeams = mergeTeamsById(allTeams, winnersTeams);
      updateTeams(newTeams);
    }
  };
  return (
    <div className="flex gap-2 mb-2">
      {!isGame ? (
        <Button
          type="button"
          variant="outline"
          onClick={startGame}
        >
          Start Game
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={endGame}
        >
          Stop Game
        </Button>
      )}
      <Button
        type="button"
        variant="borderless"
        onClick={onRoundEnds}
        loading={loading}
      >
        End round
      </Button>
    </div>
  );
}
