---
author: Julian Beck
pubDatetime: 2025-05-24T10:30:00Z # Adjusted to be a bit more current for a new post
title: "Deploying Astro.js to Cloudflare Pages (with Real-time Polls via Durable Objects!)"
postSlug: astro-cloudflare-pages-durable-objects-guide
featured: true # Assuming this is a significant post
draft: true
tags:
  - Astro
  - Cloudflare
  - Durable Objects
  - Serverless
ogImage: "" # Add your open graph image URL here
description: "A comprehensive guide on deploying your Astro.js website to Cloudflare Pages, including how to power real-time features like live poll updates using Cloudflare Durable Objects."
---

Cloudflare Pages offers a robust and performant platform for deploying modern Jamstack websites, including those built with Astro.js. Migrating or setting up your Astro project for Cloudflare is straightforward for static sites, but Cloudflare's capabilities also allow for dynamic, real-time features. This guide will walk you through the process, inspired by a real-world project's transition, including how to power features like automatic poll updates using Cloudflare Durable Objects.

---

## 1. Install and Configure the Astro Cloudflare Adapter

Astro uses adapters to integrate with different deployment platforms. For Cloudflare, you'll use the `@astrojs/cloudflare` adapter.

**Installation:**
If you haven't already, add the adapter to your project:
```bash
npm install @astrojs/cloudflare
# or
yarn add @astrojs/cloudflare
# or
pnpm add @astrojs/cloudflare
```

**Configuration (`astro.config.mjs`):**
Modify your `astro.config.mjs` to use the Cloudflare adapter. For server-side rendering or to leverage Cloudflare's runtime features (like Durable Objects for our live polls), ensure `output` is set to `'server'` and `platformProxy` within the adapter configuration is set to `true`.

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react'; // Or your other framework integrations
import mdx from '@astrojs/mdx';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite'; // Example: if you use Tailwind

export default defineConfig({
  site: '[https://your-domain.com](https://your-domain.com)', // Replace with your actual site URL
  output: 'server', // Crucial for enabling server-side logic and Cloudflare functions
  integrations: [
    react(), // Example
    mdx()    // Example
  ],
  adapter: cloudflare({
    platformProxy: true // Enables access to Cloudflare runtime features like Durable Objects
  }),
  markdown: {
    // Your Markdown config
  },
  vite: {
    // Add this if you're using React 19+ to ensure compatibility with Cloudflare's edge runtime
    // This was seen in the project's commit history
    resolve: {
      alias: import.meta.env.PROD && {
        "react-dom/server": "react-dom/server.edge",
      },
    },
    plugins: [tailwindcss()] // Example
  }
});
```
The project this guide is based on set `output: 'server'` and `platformProxy: true` in its Astro configuration.

---

## 2. Set Up `wrangler.jsonc` for Your Main Project

Wrangler is Cloudflare's command-line tool. You'll need a configuration file for it. The referenced project used `wrangler.jsonc`.

Create a `wrangler.jsonc` file in the root of your project:

```jsonc
// wrangler.jsonc (for the main Astro project)
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "your-astro-project-name", // Replace with your Cloudflare Pages project name
  "compatibility_date": "YYYY-MM-DD", // Use a recent date, e.g., "2025-05-24"
  "compatibility_flags": [
    "nodejs_compat" // Useful for Node.js compatibility
  ],
  "pages_build_output_dir": "./dist", // Astro's default build output directory
  "observability": {
    "enabled": true // Optional: enable observability features
  }
  // Bindings for Durable Objects will be added here later if you use them
  // (see section on Powering Real-time Features)
}
```
Ensure placeholder values match your project. The reference project named itself "openpoll" and used a compatibility date of "2025-05-21".

---

## 3. Add Deploy Scripts to `package.json` and Install Wrangler

Simplify your deployment with `package.json` scripts.

```json
// package.json
{
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build", // Builds your Astro site
    "build:check": "astro check && astro build", // Optional: build with type checking
    "preview": "astro preview",
    "astro": "astro",
    "deploy": "astro build && wrangler pages deploy", // Builds and then deploys
    "only-deploy": "wrangler pages deploy" // Deploys the existing ./dist folder
  },
  "dependencies": {
    // ... your dependencies
    "@astrojs/cloudflare": "^X.Y.Z", // Use the correct version
    "wrangler": "^A.B.C" // Add wrangler as a dependency
  }
}
```
The referenced project added `wrangler` (e.g., `^4.16.1`) as a direct dependency. If you haven't, install it:
```bash
npm install wrangler --save-dev # or pnpm add wrangler -D / yarn add wrangler --dev
```

---

## 4. Update `.gitignore`

Prevent Cloudflare-specific files from being committed.
```gitignore
# .gitignore

