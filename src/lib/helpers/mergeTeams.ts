import Team from "@/types/team";

export function mergeTeamsById(allTeams: Team[], winnersTeams: Team[]) {
  const teamsById = new Map(allTeams.map((t) => [t.id, t]));

  for (const winnerTeam of winnersTeams) {
    if (teamsById.has(winnerTeam.id)) {
      teamsById.set(winnerTeam.id, winnerTeam);
    }
  }

  return Array.from(teamsById.values());
}
