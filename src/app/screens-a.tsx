import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Activity, AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Clock3, Eye, Gamepad2, Heart, Lock, MessageSquare, Plus, Search, ShieldCheck, Sparkles, Stethoscope, TrendingUp, Trophy, Users, Play, Star, CircleHelp } from "lucide-react";
import { Avatar, Badge, Button, Card, DataTable, Mascot, ProgressBar, SectionTitle, Stat, cn, initials } from "./kit";
import { api, qs } from "./api";
import { Async, ChildPicker, Field, Tabs, errMsg, fmtDate, fmtDur, inputCls, run, statusLabel, toneFor, useLoad, useNav } from "./core";

/* ───────────────────────── Auth ───────────────────────── */
export function AuthScreen({ onAuth }: { onAuth: (token: string, user: any) => void }) {
  const [mode, setMode] = useState<"login" | "create" | "reset">("login");
  const [busy, setBusy] = useState(false);
  const [showDemoChoices, setShowDemoChoices] = useState(false);

  const [f, setF] = useState({
    email: "",
    password: "",
    confirm: "",
    fullName: "",
    code: "",
    role: "Parent",
    newPassword: "",
  });

  const [codeSent, setCodeSent] = useState(false);
  const [consent, setConsent] = useState(true);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF({ ...f, [k]: e.target.value });

  const wrap = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      toast.error(errMsg(e));
    } finally {
      setBusy(false);
    }
  };

  const sendCode = (purpose: "register" | "reset") =>
    wrap(async () => {
      const r = await api.post("/auth/send-code", {
        email: f.email,
        purpose,
      });

      setCodeSent(true);

      toast.success(
        r.devCode
          ? `Verification code sent (development code: ${r.devCode})`
          : "Verification code sent to your email"
      );
    });

  const back = () => {
    setMode("login");
    setCodeSent(false);
    setShowDemoChoices(false);
  };

  const loginDemo = (role: "Doctor" | "Parent" | "Admin") =>
    wrap(async () => {
      const accounts = {
        Doctor: "doctor@patchy.health",
        Parent: "parent@patchy.health",
        Admin: "admin@patchy.health",
      };

      const r = await api.post("/auth/login", {
        email: accounts[role],
        password: "Patchy@123",
      });

      onAuth(r.token, r.user);
    });

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#061220] p-4 text-white md:p-7">
      <div className="absolute left-[8%] top-[8%] size-[480px] rounded-full bg-blue-500/20 blur-[130px]" />
      <div className="absolute bottom-[-20%] right-[-8%] size-[620px] rounded-full bg-amber-400/10 blur-[150px]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-56px)] max-w-[1400px] overflow-hidden rounded-[32px] border border-white/10 bg-white/[.04] shadow-2xl lg:grid-cols-[1.15fr_.85fr]">
        <section className="relative hidden overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(55,139,255,.24),transparent_32%),linear-gradient(135deg,rgba(18,42,91,.7),rgba(5,16,38,.4))]" />

          <div className="relative flex items-center gap-3">
            <img src="logo.png" alt="PATCHY logo" className="h-13 w-13 object-contain" />
            <div>
              <p className="font-display text-2xl font-semibold">PATCHY</p>
              <p className="font-mono text-[9px] uppercase tracking-[.25em] text-blue-200">
                Intelligent vision care
              </p>
            </div>
          </div>

          <div className="relative max-w-xl">
            <Badge tone="blue">
              <Sparkles className="size-3" /> One connected care journey
            </Badge>

            <h1 className="mt-7 font-display text-6xl font-medium leading-[1.02] tracking-[-.045em]">
              Better routines.
              <br />
              <span className="text-blue-200">Brighter futures.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-blue-100/70">
              A precision platform for amblyopia care—connecting clinicians,
              families, play, and responsible intelligence.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-3">
              {[["91%", "adherence"], ["6 weeks", "clear trends"], ["24/7", "guided care"]].map(([a, b]) => (
                <div
                  key={b}
                  className="rounded-2xl border border-white/10 bg-white/[.055] p-4 backdrop-blur"
                >
                  <p className="font-display text-2xl font-semibold">{a}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-blue-200/60">
                    {b}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center gap-2 text-[10px] text-blue-200/50">
            <ShieldCheck className="size-4" />
            Human-reviewed clinical intelligence · Privacy-first child experiences
          </div>
        </section>

        <section className="flex items-center bg-[#F4F8FA] p-6 text-foreground sm:p-10 lg:p-14">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-9 flex items-center gap-3 lg:hidden">
              <span className="grid size-11 place-items-center rounded-2xl bg-blue-600 text-white">
                <Eye className="size-5" />
              </span>
              <span className="font-display text-2xl font-semibold text-[#0D1625]">
                PATCHY
              </span>
            </div>

            {mode === "login" && (
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[.2em] text-blue-600">
                  Welcome back
                </p>

                <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-[#0D1625]">
                  Continue your care journey
                </h2>

                <div className="mt-8 space-y-4">
                  <Field label="Email address">
                    <input
                      type="email"
                      value={f.email}
                      onChange={set("email")}
                      className={inputCls}
                      autoComplete="email"
                    />
                  </Field>

                  <Field label="Password">
                    <input
                      type="password"
                      value={f.password}
                      onChange={set("password")}
                      className={inputCls}
                      autoComplete="current-password"
                    />
                  </Field>

                  <div className="text-right text-xs">
                    <button
                      type="button"
                      onClick={() => setMode("reset")}
                      className="font-semibold text-blue-600"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setShowDemoChoices(!showDemoChoices)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm text-primary-foreground transition hover:bg-blue-700 disabled:opacity-50"
                  >
                    Sign in securely
                    <ArrowRight className="size-4" />
                  </button>

 
{showDemoChoices && (
  <div className="mt-5 grid grid-cols-3 gap-3">
    {(
      [
        ["Parent", Heart],
        ["Doctor", Stethoscope],
        ["Admin", ShieldCheck],
      ] as const
    ).map(([role, Icon]) => (
      <button
        type="button"
        key={role}
        disabled={busy}
        onClick={() => loginDemo(role)}
        className={cn(
          "rounded-xl border p-4 text-left",
          "border-slate-200 bg-white",
          "transition hover:border-blue-400 hover:bg-blue-50",
          "disabled:opacity-50"
        )}
      >
        <Icon className="mb-3 size-5 text-blue-600" />
        <span className="text-sm font-bold">{role}</span>
      </button>
    ))}
  </div>
)}


                  <p className="text-center text-xs text-muted-foreground">
                    New to PATCHY?{" "}
                    <button
                      type="button"
                      className="font-semibold text-blue-600"
                      onClick={() => setMode("create")}
                    >
                      Create an account
                    </button>
                  </p>

                  <p className="rounded-xl bg-white p-3 text-[10px] leading-5 text-slate-500 ring-1 ring-slate-200">
                    Demo password: <b>Patchy@123</b>
                  </p>
                </div>
              </div>
            )}

            {mode === "create" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  if (f.password !== f.confirm) {
                    return toast.error("Passwords do not match");
                  }

                  wrap(async () => {
                    const r = await api.post("/auth/register", {
                      fullName: f.fullName,
                      email: f.email,
                      password: f.password,
                      role: f.role,
                      code: f.code,
                    });

                    onAuth(r.token, r.user);
                  });
                }}
              >
                <button
                  type="button"
                  onClick={back}
                  className="mb-6 flex items-center gap-2 text-xs font-semibold text-blue-600"
                >
                  <ArrowLeft className="size-4" /> Back to sign in
                </button>

                <h2 className="font-display text-4xl font-semibold tracking-tight text-[#0D1625]">
                  Create your account
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  Create an account as a doctor or parent.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {([["Doctor", Stethoscope], ["Parent", Heart]] as const).map(([r, Icon]) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setF({ ...f, role: r })}
                      className={cn(
                        "rounded-xl border p-4 text-left",
                        f.role === r
                          ? "border-2 border-blue-500 bg-blue-50"
                          : "border-slate-200 bg-white"
                      )}
                    >
                      <Icon className="mb-3 size-5 text-blue-600" />
                      <span className="text-sm font-bold">{r}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-5 space-y-3">
                  <input
                    required
                    placeholder="Full name"
                    value={f.fullName}
                    onChange={set("fullName")}
                    className={inputCls}
                  />

                  <input
                    required
                    type="email"
                    placeholder="Email address"
                    value={f.email}
                    onChange={set("email")}
                    className={inputCls}
                  />

                  <input
                    required
                    type="password"
                    placeholder="Password (8+ characters)"
                    value={f.password}
                    onChange={set("password")}
                    className={inputCls}
                  />

                  <input
                    required
                    type="password"
                    placeholder="Confirm password"
                    value={f.confirm}
                    onChange={set("confirm")}
                    className={inputCls}
                  />

                  <div className="flex gap-2">
                    <input
                      required
                      placeholder="Verification code"
                      value={f.code}
                      onChange={set("code")}
                      className={inputCls}
                    />

                    <Button
                      variant="secondary"
                      onClick={() => sendCode("register")}
                      disabled={busy || !f.email}
                    >
                      {codeSent ? "Resend" : "Send code"}
                    </Button>
                  </div>

                  <label className="flex items-start gap-2 text-[11px] leading-5 text-muted-foreground">
                    <input
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      type="checkbox"
                      className="mt-1"
                    />
                    I understand that AI features are decision support only, and that
                    the camera is used only with a parent's consent.
                  </label>

                  <button
                    disabled={busy || !consent || !f.code}
                    className="w-full rounded-xl bg-primary px-5 py-3.5 text-sm text-primary-foreground disabled:opacity-50"
                  >
                    Create account
                  </button>
                </div>
              </form>
            )}

            {mode === "reset" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  if (f.newPassword !== f.confirm) {
                    return toast.error("Passwords do not match");
                  }

                  wrap(async () => {
                    await api.post("/auth/reset-password", {
                      email: f.email,
                      code: f.code,
                      newPassword: f.newPassword,
                    });

                    toast.success("Password updated. Please sign in.");
                    back();
                  });
                }}
              >
                <button
                  type="button"
                  onClick={back}
                  className="mb-6 flex items-center gap-2 text-xs font-semibold text-blue-600"
                >
                  <ArrowLeft className="size-4" /> Back
                </button>

                <span className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                  <Lock className="size-5" />
                </span>

                <h2 className="mt-5 font-display text-4xl font-semibold text-[#0D1625]">
                  Reset password
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  We will send a six-digit verification code to your email.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex gap-2">
                    <input
                      required
                      type="email"
                      placeholder="Email address"
                      value={f.email}
                      onChange={set("email")}
                      className={inputCls}
                    />

                    <Button
                      variant="secondary"
                      onClick={() => sendCode("reset")}
                      disabled={busy || !f.email}
                    >
                      {codeSent ? "Resend" : "Send code"}
                    </Button>
                  </div>

                  {codeSent && (
                    <>
                      <input
                        required
                        placeholder="Verification code"
                        value={f.code}
                        onChange={set("code")}
                        className={inputCls}
                      />

                      <input
                        required
                        type="password"
                        placeholder="New password (8+ characters)"
                        value={f.newPassword}
                        onChange={set("newPassword")}
                        className={inputCls}
                      />

                      <input
                        required
                        type="password"
                        placeholder="Confirm new password"
                        value={f.confirm}
                        onChange={set("confirm")}
                        className={inputCls}
                      />

                      <button
                        disabled={busy}
                        className="w-full rounded-xl bg-primary px-5 py-3.5 text-sm text-primary-foreground disabled:opacity-50"
                      >
                        Reset password
                      </button>
                    </>
                  )}
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}


