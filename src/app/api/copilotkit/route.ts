import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { HttpAgent } from "@ag-ui/client";
import { NextRequest } from "next/server";
import { logger } from "@/lib/logger";
import { env } from "@/lib/env";

// 1. You can use any service adapter here for multi-agent support. We use
//    the empty adapter since we're only using one agent.
const serviceAdapter = new ExperimentalEmptyAdapter();

// Backend agent URL
const AGENT_URL = env.AGENT_URL;

// 2. Create the CopilotRuntime instance and utilize the PydanticAI AG-UI
//    integration to setup the connection.
const runtime = new CopilotRuntime({
  agents: {
    // Our FastAPI endpoint URL
    jom_kira_agent: new HttpAgent({ url: AGENT_URL }),
  },
});

/**
 * Check if any message in the body has an image attachment.
 * If so, we need to transform and proxy directly to avoid CopilotRuntime stripping images.
 */
function hasImageInMessages(body: any): boolean {
  const messages = body?.body?.messages || [];
  return messages.some((msg: any) => msg.image && msg.role === "user");
}

/**
 * Transform image messages to preserve image data while keeping content as string.
 * PydanticAI's AG-UI schema expects content to be a string, so we embed the image
 * in a custom field that the middleware can extract via ContextVar.
 * @see https://github.com/CopilotKit/CopilotKit/issues/2577
 */
function transformImageMessages(body: any): any {
  if (!body?.body?.messages) return body;

  const transformedBody = JSON.parse(JSON.stringify(body)); // Deep clone

  transformedBody.body.messages = transformedBody.body.messages.map(
    (msg: any) => {
      if (msg.image && msg.role === "user") {
        logger.info(
          { msgId: msg.id, format: msg.image.format },
          "🔄 Transforming ImageMessage for direct proxy"
        );

        // Keep content as string (PydanticAI AG-UI requires string content)
        // Move image data to a custom field that the middleware can extract
        return {
          ...msg,
          content: msg.content || "Please analyze this image.",
          // Embed image in content array format for middleware extraction
          // The middleware already extracts this via extract_last_user_image()
          _image: {
            format: msg.image.format,
            bytes: msg.image.bytes,
          },
          // Remove the original image field
          image: undefined,
        };
      }
      return msg;
    }
  );

  return transformedBody;
}

/**
 * Direct proxy to the Python agent, bypassing CopilotRuntime.
 * This is necessary because CopilotRuntime/HttpAgent strips image data.
 */
async function proxyToAgent(body: any): Promise<Response> {
  const transformedBody = transformImageMessages(body);

  // The AG-UI protocol expects the body content directly, not wrapped in {method, params, body}
  // CopilotKit sends: { method: "agent/run", params: {...}, body: { threadId, messages, ... } }
  // PydanticAI expects: { threadId, messages, ... }
  const agUiPayload = transformedBody.body || transformedBody;

  logger.info(
    {
      bodyLength: JSON.stringify(agUiPayload).length,
      messageCount: agUiPayload?.messages?.length,
      threadId: agUiPayload?.threadId,
    },
    "📤 Direct proxy to agent (bypassing CopilotRuntime)"
  );

  const response = await fetch(AGENT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify(agUiPayload),
  });

  // Stream the response back to the client
  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

// 3. Build a Next.js API route that handles the CopilotKit runtime requests.
export const POST = async (req: NextRequest) => {
  let body: any;
  try {
    body = await req.json();
  } catch (err) {
    logger.error(err, "⚠️ Failed to parse request body");
    return new Response("Invalid JSON", { status: 400 });
  }

  // If request contains image messages, bypass CopilotRuntime and proxy directly
  // This works around the CopilotKit bug #2577 where images aren't forwarded to AG-UI agents
  if (hasImageInMessages(body)) {
    logger.info("hasImageInMessages");
    return proxyToAgent(body);
  }

  // For non-image requests, use standard CopilotRuntime flow
  // Reconstruct the request with the body we already parsed
  const newRequest = new NextRequest(req.url, {
    method: req.method,
    headers: req.headers,
    body: JSON.stringify(body),
  });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(newRequest);
};
