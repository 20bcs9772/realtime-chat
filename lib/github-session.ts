import { cookies, headers } from "next/headers";

const TOKEN_COOKIE = "gh_oauth_token";
const STATE_COOKIE = "gh_oauth_state";
const NEXT_COOKIE = "gh_oauth_next";

export async function getCookieToken(): Promise<string | null> {
  const c = await cookies();
  const t = c.get(TOKEN_COOKIE)?.value;
  return t || null;
}

export async function setCookieToken(token: string) {
  const c = await cookies();
  c.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearCookieToken() {
  const c = await cookies();
  c.delete(TOKEN_COOKIE);
}

export async function setStateCookie(state: string) {
  const c = await cookies();
  c.set(STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 600,
  });
}

export async function readAndClearState(): Promise<string | null> {
  const c = await cookies();
  const s = c.get(STATE_COOKIE)?.value || null;
  if (s) c.delete(STATE_COOKIE);
  return s;
}

export async function setNextCookie(next: string) {
  const c = await cookies();
  c.set(NEXT_COOKIE, next, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 600,
  });
}

export async function readAndClearNext(): Promise<string | null> {
  const c = await cookies();
  const n = c.get(NEXT_COOKIE)?.value || null;
  if (n) c.delete(NEXT_COOKIE);
  return n;
}

export async function absoluteUrl(pathname: string) {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") || "https";
  const host = h.get("x-forwarded-host") || h.get("host");
  const origin = host ? `${proto}://${host}` : "";
  return `${origin}${pathname}`;
}
