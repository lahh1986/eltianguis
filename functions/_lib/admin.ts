export function checkAdmin(request: Request, expected: string | undefined): Response | null {
  if (!expected) {
    return new Response(
      JSON.stringify({ ok: false, error: "admin_key_not_configured" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }
  const auth = request.headers.get("authorization") ?? "";
  const key = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (key !== expected) {
    return new Response(
      JSON.stringify({ ok: false, error: "unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  return null;
}

export const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
