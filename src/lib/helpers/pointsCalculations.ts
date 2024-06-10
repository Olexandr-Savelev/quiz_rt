import Team from "@/types/team";

export function calcBetsSum(teams: Team[]) {
  return teams.reduce((acc, cur) => acc + cur.bet, 0);
}

export function updateWinnersTeamsPoints(teams: Team[], prizePool: number) {
  const winnersBetSum = calcBetsSum(teams);

  return teams.map((team) => {
    const percentOfPool = (team.bet * 100) / winnersBetSum;
    const prize = +((percentOfPool * prizePool) / 100).toFixed(2);
    const newPoints = team.points + prize;
    return { ...team, points: newPoints };
  });
}
