import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, ArrowLeft, Bell, Camera, CheckCircle2, Eye, FileText, Gamepad2, Pause, Plus, Search, Send, ShieldCheck, Sparkles, Trophy, Upload, Users, X, Play, Star, CircleHelp, AlertCircle } from "lucide-react";
import { Avatar, Badge, Button, Card, DataTable, EmptyState, Mascot, ProgressBar, SectionTitle, SimulatedBadge, Stat, cn, initials, roleMeta } from "./kit";
import { api, qs } from "./api";
import { Async, ChildPicker, Field, Tabs, errMsg, fmtDate, fmtDur, inputCls, run, statusLabel, toneFor, useCameraMonitor, useLoad, useNav } from "./core";
import { MeasurementForm } from "./screens-a";

/* ───────────────────────── Progress / reports / vision ───────────────────────── */
const dec = (v: string) => { const m = /^(\d+)\s*\/\s*(\d+)$/.exec(v); return m ? Math.round((Number(m[1]) / Number(m[2])) * 100) / 100 : null; };

export function ProgressScreen({ role }: { role: "doctor" | "parent" }) {
  const { sel } = useNav();
  const q = useLoad(() => (sel.childId ? api.get(`/children/${sel.childId}/progress`) : Promise.reject(new Error("Choose a child."))), [sel.childId]);
  return (<div className="space-y-5"><div className="flex justify-end"><ChildPicker /></div>
    <Async q={q}>{(d) => (<div className="grid gap-5 xl:grid-cols-2">
      <Card className="p-5"><SectionTitle eyebrow="Last 8 weeks" title="Adherence and attention" />
        <div className="h-72"><ResponsiveContainer><LineChart data={d.weeks}><CartesianGrid strokeDasharray="3 3" stroke="#E4E4E6" /><XAxis dataKey="week" fontSize={11} /><YAxis domain={[0, 100]} fontSize={11} /><Tooltip />
          <Line type="monotone" dataKey="adherence" name="Adherence %" stroke="#4090B1" strokeWidth={3} dot={{ r: 3 }} /><Line type="monotone" dataKey="attention" name="Attention %" stroke="#F5922B" strokeWidth={3} dot={{ r: 3 }} /></LineChart></ResponsiveContainer></div></Card>
      <Card className="p-5"><SectionTitle eyebrow="Measured by the doctor" title="Visual acuity (decimal, higher is better)" />
        <div className="h-72"><ResponsiveContainer><LineChart data={d.measurements.map((m: any) => ({ date: fmtDate(m.date), left: dec(m.leftEye), right: dec(m.rightEye) }))}><CartesianGrid strokeDasharray="3 3" stroke="#E4E4E6" /><XAxis dataKey="date" fontSize={11} /><YAxis domain={[0, 1]} fontSize={11} /><Tooltip />
          <Line dataKey="left" name="Left eye" stroke="#226D8C" strokeWidth={3} /><Line dataKey="right" name="Right eye" stroke="#3BA776" strokeWidth={3} /></LineChart></ResponsiveContainer></div>
        <p className="mt-2 text-[11px] text-muted-foreground">Acuity is a clinic measurement. The app does not claim clinical results.</p></Card></div>)}</Async>
    <span className="hidden">{role}</span></div>);
}

export function ReportsScreen({ role }: { role: "doctor" | "parent" }) {
  const { sel } = useNav(); const [r, setR] = useState<any>(null); const [busy, setBusy] = useState(false);
  return (<Card className="mx-auto max-w-3xl p-6"><SectionTitle eyebrow={role === "doctor" ? "Doctor" : "Parent"} title="Progress report" action={<ChildPicker />} />
    <div className="mb-4 flex items-center gap-2"><SimulatedBadge /><span className="text-xs text-muted-foreground">Built from the child's real session data.</span></div>
    <Button disabled={busy || !sel.childId} onClick={async () => { setBusy(true); setR(await run(api.get(`/ai/report/${sel.childId}`))); setBusy(false); }}><FileText className="size-4" /> Generate report</Button>
    {r && <div className="mt-5 space-y-3"><div className="grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded-xl bg-blue-50 p-3"><b className="block text-lg">{r.adherence}%</b>adherence</div><div className="rounded-xl bg-amber-50 p-3"><b className="block text-lg">{r.attentionAvg}%</b>attention</div><div className={cn("rounded-xl p-3", r.risk === "Low" ? "bg-emerald-50" : r.risk === "Medium" ? "bg-amber-50" : "bg-rose-50")}><b className="block text-lg">{r.risk}</b>risk</div></div>
      <p className="rounded-2xl bg-slate-50 p-4 text-sm leading-6">{r.summary}</p><p className="text-[11px] text-muted-foreground">{r.disclaimer}</p></div>}</Card>);
}

export function MeasurementsScreen() {
  const { sel } = useNav();
  const q = useLoad(() => (sel.childId ? api.get<any[]>(`/children/${sel.childId}/measurements`) : Promise.resolve([])), [sel.childId]);
  return (<div className="space-y-5"><div className="flex justify-end"><ChildPicker /></div>
    {sel.childId && <Card className="p-5"><SectionTitle title="Add a measurement" /><MeasurementForm childId={sel.childId} onDone={q.reload} /></Card>}
    <Card className="p-5"><SectionTitle eyebrow="History" title="Vision measurements" /><Async q={q}>{(m) => <DataTable headers={["Date", "Left eye", "Right eye", "Notes"]} rows={m.map((x) => [fmtDate(x.date), x.leftEye, x.rightEye, x.notes ?? "—"])} />}</Async></Card></div>);
}

