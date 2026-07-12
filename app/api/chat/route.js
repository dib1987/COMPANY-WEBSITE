import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { join } from "path";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const WIKI_FILES = [
  "chatbot-persona.md",
  "company.md",
  "services.md",
  "use-cases.md",
  "process.md",
  "faq.md",
];

function buildSystemPrompt() {
  const wikiDir = join(process.cwd(), "llm-wiki");
  return WIKI_FILES.map((f) => {
    try {
      return readFileSync(join(wikiDir, f), "utf8");
    } catch {
      return "";
    }
  })
    .filter(Boolean)
    .join("\n\n---\n\n");
}

const SUBMIT_LEAD_TOOL = {
  name: "submit_lead",
  description:
    "Submit a lead to the Bharat AI Automation Labs team. Call this ONLY when you have collected the visitor's name, email, and a brief description of their problem.",
  input_schema: {
    type: "object",
    properties: {
      name: { type: "string", description: "The visitor's full name" },
      email: { type: "string", description: "The visitor's email address" },
      problem: {
        type: "string",
        description: "Brief description of the problem they want to solve",
      },
    },
    required: ["name", "email", "problem"],
  },
};

async function submitLeadToApi(leadData, request) {
  const baseUrl = new URL(request.url).origin;
  const res = await fetch(`${baseUrl}/api/lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: leadData.name,
      company_name: "",
      email: leadData.email,
      problem: leadData.problem,
      source: "chatbot",
    }),
  });
  return res.ok;
}

export async function POST(request) {
  const { messages } = await request.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const systemPrompt = buildSystemPrompt();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        let pendingToolUse = null;
        let fullText = "";

        const anthropicStream = await client.messages.stream({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          system: systemPrompt,
          tools: [SUBMIT_LEAD_TOOL],
          messages,
        });

        for await (const event of anthropicStream) {
          if (event.type === "content_block_start") {
            if (event.content_block.type === "tool_use") {
              pendingToolUse = {
                id: event.content_block.id,
                name: event.content_block.name,
                inputJson: "",
              };
            }
          } else if (event.type === "content_block_delta") {
            if (event.delta.type === "text_delta") {
              const chunk = event.delta.text;
              fullText += chunk;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text", text: chunk })}\n\n`));
            } else if (event.delta.type === "input_json_delta" && pendingToolUse) {
              pendingToolUse.inputJson += event.delta.partial_json;
            }
          } else if (event.type === "message_stop") {
            if (pendingToolUse && pendingToolUse.name === "submit_lead") {
              let leadData;
              try {
                leadData = JSON.parse(pendingToolUse.inputJson);
              } catch {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text", text: "\n\nSorry, something went wrong collecting your details. Please try the contact form." })}\n\n`));
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                controller.close();
                return;
              }

              const ok = await submitLeadToApi(leadData, request);
              const confirmText = ok
                ? "Done. Our business team will review your workflow and get back to you within one business day. Keep an eye on your inbox — check your Promotions or Spam tab if you don't see it."
                : "I couldn't submit your details automatically — please use the contact form on this page and our team will be in touch.";

              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text", text: confirmText })}\n\n`));
            }
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          }
        }
      } catch (err) {
        console.error("Chat API error:", err);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "text", text: "Sorry, something went wrong. Please try again or use the contact form." })}\n\n`
          )
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
