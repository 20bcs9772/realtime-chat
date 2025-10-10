import { NextResponse } from "next/server";
import {
  setNextCookie,
  setStateCookie,
  absoluteUrl,
} from "@/lib/github-session";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const next = searchParams.get("next") || "/";
  await setNextCookie(next);

  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "Missing GITHUB_CLIENT_ID" },
      { status: 500 }
    );
  }

  const state = crypto.randomUUID();
  await setStateCookie(state);

  const callback = await absoluteUrl("/api/github/oauth/callback");
  const scope = encodeURIComponent("public_repo workflow read:user");
  const encodedCallback = encodeURIComponent(callback);
  const location = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodedCallback}&scope=${scope}&state=${state}`;

  return NextResponse.redirect(location);
}
