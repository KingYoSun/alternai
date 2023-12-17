import type RedisCli from "../redis.ts";
import { type Settings } from "shared/types/Settings.ts";
import { type DiskQuota, createClient, type FileStat } from "webdav";
import parseXml from "xml-js";

interface classProps {
  redis: RedisCli;
}

const REDIS_SETTING_KEY = "alternai:settings";

export default class NextcloudCli {
  redis: RedisCli;
  settings: Settings;
  connected: boolean;
  webdavCli: any;
  webdavSuffix: string;

  constructor({ redis }: classProps) {
    this.redis = redis;
    this.webdavSuffix = "/remote.php/dav";
  }

  async init(): Promise<void> {
    if (this.connected) return;

    this.settings = await this.getSettings();

    if (
      this.settings.NEXTCLOUD_URL != null &&
      this.settings.NEXTCLOUD_USER != null &&
      this.settings.NEXTCLOUD_PASS != null
    ) {
      this.webdavCli = createClient(
        `${this.settings.NEXTCLOUD_URL}${this.webdavSuffix}`,
        {
          username: this.settings.NEXTCLOUD_USER,
          password: this.settings.NEXTCLOUD_PASS,
        },
      );
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

  async exists(path: string): Promise<boolean> {
    const res: boolean = await this.webdavCli.exists(path);
    return res;
  }

  async getDirectoryContents(): Promise<FileStat[]> {
    const path = `/files/${this.settings.NEXTCLOUD_USER}`;
    const contents: FileStat[] =
      await this.webdavCli.getDirectoryContents(path);
    return contents;
  }

  async getUserInfo(): Promise<any> {
    const credentials = Buffer.from(
      `${this.settings.NEXTCLOUD_USER}:${this.settings.NEXTCLOUD_PASS}`,
    ).toString("base64");

    const url = `${this.settings.NEXTCLOUD_URL}/ocs/v1.php/cloud/users/${this.settings.NEXTCLOUD_USER}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "text/plain",
        Depth: "4",
        Authorization: `Basic ${credentials}`,
        responseType: "text",
        "OCS-APIRequest": "true",
      },
    });
    const txt = await res.text();
    const result = JSON.parse(
      parseXml.xml2json(txt, { compact: true, spaces: 2 }),
    );
    console.log(JSON.stringify(result));
    return result.ocs.data;
  }
}