export function MonitoringScreen({ role }: { role: "doctor" | "parent" }) {
  const [on, setOn] = useState(false);
  const m = useCameraMonitor(on);
  return (<div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
    <Card className="p-5"><SectionTitle eyebrow="Camera check" title="Is the child ready?" action={<Badge tone="green"><ShieldCheck className="size-3" /> Video stays on this device</Badge>} />
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900">{on ? <video ref={m.videoRef} muted playsInline className="size-full -scale-x-100 object-cover" /> : <div className="grid size-full place-items-center text-sm text-slate-400"><Camera className="mb-2 size-8" />Camera is off</div>}</div>
      <label className="mt-4 flex items-start gap-3 text-sm"><input type="checkbox" className="mt-1" checked={on} onChange={(e) => setOn(e.target.checked)} /> <span>I (the parent) agree to use the camera for this check. Only scores are kept, never the video.</span></label>
      {m.error && <p className="mt-3 text-sm text-rose-600">{m.error}</p>}</Card>
    <Card className="p-5"><SectionTitle title="Live indicators" /><div className="space-y-3">
      <div className="flex justify-between rounded-xl bg-slate-50 p-3 text-sm"><span>Face visible</span><Badge tone={!on ? "slate" : m.facePresent ? "green" : "rose"}>{!on ? "—" : m.facePresent ? "Yes" : "No"}</Badge></div>
      <div className="rounded-xl bg-slate-50 p-3 text-sm"><div className="mb-2 flex justify-between"><span>Attention indicator</span><b>{on ? `${m.attention}%` : "—"}</b></div><ProgressBar value={on ? m.attention : 0} /></div>
      <div className="flex justify-between rounded-xl bg-slate-50 p-3 text-sm"><span>Times the face was lost</span><b>{m.lost}</b></div></div>
      {on && !m.supported && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">This browser has no face-detection API (try Chrome/Edge). The camera preview works, but automatic checks are unavailable; the parent confirms the patch manually.</p>}
      <p className="mt-4 text-[11px] text-muted-foreground">An attention indicator supports the doctor; it is not a diagnosis. Accuracy depends on light and device.{role === "doctor" ? "" : ""}</p></Card></div>);
}

export function OCRScreen() {
  const { sel } = useNav(); const [r, setR] = useState<any>(null); const [busy, setBusy] = useState(false);
  return (<Card className="mx-auto max-w-3xl p-6"><SectionTitle eyebrow="Prescription" title="Read a prescription photo" action={<ChildPicker />} /><div className="mb-4"><SimulatedBadge /></div>
    <label className="grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center hover:border-blue-300"><Upload className="mb-2 size-7 text-blue-500" /><span className="text-sm font-semibold">{busy ? "Reading…" : "Choose a prescription photo"}</span>
      <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; setBusy(true); const fd = new FormData(); fd.append("image", file); setR(await run(api.upload("/ai/ocr", fd))); setBusy(false); }} /></label>
    {r && <div className="mt-5"><div className="grid grid-cols-2 gap-3 md:grid-cols-5">{[["Left eye", r.leftEye], ["Right eye", r.rightEye], ["Sphere", r.sphere], ["Cylinder", r.cylinder], ["Axis", r.axis]].map(([a, b]) => <div key={a} className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-muted-foreground">{a}</p><p className="font-bold">{b}</p></div>)}</div>
      <p className="mt-3 text-xs text-muted-foreground">Confidence {(r.confidence * 100).toFixed(0)}%. {r.disclaimer}</p>
      {sel.childId && <Button className="mt-4" onClick={async () => { await run(api.post(`/children/${sel.childId}/measurements`, { leftEye: r.leftEye, rightEye: r.rightEye, notes: "From prescription scan (confirmed by user)" }), "Saved as a measurement"); }}>Confirm and save as measurement</Button>}</div>}</Card>);
}

export function AssistantScreen({ role }: { role: "doctor" | "parent" }) {
  const { sel } = useNav(); const [msgs, setMsgs] = useState<{ from: "me" | "ai"; text: string }[]>([]); const [text, setText] = useState(""); const bottom = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottom.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [msgs]);
  const send = async () => { const t = text.trim(); if (!t) return; setText(""); setMsgs((m) => [...m, { from: "me", text: t }]); const r = await run(api.post("/ai/assistant", { question: t, childId: sel.childId ?? null })); if (r) setMsgs((m) => [...m, { from: "ai", text: `${r.answer}\n\n${r.disclaimer}` }]); };
  return (<Card className="mx-auto flex min-h-[560px] max-w-3xl flex-col p-5"><SectionTitle eyebrow={role === "doctor" ? "Clinical assistant" : "Parent guide"} title="Ask a question" action={<ChildPicker />} /><div className="mb-3"><SimulatedBadge /></div>
    <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl bg-slate-50/70 p-4">{msgs.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">Try: "How do I help my child keep the patch on?"</p>}
      {msgs.map((m, i) => <div key={i} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}><p className={cn("max-w-[80%] whitespace-pre-line rounded-2xl p-3 text-sm", m.from === "me" ? "bg-blue-600 text-white" : "bg-white ring-1 ring-slate-200")}>{m.text}</p></div>)}<div ref={bottom} /></div>
    <div className="mt-3 flex gap-2"><input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type your question…" className={inputCls} /><Button onClick={send}><Send className="size-4" /></Button></div></Card>);
}