/* ───────────────────────── Dashboards ───────────────────────── */
const WeekStrip = ({ week }: { week: { day: string; status: string }[] }) => (
  <div className="grid grid-cols-7 gap-2">{week.map((d) => (
    <div key={d.day} className="text-center">
      <div className={cn("mx-auto grid size-9 place-items-center rounded-xl text-[10px] font-bold",
        d.status === "Completed" ? "bg-emerald-100 text-emerald-700" : d.status === "Missed" ? "bg-rose-100 text-rose-700" : d.status === "Incomplete" ? "bg-amber-100 text-amber-700" : d.status === "Scheduled" ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-400")}>
        {d.status === "Completed" ? "✓" : d.status === "Missed" ? "✕" : d.status === "Incomplete" ? "!" : "·"}</div>
      <p className="mt-1 text-[9px] text-muted-foreground">{new Date(d.day).toLocaleDateString([], { weekday: "short" })}</p>
    </div>))}</div>
);

export function DoctorDashboard() {
  const { go, me } = useNav();
  const q = useLoad(() => api.get("/dashboard"), []);
  return <Async q={q}>{(d) => (
    <div className="space-y-5">
      <Card className="border-0 bg-gradient-to-br from-[#226D8C] to-[#0E2C3D] p-7 text-white">
        <p className="font-mono text-[10px] uppercase tracking-[.2em] text-blue-100">Your care team</p>
        <h2 className="mt-2 font-display text-3xl font-semibold">Welcome, {me.fullName}</h2>
        <p className="mt-2 text-sm text-blue-100">Your doctor code: <b className="rounded-lg bg-white/15 px-2 py-1 font-mono">{me.doctorCode}</b> — parents enter it to link their child to you.</p>
      </Card>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Stat label="Children under care" value={String(d.totalChildren)} icon={Users} />
        <Stat label="Need follow-up" value={String(d.needFollowUp)} icon={AlertCircle} tone="amber" />
        <Stat label="Unread messages" value={String(d.unreadMessages)} icon={MessageSquare} tone="violet" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.4fr_.6fr]">
        <Card className="p-5"><SectionTitle eyebrow="Needs attention" title="Children to follow up" />
          {d.flagged.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">Everyone is on track. 🎉</p> :
            <div className="space-y-2">{d.flagged.map((c: any) => (
              <button key={c.id} onClick={() => go("child-detail", { childId: c.id })} className="flex w-full items-center justify-between rounded-2xl border border-slate-100 p-3 text-left hover:bg-blue-50/50">
                <div className="flex items-center gap-3"><Avatar text={initials(c.fullName)} /><div><p className="text-sm font-bold">{c.fullName}</p><p className="text-xs text-muted-foreground">{c.reason}</p></div></div>
                <Badge tone={toneFor(c.followUp)}>{statusLabel(c.followUp)}</Badge></button>))}</div>}
        </Card>
        <Card className="p-5"><SectionTitle title="Tasks" /><ul className="space-y-2 text-sm">{d.tasks.map((t: string) => <li key={t} className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 text-blue-500" />{t}</li>)}</ul>
          <div className="mt-5 grid gap-2"><Button variant="secondary" onClick={() => go("children")}>All children</Button><Button variant="secondary" onClick={() => go("plans")}>Treatment plans</Button><Button variant="secondary" onClick={() => go("messages")}>Messages</Button></div></Card>
      </div>
    </div>)}</Async>;
}

export function ParentDashboard() {
  const { go, sel, me, switchToChild } = useNav();
  const q = useLoad(() => api.get("/dashboard"), []);
  return <Async q={q}>{(d) => {
    if (d.children.length === 0) return <AddChildCard onDone={() => { q.reload(); }} intro />;
    const c = d.children.find((x: any) => x.id === sel.childId) ?? d.children[0];
    const done = c.summary.completed, total = c.summary.completed + c.summary.missed + c.summary.remaining;
    return (
      <div className="space-y-5">
        <Card className="flex flex-wrap items-center justify-between gap-4 border-0 bg-gradient-to-br from-[#4090B1] to-[#15455A] p-6 text-white">
          <div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-blue-100">Hello, {me.fullName}</p><h2 className="mt-1 font-display text-3xl font-semibold">{c.fullName}'s care journey</h2></div>
          <ChildPicker />
        </Card>
        <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
          <Card className="p-6"><SectionTitle eyebrow="Today" title="Today's session" action={<Badge tone={c.today ? toneFor(c.today.status) : "slate"}>{c.today ? c.today.status : "No session today"}</Badge>} />
            {c.today && c.today.status !== "Completed" ? <><p className="text-sm text-muted-foreground">Make sure the patch or glasses are on, then start the quest together.</p>
              <Button className="mt-5" size="lg" onClick={() => switchToChild(c.id)}><Play className="size-4" /> Start today's session</Button></> :
              <p className="text-sm text-muted-foreground">{c.today ? "Today's session is done. Great job! ⭐" : "There is nothing planned for today."}</p>}
            <div className="mt-6"><p className="mb-3 text-xs font-bold">Last 7 days</p><WeekStrip week={c.week} /></div></Card>
          <Card className="p-6"><SectionTitle title="Plan adherence" /><p className="font-display text-5xl font-semibold">{c.adherence}%</p>
            <div className="mt-3"><ProgressBar value={c.adherence} /></div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded-xl bg-emerald-50 p-3"><b className="block text-lg">{done}</b>done</div><div className="rounded-xl bg-rose-50 p-3"><b className="block text-lg">{c.summary.missed}</b>missed</div><div className="rounded-xl bg-blue-50 p-3"><b className="block text-lg">{c.summary.remaining}</b>left</div></div>
            <p className="mt-3 text-[11px] text-muted-foreground">{done} of {total} planned sessions completed.</p>
            <div className="mt-5 flex flex-wrap gap-2"><Button variant="secondary" size="sm" onClick={() => go("sessions")}>Sessions</Button><Button variant="secondary" size="sm" onClick={() => go("progress")}>Progress</Button><Button variant="secondary" size="sm" onClick={() => go("messages")}>Message doctor</Button></div></Card>
        </div>
      </div>);
  }}</Async>;
}

export function ChildDashboard() {
  const { go, sel } = useNav();
  const q = useLoad(() => api.get("/dashboard"), []);
  return <Async q={q}>{(d) => { const c = d.children[0]; if (!c) return null; return (
    <div className="-m-4 min-h-[calc(100vh-76px)] space-y-5 bg-gradient-to-b from-blue-50 to-amber-50 p-4 md:-m-7 md:p-7">
      <Card className="flex flex-col items-center gap-4 border-0 bg-gradient-to-br from-[#4090B1] to-[#226D8C] p-7 text-center text-white md:flex-row md:text-left">
        <div className="shrink-0"><Mascot /></div>
        <div className="flex-1"><h2 className="font-display text-3xl font-semibold">Hi {c.fullName.split(" ")[0]}! 👋</h2><p className="mt-1 text-sm text-blue-50">You have <b>{c.points}</b> stars. Ready for today's quest?</p></div>
        {c.today && c.today.status !== "Completed" ? <Button size="lg" variant="secondary" onClick={() => go("session", { childId: c.id })}><Play className="size-4" /> Start quest</Button> : <Badge tone="green"><Trophy className="size-3" /> {c.today ? "Quest complete!" : "No quest today"}</Badge>}
      </Card>
      <Card className="p-5"><SectionTitle title="Your week" /><WeekStrip week={c.week} /></Card>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{[["games", "Game galaxy", Gamepad2], ["rewards", "My stars", Star], ["progress", "My journey", TrendingUp], ["companion", "Talk to Pip", Sparkles]].map(([id, label, Icon]: any) => (
        <Card key={id} className="p-5 text-center" onClick={() => go(id)}><Icon className="mx-auto mb-2 size-7 text-blue-600" /><p className="text-sm font-bold">{label}</p></Card>))}</div>
      <span className="hidden">{sel.childId}</span>
    </div>); }}</Async>;
}

export function AdminDashboard() {
  const { go } = useNav();
  const q = useLoad(() => api.get("/dashboard"), []);
  return <Async q={q}>{(d) => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Accounts" value={String(d.accounts.total)} icon={Users} /><Stat label="Active accounts" value={String(d.accounts.active)} icon={CheckCircle2} tone="green" />
        <Stat label="Open support requests" value={String(d.openTickets)} icon={CircleHelp} tone="amber" /><Stat label="Active games" value={String(d.games)} icon={Gamepad2} tone="violet" /></div>
      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="p-5"><SectionTitle eyebrow="Health" title="AI services" action={<Button size="sm" variant="ghost" onClick={() => go("ai-services")}>Open</Button>} />
          <div className="space-y-2">{d.aiServices.map((s: any) => <button key={s.id} onClick={() => go("service-detail", { serviceId: s.id })} className="flex w-full items-center justify-between rounded-xl border border-slate-100 p-3 text-sm hover:bg-blue-50/50"><span>{s.name}</span><Badge tone={toneFor(s.status)}>{s.status}</Badge></button>)}</div></Card>
        <Card className="p-5"><SectionTitle eyebrow="Support" title="Latest requests" action={<Button size="sm" variant="ghost" onClick={() => go("support")}>Open</Button>} />
          <div className="space-y-2">{d.latestTickets.map((t: any) => <button key={t.id} onClick={() => go("support-detail", { ticketId: t.id })} className="flex w-full items-center justify-between rounded-xl border border-slate-100 p-3 text-left text-sm hover:bg-blue-50/50"><span><b>{t.number}</b> · {t.title}</span><Badge tone={toneFor(t.status)}>{statusLabel(t.status)}</Badge></button>)}</div></Card>
      </div>
      <Card className="p-5"><SectionTitle title="Recent admin activity" /><ul className="space-y-2 text-sm">{d.activity.map((a: any, i: number) => <li key={i} className="flex justify-between border-b border-slate-50 pb-2"><span>{a.action}</span><span className="text-xs text-muted-foreground">{fmtDate(a.createdAt, true)}</span></li>)}</ul></Card>
    </div>)}</Async>;
}

/* ───────────────────────── Children ───────────────────────── */
export function AddChildCard({ onDone, intro }: { onDone: () => void; intro?: boolean }) {
  const [f, setF] = useState({ fullName: "", birthDate: "", lazyEye: "Left", degree: "Moderate", cause: "", doctorCode: "" });
  const [created, setCreated] = useState<any>(null);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  if (created) return <Card className="mx-auto max-w-xl p-7 text-center"><CheckCircle2 className="mx-auto size-10 text-emerald-500" /><h3 className="mt-3 font-display text-2xl font-semibold">{created.fullName} was added</h3>
    <p className="mt-2 text-sm text-muted-foreground">Your child's personal code (to sign in on the child screen):</p><p className="mt-2 font-mono text-4xl font-bold tracking-[.3em]">{created.loginCode}</p><Button className="mt-6" onClick={onDone}>Continue</Button></Card>;
  return (
    <Card className="mx-auto max-w-xl p-7">
      {intro && <><Mascot /><h2 className="text-center font-display text-3xl font-semibold">Let's add your child</h2><p className="mb-5 mt-1 text-center text-sm text-muted-foreground">You can link a doctor now or later with the doctor's code.</p></>}
      {!intro && <SectionTitle title="Add a child" />}
      <form className="space-y-3" onSubmit={async (e) => { e.preventDefault(); const r = await run(api.post("/children", { ...f, doctorCode: f.doctorCode || null })); if (r) setCreated({ ...r }); }}>
        <Field label="Child's full name"><input required value={f.fullName} onChange={set("fullName")} className={inputCls} /></Field>
        <div className="grid grid-cols-2 gap-3"><Field label="Date of birth"><input required type="date" value={f.birthDate} onChange={set("birthDate")} className={inputCls} /></Field>
          <Field label="Lazy eye"><select value={f.lazyEye} onChange={set("lazyEye")} className={inputCls}><option>Left</option><option>Right</option></select></Field></div>
        <div className="grid grid-cols-2 gap-3"><Field label="Degree"><select value={f.degree} onChange={set("degree")} className={inputCls}><option>Mild</option><option>Moderate</option><option>Severe</option></select></Field>
          <Field label="Cause (optional)"><input value={f.cause} onChange={set("cause")} className={inputCls} placeholder="e.g. Strabismus" /></Field></div>
        <Field label="Doctor code (optional)"><input value={f.doctorCode} onChange={set("doctorCode")} className={inputCls} placeholder="e.g. DR2048" /></Field>
        <Button size="lg" className="w-full">Add child</Button>
      </form>
    </Card>);
}

export function ChildrenScreen() {
  const { go } = useNav();
  const [query, setQuery] = useState(""); const [filter, setFilter] = useState("");
  const q = useLoad(() => api.get<any[]>(`/children${qs({ q: query, followUp: filter })}`), [query, filter]);
  const kids = q.data ?? [];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Children" value={String(kids.length)} icon={Users} /><Stat label="On track" value={String(kids.filter((k) => k.followUp === "OnTrack").length)} icon={TrendingUp} tone="green" />
        <Stat label="Need review" value={String(kids.filter((k) => k.followUp === "NeedsReview").length)} icon={Clock3} tone="amber" /><Stat label="At risk" value={String(kids.filter((k) => k.followUp === "AtRisk").length)} icon={AlertCircle} tone="violet" /></div>
      <Card className="p-5">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row"><div className="relative w-full max-w-md"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search children…" className="w-full rounded-xl border bg-white py-3 pl-10 text-sm outline-none focus:border-blue-400" /></div>
          <Tabs value={filter} onChange={setFilter} options={[["", "All"], ["OnTrack", "On track"], ["NeedsReview", "Needs review"], ["AtRisk", "At risk"]]} /></div>
        <Async q={q}>{(list) => list.length === 0 ? <p className="py-14 text-center text-sm text-muted-foreground">No children found. Parents link their child to you with your doctor code.</p> :
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{list.map((c) => (
            <Card key={c.id} onClick={() => go("child-detail", { childId: c.id })} className="border border-slate-100 p-4 shadow-none">
              <div className="flex items-start justify-between"><div className="flex items-center gap-3"><Avatar text={initials(c.fullName)} /><div><p className="text-sm font-bold">{c.fullName}</p><p className="text-xs text-muted-foreground">{c.age} yrs · {c.lazyEye} eye</p></div></div><Badge tone={toneFor(c.followUp)}>{statusLabel(c.followUp)}</Badge></div>
              <div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-3"><p className="text-[9px] text-muted-foreground">Latest acuity</p><p className="mt-1 font-display text-lg font-semibold">{c.latestAcuity ?? "—"}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[9px] text-muted-foreground">Parent</p><p className="mt-1 truncate text-sm font-semibold">{c.parentName}</p></div></div>
              <div className="mt-4"><div className="mb-2 flex justify-between text-[10px]"><span className="text-muted-foreground">Plan adherence</span><span className="font-bold">{c.adherence}%</span></div><ProgressBar value={c.adherence} /></div>
            </Card>))}</div>}</Async>
      </Card>
    </div>);
}

export function MeasurementForm({ childId, onDone, initial }: { childId: number; onDone: () => void; initial?: { leftEye?: string; rightEye?: string } }) {
  const [f, setF] = useState({ leftEye: initial?.leftEye ?? "20/", rightEye: initial?.rightEye ?? "20/", date: new Date().toISOString().slice(0, 10), notes: "" });
  return (
    <form className="grid gap-3 sm:grid-cols-5" onSubmit={async (e) => { e.preventDefault(); if (await run(api.post(`/children/${childId}/measurements`, { ...f, date: f.date }), "Measurement saved")) onDone(); }}>
      <Field label="Left eye"><input required value={f.leftEye} onChange={(e) => setF({ ...f, leftEye: e.target.value })} className={inputCls} /></Field>
      <Field label="Right eye"><input required value={f.rightEye} onChange={(e) => setF({ ...f, rightEye: e.target.value })} className={inputCls} /></Field>
      <Field label="Date"><input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} className={inputCls} /></Field>
      <Field label="Notes"><input value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} className={inputCls} /></Field>
      <div className="flex items-end"><Button className="w-full">Save</Button></div>
    </form>);
}

