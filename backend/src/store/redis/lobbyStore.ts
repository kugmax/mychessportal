var redis = require("redis");

const redisHost = process.env.REDIS_HOST;
const client = redis.createClient(6379, redisHost);

client.on("error", function (err) {
  console.log("Error: ", err);
});

export class LobbyStore {

  async addToLobby(userId: string) {

    const lobbyKey = this.getLobbyKey();
    client.sadd(lobbyKey, userId, redis.print);
  }

  async removeFromLobby(userIds: string[]) {

    const lobbyKey = this.getLobbyKey();
    client.srem(lobbyKey, userIds, redis.print);
  }

  async getFirstFromLobby(): Promise<string> {

    const lobbyKey = this.getLobbyKey();

    // this.flushDb();

    const userId: string = await new Promise((resolve, reject) => {

      client.srandmember(lobbyKey,
          function (err, obj) {
            console.log("err", err);
            console.log("obj", obj);

            if (err) {
              return reject(err);
            }

            return resolve(obj);
          }
      );
    });

    console.log("getFirstFromLobby", userId);

    return userId;
  }

  private getLobbyKey(): string {
    return "kugmax:chess:lobby";
  }

  // private removeIfString(lobbyKey: string) {
  //   client.type(lobbyKey,
  //       function (err, obj) {
  //         console.log("type err", err);
  //         console.log("type obj", obj);
  //
  //         if (obj == "set") {
  //           client.del(lobbyKey);
  //         }
  //       }
  //   );
  // }

  // private flushDb() {
  //   client.flushdb(this.logger);
  // }

  // private logger(err, obj) {
  //   console.log("type err", err);
  //   console.log("type obj", obj);
  // }

}