/* ───────────────────────── Messages ───────────────────────── */
export function MessagesScreen({ role }: { role: "doctor" | "parent" }) {
  const { sel, go } = useNav();
  const [filter, setFilter] = useState(""); const [query, setQuery] = useState(""); const [text, setText] = useState("");
  const conv = useLoad(() => api.get<any[]>(`/messages/conversations${qs({ q: query, filter })}`), [query, filter]);
  const active = sel.childId ?? conv.data?.[0]?.childId;
  const thread = useLoad(async () => { if (!active) return []; const t = await api.get<any[]>(`/messages/${active}`); api.post(`/messages/${active}/read`).catch(() => {}); return t; }, [active]);
  useEffect(() => { const t = setInterval(() => { thread.reload(); conv.reload(); }, 10000); return () => clearInterval(t); /* eslint-disable-next-line */ }, [active]);
  const cur = conv.data?.find((c) => c.childId === active);
  const send = async () => { if (!text.trim() || !active) return; if (await run(api.post("/messages", { childId: active, text }))) { setText(""); thread.reload(); conv.reload(); } };
  return (<Card className="grid min-h-[640px] overflow-hidden lg:grid-cols-[320px_1fr]">
    <div className="border-r border-slate-100"><div className="space-y-3 p-4"><div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search conversations" className="w-full rounded-xl border bg-white py-2.5 pl-10 text-sm outline-none" /></div>
      <Tabs value={filter} onChange={setFilter} options={[["", "All"], ["unread", "Unread"], ["read", "Read"]]} /></div>
      {(conv.data ?? []).map((c) => <button key={c.childId} onClick={() => go("__keep__", { childId: c.childId })} className={cn("flex w-full items-center gap-3 border-t border-slate-50 p-4 text-left hover:bg-blue-50/50", c.childId === active && "bg-blue-50")}>
        <Avatar text={initials(c.childName)} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{c.childName} · {role === "doctor" ? c.parentName : "Doctor"}</p><p className="truncate text-xs text-muted-foreground">{c.lastMessage ?? "No messages yet"}</p></div>
        {c.unread > 0 && <span className="rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">{c.unread}</span>}</button>)}
      {conv.data?.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No conversations.</p>}</div>
    <div className="flex flex-col"><div className="border-b p-4"><p className="text-sm font-bold">{cur ? `${cur.childName} · ${role === "doctor" ? cur.parentName : "your doctor"}` : "Select a conversation"}</p></div>
      <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/40 p-5">{(thread.data ?? []).map((m) => <div key={m.id} className={cn("flex", m.mine ? "justify-end" : "justify-start")}><div className={cn("max-w-[75%] rounded-2xl p-3 text-sm", m.mine ? "bg-blue-600 text-white" : "bg-white ring-1 ring-slate-200")}>{m.text}<p className={cn("mt-1 text-[9px]", m.mine ? "text-blue-100" : "text-muted-foreground")}>{fmtDate(m.sentAt, true)}</p></div></div>)}</div>
      <div className="flex gap-2 border-t p-4"><input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Write a message…" className={inputCls} disabled={!active} /><Button onClick={send} disabled={!active}><Send className="size-4" /></Button></div></div></Card>);
}

/* ───────────────────────── Child: today's quest, games, rewards ───────────────────────── */
export function TodaySession() {
  const { go, sel } = useNav();
  const q = useLoad(() => api.get(`/sessions/today?childId=${sel.childId}`), [sel.childId]);
  const [phase, setPhase] = useState<"ready" | "playing" | "done">("ready");
  const [cam, setCam] = useState(false); const [patchOn, setPatchOn] = useState(false);
  const [round, setRound] = useState(0); const [hits, setHits] = useState(0); const [fast, setFast] = useState(0);
  const [pos, setPos] = useState({ x: 50, y: 50 }); const shown = useRef(0); const startedAt = useRef(0); const [result, setResult] = useState<any>(null);
  const ROUNDS = 8;
  const mon = useCameraMonitor(cam);
  const next = () => { shown.current = Date.now(); setPos({ x: 8 + Math.random() * 78, y: 12 + Math.random() * 62 }); };
  const finish = async (completed: boolean, h = hits, f = fast) => {
    const s = (q.data as any).session; const secs = Math.round((Date.now() - startedAt.current) / 1000);
    const attention = cam && mon.supported ? mon.attention : Math.round((100 * f) / ROUNDS); // proxy: targets found within 3 s
    const r = await run(api.post(`/sessions/${s.id}/complete`, { durationSeconds: secs, score: Math.round((100 * h) / ROUNDS), attentionAvg: attention, faceLostCount: cam ? mon.lost : 0, patchConfirmed: patchOn, completed }));
    if (r) { setResult(r); setPhase("done"); }
  };
  useEffect(() => { if (phase !== "playing") return; const t = setTimeout(() => advance(false), 4000); return () => clearTimeout(t); /* eslint-disable-next-line */ }, [phase, round]);
  const advance = (hit: boolean) => {
    const h = hits + (hit ? 1 : 0); const f = fast + (hit && Date.now() - shown.current < 3000 ? 1 : 0);
    setHits(h); setFast(f);
    if (round + 1 >= ROUNDS) { finish(true, h, f); return; }
    setRound(round + 1); next();
  };
  return <Async q={q}>{(d) => {
    const s = d.session;
    return (<div className="-m-4 min-h-[calc(100vh-76px)] bg-gradient-to-b from-blue-50 to-amber-50 p-4 md:-m-7 md:p-7"><Card className="mx-auto max-w-4xl overflow-hidden border-0">
      <div className="relative min-h-[560px] overflow-hidden bg-[radial-gradient(circle_at_50%_15%,#82B4C6,#226D8C_45%,#0E2C3D_80%)] p-6 text-white">
        <div className="relative flex items-center justify-between"><Button variant="secondary" size="sm" onClick={() => (phase === "playing" ? finish(false) : go("home"))}><ArrowLeft className="size-4" /> Leave quest</Button><Badge tone="amber"><Star className="size-3" /> {phase === "playing" ? `Round ${round + 1} of ${ROUNDS}` : "Today's quest"}</Badge></div>
        {!s && <div className="relative mt-20 text-center"><h2 className="font-display text-4xl font-semibold">No quest today</h2><p className="mt-3 text-blue-100">Come back tomorrow!</p></div>}
        {s?.status === "Completed" && phase !== "done" && <div className="relative mt-20 text-center"><Trophy className="mx-auto size-16 text-amber-300" /><h2 className="mt-4 font-display text-4xl font-semibold">Already done today!</h2></div>}
        {s && s.status !== "Completed" && phase === "ready" && <div className="relative mx-auto mt-10 max-w-xl text-center"><h2 className="font-display text-5xl font-semibold">Focus Forest</h2><p className="mt-3 text-blue-100">Find the glowing firefly and tap it as fast as you can!</p>
          <div className="mt-6 space-y-3 rounded-2xl bg-white/10 p-4 text-left text-sm"><label className="flex items-center gap-3"><input type="checkbox" checked={patchOn} onChange={(e) => setPatchOn(e.target.checked)} /> My patch / glasses are on</label>
            <label className="flex items-center gap-3"><input type="checkbox" checked={cam} onChange={(e) => setCam(e.target.checked)} /> A parent says the camera helper can be on (video never leaves this device)</label></div>
          {cam && <video ref={mon.videoRef} muted playsInline className="mx-auto mt-3 h-24 -scale-x-100 rounded-xl object-cover" />}{mon.error && <p className="mt-2 text-xs text-amber-200">{mon.error}</p>}
          <Button size="lg" className="mt-6" disabled={!patchOn} onClick={async () => { await run(api.post(`/sessions/${s.id}/start`, { patchConfirmed: patchOn })); startedAt.current = Date.now(); setRound(0); setHits(0); setFast(0); next(); setPhase("playing"); }}><Play className="size-4" /> Start quest</Button></div>}
        {phase === "playing" && <div className="relative mt-6 h-[400px]"><button onClick={() => advance(true)} aria-label="Firefly" style={{ left: `${pos.x}%`, top: `${pos.y}%` }} className="absolute size-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300 shadow-[0_0_45px_16px_rgba(255,200,61,.75)] transition-all duration-300 hover:scale-110" />
          {cam && !mon.facePresent && <p className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-rose-500 px-4 py-1 text-xs font-bold">Come back to the screen 👀</p>}</div>}
        {phase === "done" && result && <div className="relative mx-auto mt-14 max-w-xl text-center"><Trophy className="mx-auto size-16 text-amber-300" /><h2 className="mt-4 font-display text-5xl font-semibold">{result.status === "Completed" ? "Quest complete!" : "Good try!"}</h2>
          <p className="mt-3 text-blue-100">You earned <b>{result.pointsEarned}</b> stars. Total: {result.totalPoints} ⭐</p><Button className="mt-6" variant="secondary" onClick={() => go("home")}>Back home</Button></div>}
      </div></Card></div>);
  }}</Async>;
}

const grads = ["from-emerald-300 to-teal-600", "from-amber-300 to-orange-600", "from-cyan-300 to-blue-600", "from-orange-300 to-amber-600"];
export function GamesScreen({ admin = false }: { admin?: boolean }) {
  const { go } = useNav();
  const [query, setQuery] = useState(""); const [adding, setAdding] = useState(false);
  const q = useLoad(() => api.get(`/games${qs({ q: query })}`), [query]);
  const [f, setF] = useState({ name: "", type: "Therapy", category: "", url: "", description: "" });
  return (<div className="space-y-5">
    <Async q={q}>{(d) => (<>
      {admin && <div className="grid grid-cols-3 gap-3"><Stat label="Total games" value={String(d.stats.total)} icon={Gamepad2} /><Stat label="Active" value={String(d.stats.active)} icon={CheckCircle2} tone="green" /><Stat label="Disabled" value={String(d.stats.disabled)} icon={Pause} tone="amber" /></div>}
      <div className="flex justify-between gap-3"><div className="relative max-w-md flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search games…" className="w-full rounded-xl border bg-white py-3 pl-10 text-sm outline-none" /></div>
        {admin && <Button onClick={() => setAdding(!adding)}><Plus className="size-4" /> Add game</Button>}</div>
      {adding && <Card className="p-5"><form className="grid gap-3 md:grid-cols-5" onSubmit={async (e) => { e.preventDefault(); if (await run(api.post("/games", { ...f, isActive: true }), "Game added")) { setAdding(false); q.reload(); } }}>
        <Field label="Name"><input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={inputCls} /></Field><Field label="Type"><select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })} className={inputCls}><option>Therapy</option><option>Test</option></select></Field>
        <Field label="Category"><input value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className={inputCls} /></Field><Field label="Game link"><input value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} className={inputCls} /></Field>
        <div className="flex items-end"><Button className="w-full">Save</Button></div><div className="md:col-span-5"><Field label="Description"><input value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className={inputCls} /></Field></div></form></Card>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{d.items.map((g: any, i: number) => (
        <Card key={g.id} className={cn("overflow-hidden", !g.isActive && "opacity-60")} onClick={() => (admin ? go("game-detail", { gameId: g.id }) : toast.message(`${g.name} starts from today's quest`))}>
          <div className={cn("relative grid h-36 place-items-center bg-gradient-to-br text-white", grads[i % 4])}><Gamepad2 className="size-12" /></div>
          <div className="p-4"><div className="flex items-center justify-between"><p className="font-bold">{g.name}</p>{admin && <Badge tone={g.isActive ? "green" : "slate"}>{g.isActive ? "Active" : "Disabled"}</Badge>}</div><p className="text-xs text-muted-foreground">{g.category ?? g.type}</p>{admin && <p className="mt-2 text-xs">{g.plays} plays</p>}</div></Card>))}</div></>)}</Async></div>);
}

