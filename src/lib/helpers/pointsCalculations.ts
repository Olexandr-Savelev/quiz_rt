import Team from "@/types/team";

export function calcBetsSum(teams: Team[]) {
  return teams.reduce((acc, cur) => acc + cur.bet, 0);
}

export function updateWinnersTeamsPoints(
  teams: Team[],
  prizePool: number,
  winnersBetSum: number
) {
  return teams.map((team) => {
    const percentOfPool = (team.bet * 100) / winnersBetSum;
    if (team.bet === 0) return team;
    const prize = (percentOfPool * prizePool) / 100;
    const newPoints = Number((team.points + prize).toFixed(2));
    return { ...team, points: newPoints };
  });
}

export function returnBets(teams: Team[]) {
  return teams.map((team: Team) => {
    team.points += team.bet;
    team.bet = 0;
    return team;
  });
}
