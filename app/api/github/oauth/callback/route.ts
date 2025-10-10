import { NextResponse } from "next/server";
import {
  readAndClearState,
  readAndClearNext,
  setCookieToken,
} from "@/lib/github-session";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return NextResponse.json({ error: "Missing code/state" }, { status: 400 });
  }
  const expected = await readAndClearState();
  if (!expected || expected !== state) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Missing GitHub OAuth env vars" },
      { status: 500 }
    );
  }

  // Exchange code for token
  const resp = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });
  const data = (await resp.json()) as { access_token?: string; error?: string };
  if (!resp.ok || !data.access_token) {
    return NextResponse.json(
      { error: data?.error || "Token exchange failed" },
      { status: 400 }
    );
  }

  await setCookieToken(data.access_token);

  const next = (await readAndClearNext()) || "/";
  return NextResponse.redirect(next);
}
