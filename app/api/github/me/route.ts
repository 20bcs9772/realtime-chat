import { NextResponse } from "next/server";
import { getCookieToken } from "@/lib/github-session";

export async function GET() {
  const token = await getCookieToken();
  if (!token) return NextResponse.json({ connected: false });

  const me = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
    cache: "no-store",
  });
  if (!me.ok) return NextResponse.json({ connected: false });

  const data = await me.json();
  return NextResponse.json({ connected: true, login: data?.login });
}
