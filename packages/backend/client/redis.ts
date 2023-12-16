import { createClient, type RedisClientType } from "redis";

interface setProps {
  key: string;
  value: string;
}

export default class RedisCli {
  client: RedisClientType;
  connected: boolean;

  constructor() {
    this.client = createClient({ url: process.env.REDIS_URL });
    this.client.on("error", (err) => {
      console.log("Redis Client Error", err);
    });
  }

  async init(): Promise<void> {
    if (this.connected) return;

    await this.client.connect();
    this.connected = true;
  }

  async set({ key, value }: setProps): Promise<void> {
    await this.init();
    await this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    await this.init();
    const val = await this.client.get(key);

    return val;
  }
}
