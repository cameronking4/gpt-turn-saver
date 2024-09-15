import { kv } from "@vercel/kv";

export async function POST(req) {
  try {
    const { userMessage, aiResponse } = await req.json();

    // Generate a unique key using a precise timestamp
    const timestamp = new Date().toISOString();
    const key = `turn-${timestamp}`;

    // Save the conversation turn
    await kv.set(key, { userMessage, aiResponse, timestamp });

    return new Response(JSON.stringify({ success: true, key }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
