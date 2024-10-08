import { kv } from "@vercel/kv";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) {
      return new Response(
        JSON.stringify({ success: false, error: "Key is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Retrieve the specific turn by key
    const turn = await kv.get(key);

    if (!turn) {
      return new Response(
        JSON.stringify({ success: false, error: "Turn not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Return all fields, including the new ones
    return new Response(JSON.stringify({ success: true, turn }), {
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
