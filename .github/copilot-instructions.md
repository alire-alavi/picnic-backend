# AI agent guide for picnic-backend

Purpose: help AI coding agents work productively in this NestJS + Prisma + GraphQL project by following existing patterns and workflows.

## Changes guideline
- Size: keep changes small and focused per prompt. don't change more than 2 files for prompt responses.
- Scope: limit the changes as much as possible to the requested file, either add more files to handle the change,


## Architecture (big picture)
- Framework: NestJS (v11) with GraphQL Yoga driver. GraphQL schema is generated at runtime to `schema.gql` (code-first).
- Modules: `AppModule` wires `ConfigModule` (global .env), `GraphQLModule` (Yoga), `HealthModule`, `ProductsModule`, and global `PrismaModule`.
- Data: PostgreSQL via Prisma. Schema lives in `prisma/schema.prisma`; client generated before build. `PrismaService` extends `PrismaClient` and is exported globally.
- API style: GraphQL resolvers under `src/**/*.resolver.ts` using DTOs and `@nestjs/graphql` decorators; models under `src/**/models`.
- Base GraphQL model: `src/utils/graphql.models.ts` defines `AbstractModel` used by GraphQL models (e.g., `Product`). Note: GraphQL id is typed as number here, while DB ids are UUID strings in Prisma.

## Key workflows
- Install: `npm install`
- Dev server: `npm run start:dev` (reads `PORT` from `.env`, default 3000)
- Build: `npm run build` (runs `prisma generate` then `nest build`)
- Test: `npm run test` (unit), `npm run test:e2e` (e2e)
- Lint/format: `npm run lint`, `npm run format`
- DB helpers: `npm run db:up` (docker compose Postgres), `npm run prisma:migrate`, `npm run prisma:studio`

## Environment and config
- `ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' })`. Put runtime config in `.env`.
- Prisma uses `DATABASE_URL` (see `prisma/schema.prisma`). PostgreSQL defaults provided in `docker-compose.yml`.
- MinIO is defined in `docker-compose.yml` with `${MINIO_*}` vars; set in `.env`.

## Conventions and patterns
- GraphQL code-first:
  - Models: `src/**/models/*.model.ts` decorated with `@ObjectType` and `@Field`. Extend `AbstractModel` when appropriate.
  - Resolvers: `src/**/` `*.resolver.ts` expose `@Query`/`@Mutation` returning the model types.
  - DTOs: input types in `src/**/dto/*.input.ts` and plain interfaces in `*.interface.ts` used by services.
- Services talk to Prisma directly via injected `PrismaService` and return Prisma entity types (e.g., `Product` from `@prisma/client`).
- Sorting/pagination defaults: see `ProductsService.list` (order by `createdAt desc`, `take: limit || 20`). Follow similar defaults unless specified.
- Error handling/validation: class-validator is available but not shown in current DTOs—mirror existing minimal approach unless you add validations explicitly.

## Cross-type mapping gotcha (IDs)
- Prisma models use `String @id @default(uuid())`.
- GraphQL `AbstractModel.id` is `ID` but typed as `number` in code. Be careful to keep GraphQL and Prisma IDs consistent. If you add new models, prefer `id: string` in GraphQL to match Prisma UUIDs, or implement mapping explicitly.

## Adding new features (example)
- New domain (e.g., Categories):
  1) Add Prisma model (edit `prisma/schema.prisma`) and run `npm run prisma:migrate`.
  2) Create `src/categories` with module, service (use `PrismaService`), resolver, models, dto.
  3) Import the module into `AppModule`.
  4) Return Prisma types from service; shape GraphQL types in `models/`.

## Running the stack locally
- Database: `docker compose up -d db` (from repo root). DB exposed on `${POSTGRES_PORT:-5432}`.
- MinIO: `docker compose up -d minio`. API on `${MINIO_API_PORT:-9000}`, console on `${MINIO_CONSOLE_PORT:-9001}`. Set `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD` in `.env`.

## Files to read first
- `src/app.module.ts` — wiring and config
- `src/main.ts` — bootstrap and port resolution
- `prisma/schema.prisma` — domain schema
- `src/products/*` — reference for module/service/resolver/model structure
- `docker-compose.yml` — local infra (Postgres, MinIO)

## Coding checklist for agents
- Update Prisma types then run generate before build/tests.
- Keep GraphQL code-first decorators in sync with service return shapes.
- Inject and reuse `PrismaService` from `PrismaModule` (already global).
- Use `.env` for ports/URLs; don’t hardcode.
- Watch the ID type mismatch; prefer string UUIDs end-to-end when adding code.
