import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import type { MiddlewareHandler } from "hono";
import { Redis } from "@upstash/redis/cloudflare";

export const runtime = "edge";

type EnvConfig = {
  CRON_SECRET: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
};

type Variables = {
  redis: Redis;
};

const app = new Hono<{
  Bindings: EnvConfig;
  Variables: Variables;
}>().basePath("/api");

const redisMiddleware: MiddlewareHandler<{
  Bindings: EnvConfig;
  Variables: Variables;
}> = async (c, next) => {
  const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = c.env;

  const redis = new Redis({
    url: UPSTASH_REDIS_REST_URL,
    token: UPSTASH_REDIS_REST_TOKEN,
  });

  c.set("redis", redis);
  await next();
};

app.use("/*", cors());
app.use("/search", redisMiddleware);
app.use("/ping", redisMiddleware);

app.get("/ping", async (c) => {
  try {
    const { CRON_SECRET } = c.env;
    const authHeader = c.req.header("authorization");

    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return c.json({ error: "Unauthorized" }, { status: 401 });
    }

    const redis = c.get("redis");
    await redis.set("ping:timestamp", new Date().toISOString());

    return c.json(
      { status: "ok", services: { redis: "ok" } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Redis ping failed:", error);

    return c.json(
      { status: "error", services: { redis: "error" } },
      { status: 503 }
    );
  }
});

app.get("/search", async (c) => {
  try {
    const start = performance.now();
    
    const redis = c.get("redis");
    const query = c.req.query("q")?.toUpperCase();

    if (!query) {
      return c.json(
        { message: "Invalid search query" },
        {
          status: 400,
        }
      );
    }

    const res: string[] = [];
    const rank = await redis.zrank("terms", query);

    if (rank !== null && rank !== undefined) {
      const temp = await redis.zrange<string[]>("terms", rank, rank + 500);

      for (const el of temp) {
        if (!el.startsWith(query)) {
          break;
        }

        if (el.endsWith("*")) {
          res.push(el.substring(0, el.length - 1));
        }
      }
    }

    const end = performance.now();

    return c.json({
      results: res,
      duration: end - start,
    });
  } catch (err) {
    console.error(err);

    return c.json(
      { results: [], message: "Something went wrong" },
      {
        status: 500,
      }
    );
  }
});

// vercel deployment
export const GET = handle(app);

// cloudflare workers
export default app as never;
