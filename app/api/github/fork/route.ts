import { NextResponse } from "next/server";
import { getCookieToken } from "@/lib/github-session";

const DEMO_OWNER = process.env.DEMO_OWNER;
const DEMO_REPO = process.env.DEMO_REPO;

export async function POST() {
  const token = await getCookieToken();
  if (!token)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const forkRes = await fetch(
    `https://api.github.com/repos/${DEMO_OWNER}/${DEMO_REPO}/forks`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    }
  );
  const forkData = await forkRes.json();
  if (!forkRes.ok) {
    return NextResponse.json(
      { error: forkData?.message || "Fork failed" },
      { status: 400 }
    );
  }

  const [owner, repo] = [forkData.owner?.login, forkData.name];
  if (!owner || !repo) {
    return NextResponse.json(
      { error: "Unexpected fork response" },
      { status: 400 }
    );
  }

  let attempts = 0;
  while (attempts < 12) {
    attempts++;
    const check = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    });
    if (check.ok) break;
    await new Promise((r) => setTimeout(r, 1500));
  }

  return NextResponse.json({
    owner,
    repo,
    full_name: `${owner}/${repo}`,
    html_url: `https://github.com/${owner}/${repo}`,
  });
}
