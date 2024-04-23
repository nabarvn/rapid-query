# Rapid Query

An agile web app leveraging the power of Hono, Next.js, and Cloudflare - delivering fast API responses in milliseconds. Simply input your query and experience high-performance results. Engineered for nothing but efficiency and speed.

## Screenshot

<img src="./screenshot.png">

<p align="center">
  <a href="https://rapid-query.pages.dev"><strong>View Project »</strong></a>
</p>

## Running Locally

This application requires Node.js v18.20.1+.

### Cloning the repository to the local machine:

```bash
git clone https://github.com/nabarvn/rapid-query.git
cd rapid-query
```

### Installing the dependencies:

```bash
pnpm install
```

### Setting up the `.env` file:

```bash
cp .env.example .env
```

### Seeding the application:

```bash
pnpm seed
```

### Deploying the application to Cloudflare Workers:

```bash
pnpm run deploy
```

### Running the application:

```bash
pnpm dev
```

## Tech Stack:

- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Framework**: [Next.js](https://nextjs.org)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Analytics**: [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics)
- **Redis Database**: [Upstash](https://upstash.com/docs/vector/overall/getstarted)
- **Edge Runtime**: [Cloudflare Workers](https://developers.cloudflare.com/workers)
- **API Server**: [Hono.js](https://hono.dev/top)
- **Deployment**: [Cloudflare Pages](https://developers.cloudflare.com/pages)

## Credits

Learned a ton while building this project. All thanks to Josh for the next level (no pun intended) tutorial!

<hr />

<div align="center">Don't forget to leave a STAR 🌟</div>
