import { createClient, type RedisClientType } from "redis";

interface setProps {
  key: string;
  value: string;
}

export default class RedisCli {
  client: RedisClientType;

  constructor() {
    this.client = createClient({ url: process.env.REDIS_URL });
    this.client.on("error", (err) => {
      console.log("Redis Client Error", err);
    });
  }

  async init(): Promise<void> {
    await this.client.connect();
  }

  async set({ key, value }: setProps): Promise<void> {
    await this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    const val = await this.client.get(key);

    return val;
  }
}
