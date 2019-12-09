import { User } from '../../model/User'

var redis = require("redis");
const redisHost = process.env.REDIS_HOST;
const client = redis.createClient(6379, redisHost);

export class UserStore {

  async loginUser(user: User): Promise<string> {

    const userKey = this.getUserKey(user.userId);
    client.hmset(userKey,
        "conId", user.connectionId,
        "gameId", user.currentGameId,

        function (err, res) {
          console.log("err", err);
          console.log("res", res);
        });

    return "OK";
  }

  async getLoggedUser(userId: string): Promise<User> {

    const userKey = this.getUserKey(userId);
    return new Promise((resolve, reject) => {

      client.hgetall(userKey,
          function (err, obj) {
            console.log("err", err);
            console.log("obj", obj);

            if (err) {
              return reject(err);
            }

            return resolve(obj)
          }
      );
    });
  }

  private getUserKey(userId: string): string {
    return "kugmax:chess:users:" + userId;
  }

}

