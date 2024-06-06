export default interface Team {
  id: string;
  name: string;
  points: number;
  bet: number;
  roundId: string | null;
}
