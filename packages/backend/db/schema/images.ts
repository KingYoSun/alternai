import {
  mysqlEnum,
  mysqlTable,
  uniqueIndex,
  varchar,
  serial,
} from "drizzle-orm/mysql-core";

export const images = mysqlTable(
  "images",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    storage: mysqlEnum("storage", ["local", "nextcloud"]),
    path: varchar("path", { length: 255 }).notNull(),
  },
  (images) => ({
    nameIndex: uniqueIndex("name_idx").on(images.storage, images.path),
  }),
);
