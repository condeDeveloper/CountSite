export async function onRequestGet(context) {
  const { env } = context;
  const current = await env.COUNTER.get("visits");
  const count = current ? parseInt(current, 10) + 1 : 1;
  await env.COUNTER.put("visits", String(count));

  return new Response(JSON.stringify({ count }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}
