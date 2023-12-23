### document

- help:api: https://danbooru.donmai.us/wiki_pages/help%3Aapi
- Api:Wiki Pages: https://danbooru.donmai.us/wiki_pages/api%3Awiki_pages
- api:tags: https://danbooru.donmai.us/wiki_pages/api%3Atags
- help:api read requests: https://danbooru.donmai.us/wiki_pages/help%3Aapi_read_requests#dtext-external-links
- hepl:chaining syntax: https://danbooru.donmai.us/wiki_pages/help%3Achaining_syntax

### curl sample

- `curl --globoff -u $username:$apikey -H "Content-Type:applicatio/x-www-form-urlencoded" 'https://danbooru.donmai.us/wiki_pages.json?search[is_deleted]=false&search[order]=id&limit=1&page=1'`
- `curl --globoff -u $username:$apikey -H "Content-Type:applicatio/x-www-form-urlencoded" 'https://danbooru.donmai.us/tags.json?search[order]=id&limit=1&page=2'`

### danbooru wiki取得とDB構築

1. `/tags.json` からタグを取得する
   ※ GET以外はrate limitがかかるので `Content-Type:applicatio/x-www-form-urlencoded` が基本

1. `/wiki_pages` で、bodyから[[]]で表示されているワードを関連tagとしてリレーションを作成する。このとき、[[Tag group:]]で表されるキーワードはtag_groupに入れる
