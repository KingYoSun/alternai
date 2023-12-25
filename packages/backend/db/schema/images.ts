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
  json,
  int,
  index,
  datetime,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const images = mysqlTable(
  "images",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    storage: mysqlEnum("storage", ["local", "nextcloud"]),
    path: varchar("path", { length: 255 }).notNull(),
    createdAt: datetime("created_at"),
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
  tags: many(tagGroups),
}));

export const tagGroups = mysqlTable(
  "tag_groups",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    categoryId: bigint("category_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => categories.id),
  },
  (tagGroups) => ({
    nameIndex: uniqueIndex("name_idx").on(tagGroups.name),
  }),
);

export const tagGroupsRelations = relations(tagGroups, ({ one }) => ({
  category: one(categories, {
    fields: [tagGroups.categoryId],
    references: [categories.id],
  }),
}));

export const tags = mysqlTable(
  "tags",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    category: mysqlEnum("category", [
      "General",
      "Artist",
      "Copyright",
      "Character",
      "Meta",
    ]),
    postCount: int("post_count"),
    isLocked: boolean("is_locked").default(false),
    isDeprecated: boolean("is_deprecated").default(false),
    words: json("words"),
    createdAt: datetime("created_at"),
    updatedAt: datetime("updated_at"),
  },
  (tags) => ({
    nameIndex: uniqueIndex("name_idx").on(tags.name),
    categoryIndex: index("category_idx").on(tags.category),
    updatedAtIndex: index("updated_at").on(tags.updatedAt),
    postCount: index("post_count").on(tags.postCount),
  }),
);

export const tagsToTagGroups = mysqlTable(
  "tags_to_tag_groups",
  {
    tagId: bigint("tag_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => tags.id),
    tagGroupId: bigint("tag_group_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => tags.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.tagId, t.tagGroupId] }),
  }),
);

export const tagsToTagGroupsRelations = relations(
  tagsToTagGroups,
  ({ one }) => ({
    tagGroup: one(tagGroups, {
      fields: [tagsToTagGroups.tagGroupId],
      references: [tagGroups.id],
    }),
    tag: one(tags, {
      fields: [tagsToTagGroups.tagId],
      references: [tags.id],
    }),
  }),
);

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
    isNegativeIdx: index("is_negative_idx").on(prompts.isNegative),
  }),
);

export const promptsToTags = mysqlTable(
  "prompts_to_tags",
  {
    promptId: bigint("prompt_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => prompts.id),
    tagId: bigint("tag_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => tags.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.promptId, t.tagId] }),
  }),
);

export const promptsToTagsRelations = relations(promptsToTags, ({ one }) => ({
  tag: one(tags, {
    fields: [promptsToTags.tagId],
    references: [tags.id],
  }),
  prompt: one(prompts, {
    fields: [promptsToTags.promptId],
    references: [prompts.id],
  }),
}));

export const imagesToTags = mysqlTable(
  "images_to_tags",
  {
    imageId: bigint("image_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => images.id),
    tagId: bigint("tag_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => tags.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.imageId, t.tagId] }),
  }),
);

export const imagesToTagsRelations = relations(imagesToTags, ({ one }) => ({
  tag: one(tags, {
    fields: [imagesToTags.tagId],
    references: [tags.id],
  }),
  image: one(images, {
    fields: [imagesToTags.imageId],
    references: [images.id],
  }),
}));

export const wikiPages = mysqlTable("wiki_pages", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("text").notNull(),
  otherNames: json("other_names"),
  isDeleted: boolean("is_deleted").default(false),
  locked: boolean("locked").default(false),
  createdAt: datetime("created_at"),
  updatedAt: datetime("updated_at"),
});

export const tagsToWikiPages = mysqlTable(
  "tags_to_wiki_pages",
  {
    tagId: bigint("tag_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => tags.id),
    wikiPageId: bigint("wiki_page_id", { mode: "number", unsigned: true })
      .notNull()
      .references(() => tags.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.tagId, t.wikiPageId] }),
  }),
);

export const tagsToWikiPagesRelations = relations(
  tagsToWikiPages,
  ({ one }) => ({
    wikiPage: one(wikiPages, {
      fields: [tagsToWikiPages.wikiPageId],
      references: [wikiPages.id],
    }),
    tag: one(tags, {
      fields: [tagsToWikiPages.tagId],
      references: [tags.id],
    }),
  }),
);
