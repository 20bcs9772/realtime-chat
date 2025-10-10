import { NextResponse } from "next/server";
import { getCookieToken } from "@/lib/github-session";

export async function POST(req: Request) {
  const token = await getCookieToken();
  if (!token)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { owner, repo } = await req.json().catch(() => ({}));
  if (!owner || !repo)
    return NextResponse.json({ error: "Missing owner/repo" }, { status: 400 });

  // Get current README to obtain sha (update) or create new file
  const filePath = "README.md";
  const getRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    }
  );

  const now = new Date().toISOString();
  const content = `## Demo Pipeline

Triggered by your visit at ${now}

User: ${owner}

This commit should trigger GitHub Actions to build and deploy to GitHub Pages.
`;
  const payload: any = {
    message: `chore: demo pipeline trigger at ${now}`,
    content: Buffer.from(content, "utf-8").toString("base64"),
    branch: undefined, // default branch
  };

  if (getRes.ok) {
    const file = await getRes.json();
    if (file?.sha) payload.sha = file.sha;
  }

  const putRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
  const j = await putRes.json();
  if (!putRes.ok) {
    return NextResponse.json(
      { error: j?.message || "Commit failed" },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true, message: payload.message });
}
