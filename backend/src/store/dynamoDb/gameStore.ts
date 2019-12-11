import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { createLogger } from '../../utils/logger';
import { GameRequest } from "../../model/GameRequest";

const logger = createLogger('store');
const XAWS = AWSXRay.captureAWS(AWS);

export class GameStore {
  constructor(
      private readonly docClient: DocumentClient = createDynamoDBClient(),
      private readonly gameRequestTable = process.env.GAME_REQUEST_TABLE,
      private readonly createAtIndex = process.env.GAME_REQUEST_SORT_INDEX,
  ) {

  }

  async saveGameRequest(gameRequest: GameRequest) {
    await this.docClient.put({
      TableName: this.gameRequestTable,
      Item: gameRequest
    }).promise()
  }

  async getFirstGameRequests(limit: number): Promise<GameRequest[]> {
    const result = await this.docClient.query({
      TableName: this.gameRequestTable,
      IndexName: this.createAtIndex,
      Limit: limit
      // KeyConditionExpression: 'userId = :userId',
      // ExpressionAttributeValues: {
      //   ':userId': userId
      // }
    })
    .promise();

    logger.info("requests:", result);

    const items = result.Items;
    return items as GameRequest[]
  }

}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance');
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}