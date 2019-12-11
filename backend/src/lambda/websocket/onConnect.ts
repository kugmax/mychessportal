import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { GameStore } from "../../store/dynamoDb/gameStore"
import {GameRequest} from "../../model/GameRequest";

const gameStore = new GameStore();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Websocket connect', event);

  const connectionId = event.requestContext.connectionId;
  const userId = connectionId;
  const timestamp = new Date().toISOString();

  const gameRequest = {
    userId: userId,
    connectionId: connectionId,
    createdAt: timestamp,
    timeControl: "unlimited",
    color: "random",
    elo: "unlimited"
  };

  console.log('saveGameRequest:', gameRequest);

  await gameStore.saveGameRequest(gameRequest);

  const requests: GameRequest[] = await gameStore.getFirstGameRequests(3);

  console.log('getFirstGameRequests, limit 3:', requests);

  return {
    statusCode: 200,
    body: ''
  }
};