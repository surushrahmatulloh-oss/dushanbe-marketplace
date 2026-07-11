# Душанбе Маркетплейс

Платформаи веби маркетплейс барои хариду фурӯш дар Душанбе.

## Технологияҳо

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + UI components (shadcn-style)
- **Prisma** + SQLite (барои dev) / PostgreSQL (барои production)
- **NextAuth.js** — аутентификатсия
- **TanStack Query** + Zustand

## Оғози кор

```bash
cd bozor
npm install
npm run db:push
npm run db:seed
npm run dev
```

Сайт дар [http://localhost:3000](http://localhost:3000) кушода мешавад.

## Ҳисобҳои тестӣ

| Нақш | Email | Парол |
|------|-------|-------|
| Админ | admin@bozor.tj | password123 |
| Истифодабаранда | user@bozor.tj | password123 |
| Фурӯшанда | seller@bozor.tj | password123 |

## Сохтори лоиҳа

```
bozor/
├── prisma/          # Database schema ва seed
├── public/          # Статик файлҳо
├── src/
│   ├── app/         # Next.js App Router (саҳифаҳо ва API)
│   ├── components/  # React компонентҳо
│   ├── lib/         # Утилитҳо, auth, prisma
│   └── types/       # TypeScript types
└── TZ.md            # Техникӣ Задание
```

## Марҳилаи MVP (ҷорӣ)

- [x] Аутентификатсия (бақайдгирӣ/вуруд)
- [x] CRUD барои эълонҳо
- [x] Категорияҳо ва ҷустуҷӯ/филтр
- [x] Саҳифаи эълон
- [x] Кабинети шахсӣ
- [x] Дизайни responsive

## Марҳилаи 2 (навбатӣ)

- [ ] Сабади харид ва checkout
- [ ] Кабинети фурӯшанда
- [ ] Чат
- [ ] Системаи баҳодиҳӣ

## Иваз кардани PostgreSQL

Дар `prisma/schema.prisma` provider-ро иваз кунед:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Ва `DATABASE_URL`-ро дар `.env` танзим кунед.
