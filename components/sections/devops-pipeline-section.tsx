"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import FullViewportSection from "@/components/sections/full-viewport-section";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Github,
  Rocket,
  GitFork,
  Settings,
  FileCode,
  Globe,
} from "lucide-react";

type Status =
  | "idle"
  | "auth"
  | "forking"
  | "enable"
  | "committing"
  | "pages"
  | "building"
  | "completed"
  | "failed";

type ActionsStatus = {
  status: "queued" | "in_progress" | "completed" | "idle";
  conclusion: "success" | "failure" | "cancelled" | "skipped" | null;
  html_url?: string;
  repo_full_name?: string;
  owner?: string;
  repo?: string;
};

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
    return r.json();
  });

function StepIcon({
  done,
  error,
  active,
}: {
  done?: boolean;
  error?: boolean;
  active?: boolean;
}) {
  if (error) return <AlertCircle className="size-4" />;
  if (done) return <CheckCircle2 className="size-4" />;
  if (active) return <Loader2 className="size-4 animate-spin" />;
  return <Circle className="size-4" />;
}

function Step({
  label,
  active,
  done,
  error,
  icon,
  substatus,
}: {
  label: string;
  active?: boolean;
  done?: boolean;
  error?: boolean;
  icon?: React.ReactNode;
  substatus?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
      <div
        className={cn(
          "grid place-items-center size-14 rounded-full border-2 transition-all duration-300",
          "shadow-sm flex-shrink-0",
          active &&
            "ring-2 ring-primary ring-offset-2 bg-primary/10 border-primary scale-110",
          done && "bg-primary text-primary-foreground border-primary",
          error &&
            "bg-destructive text-destructive-foreground border-destructive ring-2 ring-destructive ring-offset-2",
          !active &&
            !done &&
            !error &&
            "bg-background border-muted-foreground/30"
        )}
        aria-label={label}
      >
        {icon || <StepIcon done={done} error={error} active={active} />}
      </div>
      <div className="text-center space-y-1">
        <div
          className={cn(
            "text-sm font-semibold transition-colors",
            active && "text-primary",
            done && "text-muted-foreground",
            error && "text-destructive"
          )}
        >
          {label}
        </div>
        {substatus && (
          <div
            className={cn(
              "text-xs transition-colors",
              active && "text-primary/80",
              done && "text-muted-foreground/60",
              error && "text-destructive/80",
              !active && !done && !error && "text-muted-foreground/60"
            )}
          >
            {substatus}
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
      <div
        className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default function DevOpsPipelineSection() {
  const { toast } = useToast();
  const [status, setStatus] = useState<Status>("idle");
  const [connected, setConnected] = useState<boolean>(false);
  const [repoInfo, setRepoInfo] = useState<{
    owner?: string;
    repo?: string;
    fullName?: string;
  }>({});
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [error, setError] = useState<{
    title: string;
    message?: string;
  } | null>(null);

  const {
    data: me,
    mutate: mutateMe,
    error: meError,
  } = useSWR<{
    login?: string;
    connected: boolean;
  }>("/api/github/me", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    onError: (err) => {
      console.error("Failed to fetch GitHub connection status:", err);
    },
  });

  const { data: action, error: actionError } = useSWR<ActionsStatus>(
    repoInfo.owner && repoInfo.repo && status === "building"
      ? `/api/github/actions-status?owner=${repoInfo.owner}&repo=${repoInfo.repo}`
      : null,
    fetcher,
    {
      refreshInterval: 3000,
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      onError: (err) => {
        console.error("Failed to fetch Actions status:", err);
      },
    }
  );

  useEffect(() => {
    setConnected(Boolean(me?.connected));
  }, [me]);

  const stepOrder: Status[] = useMemo(
    () => [
      "auth",
      "forking",
      "enable",
      "committing",
      "pages",
      "building",
      "completed",
    ],
    []
  );

  const currentStepIndex = useMemo(() => {
    const idx = stepOrder.indexOf(status);
    return idx === -1 ? 0 : idx;
  }, [status, stepOrder]);

  const progress = useMemo(() => {
    if (status === "idle") return 0;
    if (status === "completed") return 100;
    return ((currentStepIndex + 1) / stepOrder.length) * 100;
  }, [currentStepIndex, stepOrder.length, status]);

  useEffect(() => {
    if (status !== "building" || !action) return;
    if (action.status === "completed") {
      if (action.conclusion === "success") {
        const urlGuess =
          repoInfo.owner && repoInfo.repo
            ? `https://${repoInfo.owner}.github.io/${repoInfo.repo}/`
            : null;
        setDeployUrl(urlGuess);
        setStatus("completed");
        toast({
          title: "Deployment Successful!",
          description: "Your site is now live on GitHub Pages.",
        });
      } else {
        setStatus("failed");
        setError({
          title: "Build Failed",
          message: `GitHub Actions concluded with: ${
            action.conclusion ?? "unknown"
          }. Check the Actions tab for details.`,
        });
        toast({
          title: "Build Failed",
          description: "Check the Actions run for error details.",
          variant: "destructive",
        });
      }
    }
  }, [action, status, repoInfo.owner, repoInfo.repo, toast]);

  const startOAuth = useCallback(async () => {
    try {
      setError(null);
      setStatus("auth");
      const next = `${window.location.origin}/#skills-devops`;
      window.location.href = `/api/github/oauth/start?next=${encodeURIComponent(
        next
      )}`;
    } catch (e: any) {
      setStatus("idle");
      setError({ title: "OAuth Failed", message: e.message });
      toast({
        title: "Connection Failed",
        description: e.message || "Could not start GitHub OAuth flow.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const beginPipeline = useCallback(async () => {
    if (!connected) {
      toast({
        title: "Not Connected",
        description: "Please connect with GitHub first.",
        variant: "destructive",
      });
      return;
    }
    try {
      setError(null);
      setDeployUrl(null);
      setStatus("forking");

      const forkRes = await fetch("/api/github/fork", {
        method: "POST",
        credentials: "include",
      });

      const fork = await forkRes.json();

      if (!forkRes.ok) {
        throw new Error(
          fork?.error || `Fork failed with status ${forkRes.status}`
        );
      }

      if (!fork.owner || !fork.repo) {
        throw new Error("Invalid fork response: missing owner or repo");
      }

      setRepoInfo({
        owner: fork.owner,
        repo: fork.repo,
        fullName: fork.full_name,
      });

      toast({
        title: "Repository Forked!",
        description: `Successfully forked to ${fork.full_name}. Now enable workflows.`,
      });

      // Move to enable workflows step after forking
      setStatus("enable");
    } catch (e: any) {
      setStatus("failed");
      setError({
        title: "Fork Failed",
        message:
          e.message || "Could not fork the repository. Please try again.",
      });
      toast({
        title: "Fork Failed",
        description: e.message,
        variant: "destructive",
      });
    }
  }, [connected, toast]);

  const continueAfterEnable = useCallback(async () => {
    if (!repoInfo.owner || !repoInfo.repo) {
      toast({
        title: "Missing Repository Info",
        description: "Please restart the pipeline.",
        variant: "destructive",
      });
      return;
    }

    setStatus("committing");
    setError(null);

    try {
      const commitRes = await fetch("/api/github/commit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner: repoInfo.owner,
          repo: repoInfo.repo,
          message: "chore: initial commit to trigger workflow",
        }),
      });

      const commit = await commitRes.json();

      if (!commitRes.ok) {
        throw new Error(
          commit?.error || `Commit failed with status ${commitRes.status}`
        );
      }

      toast({
        title: "Change Committed!",
        description: "Now enable GitHub Pages to deploy.",
      });
      setStatus("pages");
    } catch (e: any) {
      setStatus("failed");
      setError({
        title: "Commit Failed",
        message: e.message || "Could not commit changes. Please try again.",
      });
      toast({
        title: "Commit Failed",
        description: e.message,
        variant: "destructive",
      });
    }
  }, [repoInfo.owner, repoInfo.repo, toast]);

  const deployToPages = useCallback(async () => {
    if (!repoInfo.owner || !repoInfo.repo) {
      toast({
        title: "Missing Repository Info",
        description: "Please restart the pipeline.",
        variant: "destructive",
      });
      return;
    }

    setStatus("committing");
    setError(null);

    try {
      // First commit to trigger the workflow after Pages is enabled
      const res = await fetch("/api/github/commit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner: repoInfo.owner,
          repo: repoInfo.repo,
          message: "chore: trigger deployment to GitHub Pages",
        }),
      });

      const j = await res.json();

      if (!res.ok) {
        throw new Error(
          j?.error || `Deploy commit failed with status ${res.status}`
        );
      }

      toast({
        title: "Deploying...",
        description:
          "Building and deploying your site. This may take 1-2 minutes.",
      });

      // Move to building state after successful commit
      setStatus("building");
    } catch (e: any) {
      setStatus("failed");
      setError({
        title: "Deploy Failed",
        message: e.message || "Could not start deployment. Please try again.",
      });
      toast({
        title: "Deploy Failed",
        description: e.message,
        variant: "destructive",
      });
    }
  }, [repoInfo.owner, repoInfo.repo, toast]);

  const retry = useCallback(async () => {
    if (!repoInfo.owner || !repoInfo.repo) {
      toast({
        title: "Missing Repository Info",
        description: "Please start a new pipeline.",
        variant: "destructive",
      });
      return;
    }

    setDeployUrl(null);
    setError(null);
    setStatus("committing");

    try {
      const res = await fetch("/api/github/commit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner: repoInfo.owner,
          repo: repoInfo.repo,
          message: `chore: retry deployment - ${new Date().toISOString()}`,
        }),
      });

      const j = await res.json();

      if (!res.ok) {
        throw new Error(
          j?.error || `Retry commit failed with status ${res.status}`
        );
      }

      toast({
        title: "Retrying Pipeline",
        description: "Re-triggering the workflow...",
      });
      setStatus("building");
    } catch (e: any) {
      setStatus("failed");
      setError({
        title: "Retry Failed",
        message:
          e.message ||
          "Could not retry. Please check your repository settings.",
      });
      toast({
        title: "Retry Failed",
        description: e.message,
        variant: "destructive",
      });
    }
  }, [repoInfo.owner, repoInfo.repo, toast]);

  const disconnect = useCallback(async () => {
    try {
      const res = await fetch("/api/github/revoke", {
        method: "POST",
        credentials: "include",
      });

      const j = await res.json();

      if (!res.ok) {
        throw new Error(j?.error || `Revoke failed with status ${res.status}`);
      }

      setConnected(false);
      setStatus("idle");
      setRepoInfo({});
      setDeployUrl(null);
      setError(null);
      await mutateMe();

      toast({
        title: "Disconnected",
        description: "Successfully disconnected from GitHub.",
      });
    } catch (e: any) {
      toast({
        title: "Disconnect Failed",
        description: e.message || "Could not disconnect. Please try again.",
        variant: "destructive",
      });
    }
  }, [mutateMe, toast]);

  const steps = useMemo(
    () => [
      {
        label: "Setup",
        key: "setup",
        icon: <Github className="size-5" />,
        description: "Connect & Fork Repository",
      },
      {
        label: "Configure",
        key: "configure",
        icon: <Settings className="size-5" />,
        description: "Enable Actions & Pages",
      },
      {
        label: "Deploy",
        key: "deploy",
        icon: <Rocket className="size-5" />,
        description: "Build & Publish",
      },
      {
        label: "Live",
        key: "completed",
        icon: <CheckCircle2 className="size-5" />,
        description: "Site is Live",
      },
    ],
    []
  );

  const getStepStatus = useCallback(
    (stepKey: string) => {
      switch (stepKey) {
        case "setup":
          if (status === "idle" || status === "auth")
            return {
              active: true,
              done: false,
              substatus: "Waiting to connect...",
            };
          if (status === "forking")
            return {
              active: true,
              done: false,
              substatus: "Forking repository...",
            };
          if (
            ["enable", "committing", "pages", "building", "completed"].includes(
              status
            )
          )
            return {
              active: false,
              done: true,
              substatus: "Repository forked",
            };
          return { active: false, done: false, substatus: "Ready to start" };

        case "configure":
          if (["idle", "auth", "forking"].includes(status))
            return { active: false, done: false, substatus: "Pending setup" };
          if (status === "enable")
            return {
              active: true,
              done: false,
              substatus: "Enable GitHub Actions",
            };
          if (status === "committing")
            return {
              active: true,
              done: false,
              substatus: "Committing changes...",
            };
          if (status === "pages")
            return {
              active: true,
              done: false,
              substatus: "Enable GitHub Pages",
            };
          if (["building", "completed"].includes(status))
            return {
              active: false,
              done: true,
              substatus: "Configuration complete",
            };
          return {
            active: false,
            done: false,
            substatus: "Awaiting configuration",
          };

        case "deploy":
          if (
            [
              "idle",
              "auth",
              "forking",
              "enable",
              "committing",
              "pages",
            ].includes(status)
          )
            return {
              active: false,
              done: false,
              substatus: "Waiting for config",
            };
          if (status === "building")
            return {
              active: true,
              done: false,
              substatus: "Building & deploying...",
            };
          if (status === "completed")
            return {
              active: false,
              done: true,
              substatus: "Deployment successful",
            };
          return { active: false, done: false, substatus: "Ready to deploy" };

        case "completed":
          if (status === "completed")
            return { active: false, done: true, substatus: "Site is live!" };
          return {
            active: false,
            done: false,
            substatus: "Awaiting deployment",
          };

        default:
          return { active: false, done: false, substatus: "" };
      }
    },
    [status]
  );

  return (
    <FullViewportSection id="devops-github" ariaLabel="DevOps: GitHub CI/CD">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Live DevOps Pipeline
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
              Experience a full CI/CD workflow: GitHub OAuth → Fork Repository →
              Enable Workflows → Commit Changes → Deploy to Pages
            </p>
          </div>
          <Badge
            variant={connected ? "default" : "secondary"}
            className="text-sm px-4 py-1.5 flex items-center gap-2"
          >
            <div
              className={cn(
                "size-2 rounded-full",
                connected ? "bg-green-500 animate-pulse" : "bg-muted-foreground"
              )}
            />
            {connected
              ? `Connected${me?.login ? ` as ${me.login}` : ""}`
              : "Not Connected"}
          </Badge>
        </div>

        {/* Main Pipeline Card */}
        <Card className="p-6 md:p-8 space-y-6 shadow-lg">
          {/* Progress Bar */}
          {status !== "idle" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">
                  Pipeline Progress
                </span>
                <span className="font-semibold">{Math.round(progress)}%</span>
              </div>
              <ProgressBar progress={progress} />
            </div>
          )}

          {/* Steps Visualization */}
          <div className="w-full">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 md:gap-4">
              {steps.map((s, i) => {
                const stepStatus = getStepStatus(s.key);
                const isError = status === "failed" && stepStatus.active;

                return (
                  <div key={s.key} className="flex items-center flex-1">
                    <Step
                      label={s.label}
                      active={stepStatus.active}
                      done={stepStatus.done}
                      error={isError}
                      icon={s.icon}
                      substatus={stepStatus.substatus}
                    />
                    {i < steps.length - 1 && (
                      <div
                        className={cn(
                          "hidden md:block w-full max-w-[60px] h-1 mx-4 rounded-full transition-all duration-500",
                          stepStatus.done ? "bg-primary" : "bg-muted"
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t">
            {!connected && (
              <Button
                onClick={startOAuth}
                size="lg"
                className="gap-2"
                aria-label="Connect with GitHub"
              >
                <Github className="size-5" />
                Connect with GitHub
              </Button>
            )}

            {connected &&
              (status === "idle" ||
                status === "auth" ||
                status === "failed") && (
                <Button
                  onClick={beginPipeline}
                  size="lg"
                  className="gap-2"
                  aria-label="Start pipeline"
                >
                  <Rocket className="size-5" />
                  Start Pipeline
                </Button>
              )}

            {connected && status === "enable" && (
              <Button
                onClick={continueAfterEnable}
                size="lg"
                className="gap-2"
                aria-label="Continue after enabling workflows"
              >
                <FileCode className="size-5" />
                Continue Pipeline
              </Button>
            )}

            {connected && status === "pages" && (
              <Button
                onClick={deployToPages}
                size="lg"
                className="gap-2"
                aria-label="Deploy to GitHub Pages"
              >
                <Rocket className="size-5" />
                Deploy to Pages
              </Button>
            )}

            {connected &&
              (status === "forking" ||
                status === "committing" ||
                status === "building") && (
                <Button
                  variant="secondary"
                  size="lg"
                  disabled
                  className="gap-2"
                  aria-label="Pipeline in progress"
                >
                  <Loader2 className="size-5 animate-spin" />
                  {status === "forking" && "Forking Repository..."}
                  {status === "committing" && "Committing Changes..."}
                  {status === "building" && "Building & Deploying..."}
                </Button>
              )}

            {connected && status === "completed" && deployUrl && (
              <Button
                asChild
                size="lg"
                className="gap-2"
                aria-label="View deployed site"
              >
                <a href={deployUrl} target="_blank" rel="noreferrer">
                  <Globe className="size-5" />
                  View Live Site
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            )}

            {connected && status !== "idle" && (
              <Button
                variant="outline"
                size="lg"
                onClick={disconnect}
                className="gap-2"
                aria-label="Disconnect from GitHub"
              >
                Disconnect
              </Button>
            )}
          </div>

          {/* Repository Info */}
          {repoInfo.fullName && (
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground pt-4 border-t">
              <a
                className="flex items-center gap-2 hover:text-primary transition-colors underline underline-offset-4"
                href={`https://github.com/${repoInfo.fullName}`}
                target="_blank"
                rel="noreferrer"
              >
                <GitFork className="size-4" />
                {repoInfo.fullName}
              </a>
              {action?.html_url && (
                <a
                  className="flex items-center gap-2 hover:text-primary transition-colors underline underline-offset-4"
                  href={action.html_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Rocket className="size-4" />
                  View Actions Run
                  <ExternalLink className="size-3" />
                </a>
              )}
            </div>
          )}
        </Card>

        {/* Enable Workflows Instructions */}
        {connected && status === "enable" && repoInfo.fullName && (
          <Alert className="border-primary/50 bg-primary/5">
            <Settings className="size-5" />
            <AlertTitle className="text-lg font-semibold">
              Action Required: Enable GitHub Actions
            </AlertTitle>
            <AlertDescription className="space-y-4 mt-3">
              <p className="text-sm">
                GitHub requires manual approval for workflows on forked
                repositories. Follow these steps:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm ml-2">
                <li>Click the button below to open your fork's Actions tab</li>
                <li>
                  Click the green button that says "I understand my workflows,
                  go ahead and enable them"
                </li>
                <li>Return here and click "Continue Pipeline" to proceed</li>
              </ol>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild variant="default" className="gap-2">
                  <a
                    href={`https://github.com/${repoInfo.fullName}/actions`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Settings className="size-4" />
                    Open Actions Tab
                    <ExternalLink className="size-3" />
                  </a>
                </Button>
                <Button
                  onClick={continueAfterEnable}
                  variant="outline"
                  className="gap-2"
                >
                  <CheckCircle2 className="size-4" />
                  I've Enabled Workflows
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Enable Pages Instructions */}
        {connected && status === "pages" && repoInfo.fullName && (
          <Alert className="border-primary/50 bg-primary/5">
            <Globe className="size-5" />
            <AlertTitle className="text-lg font-semibold">
              Action Required: Enable GitHub Pages
            </AlertTitle>
            <AlertDescription className="space-y-4 mt-3">
              <p className="text-sm">
                Configure GitHub Pages to deploy your site:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm ml-2">
                <li>Click below to open your repository's Settings → Pages</li>
                <li>
                  Under "Build and deployment", set <strong>Source</strong> to{" "}
                  <strong>GitHub Actions</strong>
                </li>
                <li>
                  Click Save, then return here and click "Deploy to Pages"
                </li>
              </ol>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild variant="default" className="gap-2">
                  <a
                    href={`https://github.com/${repoInfo.fullName}/settings/pages`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Settings className="size-4" />
                    Open Pages Settings
                    <ExternalLink className="size-3" />
                  </a>
                </Button>
                <Button
                  onClick={deployToPages}
                  variant="outline"
                  className="gap-2"
                >
                  <Rocket className="size-4" />
                  I've Enabled Pages
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {status === "completed" && deployUrl && (
          <Alert className="border-green-500/50 bg-green-500/5">
            <CheckCircle2 className="size-5 text-green-500" />
            <AlertTitle className="text-lg font-semibold text-green-700 dark:text-green-400">
              Deployment Successful!
            </AlertTitle>
            <AlertDescription className="space-y-3 mt-3">
              <p className="text-sm">
                Your site has been successfully deployed to GitHub Pages. It may
                take a minute for DNS to propagate.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="gap-2">
                  <a href={deployUrl} target="_blank" rel="noreferrer">
                    <Globe className="size-4" />
                    View Live Site
                    <ExternalLink className="size-3" />
                  </a>
                </Button>
                <Button variant="outline" onClick={retry} className="gap-2">
                  <Rocket className="size-4" />
                  Run Again
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-5" />
            <AlertTitle className="text-lg font-semibold">
              {error.title}
            </AlertTitle>
            <AlertDescription className="space-y-3 mt-3">
              <p className="text-sm">
                {error.message ||
                  "Something went wrong with the pipeline. Please check the details and try again."}
              </p>
              <div className="flex flex-wrap gap-3">
                {action?.html_url && (
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <a href={action.html_url} target="_blank" rel="noreferrer">
                      View Error Details
                      <ExternalLink className="size-3" />
                    </a>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={retry}
                  className="gap-2"
                >
                  <Rocket className="size-4" />
                  Retry Pipeline
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Info Card for Recruiters */}
        <Card className="p-6 bg-muted/30 border-dashed">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Settings className="size-5" />
            What This Demonstrates
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-4 mt-0.5 text-primary flex-shrink-0" />
              <span>
                <strong>OAuth Integration:</strong> Secure GitHub authentication
                flow
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-4 mt-0.5 text-primary flex-shrink-0" />
              <span>
                <strong>CI/CD Pipeline:</strong> Automated fork, commit, build,
                and deploy process
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-4 mt-0.5 text-primary flex-shrink-0" />
              <span>
                <strong>GitHub Actions:</strong> Workflow automation and status
                monitoring
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-4 mt-0.5 text-primary flex-shrink-0" />
              <span>
                <strong>GitHub Pages:</strong> Static site deployment and
                hosting
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-4 mt-0.5 text-primary flex-shrink-0" />
              <span>
                <strong>Error Handling:</strong> Comprehensive error states and
                retry logic
              </span>
            </li>
          </ul>
        </Card>
      </div>
    </FullViewportSection>
  );
}
