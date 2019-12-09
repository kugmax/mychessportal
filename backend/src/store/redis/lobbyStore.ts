var redis = require("redis");

const redisHost = process.env.REDIS_HOST;
const client = redis.createClient(6379, redisHost);

export class LobbyStore {

  async addToLobby(userId: string) {

    const lobbyKey = this.getLobbyKey();
    client.set(lobbyKey, userId);
  }

  async removeFromLobby(userIds: string[]) {

    const lobbyKey = this.getLobbyKey();
    client.srem(lobbyKey, userIds);
  }

  async getFirstFromLobby(): Promise<string> {

    const lobbyKey = this.getLobbyKey();
    // const userIds: string[] = client.srandmember(lobbyKey, 1);
    //
    // console.log("getFirstFromLobby", userIds);
    //
    // if (userIds && userIds.length > 0) {
    //   return userIds[0];
    // }

    const userIds: string[] = await new Promise((resolve, reject) => {

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

    console.log("getFirstFromLobby", userIds);

    if (userIds && userIds.length > 0) {
      return userIds[0];
    }

    return null;
  }

  private getLobbyKey(): string {
    return "kugmax:chess:lobby";
  }
}