export function RewardsScreen() {
  const { sel } = useNav();
  const q = useLoad(() => api.get(`/rewards/${sel.childId}`), [sel.childId]);
  return <Async q={q}>{(d) => (
    <div className="-m-4 min-h-[calc(100vh-76px)] space-y-5 bg-gradient-to-b from-amber-50 to-blue-50 p-4 md:-m-7 md:p-7">
      <Card className="border-0 bg-gradient-to-br from-[#FFC83D] to-[#F5922B] p-7 text-[#4D2607]"><Badge tone="amber"><Trophy className="size-3" /> Level {d.level}</Badge><p className="mt-3 font-display text-6xl font-semibold">{d.points} ⭐</p><p className="mt-1 text-sm">{d.streak}-day streak. Keep it going!</p></Card>
      <SectionTitle eyebrow="Choose a reward" title="Pip's treasure shelf" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{d.shop.map((s: any) => (
        <button key={s.name} disabled={d.points < s.cost} onClick={async () => { if (await run(api.post("/rewards/redeem", { childId: sel.childId, item: s.name }), `${s.name} unlocked!`)) q.reload(); }} className="rounded-3xl bg-white p-5 text-center shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 disabled:opacity-45"><p className="text-lg font-bold">{s.name}</p><p className="mt-1 text-sm text-amber-600">{s.cost} ⭐</p></button>))}</div>
      <Card className="p-5"><SectionTitle title="Achievement badges" /><div className="flex flex-wrap gap-4">{d.badges.map((b: any) => <div key={b.name} className={cn("grid size-24 place-items-center rounded-full p-2 text-center text-[10px] font-bold", b.earned ? "bg-gradient-to-br from-amber-300 to-orange-400 text-amber-950" : "bg-slate-100 text-slate-400")}>{b.name}</div>)}</div></Card>
      <Card className="p-5"><SectionTitle title="Recent stars" /><ul className="space-y-2 text-sm">{d.events.map((e: any) => <li key={e.id} className="flex justify-between"><span>{e.reason}</span><b className={e.points > 0 ? "text-emerald-600" : "text-rose-600"}>{e.points > 0 ? "+" : ""}{e.points}</b></li>)}</ul></Card>
    </div>)}</Async>;
}

