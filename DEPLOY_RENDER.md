# Деплой ба Render (ройгон)

## Қадами 1 — GitHub (лозим аст)
1. https://github.com/signup — бо **Google** қайд шавед
2. New repository → ном: `dushanbe-marketplace` → Create (бе README)

## Қадами 2 — Кодро ба GitHub
Дар PowerShell (папкаи bozor):

```powershell
cd "c:\Users\user\Desktop\маркет плес\bozor"
git remote add origin https://github.com/USERNAME/dushanbe-marketplace.git
git branch -M main
git push -u origin main
```

(USERNAME = номи GitHub-и шумо)

## Қадами 3 — Render
1. https://dashboard.render.com → Sign up with **Google**
2. **New +** → **Blueprint**
3. Пайваст кунед GitHub → репои `dushanbe-marketplace`-ро интихоб кунед
4. Render файли `render.yaml`-ро мехонад → **Apply**
5. Интизор шавед 5–15 дақиқа (build)

Сайт: `https://dushanbe-marketplace.onrender.com`

## Муҳим
- Free tier: баъд аз бекорӣ сайт «хомӯш» мешавад — кушодани аввал ~1 дақ.
- Локал: ҳоло схема PostgreSQL аст. Барои кор дар компютер `DATABASE_URL`-и Render-ро нусха бардоред ё SQLite-ро барқарор кунем.
