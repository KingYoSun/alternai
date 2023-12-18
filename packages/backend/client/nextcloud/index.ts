import type RedisCli from "../redis.ts";
import { type Settings } from "shared/types/Settings.ts";
import { createClient, type FileStat, type WebDAVClient } from "webdav";
import parseXml from "xml-js";

interface classProps {
  redis: RedisCli;
}

const REDIS_SETTING_KEY = "alternai:settings";

export default class NextcloudCli {
  redis: RedisCli;
  settings: Settings;
  connected: boolean;
  webdavCli: WebDAVClient;
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
      this.connected = true;
    } else {
      this.connected = false;
    }
  }

  async getSettings(): Promise<Settings> {
    const res = await this.redis.get(REDIS_SETTING_KEY);
    if (res === null) return {};

    return JSON.parse(res);
  }

  async exists(path: string): Promise<boolean> {
    const res: boolean = await this.webdavCli.exists(path);
    return res;
  }

  async getDirectoryContents(): Promise<FileStat[]> {
    const path = `/files/${this.settings.NEXTCLOUD_USER}`;
    const contents = await this.webdavCli.getDirectoryContents(path);
    if (Array.isArray(contents)) {
      return contents;
    } else {
      return contents.data;
    }
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
