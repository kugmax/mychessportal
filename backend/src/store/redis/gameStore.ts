// import { Redis } from "ioredis"

import { Game } from '../../model/Game'

var redis = require("redis");
// var redis = new Redis();

const redisHost = process.env.REDIS_HOST;
// const redis = new Redis(redisHost);
const client = redis.createClient(6379, redisHost);
// const client = redis.createClient(redisHost);

export class GameStore {
  async createGame(game: Game): Promise<string> {

    const gameKey = this.getGameKey(game.gameId);
    client.hmset(gameKey,
        "wUserId", game.wUserId,
        "wConId", game.wConnectionId,

        "bUserId", game.bUserId,
        "bConId", game.bConnectionId,
        function (err, res) {
      console.log("err", err);
      console.log("res", res);
    });

    return "OK";
  }

  private getGameKey(gameId: string): string {
    return "kugmax:chess:games:" + gameId;
  }

}

