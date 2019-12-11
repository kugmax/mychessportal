export interface GameRequest {
  userId: string,
  connectionId: string,
  createdAt: string

  timeControl: string,
  color: string,
  elo: string
}