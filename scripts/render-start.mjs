/**
 * Render start: migrate → start Next ASAP → seed in background.
 * Health check must not wait for seed.
 */
import { spawn } from "node:child_process";

const PORT = process.env.PORT || "10000";

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: "inherit",
      shell: true,
      env: process.env,
      ...opts,
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(" ")} exited ${code}`));
    });
  });
}

async function main() {
  try {
    console.log("[render] prisma db push...");
    await run("npx", ["prisma", "db", "push", "--accept-data-loss"]);
  } catch (err) {
    console.error("[render] db push failed (continuing):", err.message);
  }

  // Seed must not block health checks / open port
  console.log("[render] seeding in background...");
  const seed = spawn("npx", ["tsx", "prisma/seed.ts"], {
    stdio: "ignore",
    shell: true,
    env: { ...process.env, SEED_LIGHT: process.env.SEED_LIGHT || "1" },
    detached: true,
  });
  seed.unref();

  console.log(`[render] next start on 0.0.0.0:${PORT}`);
  await run("npx", ["next", "start", "-H", "0.0.0.0", "-p", PORT]);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