export function ChildDetail({ role }: { role: "doctor" | "parent" }) {
  const { sel, go } = useNav();
  const [code, setCode] = useState(""); const [adding, setAdding] = useState(false); const [editing, setEditing] = useState(false);
  const q = useLoad(() => (sel.childId ? api.get(`/children/${sel.childId}`) : Promise.reject(new Error("Choose a child first."))), [sel.childId]);
  return <Async q={q}>{(c) => {
    const id = c.id;
    const edit = { fullName: c.fullName, birthDate: c.birthDate?.slice(0, 10), lazyEye: c.lazyEye, degree: c.degree ?? "", cause: c.cause ?? "", status: c.status, treatmentStart: c.treatmentStart?.slice(0, 10) ?? "", treatmentEnd: c.treatmentEnd?.slice(0, 10) ?? "" };
    return (
      <div className="space-y-5">
        {role === "parent" && <div className="flex justify-end"><ChildPicker /></div>}
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4"><Avatar text={initials(c.fullName)} className="size-16 text-lg" /><div><h2 className="font-display text-3xl font-semibold">{c.fullName}</h2>
              <p className="text-sm text-muted-foreground">{c.age} years · born {fmtDate(c.birthDate)}</p><div className="mt-2 flex gap-2"><Badge tone={toneFor(c.status)}>{c.status}</Badge><Badge tone={toneFor(c.followUp)}>{statusLabel(c.followUp)}</Badge></div></div></div>
            <div className="flex flex-wrap gap-2"><Button variant="secondary" size="sm" onClick={() => setEditing(!editing)}>Edit profile</Button><Button variant="secondary" size="sm" onClick={() => go("plans", { childId: id })}>Plans</Button><Button variant="secondary" size="sm" onClick={() => go("sessions", { childId: id })}>Sessions</Button><Button variant="secondary" size="sm" onClick={() => go("progress", { childId: id })}>Progress</Button></div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">{[["Lazy eye", c.lazyEye], ["Degree", c.degree ?? "—"], ["Cause", c.cause ?? "—"], ["Plan adherence", `${c.adherence}%`], ["Treatment start", fmtDate(c.treatmentStart)], ["Treatment end", fmtDate(c.treatmentEnd)], ["Active plan", c.activePlan?.planNumber ?? "—"], ["Stars", String(c.points)]].map(([a, b]) =>
            <div key={a} className="rounded-2xl bg-slate-50 p-4"><p className="text-[10px] text-muted-foreground">{a}</p><p className="mt-1 text-sm font-bold">{b}</p></div>)}</div>
          <div className="mt-5 grid grid-cols-4 gap-2 text-center text-xs">{[["Completed", c.summary.completed, "bg-emerald-50"], ["Incomplete", c.summary.incomplete, "bg-amber-50"], ["Missed", c.summary.missed, "bg-rose-50"], ["Remaining", c.summary.remaining, "bg-blue-50"]].map(([a, b, cl]: any) => <div key={a} className={cn("rounded-xl p-3", cl)}><b className="block text-lg">{b}</b>{a}</div>)}</div>
        </Card>
        {editing && <EditChild c={edit} id={id} role={role} onDone={() => { setEditing(false); q.reload(); }} />}
        <div className="grid gap-5 xl:grid-cols-[1.3fr_.7fr]">
          <Card className="p-5"><SectionTitle eyebrow="Vision" title="Measurements" action={<Button size="sm" onClick={() => setAdding(!adding)}><Plus className="size-4" /> Add</Button>} />
            {adding && <div className="mb-4 rounded-2xl bg-slate-50 p-4"><MeasurementForm childId={id} onDone={() => { setAdding(false); q.reload(); }} /></div>}
            <DataTable headers={["Date", "Left eye", "Right eye", "Notes"]} rows={c.measurements.map((m: any) => [fmtDate(m.date), m.leftEye, m.rightEye, m.notes ?? "—"])} /></Card>
          <div className="space-y-5">
            <Card className="p-5"><SectionTitle title={role === "doctor" ? "Parent" : "Doctor"} />
              {role === "doctor" ? <><p className="font-bold">{c.parent?.fullName}</p><p className="text-sm text-muted-foreground">{c.parent?.phone ?? "No phone"} · {c.parent?.email}</p><Button className="mt-4" variant="secondary" size="sm" onClick={() => go("messages", { childId: id })}>Message parent</Button></> :
                c.doctor ? <><p className="font-bold">{c.doctor.fullName}</p><p className="font-mono text-xs text-muted-foreground">{c.doctor.doctorCode}</p>
                  <div className="mt-4 flex gap-2"><Button size="sm" variant="secondary" onClick={() => go("messages", { childId: id })}>Message</Button><Button size="sm" variant="danger" onClick={async () => { if (confirm("Unlink this doctor?") && (await run(api.del(`/children/${id}/doctor`), "Doctor unlinked"))) q.reload(); }}>Unlink</Button></div></> :
                  <form className="flex gap-2" onSubmit={async (e) => { e.preventDefault(); if (await run(api.post(`/children/${id}/link-doctor`, { doctorCode: code }), "Doctor linked")) q.reload(); }}><input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Doctor code" className={inputCls} /><Button>Link</Button></form>}</Card>
            {c.loginCode && <Card className="p-5"><SectionTitle title="Child's sign-in code" /><p className="font-mono text-3xl font-bold tracking-[.3em]">{c.loginCode}</p><p className="mt-2 text-xs text-muted-foreground">The child types this code on the sign-in page.</p>
              <Button className="mt-3" size="sm" variant="secondary" onClick={async () => { if (await run(api.post(`/children/${id}/login-code`), "New code created")) q.reload(); }}>Create a new code</Button></Card>}
            {role === "parent" && <Card className="p-5"><SectionTitle title="Danger zone" /><Button variant="danger" size="sm" onClick={async () => { if (confirm(`Delete ${c.fullName} and all of their data? This cannot be undone.`) && (await run(api.del(`/children/${id}`), "Child deleted"))) go("home"); }}>Delete child</Button></Card>}
          </div>
        </div>
      </div>); }}</Async>;
}

