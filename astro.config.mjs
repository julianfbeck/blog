import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.julianbeck.com/", // replace this with your deployed domain
  // Extra project sites for reference (non-canonical):
  // - https://coffeebeantracker.com
  redirects: {
    // Redirect all blog posts to new julianbeck.com/blog/
    "/posts/2021-01-04-ko-local-go-development-with-minikube":
      "https://julianbeck.com/blog/ko-local-go-development-with-minikube",
    "/posts/2021-01-05-set-up-basic-auth":
      "https://julianbeck.com/blog/set-up-basic-auth-traefik",
    "/posts/2021-01-05-use-uptimekuma-on-kubernetes":
      "https://julianbeck.com/blog/deploy-uptime-kuma-kubernetes",
    "/posts/introducing-eyevo-pokemon-tcg-scanner":
      "https://julianbeck.com/blog/introducing-eyevo-pokemon-tcg-scanner",
    "/posts/whatstats-whatsapp-chat-analytics-iphone":
      "https://julianbeck.com/blog/whatstats-whatsapp-analytics",
    "/posts/introducing-iemoji-ai-emoji-generator":
      "https://julianbeck.com/blog/introducing-iemoji-ai-emoji-generator",
    "/posts/add-to-siri-button-swiftui":
      "https://julianbeck.com/blog/add-to-siri-button-swiftui",
    "/posts/stripe-client-side-donation-button-with-react":
      "https://julianbeck.com/blog/stripe-client-side-donation-button-react",
    "/posts/app-money-track-your-app-store-sales-using-widgets":
      "https://julianbeck.com/blog/app-earnings-track-appstore-sales",
    "/posts/build-multiple-docker-images-using-github-action-and-matrix-builds":
      "https://julianbeck.com/blog/github-actions-build-multiple-docker-images",
    "/posts/cloudflare-workers-ios-backend-guide":
      "https://julianbeck.com/blog/cloudflare-workers-ios-backend",
    "/posts/experience-building-a-community-bingo-using-t3-stack":
      "https://julianbeck.com/blog/t3-stack-community-bingo",
    "/posts/kubernetes-dashboard-in-notion":
      "https://julianbeck.com/blog/kubernetes-dashboard-notion",
    // Posts not on new site - redirect to main blog listing
    "/posts/how-i-switched-my-website-from-next-auth-to-better-auth":
      "https://julianbeck.com/blog",
    "/posts/astro-cloudflare-pages-durable-objects-guide":
      "https://julianbeck.com/blog",
    // Redirect main pages
    "/posts": "https://julianbeck.com/blog",
    "/": "https://julianbeck.com/blog",
    "/tags": "https://julianbeck.com/blog",
    "/about": "https://julianbeck.com",
    "/search": "https://julianbeck.com/blog",
  },
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    react(),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [
      remarkToc,
      [
        remarkCollapse,
        {
          test: "Table of contents",
        },
      ],
    ],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
});
