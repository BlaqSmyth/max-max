import serverless from "serverless-http";
import { createApp } from "../../server/app";

let handler: ReturnType<typeof serverless> | null = null;

async function getHandler() {
  if (!handler) {
    const app = await createApp();
    handler = serverless(app);
  }
  return handler;
}

export const main = async (event: any, context: any) => {
  const h = await getHandler();
  return h(event, context);
};