# Cloudflare / Wrangler
.wrangler/
.dev.vars # For local development secrets with Wrangler
# ... other ignored files
```

---

## 5. Powering Real-time Features: Automatic Poll Updates with Durable Objects

This is where Cloudflare Pages truly shines with Astro by allowing stateful logic at the edge. The example project implemented a feature for automatic poll updates using a **Cloudflare Durable Object**.

**What are Durable Objects?**
Durable Objects provide strongly consistent, transactional storage and stateful serverless compute at the edge. This makes them perfect for features like live counters, chat applications, or, in this case, ensuring poll votes are updated accurately and in real-time for all users.

**How "openpoll-do" Enables Automatic Poll Updates:**
The project created a separate worker for its Durable Object, named "openpoll-do", which contained a `Counter` class. This `Counter` object is responsible for managing the state (vote counts) for each poll.

**Setup Steps (based on the project):**

1.  **Create a Separate Worker for the Durable Object:**
    A subdirectory like `openpoll-do/` was created to house the Durable Object code. This worker has its own `package.json`, `tsconfig.json`, and `wrangler.jsonc`.

2.  **Define the Durable Object Class (`openpoll-do/src/counter.ts`):**
    A TypeScript class, let's call it `Counter`, extends `DurableObject`. It would use `this.state.storage` to persistently store and update vote counts for a specific poll. It likely exposes methods like `incrementVote(optionId)` and `getCounts()`.

    ```typescript
    // Example: openpoll-do/src/counter.ts
    // (Conceptual, based on the project's intent)
    import { DurableObject } from "cloudflare:workers";

    export class Counter extends DurableObject {
      constructor(state, env) {
        super(state, env);
        this.state = state;
      }

      async fetch(request: Request) {
        const url = new URL(request.url);
        const optionId = url.searchParams.get("optionId");
        let counts = (await this.state.storage.get("counts")) || {};

        if (request.method === "POST" && optionId) {
          counts[optionId] = (counts[optionId] || 0) + 1;
          await this.state.storage.put("counts", counts);
        }
        return new Response(JSON.stringify(counts), {
          headers: { "Content-Type": "application/json" },
        });
      }

      // Example: Alarm for periodic updates if needed
      // async alarm() { /* ... */ }
    }
    ```

3.  **Configure Wrangler for the Durable Object (`openpoll-do/wrangler.jsonc`):**
    This file defines the Durable Object itself and any necessary migrations.
    ```jsonc
    // openpoll-do/wrangler.jsonc
    {
      "name": "openpoll-do", // Name of the worker service exporting the DO
      "main": "src/counter.ts", // Entrypoint for the DO worker
      "compatibility_date": "YYYY-MM-DD", // e.g., "2025-05-24"
      "durable_objects": {
        "bindings": [
          {
            "name": "COUNTER_DO", // How this DO is referred to internally
            "class_name": "Counter" // The exported class name
          }
        ]
      },
      "migrations": [
        { "tag": "v1", "new_classes": ["Counter"] } // Manages DO class changes
      ]
    }
    ```

4.  **Bind the Durable Object to Your Main Astro Project:**
    Update your main project's `wrangler.jsonc` to bind the `COUNTER_DO`. This allows your Astro server-side code to communicate with it.

    ```jsonc
    // Main wrangler.jsonc (add this section)
    {
      // ... other configurations from step 2 ...
      "durable_objects": {
        "bindings": [
          {
            "name": "POLL_COUNTER",    // How your Astro functions will access it (e.g., env.POLL_COUNTER)
            "class_name": "Counter",   // The class name exported by the DO worker
            "script_name": "openpoll-do" // The name of the worker service that exports the DO
          }
        ]
      }
    }
    ```

Your Astro API routes or server endpoints can now use `env.POLL_COUNTER` to get a stub for a specific poll's `Counter` instance (usually based on a poll ID), send it "vote" requests, and fetch updated counts. The frontend then polls these Astro API routes or uses WebSockets (if implemented with the DO) to display these changes automatically.

---

## 6. Deploy!

Once everything is configured, you can deploy your site:

* **Full build and deploy:**
    ```bash
    npm run deploy # or yarn deploy / pnpm deploy
    ```
* **Deploy an existing build:**
    ```bash
    npm run only-deploy # or yarn only-deploy / pnpm only-deploy
    ```
Wrangler will guide you through authentication and project selection on your first deploy. If you added a Durable Object worker like "openpoll-do", deploy it separately first:
```bash
cd openpoll-do
npx wrangler deploy # (or your specific deploy script for the DO)
cd ..
```
Then deploy your main Astro project.

---

By following these steps, your Astro.js website is not only deployed on Cloudflare Pages but can also be enhanced with powerful, stateful edge features like the automatic poll updates demonstrated. This architecture allows for highly responsive and scalable interactive elements. Remember to consult the official [Astro](https://docs.astro.build/en/guides/deploy/cloudflare/) and [Cloudflare Pages](https://developers.cloudflare.com/pages/) documentation for the latest details.