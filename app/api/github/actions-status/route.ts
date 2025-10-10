import { NextResponse } from "next/server";
import { getCookieToken } from "@/lib/github-session";

export async function GET(req: Request) {
  const token = await getCookieToken();
  if (!token) return NextResponse.json({ status: "idle", conclusion: null });

  const url = new URL(req.url);
  const owner = url.searchParams.get("owner");
  const repo = url.searchParams.get("repo");
  if (!owner || !repo)
    return NextResponse.json({ status: "idle", conclusion: null });

  const runs = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=5`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    }
  );

  if (!runs.ok) {
    return NextResponse.json({ status: "idle", conclusion: null, owner, repo });
  }

  const data = await runs.json();
  const runsArr = Array.isArray(data?.workflow_runs) ? data.workflow_runs : [];

  const pagesRun = runsArr.find(
    (r: any) => r?.name === "pages-build-deployment"
  );
  const latestRun = runsArr[0];
  const run = pagesRun || latestRun;

  if (!run) {
    return NextResponse.json({ status: "idle", conclusion: null, owner, repo });
  }

  return NextResponse.json({
    status: (run.status || "idle") as
      | "queued"
      | "in_progress"
      | "completed"
      | "idle",
    conclusion: (run.conclusion || null) as
      | "success"
      | "failure"
      | "cancelled"
      | "skipped"
      | null,
    html_url: run.html_url as string,
    owner,
    repo,
  });
}
