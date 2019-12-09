import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as uuid from 'uuid'

import { GameStore } from '../../store/redis/gameStore'
import { LobbyStore } from '../../store/redis/lobbyStore'
import { UserStore } from '../../store/redis/userStore'
import { User } from "../../model/User";
import {Game} from "../../model/Game";

// import * as AWS  from 'aws-sdk'

// var cache = new AWS.ElastiCache();
//
// var Redis = require("ioredis");
// var redis = new Redis();

const lobbyStore = new LobbyStore();
const gameStore = new GameStore();
const userStore = new UserStore();

//TODO: need create game in Redis

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Websocket connect', event);

  const connectionId = event.requestContext.connectionId;
  const userId = connectionId;

  const competitorId: string = await lobbyStore.getFirstFromLobby();

  if (competitorId) {
    await lobbyStore.removeFromLobby([competitorId]);
    const competitor: User = await userStore.getLoggedUser(competitorId);  //TODO: need set current game id

    const gameId = uuid.v4();

    const user: User = {
      userId: userId,
      connectionId: connectionId,
      currentGameId: gameId
    };

    await userStore.loginUser(user);

    const game: Game = createGame(gameId, user, competitor);
    await gameStore.createGame(game);

  } else {
    const user: User = {
      userId: userId,
      connectionId: connectionId,
      currentGameId: ""
    };

    await lobbyStore.addToLobby(userId);
    await userStore.loginUser(user);
  }

  return {
    statusCode: 200,
    body: ''
  }
};

function createGame(gameId: string, user1: User, user2: User): Game {

  const whitePlayer = getWhitePlayer();

  const wPlayer: User = whitePlayer == 0 ? user1: user2;
  const bPlayer: User = whitePlayer == 0 ? user2: user1;

  const game: Game = {
    gameId: gameId,

    wUserId: wPlayer.userId,
    wConnectionId: wPlayer.connectionId,

    bUserId: bPlayer.userId,
    bConnectionId: bPlayer.connectionId,

    position: "here should be start positing FAN"
  };

  console.log("createGame:", game);

  return game;
}

function getWhitePlayer(): Number {
  return Math.floor(Math.random() * Math.floor(2));
}