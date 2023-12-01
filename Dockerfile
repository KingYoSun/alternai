FROM node:20.5.1-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS build
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run -r build
# 1. Root store に依存しない node_modules を作成する
RUN pnpm --filter=frontend --prod deploy /prod/frontend
RUN pnpm --filter=backend --prod deploy /prod/backend

# 2. ベースイメージは base なので不要なファイルが含まれていない
FROM base AS backend
COPY --from=build /prod/backend/node_modules/ /app/packages/backend/node_modules
COPY --from=build /prod/backend/dist /app/packages/backend/dist
COPY --from=build /prod/backend/package.json /app/packages/backend/package.json
WORKDIR /app/packages/backend
EXPOSE 8090
CMD [ "pnpm", "run", "start" ]

FROM base AS frontend
COPY --from=build /prod/frontend/node_modules/ /app/packages/frontend/node_modules
# 何故か/prod/frontend/distが生成されない
COPY --from=build /app/packages/frontend/dist /app/packages/frontend/dist
COPY --from=build /prod/frontend/package.json /app/packages/frontend/package.json
WORKDIR /app/packages/frontend
EXPOSE 5173
CMD [ "pnpm", "run", "start" ]
