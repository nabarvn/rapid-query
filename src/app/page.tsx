import { Search } from "@/components";

export default function Home() {
  return (
    <main className="h-screen w-screen grainy p-5 md:p-3">
      <div className="flex flex-col items-center gap-6 duration-500 animate-in fade-in-5 slide-in-from-bottom-2.5 pt-32">
        <h1 className="text-4xl md:text-5xl tracking-tight font-bold">
          ⚡ Rapid Query
        </h1>

        <p className="max-w-prose text-zinc-600 text-base md:text-lg text-center">
          A high-performance API built with Hono, Next.js, and Cloudflare.
          <br className="hidden md:block" />
          Type a query below and get your results in milliseconds.
        </p>

        <Search />
      </div>
    </main>
  );
}
