import serverless from "serverless-http";
import { createApp } from "../../server/app";

let cachedHandler: ReturnType<typeof serverless> | null = null;

async function getHandler() {
  if (!cachedHandler) {
    const app = await createApp();
    cachedHandler = serverless(app);
  }
  return cachedHandler;
}

export const handler = async (event: any, context: any) => {
  try {
    // Ensure the original request path is preserved correctly
    // When Netlify rewrites /api/* -> function, rawUrl has the real path
    if (event.rawUrl && (!event.path || event.path === "/.netlify/functions/api")) {
      try {
        const url = new URL(event.rawUrl);
        event.path = url.pathname;
        if (url.search) event.rawQuery = url.search.slice(1);
      } catch {}
    }

    console.log(`[fn] ${event.httpMethod} ${event.path}`);

    const h = await getHandler();
    return await h(event, context);
  } catch (err: any) {
    console.error("[fn] Fatal error:", err?.message || err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error", detail: err?.message }),
      headers: { "Content-Type": "application/json" },
    };
  }
};
