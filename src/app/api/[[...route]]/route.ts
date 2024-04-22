import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "hono/adapter";
import { handle } from "hono/vercel";
import { Redis } from "@upstash/redis/cloudflare";

export const runtime = "edge";

const app = new Hono().basePath("/api");

// to access environment variables inside of the api route
type EnvConfig = {
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
};

// cors middleware
app.use("/*", cors());

app.get("/search", async (c) => {
  try {
    const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } =
      env<EnvConfig>(c);

    const start = performance.now();
    {
      /*********************/
    }

    // to communicate with the database
    const redis = new Redis({
      url: UPSTASH_REDIS_REST_URL,
      token: UPSTASH_REDIS_REST_TOKEN,
    });

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

    {
      /*********************/
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
