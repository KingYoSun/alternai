import type RedisCli from "../redis.ts";
import { type Settings } from "shared/types/Settings.ts";
import { type DiskQuota, createClient } from "webdav";

interface classProps {
  redis: RedisCli;
}

const REDIS_SETTING_KEY = "alternai:settings";

export default class NextcloudCli {
  redis: RedisCli;
  settings: Settings;
  connected: boolean;
  webdavCli: any;

  constructor({ redis }: classProps) {
    this.redis = redis;
  }

  async init(): Promise<void> {
    if (this.connected) return;

    this.settings = await this.getSettings();

    if (
      this.settings.NEXTCLOUD_URL != null &&
      this.settings.NEXTCLOUD_USER != null &&
      this.settings.NEXTCLOUD_PASS != null
    ) {
      this.webdavCli = createClient(this.settings.NEXTCLOUD_URL, {
        username: this.settings.NEXTCLOUD_USER,
        password: this.settings.NEXTCLOUD_PASS,
      });
      const quata = await this.getQuota();
      this.connected = Boolean(quata);
    } else {
      this.connected = false;
    }
  }

  async getSettings(): Promise<Settings> {
    const res = await this.redis.get(REDIS_SETTING_KEY);
    if (res === null) throw new Error("Settings are not found");

    return JSON.parse(res);
  }

  async getQuota(): Promise<DiskQuota> {
    const quata: DiskQuota = await this.webdavCli.getQuota();
    return quata;
  }
}