function EditChild({ c, id, role, onDone }: { c: any; id: number; role: string; onDone: () => void }) {
  const [f, setF] = useState(c);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  return <Card className="p-5"><form className="grid gap-3 md:grid-cols-4" onSubmit={async (e) => { e.preventDefault(); if (await run(api.put(`/children/${id}`, { ...f, degree: f.degree || null, cause: f.cause || null, treatmentStart: f.treatmentStart || null, treatmentEnd: f.treatmentEnd || null }), "Saved")) onDone(); }}>
    <Field label="Name"><input value={f.fullName} onChange={set("fullName")} className={inputCls} /></Field><Field label="Birth date"><input type="date" value={f.birthDate} onChange={set("birthDate")} className={inputCls} /></Field>
    <Field label="Lazy eye"><select value={f.lazyEye} onChange={set("lazyEye")} className={inputCls}><option>Left</option><option>Right</option></select></Field>
    <Field label="Degree"><select value={f.degree} onChange={set("degree")} className={inputCls}><option value="">—</option><option>Mild</option><option>Moderate</option><option>Severe</option></select></Field>
    <Field label="Cause"><input value={f.cause} onChange={set("cause")} className={inputCls} /></Field>
    {role === "doctor" && <><Field label="Status"><select value={f.status} onChange={set("status")} className={inputCls}><option>Ongoing</option><option>Paused</option><option>Completed</option></select></Field>
      <Field label="Treatment start"><input type="date" value={f.treatmentStart} onChange={set("treatmentStart")} className={inputCls} /></Field><Field label="Treatment end"><input type="date" value={f.treatmentEnd} onChange={set("treatmentEnd")} className={inputCls} /></Field></>}
    <div className="flex items-end"><Button className="w-full">Save changes</Button></div></form></Card>;
}

