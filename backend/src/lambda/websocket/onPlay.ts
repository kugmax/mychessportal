import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Websocket play', event);

  const connectionId = event.requestContext.connectionId;
  const timestamp = new Date().toISOString();

  const item = {
    id: connectionId,
    timestamp
  };

  return {
    statusCode: 200,
    body: JSON.stringify(item)
  }
};