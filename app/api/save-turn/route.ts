import { kv } from "@vercel/kv";

export async function GET(req: Request) {
  try {
    // Extract query parameters from the URL
    const url = new URL(req.url);
    const userMessage = url.searchParams.get("userMessage");
    const aiResponse = url.searchParams.get("aiResponse");
    const turnSummary = url.searchParams.get("turnSummary");
    const taskCompletedParam = url.searchParams.get("taskCompleted");

    // Validate required fields and taskCompleted should be a boolean
    const taskCompleted = taskCompletedParam === "true" ? true : false;

    if (
      !userMessage ||
      !aiResponse ||
      !turnSummary ||
      taskCompletedParam === null
    ) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing or invalid fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
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