/* ───────────────────────── Plans ───────────────────────── */
function PlanForm({ initial, onDone }: { initial?: any; onDone: () => void }) {
  const { sel } = useNav();
  const kids = useLoad(() => api.get<any[]>("/children"), []);
  const games = useLoad(() => api.get("/games"), []);
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({ childId: initial?.childId ?? sel.childId ?? 0, startDate: initial?.startDate?.slice(0, 10) ?? today, endDate: initial?.endDate?.slice(0, 10) ?? new Date(Date.now() + 56 * 864e5).toISOString().slice(0, 10),
    dailyMinutes: initial?.dailyMinutes ?? 25, usesPatch: initial?.usesPatch ?? true, usesGlasses: initial?.usesGlasses ?? true, patchHours: initial?.patchHours ?? 2 });
  const [picked, setPicked] = useState<Record<number, number>>(Object.fromEntries((initial?.games ?? []).map((g: any) => [g.id, g.minutes])));
  const items = (games.data?.items ?? []).filter((g: any) => g.type === "Therapy");
  const childId = f.childId || kids.data?.[0]?.id;
  return (
    <Card className="p-5"><SectionTitle eyebrow="Doctor" title={initial ? `Edit ${initial.planNumber}` : "New treatment plan"} />
      <form className="space-y-4" onSubmit={async (e) => { e.preventDefault();
        const body = { ...f, childId, games: Object.entries(picked).map(([gameId, minutes]) => ({ gameId: Number(gameId), minutes })) };
        if (await run(initial ? api.put(`/plans/${initial.id}`, body) : api.post("/plans", body), "Plan saved")) onDone(); }}>
        <div className="grid gap-3 md:grid-cols-4">
          <Field label="Child"><select value={childId ?? ""} disabled={!!initial} onChange={(e) => setF({ ...f, childId: Number(e.target.value) })} className={inputCls}>{(kids.data ?? []).map((k) => <option key={k.id} value={k.id}>{k.fullName}</option>)}</select></Field>
          <Field label="Start"><input type="date" value={f.startDate} onChange={(e) => setF({ ...f, startDate: e.target.value })} className={inputCls} /></Field>
          <Field label="End"><input type="date" value={f.endDate} onChange={(e) => setF({ ...f, endDate: e.target.value })} className={inputCls} /></Field>
          <Field label="Daily minutes"><input type="number" min={5} max={120} value={f.dailyMinutes} onChange={(e) => setF({ ...f, dailyMinutes: Number(e.target.value) })} className={inputCls} /></Field></div>
        <div className="flex flex-wrap items-center gap-5 text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={f.usesPatch} onChange={(e) => setF({ ...f, usesPatch: e.target.checked })} /> Patch</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={f.usesGlasses} onChange={(e) => setF({ ...f, usesGlasses: e.target.checked })} /> Glasses</label>
          {f.usesPatch && <label className="flex items-center gap-2">Patch hours/day <input type="number" step="0.5" min={0.5} max={8} value={f.patchHours} onChange={(e) => setF({ ...f, patchHours: Number(e.target.value) })} className="w-20 rounded-lg border px-2 py-1" /></label>}</div>
        <div><p className="mb-2 text-xs font-semibold text-slate-600">Exercises (choose at least one)</p><div className="grid gap-2 md:grid-cols-2">{items.map((g: any) => (
          <label key={g.id} className={cn("flex items-center justify-between rounded-xl border p-3 text-sm", picked[g.id] ? "border-blue-400 bg-blue-50" : "border-slate-200")}>
            <span className="flex items-center gap-2"><input type="checkbox" checked={!!picked[g.id]} onChange={(e) => { const n = { ...picked }; if (e.target.checked) n[g.id] = 10; else delete n[g.id]; setPicked(n); }} /> <span><b>{g.name}</b><br /><span className="text-xs text-muted-foreground">{g.category}</span></span></span>
            {picked[g.id] && <span className="flex items-center gap-1 text-xs"><input type="number" min={1} max={60} value={picked[g.id]} onChange={(e) => setPicked({ ...picked, [g.id]: Number(e.target.value) })} className="w-14 rounded-lg border px-2 py-1" />min</span>}</label>))}</div></div>
        <p className="text-[11px] text-muted-foreground">Exercise settings are suggestions to be reviewed by the treating ophthalmologist.</p>
        <Button size="lg">Save plan</Button></form></Card>);
}