export function ChildProgress() {
  const { sel } = useNav();
  const q = useLoad(() => api.get(`/children/${sel.childId}/progress`), [sel.childId]);
  return <Async q={q}>{(d) => (<div className="-m-4 min-h-[calc(100vh-76px)] bg-gradient-to-b from-blue-50 to-amber-50 p-4 md:-m-7 md:p-7"><Card className="p-6"><SectionTitle eyebrow="Your journey" title="How many quests you finished each week" />
    <div className="grid grid-cols-8 items-end gap-3">{d.weeks.map((w: any) => <div key={w.week} className="text-center"><div className="mx-auto w-8 rounded-t-xl bg-gradient-to-t from-blue-500 to-cyan-300" style={{ height: `${Math.max(8, w.sessions * 14)}px` }} /><p className="mt-1 text-[10px]">{w.week}</p><b className="text-xs">{w.sessions}</b></div>)}</div></Card></div>)}</Async>;
}

export function ChildHistory() {
  const { sel } = useNav();
  const q = useLoad(() => api.get(`/sessions?childId=${sel.childId}`), [sel.childId]);
  return <Async q={q}>{(d) => (<div className="-m-4 min-h-[calc(100vh-76px)] bg-amber-50/50 p-4 md:-m-7 md:p-7"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{d.items.slice(0, 18).map((s: any) => (
    <Card key={s.id} className="p-5"><p className="text-xs text-muted-foreground">{fmtDate(s.date)}</p><p className="mt-1 font-bold">{s.gameName ?? "Quest"}</p><div className="mt-3 flex justify-between"><span className="text-sm">{s.status === "Completed" ? `${s.score} points` : "—"}</span><Badge tone={toneFor(s.status)}>{s.status === "Completed" ? "Complete" : s.status}</Badge></div></Card>))}</div></div>)}</Async>;
}

