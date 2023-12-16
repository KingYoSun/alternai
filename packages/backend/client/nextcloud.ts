import type RedisCli from "./redis";
import { type Settings } from "shared/types/Settings";

interface classProps {
  redis: RedisCli;
}

const REDIS_SETTING_KEY = "alternai:settings";

export default class NextcloudCli {
  redis: RedisCli;
  settings: Settings;
  connected: boolean;

  constructor({ redis }: classProps) {
    this.redis = redis;
  }

  async init(): Promise<void> {
    if (this.connected) return;

    this.settings = await this.getSettings();
    this.connected = true;
  }

  async getSettings(): Promise<Settings> {
    await this.redis.init();
    const res = await this.redis.get(REDIS_SETTING_KEY);
    if (res === null) throw new Error("Settings are not found");

    return JSON.parse(res);
  }
}
