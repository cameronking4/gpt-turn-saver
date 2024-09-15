import { kv } from "@vercel/kv";

export async function GET() {
  try {
    // Get all keys starting with 'turn-'
    const keys = await kv.keys("turn-*"); // Wildcard to match all keys starting with 'turn-'

    // If no keys are found, return an empty array
    if (keys.length === 0) {
      return new Response(JSON.stringify({ success: true, turns: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Retrieve all conversation turns based on the keys
    const turns = await Promise.all(
      keys.map(async (key) => {
        const turn = await kv.get(key);

        // Ensure turn is valid and include key in the response
        if (turn && typeof turn === "object") {
          return { key, ...turn };
        } else {
          return { key, error: "Invalid turn data" };
        }
      }),
    );

    return new Response(JSON.stringify({ success: true, turns }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error retrieving conversation turns:", error);

    return new Response(JSON.stringify({ success: false, error: error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
