import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, Button, cn, type Role } from "./kit";
import { api } from "./api";

export type Sel = { childId?: number; planId?: number; sessionId?: number; accountId?: number; gameId?: number; serviceId?: number; ticketId?: number };
export type Me = { id: number; fullName: string; email: string; role: string; phone?: string | null; doctorCode?: string | null };
export type NavCtxValue = {
  sel: Sel; go: (id: string, p?: Sel) => void; me: Me; role: Role;
  switchToChild: (childId?: number, target?: string) => void; refreshMe: () => void; logout: () => void;
};
export const NavCtx = createContext<NavCtxValue>(null as unknown as NavCtxValue);
export const useNav = () => useContext(NavCtx);

export function fmtDate(d?: string | null, withTime = false) {
  if (!d) return "—";
  const dt = new Date(d);
  return withTime ? dt.toLocaleString([], { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : dt.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" });
}
export const fmtDur = (s: number) => (s ? `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s` : "—");
export const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");

export function useLoad<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const fnRef = useRef(fn); fnRef.current = fn;
  const reload = useCallback(() => {
    setLoading(true);
    fnRef.current().then((d) => { setData(d); setError(""); }).catch((e) => setError(errMsg(e))).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(() => { reload(); }, [reload]);
  return { data, error, loading, reload, setData };
}

export function Async<T>({ q, children }: { q: { data: T | null; error: string; loading: boolean; reload: () => void }; children: (d: T) => ReactNode }) {
  if (q.loading && !q.data) return <Card className="grid min-h-[240px] place-items-center p-8"><Loader2 className="size-6 animate-spin text-blue-500" /></Card>;
  if (q.error) return <Card className="p-8 text-center"><p className="text-sm text-rose-600">{q.error}</p><Button className="mt-4" variant="secondary" onClick={q.reload}>Try again</Button></Card>;
  if (!q.data) return null;
  return <>{children(q.data)}</>;
}

export async function run<T>(p: Promise<T>, ok?: string): Promise<T | undefined> {
  try { const r = await p; if (ok) toast.success(ok); return r; } catch (e) { toast.error(errMsg(e)); return undefined; }
}

export const inputCls = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-xs font-semibold text-slate-600">{label}<div className="mt-1.5 font-normal">{children}</div></label>;
}

export function Tabs<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: [T, string][] }) {
  return <div className="flex flex-wrap gap-2">{options.map(([v, l]) => (
    <button key={v} onClick={() => onChange(v)} className={cn("rounded-full px-3.5 py-1.5 text-xs font-bold transition", value === v ? "bg-blue-600 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-blue-50")}>{l}</button>
  ))}</div>;
}

const toneFor = (s: string): "green" | "amber" | "rose" | "blue" | "slate" =>
  ["Completed", "Complete", "OnTrack", "Operational", "Resolved", "Active", "Ongoing"].includes(s) ? "green"
  : ["Incomplete", "NeedsReview", "Degraded", "UnderReview", "Paused", "Medium"].includes(s) ? "amber"
  : ["Missed", "AtRisk", "Down", "High"].includes(s) ? "rose" : s === "Scheduled" || s === "New" ? "blue" : "slate";
export const statusLabel = (s: string) => ({ OnTrack: "On track", NeedsReview: "Needs review", AtRisk: "At risk", UnderReview: "Under review" } as Record<string, string>)[s] ?? s;
export { toneFor };

/// Lets doctors/parents pick which child the current screen is about.
export function ChildPicker() {
  const { sel, go, role } = useNav();
  const q = useLoad(() => api.get<any[]>("/children"), []);
  const kids = q.data ?? [];
  useEffect(() => { if (kids.length && !kids.some((k) => k.id === sel.childId)) go("__keep__", { childId: kids[0].id }); /* eslint-disable-next-line */ }, [q.data]);
  if (role === "child" || kids.length <= 1) return null;
  return (
    <select value={sel.childId ?? ""} onChange={(e) => go("__keep__", { childId: Number(e.target.value) })}
      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none" aria-label="Choose child">
      {kids.map((k) => <option key={k.id} value={k.id}>{k.fullName}</option>)}
    </select>
  );
}

/// In-browser camera monitor. Uses the browser's FaceDetector when available. Video never leaves the device:
/// only the derived numbers (attention %, times the face was lost) are used.
export function useCameraMonitor(enabled: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [supported, setSupported] = useState(true);
  const [facePresent, setFacePresent] = useState(true);
  const [attention, setAttention] = useState(100);
  const [lost, setLost] = useState(0);
  const [error, setError] = useState("");
  const samples = useRef<boolean[]>([]);
  const lastPresent = useRef(true);

  useEffect(() => {
    if (!enabled) return;
    let stream: MediaStream | null = null; let timer: number | undefined; let cancelled = false;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play().catch(() => {}); }
        const FD = (window as any).FaceDetector;
        if (!FD) { setSupported(false); return; }
        const detector = new FD({ fastMode: true, maxDetectedFaces: 1 });
        timer = window.setInterval(async () => {
          if (!videoRef.current) return;
          let present = true;
          try { present = (await detector.detect(videoRef.current)).length > 0; } catch { return; }
          samples.current = [...samples.current.slice(-19), present];
          setAttention(Math.round((100 * samples.current.filter(Boolean).length) / samples.current.length));
          if (!present && lastPresent.current) setLost((n) => n + 1);
          lastPresent.current = present; setFacePresent(present);
        }, 1000);
      } catch { setError("Camera permission was not granted."); }
    })();
    return () => { cancelled = true; if (timer) clearInterval(timer); stream?.getTracks().forEach((t) => t.stop()); };
  }, [enabled]);

  return { videoRef, supported, facePresent, attention, lost, error };
}
