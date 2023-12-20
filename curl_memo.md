### document
- help:api: https://danbooru.donmai.us/wiki_pages/help%3Aapi
- Api:Wiki Pages: https://danbooru.donmai.us/wiki_pages/api%3Awiki_pages
- api:tags: https://danbooru.donmai.us/wiki_pages/api%3Atags
- help:api read requests: https://danbooru.donmai.us/wiki_pages/help%3Aapi_read_requests#dtext-external-links
- hepl:chaining syntax: https://danbooru.donmai.us/wiki_pages/help%3Achaining_syntax

### command sample

- `curl --globoff -u $username:$apikey -H "Content-Type:applicatio/x-www-form-urlencoded" 'https://danbooru.donmai.us/wiki_pages.json?search[is_deleted]=false&search[order]=id&limit=2'`

### danbooru wiki取得とDB構築設計
1. `/tags.json` からタグを取得する
※ GET以外はrate limitがかかるので `Content-Type:applicatio/x-www-form-urlencoded` が基本

1. `/wiki_pages` から以下のパラメータを取得する。検索条件は、
```
{
  "search": {
    "is_deleted": false,
    "order": "post_count" // title or post_count, default=updated_at
  },
  "limit": 20,
  "_method": "get"
}
```

取得パラメータ
|name|type|
|---|---|
|id|integer|
|title|string|
|body|string|
|other_names|string[]|
2. bodyから[[]]で表示されているワードを関連tagとしてリレーションを作成する。このとき、[[Tag group:]]で表されるキーワードはtag_groupに入れる

### テーブル名変更 & danbooruに合わせてカラムも治す

- keywords -> tags
- tags -> tag_groups
- categoriesは手動運用
- wiki_pagesテーブルも作る