/* ───────────────────────── Admin ───────────────────────── */
export function AccountsScreen() {
  const { go } = useNav();
  const [query, setQuery] = useState(""); const [role, setRole] = useState(""); const [inv, setInv] = useState(false); const [f, setF] = useState({ fullName: "", email: "", permissions: "accounts,games,ai,support" });
  const q = useLoad(() => api.get(`/admin/accounts${qs({ q: query, role })}`), [query, role]);
  return (<div className="space-y-5"><Async q={q}>{(d) => (<>
    <div className="grid grid-cols-3 gap-3"><Stat label="Total accounts" value={String(d.stats.total)} icon={Users} /><Stat label="Active" value={String(d.stats.active)} icon={CheckCircle2} tone="green" /><Stat label="Disabled" value={String(d.stats.disabled)} icon={Pause} tone="amber" /></div>
    <Card className="p-5"><div className="mb-4 flex flex-col justify-between gap-3 md:flex-row"><div className="relative max-w-md flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search accounts…" className="w-full rounded-xl border bg-white py-3 pl-10 text-sm outline-none" /></div>
      <div className="flex flex-wrap gap-2"><Tabs value={role} onChange={setRole} options={[["", "All"], ["Doctor", "Doctors"], ["Parent", "Parents"], ["Admin", "Admins"]]} /><Button onClick={() => setInv(!inv)}><Plus className="size-4" /> Add admin</Button></div></div>
      {inv && <form className="mb-4 grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-4" onSubmit={async (e) => { e.preventDefault(); const r = await run(api.post("/admin/invite", f)); if (r) { toast.success(r.devTempPassword ? `Invitation created. Temporary password: ${r.devTempPassword}` : "Invitation sent"); setInv(false); q.reload(); } }}>
        <Field label="Name"><input required value={f.fullName} onChange={(e) => setF({ ...f, fullName: e.target.value })} className={inputCls} /></Field><Field label="Email"><input required type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className={inputCls} /></Field>
        <Field label="Permissions"><input value={f.permissions} onChange={(e) => setF({ ...f, permissions: e.target.value })} className={inputCls} /></Field><div className="flex items-end"><Button className="w-full">Send invitation</Button></div></form>}
      <DataTable headers={["Name", "Email", "Type", "Status", "Created"]} rows={d.items.map((u: any) => [u.fullName, u.email, u.role, u.isActive ? "Active" : "Disabled", fmtDate(u.createdAt)])} onRow={(i) => go("account-detail", { accountId: d.items[i].id })} /></Card></>)}</Async></div>);
}

export function GenericDetail({ kind }: { kind: "account" | "game" }) {
  const { sel, go } = useNav();
  const q = useLoad(() => api.get(kind === "account" ? `/admin/accounts/${sel.accountId}` : `/games/${sel.gameId}`), [sel.accountId, sel.gameId, kind]);
  const back = () => go(kind === "account" ? "accounts" : "games");
  return <Async q={q}>{(x) => kind === "account" ? (
    <Card className="mx-auto max-w-3xl p-6"><div className="flex items-center gap-4"><Avatar text={initials(x.fullName)} className="size-16 text-lg" /><div><h2 className="font-display text-2xl font-semibold">{x.fullName}</h2><p className="text-sm text-muted-foreground">{x.email}</p></div><Badge tone={x.isActive ? "green" : "slate"}>{x.isActive ? "Active" : "Disabled"}</Badge></div>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">{[["Type", x.role], ["Phone", x.phone ?? "—"], ["Created", fmtDate(x.createdAt)], ["Linked children", String(x.children)]].map(([a, b]) => <div key={a} className="rounded-2xl bg-slate-50 p-4"><p className="text-[10px] text-muted-foreground">{a}</p><p className="mt-1 text-sm font-bold">{b}</p></div>)}</div>
      <div className="mt-6 flex flex-wrap gap-2"><Button variant="secondary" onClick={async () => { if (await run(api.put(`/admin/accounts/${x.id}/active`, { isActive: !x.isActive }), x.isActive ? "Account disabled" : "Account enabled")) q.reload(); }}>{x.isActive ? "Disable account" : "Enable account"}</Button>
        <Button variant="danger" onClick={async () => { if (confirm("Delete this account?") && (await run(api.del(`/admin/accounts/${x.id}`), "Account deleted"))) back(); }}>Delete account</Button><Button variant="ghost" onClick={back}>Back</Button></div></Card>) : (
    <Card className="mx-auto max-w-3xl p-6"><div className="flex items-center justify-between"><h2 className="font-display text-2xl font-semibold">{x.name}</h2><Badge tone={x.isActive ? "green" : "slate"}>{x.isActive ? "Active" : "Disabled"}</Badge></div><p className="mt-1 text-sm text-muted-foreground">{x.category ?? x.type} · {x.description}</p>
      <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs"><div className="rounded-xl bg-emerald-50 p-4"><b className="block text-xl">{x.usage.plays}</b>plays</div><div className="rounded-xl bg-amber-50 p-4"><b className="block text-xl">{x.usage.unfinished}</b>unfinished</div><div className="rounded-xl bg-blue-50 p-4"><b className="block text-xl">{x.usage.avgScore}</b>avg score</div></div>
      <div className="mt-6 flex flex-wrap gap-2"><Button variant="secondary" onClick={async () => { if (await run(api.put(`/games/${x.id}/active`, { isActive: !x.isActive }), "Updated")) q.reload(); }}>{x.isActive ? "Disable game" : "Enable game"}</Button>
        <Button variant="danger" onClick={async () => { if (confirm("Delete this game?") && (await run(api.del(`/games/${x.id}`), "Game deleted"))) back(); }}>Delete game</Button><Button variant="ghost" onClick={back}>Back</Button></div></Card>)}</Async>;
}

export function AIServicesScreen() {
  const { go } = useNav();
  const q = useLoad(() => api.get("/admin/ai-services"), []);
  return <Async q={q}>{(d) => (<div className="space-y-5"><div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><Stat label="Total requests" value={String(d.stats.total)} icon={Activity} /><Stat label="Need attention" value={String(d.stats.needAttention)} icon={AlertCircle} tone="amber" /><Stat label="Healthy" value={String(d.stats.healthy)} icon={CheckCircle2} tone="green" /><Stat label="Avg response" value={`${d.stats.avgMs} ms`} icon={Sparkles} tone="violet" /></div>
    <Card className="p-5"><SectionTitle eyebrow="Responsible AI" title="Services" /><DataTable headers={["Service", "Success rate", "Avg response", "Status"]} rows={d.items.map((s: any) => [s.name, `${s.successRate}%`, `${s.avgMs} ms`, s.status])} onRow={(i) => go("service-detail", { serviceId: d.items[i].id })} /></Card></div>)}</Async>;
}

