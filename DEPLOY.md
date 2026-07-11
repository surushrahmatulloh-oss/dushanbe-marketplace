# Деплой ба Vercel + Neon (ройгон, осон)

## Муҳим
Дар компютер (локал) ҳоло **SQLite** мемонад.
Дар интернет (Vercel) **PostgreSQL (Neon)** лозим аст.

---

## Қадами 1 — Neon (база, ~2 дақ.)

1. Кушоед: https://console.neon.tech
2. Бо Google/GitHub Sign up кунед
3. **Create a project** → ном: `dushanbe-market`
4. **Connection string**-ро нусха бардоред (кнопкаи Copy)
   Мисол: `postgresql://neondb_owner:xxxx@ep-....neon.tech/neondb?sslmode=require`

---

## Қадами 2 — Ба ман фиристед / гузоред

Баъд аз нусхабардорӣ, connection string-ро ин ҷо гузоред ё ба агент гузаред.
Ман Vercel-ро пайваст карда, барномаро онлайн мекунам.

Ё худатон:

### Vercel
1. https://vercel.com → Sign up
2. **Add New… → Project**
3. Папкаи `bozor`-ро upload / GitHub import
4. **Environment Variables:**
   | Ном | Қимат |
   |-----|--------|
   | `DATABASE_URL` | connection string аз Neon |
   | `AUTH_SECRET` | ҳар гуна калиди дароз (мас. `dushanbe-secret-2026-xyz`) |
   | `AUTH_URL` | баъд аз deploy URL-и сайт |
   | `NEXTAUTH_URL` | ҳамон URL |

5. **Deploy**

### Баъд аз deploy — схема
Дар папкаи `bozor` муваққатан:

```bash
# schema-ро ба postgresql иваз кунед (ман карда метавонам)
# DATABASE_URL-и Neon-ро дар .env гузоред
npx prisma db push
npm run db:seed
```

Сайт: `https://xxxx.vercel.app`
