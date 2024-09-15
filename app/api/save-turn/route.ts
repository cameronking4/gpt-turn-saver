import { kv } from "@vercel/kv";

export async function POST(req: Request) {
  try {
    // Extract data from the request body
    const { userMessage, aiResponse, turnSummary, taskCompleted } =
      await req.json();

    // Validate required fields
    if (
      !userMessage ||
      !aiResponse ||
      !turnSummary ||
      typeof taskCompleted !== "boolean"
    ) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing or invalid fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Generate a unique key using a precise timestamp
    const timestamp = new Date().toISOString();
    const key = `turn-${timestamp}`;

    // Save the conversation turn, including the new fields
    await kv.set(key, {
      userMessage,
      aiResponse,
      turnSummary,
      taskCompleted,
      timestamp,
    });

    // Respond with the key and success message
    return new Response(JSON.stringify({ success: true, key }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