export function PlansScreen({ single = false }: { single?: boolean }) {
  const { go, sel, role } = useNav();
  const [creating, setCreating] = useState(false);
  const q = useLoad(() => api.get<any[]>(`/plans${qs({ childId: single ? sel.childId : undefined })}`), [single, sel.childId]);
  return (<div className="space-y-5">
    {creating && <PlanForm onDone={() => { setCreating(false); q.reload(); }} />}
    <Card className="p-5"><SectionTitle eyebrow="Treatment management" title="Treatment plans" action={role === "doctor" ? <Button onClick={() => setCreating(!creating)}><Plus className="size-4" /> New plan</Button> : undefined} />
      <Async q={q}>{(plans) => plans.length === 0 ? <p className="py-10 text-center text-sm text-muted-foreground">No plans yet.</p> :
        <DataTable headers={["Plan", "Child", "Period", "Method", "Adherence", "Status"]} rows={plans.map((p) => [p.planNumber, p.childName, `${fmtDate(p.startDate)} – ${fmtDate(p.endDate)}`, p.methods, `${p.adherence}%`, p.status])} onRow={(i) => go("plan-detail", { planId: plans[i].id, childId: plans[i].childId })} />}</Async></Card></div>);
}

export function PlanDetail({ role }: { role: "doctor" | "parent" }) {
  const { sel, go } = useNav();
  const [editing, setEditing] = useState(false); const [note, setNote] = useState("");
  const q = useLoad(async () => { let id = sel.planId; if (!id || role === "parent") { const l = await api.get<any[]>(`/plans${qs({ childId: sel.childId })}`); id = (role === "parent" ? l.find((p) => p.status !== "Complete") ?? l[0] : l.find((p) => p.id === id))?.id ?? id; } return id ? api.get(`/plans/${id}`) : Promise.reject(new Error("No treatment plan yet.")); }, [sel.planId, sel.childId]);
  return <Async q={q}>{(p) => (
    <div className="space-y-5">
      {role === "parent" && <div className="flex justify-end"><ChildPicker /></div>}
      {editing && <PlanForm initial={p} onDone={() => { setEditing(false); q.reload(); }} />}
      <Card className="p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><Badge tone={toneFor(p.status)}>{p.status}</Badge><h2 className="mt-3 font-display text-2xl font-semibold">{p.planNumber} · {p.childName}</h2>
        <p className="text-sm text-muted-foreground">{fmtDate(p.startDate)} – {fmtDate(p.endDate)} · {p.methods}</p></div>
        {role === "doctor" && p.status !== "Complete" && <Button variant="secondary" onClick={() => setEditing(!editing)}>Edit plan</Button>}</div>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">{[["Daily session", `${p.dailyMinutes} min`], ["Patch", p.usesPatch ? `${p.patchHours} h/day` : "Not used"], ["Glasses", p.usesGlasses ? "Yes" : "No"], ["Adherence", `${p.adherence}%`]].map(([a, b]) => <div key={a} className="rounded-2xl bg-slate-50 p-4"><p className="text-[10px] text-muted-foreground">{a}</p><p className="mt-1 text-sm font-bold">{b}</p></div>)}</div></Card>
      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="p-5"><SectionTitle title="Daily protocol" /><div className="space-y-2">{p.games.map((g: any) => <div key={g.id} className="flex justify-between rounded-xl border border-slate-100 p-3 text-sm"><span><b>{g.name}</b> <span className="text-xs text-muted-foreground">{g.category}</span></span><span>{g.minutes} min</span></div>)}</div></Card>
        <Card className="p-5"><SectionTitle title="Progress" /><div className="grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded-xl bg-emerald-50 p-3"><b className="block text-lg">{p.summary.completed}</b>done</div><div className="rounded-xl bg-rose-50 p-3"><b className="block text-lg">{p.summary.missed}</b>missed</div><div className="rounded-xl bg-blue-50 p-3"><b className="block text-lg">{p.summary.remaining}</b>left</div></div>
          <Button className="mt-4" variant="secondary" size="sm" onClick={() => go("sessions", { childId: p.childId })}>View sessions</Button>
          {role === "doctor" && p.status !== "Complete" && <div className="mt-5 border-t pt-4"><Field label="Result after finishing the plan"><input value={note} onChange={(e) => setNote(e.target.value)} className={inputCls} placeholder="e.g. Acuity improved to 20/40" /></Field>
            <Button className="mt-3" onClick={async () => { if (await run(api.post(`/plans/${p.id}/complete`, { resultNote: note }), "Plan completed")) q.reload(); }}>Complete plan</Button></div>}
          {p.resultNote && <p className="mt-4 rounded-xl bg-blue-50 p-3 text-sm"><b>Result:</b> {p.resultNote}</p>}</Card></div>
    </div>)}</Async>;
}