export function ServiceDetail() {
  const { sel, go } = useNav(); const [busy, setBusy] = useState(false);
  const q = useLoad(() => api.get(`/admin/ai-services/${sel.serviceId}`), [sel.serviceId]);
  return <Async q={q}>{(s) => (<div className="space-y-5"><Card className="p-5"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-center"><div><Badge tone={toneFor(s.status)}>{s.status}</Badge><h2 className="mt-2 font-display text-2xl font-semibold">{s.name}</h2><p className="text-sm text-muted-foreground">{s.description}</p></div>
    <div className="flex gap-2"><Button disabled={busy} onClick={async () => { setBusy(true); const r = await run(api.post(`/admin/ai-services/${s.id}/check`)); setBusy(false); if (r) { toast[r.success ? "success" : "error"](r.success ? `Healthy (${r.responseMs} ms, simulated probe)` : `Check failed: ${r.error}`); q.reload(); } }}>Check now</Button><Button variant="ghost" onClick={() => go("ai-services")}>Back</Button></div></div></Card>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><Stat label="Successful" value={String(s.stats.ok)} icon={CheckCircle2} tone="green" /><Stat label="Failed" value={String(s.stats.failed)} icon={AlertCircle} tone="amber" /><Stat label="Success rate" value={`${s.stats.successRate}%`} icon={Activity} /><Stat label="Avg response" value={`${s.stats.avgMs} ms`} icon={Sparkles} tone="violet" /></div>
    <Card className="p-5"><SectionTitle title="Recent errors" />{s.errors.length === 0 ? <p className="text-sm text-muted-foreground">No recent errors.</p> : <ul className="space-y-2 text-sm">{s.errors.map((e: any, i: number) => <li key={i} className="flex justify-between"><span>{e.error ?? "Failed check"}</span><span className="text-xs text-muted-foreground">{fmtDate(e.checkedAt, true)}</span></li>)}</ul>}</Card></div>)}</Async>;
}

export function AuditScreen() {
  const q = useLoad(() => api.get<any[]>("/admin/audit"), []);
  return <Card className="p-5"><SectionTitle eyebrow="Responsible AI & admin" title="Audit log" /><Async q={q}>{(l) => <DataTable headers={["When", "Who", "Action"]} rows={l.map((x) => [fmtDate(x.createdAt, true), x.actor, x.action])} />}</Async></Card>;
}

/* ───────────────────────── Notifications / support / profile / settings ───────────────────────── */
export function NotificationsScreen({ onChanged }: { onChanged: () => void }) {
  const q = useLoad(() => api.get<any[]>("/notifications"), []);
  return <Card className="mx-auto max-w-4xl p-5"><SectionTitle eyebrow="Recent activity" title="Notifications" action={<Button size="sm" variant="ghost" onClick={async () => { await run(api.post("/notifications/read-all")); q.reload(); onChanged(); }}>Mark all read</Button>} />
    <Async q={q}>{(l) => l.length === 0 ? <p className="py-10 text-center text-sm text-muted-foreground">Nothing new.</p> : <div className="divide-y divide-slate-50">{l.map((n) => (
      <button key={n.id} onClick={async () => { if (!n.isRead) { await api.post(`/notifications/${n.id}/read`); q.reload(); onChanged(); } }} className={cn("flex w-full items-start gap-3 py-4 text-left", !n.isRead && "bg-blue-50/40")}>
        <span className="mt-0.5 grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600"><Bell className="size-4" /></span><div className="flex-1"><p className="text-sm font-bold">{n.title}</p><p className="text-xs text-muted-foreground">{n.body}</p></div><span className="text-[10px] text-muted-foreground">{fmtDate(n.createdAt, true)}</span></button>))}</div>}</Async></Card>;
}

