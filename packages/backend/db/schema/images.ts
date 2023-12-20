import {
  mysqlEnum,
  mysqlTable,
  uniqueIndex,
  varchar,
  serial,
  bigint,
  primaryKey,
  text,
  boolean,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const images = mysqlTable(
  "images",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    storage: mysqlEnum("storage", ["local", "nextcloud"]),
    path: varchar("path", { length: 255 }).notNull(),
  },
  (images) => ({
    storagePathIndex: uniqueIndex("storage_path_idx").on(
      images.storage,
      images.path,
    ),
  }),
);

export const categories = mysqlTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
  },
  (categories) => ({
    nameIndex: uniqueIndex("name_idx").on(categories.name),
  }),
);

export const categoryRelations = relations(categories, ({ many }) => ({
  tags: many(tags),
}));

export const tags = mysqlTable(
  "tags",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    categoryId: bigint("category_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => categories.id),
  },
  (tags) => ({
    nameIndex: uniqueIndex("name_idx").on(tags.name),
  }),
);

export const tagsRelations = relations(tags, ({ one }) => ({
  category: one(categories, {
    fields: [tags.categoryId],
    references: [categories.id],
  }),
}));

export const keywords = mysqlTable(
  "keywords",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
  },
  (keywords) => ({
    nameIndex: uniqueIndex("name_idx").on(keywords.name),
  }),
);

export const keywordsToTags = mysqlTable(
  "keywords_to_tags",
  {
    keywordId: bigint("keyword_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => keywords.id),
    tagId: bigint("tag_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => tags.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.keywordId, t.tagId] }),
  }),
);

export const keywordsToTagsRelations = relations(keywordsToTags, ({ one }) => ({
  tag: one(tags, {
    fields: [keywordsToTags.tagId],
    references: [tags.id],
  }),
  keyword: one(keywords, {
    fields: [keywordsToTags.keywordId],
    references: [keywords.id],
  }),
}));

export const prompts = mysqlTable(
  "prompts",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    text: text("text").notNull(),
    isNegative: boolean("is_negative").default(false),
  },
  (prompts) => ({
    nameIndex: uniqueIndex("name_idx").on(prompts.name),
  }),
);

export const promptsToKeywords = mysqlTable(
  "prompts_to_keywords",
  {
    promptId: bigint("prompt_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => prompts.id),
    keywordId: bigint("keyword_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => keywords.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.promptId, t.keywordId] }),
  }),
);

export const promptsToKeywordsRelations = relations(
  promptsToKeywords,
  ({ one }) => ({
    keyword: one(keywords, {
      fields: [promptsToKeywords.keywordId],
      references: [keywords.id],
    }),
    prompt: one(prompts, {
      fields: [promptsToKeywords.promptId],
      references: [prompts.id],
    }),
  }),
);

export const imagesToKeywords = mysqlTable(
  "images_to_keywords",
  {
    imageId: bigint("image_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => images.id),
    keywordId: bigint("keyword_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => keywords.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.imageId, t.keywordId] }),
  }),
);

export const imagesToKeywordsRelations = relations(
  imagesToKeywords,
  ({ one }) => ({
    keyword: one(keywords, {
      fields: [imagesToKeywords.keywordId],
      references: [keywords.id],
    }),
    image: one(images, {
      fields: [imagesToKeywords.imageId],
      references: [images.id],
    }),
  }),
);
