---
author: Julian Beck
pubDatetime: 2025-01-03T20:00:00Z
title: "Building AI-Powered iOS Apps with Cloudflare Workers and OpenAI"
postSlug: cloudflare-workers-ios-backend-guide
featured: true
draft: false
tags:
  - cloudflare
  - ios
ogImage: "/media/AppMoneyApp.png"
description: ""
---


The demand for AI-powered apps is rapidly increasing. Developers are creating applications such as "Plant Identifier," "Calorie Counter," and image-generation tools that leverage AI models from providers like OpenAI, Replicate, and others.

A common approach might be to directly integrate AI services into the app by calling their APIs. However, this introduces a significant security risk: exposing the API key. Even if secure storage methods like Keychain are used, the API key can still be intercepted through network traffic monitoring tools like mitmproxy or Charles.

To mitigate this risk, a backend service is essential to act as a proxy between the app and the AI service. While SaaS platforms like "aiproxy" can fulfill this role, they often charge on a per-request basis, which can become prohibitively expensive.

A more efficient and cost-effective alternative is to use Cloudflare Workers. These are serverless functions running on Cloudflare's edge network, offering exceptional speed, scalability, and affordability. With Cloudflare Workers, you can build APIs, handle requests, and perform server-side tasks seamlessly.

In this guide, I’ll walk you through an architecture for building a simple and scalable backend using Cloudflare Workers. We'll integrate AI capabilities from OpenAI and handle subscriptions through Revenucat to make sure only paying users can access the AI features as well as implementing Rate Limiting to prevent abuse.


## Cloudflare Workers Backend Architecture

The backend architecture consists of three main components:
- **Cloudflare Worker**: Handles incoming requests, checks subscription status, and forwards AI requests to OpenAI.
- **Revenucat**: Manages user subscriptions and entitlements.
- **OpenAI**: Provides AI capabilities for text generation, image recognition, and more.

![CloudflareWorker](/media/cloudflare-workers-ios.svg)

The Cloudflare Worker acts as a middleman between the app and the AI service. It checks the user's subscription status with Revenucat and forwards the request to OpenAI if the user is subscribed. This architecture ensures that only paying users can access the AI features.

### Why use Revenucat?

Revenuecat makes it easy to mange user subscriptions and entitlements. It provides a simple API to check a user's subscription status and verify their entitlements. By using Revenuecat, you can simply use their API to check if a user is subscribed and allowed to access the AI features.

For checking the user subscription status, you can use the following code snippet:

```typescript
async function getUserSubscriptionStatus(userId: string, apiToken: string) {
  const url = `https://api.revenuecat.com/v1/subscribers/${userId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.log(await response.text(), response.status);
    throw new Error("Failed to fetch user status from RevenueCat");
  }

  const data = (await response.json()) as { subscriber: { entitlements: any } };
  return data.subscriber.entitlements;
}

export { getUserSubscriptionStatus };
```

### What about Rate Limiting?




For the Function to work you need to provide the `userId` and the `apiToken`. The `userId` is the unique identifier of the user and the `apiToken` is the API token you get from the Revenuecat dashboard for the app you are building.






For an app I was building, I needed to integrate AI capabilities while handling subscriptions through Revenucat. I'll share two different approaches to this problem - a simple synchronous one and a more robust asynchronous solution.

While the synchronous approach is straightforward, it can be challenging for longer-running AI tasks. Fortunately, we can implement a more scalable solution using webhooks and polling.

Let's look at both approaches:

**The Synchronous Approach**
The simplest way to handle AI requests is through direct communication. Your iOS app sends a request to a Cloudflare Worker, which checks the subscription status with Revenucat and then forwards the request to an AI service like OpenAI or Replicate. The worker waits for the result and sends it back to your app.

This works well for quick responses but has limitations with longer AI tasks that might exceed timeout limits or keep connections open unnecessarily long.

**The Asynchronous Approach**
A more robust solution uses webhooks and polling. Instead of waiting for the AI to complete, your app receives a request ID immediately. The app then periodically checks for results while the AI service processes the request independently. When done, the AI service notifies your worker through a webhook.

This approach handles long-running AI tasks better, avoids timeout issues, and provides a more reliable user experience. It's particularly useful when dealing with complex AI models that might take longer to process.

The key differences are:

- Immediate response with request ID
- Background processing of AI tasks
- Webhook notification when complete
- Client-side polling for results
- Better error handling and resilience