/* ───────────────────────── Sessions ───────────────────────── */
export function SessionsScreen() {
  const { go, sel, role } = useNav();
  const [status, setStatus] = useState("");
  const q = useLoad(() => api.get(`/sessions${qs({ childId: sel.childId, status })}`), [sel.childId, status]);
  return (<div className="space-y-5">
    {role === "parent" && <div className="flex justify-end"><ChildPicker /></div>}
    <Async q={q}>{(d) => (<>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><Stat label="Total" value={String(d.summary.total)} icon={Activity} /><Stat label="Completed" value={String(d.summary.completed)} icon={CheckCircle2} tone="green" /><Stat label="Incomplete" value={String(d.summary.incomplete)} icon={Clock3} tone="amber" /><Stat label="Missed" value={String(d.summary.missed)} icon={AlertCircle} tone="violet" /></div>
      <Card className="p-5"><SectionTitle eyebrow="History" title="Session history" action={role === "parent" && sel.childId ? <Button onClick={async () => { if (await run(api.post("/sessions/extra", { childId: sel.childId }), "Additional session added for today")) q.reload(); }}><Plus className="size-4" /> Additional session</Button> : undefined} />
        <div className="mb-4"><Tabs value={status} onChange={setStatus} options={[["", "All"], ["Completed", "Completed"], ["Incomplete", "Incomplete"], ["Missed", "Missed"]]} /></div>
        <DataTable headers={["Date", ...(role === "doctor" ? ["Child"] : []), "Duration", "Score", "Attention", "Patch", "Status"]}
          rows={d.items.map((s: any) => [fmtDate(s.date) + (s.isExtra ? " (extra)" : ""), ...(role === "doctor" ? [s.childName] : []), fmtDur(s.durationSeconds), s.status === "Completed" || s.status === "Incomplete" ? `${s.score}` : "—", s.durationSeconds ? `${Math.round(s.attentionAvg)}%` : "—", s.durationSeconds ? (s.patchConfirmed ? "Confirmed" : "Not confirmed") : "—", s.status])}
          onRow={(i) => go("session-detail", { sessionId: d.items[i].id, childId: d.items[i].childId })} /></Card></>)}</Async></div>);
}

