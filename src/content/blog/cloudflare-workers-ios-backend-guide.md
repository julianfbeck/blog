---
author: Julian Beck
pubDatetime: 2025-01-03T20:00:00Z
title: "Building AI-Powered iOS Apps with Cloudflare Workers and OpenAI"
postSlug: cloudflare-workers-ios-backend-guide
featured: true
draft: true
tags:
  - cloudflare
  - ios
ogImage: "/media/AppMoneyApp.png"
description: ""
---

# Building AI-Powered iOS Apps with Cloudflare Workers

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
