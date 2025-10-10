import { NextResponse } from "next/server";
import { clearCookieToken, getCookieToken } from "@/lib/github-session";

export async function POST() {
  const token = await getCookieToken();
  await clearCookieToken();

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (token && clientId && clientSecret) {
    const res = await fetch(
      `https://api.github.com/applications/${clientId}/grant`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization:
            "Basic " +
            Buffer.from(`${clientId}:${clientSecret}`, "utf-8").toString(
              "base64"
            ),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ access_token: token }),
      }
    );
  }

  return NextResponse.json({ ok: true });
}