export function SupportScreen({ admin = false, detail = false }: { admin?: boolean; detail?: boolean }) {
  const { go, sel } = useNav();
  const [status, setStatus] = useState(""); const [query, setQuery] = useState(""); const [form, setForm] = useState(false);
  const [f, setF] = useState({ title: "", category: "General", type: "Question", priority: "Medium", description: "", impact: "" });
  const list = useLoad(() => (detail ? Promise.resolve(null) : api.get(`/support${qs({ status, q: query })}`)), [status, query, detail]);
  const one = useLoad(() => (detail ? api.get(`/support/${sel.ticketId}`) : Promise.resolve(null)), [sel.ticketId, detail]);
  if (detail) return <Async q={one}>{(t) => (<Card className="mx-auto max-w-4xl p-6"><div className="flex justify-between"><div><Badge tone={toneFor(t.priority)}>{t.priority} priority</Badge><h2 className="mt-3 font-display text-2xl font-semibold">#{t.number} · {t.title}</h2><p className="text-xs text-muted-foreground">{t.from} ({t.fromRole}) · {fmtDate(t.createdAt, true)} · {t.type} · {t.category}</p></div><Badge tone={toneFor(t.status)}>{statusLabel(t.status)}</Badge></div>
    <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6">{t.description}</p>{t.impact && <p className="mt-3 text-sm"><b>Impact:</b> {t.impact}</p>}
    {admin && <div className="mt-6 flex flex-wrap gap-2">{["New", "UnderReview", "Resolved"].map((s) => <Button key={s} variant={t.status === s ? "primary" : "secondary"} size="sm" onClick={async () => { if (await run(api.put(`/support/${t.id}/status`, { status: s }), "Status updated")) one.reload(); }}>{statusLabel(s)}</Button>)}</div>}
    <Button className="mt-5" variant="ghost" onClick={() => go("support")}><ArrowLeft className="size-4" /> Back</Button></Card>)}</Async>;
  return (<div className="space-y-5">
    <Async q={list}>{(d: any) => (<>
      {admin && <div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><Stat label="All requests" value={String(d.stats.all)} icon={CircleHelp} /><Stat label="Under review" value={String(d.stats.underReview)} icon={Search} tone="violet" /><Stat label="New" value={String(d.stats.new)} icon={Plus} tone="green" /><Stat label="Urgent" value={String(d.stats.urgent)} icon={AlertCircle} tone="amber" /></div>}
      <Card className="p-5"><SectionTitle eyebrow="Help & support" title={admin ? "Requests" : "Your requests"} action={!admin ? <Button onClick={() => setForm(!form)}><Plus className="size-4" /> New request</Button> : undefined} />
        {form && <form className="mb-5 grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-4" onSubmit={async (e) => { e.preventDefault(); if (await run(api.post("/support", f), "Request sent")) { setForm(false); list.reload(); } }}>
          <Field label="Title"><input required value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} className={inputCls} /></Field><Field label="Type"><select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })} className={inputCls}><option>Question</option><option>Bug</option><option>Request</option></select></Field>
          <Field label="Priority"><select value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value })} className={inputCls}><option>Low</option><option>Medium</option><option>High</option></select></Field><Field label="Category"><input value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className={inputCls} /></Field>
          <div className="md:col-span-4"><Field label="Description"><textarea required rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className={inputCls} /></Field></div><div><Button>Send request</Button></div></form>}
        <div className="mb-4 flex flex-wrap gap-3"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" className="w-60 rounded-xl border bg-white px-3 py-2 text-sm outline-none" /><Tabs value={status} onChange={setStatus} options={[["", "All"], ["New", "New"], ["UnderReview", "Under review"], ["Resolved", "Resolved"]]} /></div>
        <DataTable headers={["#", "Title", ...(admin ? ["From"] : []), "Type", "Priority", "Status", "Date"]} rows={d.items.map((t: any) => [t.number, t.title, ...(admin ? [t.from] : []), t.type, t.priority, statusLabel(t.status), fmtDate(t.createdAt)])} onRow={(i) => go("support-detail", { ticketId: d.items[i].id })} /></Card></>)}</Async></div>);
}

export function ProfileScreen() {
  const { me, refreshMe, role } = useNav();
  const [f, setF] = useState({ fullName: me.fullName, phone: me.phone ?? "" }); const [pw, setPw] = useState({ oldPassword: "", newPassword: "" });
  return (<div className="mx-auto max-w-3xl space-y-5"><Card className="p-6"><div className="flex items-center gap-4"><Avatar text={initials(me.fullName)} className="size-16 text-lg" /><div><h2 className="font-display text-2xl font-semibold">{me.fullName}</h2><p className="text-sm text-muted-foreground">{me.email || roleMeta[role].label}</p>{me.doctorCode && <p className="mt-1 font-mono text-xs">Doctor code: {me.doctorCode}</p>}</div></div>
    {role !== "child" && <form className="mt-6 grid gap-3 md:grid-cols-3" onSubmit={async (e) => { e.preventDefault(); if (await run(api.put("/auth/me", { fullName: f.fullName, phone: f.phone || null }), "Profile updated")) refreshMe(); }}>
      <Field label="Full name"><input required value={f.fullName} onChange={(e) => setF({ ...f, fullName: e.target.value })} className={inputCls} /></Field><Field label="Phone"><input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className={inputCls} /></Field><div className="flex items-end"><Button className="w-full">Save profile</Button></div></form>}</Card>
    {role !== "child" && <Card className="p-6"><SectionTitle title="Change password" /><form className="grid gap-3 md:grid-cols-3" onSubmit={async (e) => { e.preventDefault(); if (await run(api.post("/auth/change-password", pw), "Password changed")) setPw({ oldPassword: "", newPassword: "" }); }}>
      <Field label="Current password"><input required type="password" value={pw.oldPassword} onChange={(e) => setPw({ ...pw, oldPassword: e.target.value })} className={inputCls} /></Field><Field label="New password (8+)"><input required type="password" minLength={8} value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} className={inputCls} /></Field><div className="flex items-end"><Button className="w-full">Change password</Button></div></form></Card>}</div>);
}

export function SettingsScreen({ onLogout }: { onLogout: () => void }) {
  const { role, go } = useNav();
  return (<div className="mx-auto max-w-3xl space-y-5"><Card className="p-5"><SectionTitle eyebrow={`${roleMeta[role].label} preferences`} title="Settings" />
    <div className="divide-y divide-slate-100 text-sm">{[["Profile and password", "profile"], ["Notifications", "notifications"], ["Help & support", "support"]].filter(([, id]) => !(role === "child" && id !== "support")).map(([label, id]) => <button key={id} onClick={() => go(id)} className="flex w-full justify-between py-4 text-left hover:text-blue-600"><span>{label}</span><span className="text-muted-foreground">Open →</span></button>)}</div>
    <Button className="mt-5" variant="danger" onClick={onLogout}>Sign out</Button></Card></div>);
}

export { Camera, Eye, EmptyState, Mascot, Users, X, Trophy, Upload, Send, ShieldCheck, errMsg, statusLabel, fmtDur, Gamepad2, Star, Plus };