export function SessionDetail() {
  const { sel, go } = useNav();
  const q = useLoad(() => api.get(`/sessions/${sel.sessionId}`), [sel.sessionId]);
  return <Async q={q}>{(s) => (
    <Card className="mx-auto max-w-4xl p-6"><Badge tone={toneFor(s.status)}>{s.status}</Badge><h2 className="mt-3 font-display text-2xl font-semibold">{fmtDate(s.date)} {s.gameName ? `· ${s.gameName}` : ""}</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">{[["Duration", fmtDur(s.durationSeconds)], ["Game score", `${s.score}/100`], ["Attention", `${Math.round(s.attentionAvg)}%`], ["Face lost", `${s.faceLostCount}×`], ["Patch", s.patchConfirmed ? "Confirmed" : "Not confirmed"], ["Started", fmtDate(s.startedAt, true)], ["Ended", fmtDate(s.endedAt, true)], ["Type", s.isExtra ? "Extra session" : "Planned"]].map(([a, b]) => <div key={a} className="rounded-2xl bg-slate-50 p-4"><p className="text-[10px] text-muted-foreground">{a}</p><p className="mt-1 text-sm font-bold">{b}</p></div>)}</div>
      <p className="mt-5 text-xs text-muted-foreground">Attention is an indicator computed in the browser to support the doctor. It is not a diagnosis, and no video is stored.</p>
      <Button className="mt-5" variant="secondary" onClick={() => go("sessions")}><ArrowLeft className="size-4" /> Back</Button></Card>)}</Async>;
}

