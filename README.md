
# alternai

Alternative NovelAI image generator

## Installation

### requirement
|name|version|
|---|---|
|nodejs|20.5.1|
|pnpm|8.9.0|

### run locally

```bash
  git clone https://github.com/KingYoSun/alternai.git
  cd alternai
  mkdir output
  mkdir -p data/redis
  cp .env.default .env
  docker compose up --build -d
```

## Features

- Light/dark mode toggle
- Responsive
- Image generator by [NovelAI API](https://api.novelai.net/docs/#/)
  - Unimplemented features
    - img2img
    - Inpainting
    - ControlNet
    - Upscaling
    - Multiple generation
- Save image to nextcloud
## Roadmap
- Prompt-based image management
  - auto classify and search
- Support prompt engineering
  - categorized tags
  - tags relation
  - block editor
- scheduled generating image
- test

## Acknowledgements
- [Zod](https://zod.dev/)

### backend
- [Express](https://expressjs.com/en/guide/routing.html)
- [NovelAI API](https://api.novelai.net/docs/#/)
- [webdav-client](https://github.com/perry-mitchell/webdav-client)
- [Nextcloud API](https://docs.nextcloud.com/server/latest/developer_manual/client_apis/index.html)
- [Drizzle ORM](https://drizzle.team/)
- [adm-zip](https://github.com/cthackers/adm-zip/wiki/API-Documentation)

### frontend
- [Vite](https://ja.vitejs.dev/guide/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix ui](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [tailwindcss](https://tailwindcss.com/docs/installation)
- [Lucide Icons](https://lucide.dev/icons/)
- [React Hook Form](https://react-hook-form.com/docs)

## License

[MIT](https://choosealicense.com/licenses/mit/)
