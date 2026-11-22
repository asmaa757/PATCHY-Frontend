import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  Bot,
  BrainCircuit,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  CloudUpload,
  Eye,
  FileCheck2,
  FileText,
  Gamepad2,
  Gauge,
  Glasses,
  Heart,
  Home,
  Image,
  LayoutGrid,
  Lock,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  Mic,
  Moon,
  MoreHorizontal,
  Pause,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Sun,
  Target,
  Trash2,
  TrendingUp,
  Trophy,
  Upload,
  User,
  UserCog,
  Users,
  Video,
  Volume2,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Toaster, toast } from "sonner";


export type Role = "admin" | "doctor" | "parent" | "child";

export type NavItem = { id: string; label: string; icon: React.ComponentType<{ className?: string }> };

export const roleMeta = {
  admin: { label: "Admin", name: "Maya Kareem", caption: "Platform operations", color: "#226D8C" },
  doctor: { label: "Doctor", name: "Dr. Omar Nasser", caption: "Pediatric Ophthalmologist", color: "#4090B1" },
  parent: { label: "Parent", name: "Sarah Haddad", caption: "Lina's parent", color: "#3BA776" },
  child: { label: "Child", name: "Lina", caption: "Level 8 explorer", color: "#F5922B" },
};

export const navigation: Record<Role, NavItem[]> = {
  admin: [
    { id: "home", label: "Command center", icon: LayoutGrid },
    { id: "accounts", label: "Accounts", icon: Users },
    { id: "games", label: "Game library", icon: Gamepad2 },
    { id: "ai-services", label: "AI services", icon: BrainCircuit },
    { id: "ai-audit", label: "AI governance", icon: ShieldCheck },
    { id: "support", label: "Support desk", icon: CircleHelp },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "My profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  doctor: [
    { id: "home", label: "Clinical overview", icon: Home },
    { id: "children", label: "Children", icon: Users },
    { id: "plans", label: "Treatment plans", icon: ClipboardCheck },
    { id: "sessions", label: "Sessions", icon: Activity },
    { id: "progress", label: "Progress", icon: TrendingUp },
    { id: "reports", label: "AI reports", icon: FileText },
    { id: "vision", label: "Measurements", icon: Eye },
    { id: "monitoring", label: "Vision monitor", icon: Camera },
    { id: "ocr", label: "Prescription OCR", icon: FileCheck2 },
    { id: "assistant", label: "Clinical copilot", icon: WandSparkles },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "My profile", icon: User },
    { id: "support", label: "Help & support", icon: CircleHelp },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  parent: [
    { id: "home", label: "Today", icon: Home },
    { id: "child-profile", label: "Lina's profile", icon: User },
    { id: "plans", label: "Treatment plan", icon: ClipboardCheck },
    { id: "sessions", label: "Sessions", icon: Activity },
    { id: "progress", label: "Progress & reports", icon: TrendingUp },
    { id: "monitoring", label: "Camera monitoring", icon: Camera },
    { id: "ocr", label: "Prescription scan", icon: FileCheck2 },
    { id: "assistant", label: "Parent guide", icon: Sparkles },
    { id: "companion-settings", label: "Pip's settings", icon: Bot },
    { id: "messages", label: "Dr. Omar", icon: MessageCircle },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "My profile", icon: User },
    { id: "support", label: "Help & support", icon: CircleHelp },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  child: [
    { id: "home", label: "My adventure", icon: Home },
    { id: "session", label: "Today's quest", icon: Target },
    { id: "companion", label: "Pip", icon: Bot },
    { id: "games", label: "Game galaxy", icon: Gamepad2 },
    { id: "rewards", label: "Rewards", icon: Trophy },
    { id: "progress", label: "My journey", icon: TrendingUp },
    { id: "sessions", label: "Quest history", icon: Clock3 },
    { id: "help", label: "Help", icon: Heart },
  ],
};

export const screens: Record<Role, Record<string, string>> = {
  admin: {
    home: "Command center", accounts: "Account management", games: "Game library", "ai-services": "AI service operations",
    "ai-audit": "AI governance & audit", support: "Support desk", notifications: "Notifications", profile: "My profile", settings: "Platform settings",
    "account-detail": "Account details", "game-detail": "Game details", "service-detail": "Service health", "support-detail": "Support request",
  },
  doctor: {
    home: "Clinical overview", children: "Children", "child-detail": "Lina Haddad", plans: "Treatment plans", "plan-detail": "Plan TP-2048",
    sessions: "Sessions", "session-detail": "Session details", progress: "Progress analysis", reports: "AI adherence & reports",
    vision: "Visual acuity & measurements", monitoring: "Computer vision monitor", ocr: "Prescription OCR", assistant: "Clinical copilot",
    messages: "Messages", notifications: "Notifications", profile: "My profile", support: "Help & support", settings: "Settings",
  },
  parent: {
    home: "Today with Lina", "child-profile": "Lina's profile", plans: "Treatment plan", sessions: "Sessions", "session-detail": "Session details",
    progress: "Progress & reports", monitoring: "Camera monitoring", ocr: "Prescription scan", assistant: "Parent guide",
    "companion-settings": "Pip's settings", messages: "Dr. Omar", notifications: "Notifications", profile: "My profile", support: "Help & support", settings: "Settings",
  },
  child: {
    home: "My adventure", session: "Today's quest", companion: "Pip's place", games: "Game galaxy", rewards: "My rewards",
    progress: "My journey", sessions: "Quest history", help: "Help",
  },
};

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-45",
        size === "sm" && "px-3 py-2 text-xs",
        size === "md" && "px-4 py-2.5 text-sm",
        size === "lg" && "px-5 py-3.5 text-sm",
        variant === "primary" && "bg-primary text-primary-foreground shadow-[0_10px_25px_rgba(23,107,255,.22)] hover:-translate-y-0.5 hover:bg-blue-600",
        variant === "secondary" && "border border-border bg-card text-foreground shadow-sm hover:bg-secondary",
        variant === "ghost" && "text-muted-foreground hover:bg-secondary hover:text-foreground",
        variant === "danger" && "bg-rose-50 text-rose-700 hover:bg-rose-100",
        variant === "dark" && "bg-[#0C1A27] text-white shadow-lg hover:bg-[#182538]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Card({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-[22px] border border-white/75 bg-card shadow-[0_1px_2px_rgba(10,31,68,.04),0_16px_40px_rgba(34,68,120,.06)]",
        onClick && "cursor-pointer transition hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(34,68,120,.11)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Badge({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "green" | "amber" | "rose" | "violet" | "slate" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    rose: "bg-rose-50 text-rose-700 ring-rose-100",
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
    slate: "bg-slate-100 text-slate-600 ring-slate-200",
  };
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1", tones[tone])}>{children}</span>;
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[.16em] text-blue-600">{eyebrow}</p>}
        <h2 className="font-display text-xl font-semibold tracking-tight text-[#0D1625]">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Stat({
  label,
  value,
  trend,
  icon: Icon,
  tone = "blue",
}: {
  label: string;
  value: string;
  trend?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "blue" | "green" | "violet" | "amber";
}) {
  const map = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <Card className="p-4">
      <div className="mb-5 flex items-start justify-between">
        <span className={cn("grid size-9 place-items-center rounded-xl", map[tone])}><Icon className="size-4" /></span>
        {trend && <Badge tone={trend.startsWith("+") ? "green" : "amber"}>{trend}</Badge>}
      </div>
      <p className="font-display text-[28px] font-semibold leading-none text-[#0D1625]">{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{label}</p>
    </Card>
  );
}

export function ProgressBar({ value, color = "bg-blue-500" }: { value: number; color?: string }) {
  return <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${value}%` }} /></div>;
}

export function Avatar({ text, className }: { text: string; className?: string }) {
  return <span className={cn("grid size-10 shrink-0 place-items-center rounded-2xl bg-blue-100 text-xs font-bold text-blue-700", className)}>{text}</span>;
}

export function EmptyState({ icon: Icon, title, copy, action }: { icon: React.ComponentType<{ className?: string }>; title: string; copy: string; action: string }) {
  return (
    <Card className="grid min-h-[360px] place-items-center p-8 text-center">
      <div>
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-blue-50 text-blue-600"><Icon className="size-6" /></span>
        <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{copy}</p>
        <Button className="mt-5" onClick={() => toast.success(`${action} started`)}><Plus className="size-4" />{action}</Button>
      </div>
    </Card>
  );
}

export function SimulatedBadge() {
  return <Badge tone="violet"><Sparkles className="size-3" /> Simulated AI</Badge>;
}

export function DataTable({ headers, rows, onRow }: { headers: string[]; rows: string[][]; onRow?: (index: number) => void }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[650px] border-collapse text-left">
        <thead><tr className="border-b border-slate-100">{headers.map((h) => <th key={h} className="px-3 py-3 font-mono text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => <tr key={row.join("-")} onClick={() => onRow?.(i)} className={cn("border-b border-slate-50 last:border-0", onRow && "cursor-pointer hover:bg-blue-50/50")}>{row.map((cell, j) => <td key={`${cell}-${j}`} className={cn("px-3 py-3 text-xs", j === 0 && "font-semibold text-[#0D1625]")}>{j === row.length - 1 ? <Badge tone={cell.includes("New") || cell.includes("risk") ? "rose" : cell.includes("Active") || cell.includes("Complete") || cell.includes("Operational") ? "green" : "blue"}>{cell}</Badge> : cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export function Mascot({ mood = "happy", small = false }: { mood?: "happy" | "focus" | "sleepy"; small?: boolean }) {
  return (
    <div className={cn("relative mx-auto", small ? "h-28 w-28" : "h-52 w-52")}>
      <div className="absolute inset-[12%] rounded-[45%_45%_48%_48%] bg-gradient-to-br from-[#8e7aff] via-[#6756e8] to-[#3d35a6] shadow-[inset_-14px_-18px_28px_rgba(28,18,101,.34),inset_10px_10px_24px_rgba(255,255,255,.28),0_28px_45px_rgba(77,57,177,.34)]">
        <div className="absolute left-[22%] top-[28%] h-[27%] w-[23%] rounded-full bg-white shadow-inner">
          <div className="absolute bottom-[18%] right-[18%] size-[45%] rounded-full bg-[#0E2C3D]"><div className="absolute left-[15%] top-[10%] size-[30%] rounded-full bg-white" /></div>
        </div>
        <div className="absolute right-[22%] top-[28%] h-[27%] w-[23%] rounded-full bg-white shadow-inner">
          <div className="absolute bottom-[18%] left-[18%] size-[45%] rounded-full bg-[#0E2C3D]"><div className="absolute left-[15%] top-[10%] size-[30%] rounded-full bg-white" /></div>
        </div>
        <div className={cn("absolute left-1/2 top-[62%] -translate-x-1/2 border-b-[3px] border-white/90", mood === "happy" ? "h-[12%] w-[28%] rounded-b-full" : "w-[20%]")} />
        <div className="absolute -left-[9%] top-[45%] h-[20%] w-[17%] rounded-full bg-gradient-to-br from-[#FCA94B] to-[#D6741A] shadow-lg" />
        <div className="absolute -right-[9%] top-[45%] h-[20%] w-[17%] rounded-full bg-gradient-to-br from-[#FCA94B] to-[#D6741A] shadow-lg" />
      </div>
      <div className="absolute left-[18%] top-[5%] h-[24%] w-[16%] -rotate-[25deg] rounded-full bg-gradient-to-t from-[#D6741A] to-[#FFBB63] shadow-lg" />
      <div className="absolute right-[18%] top-[5%] h-[24%] w-[16%] rotate-[25deg] rounded-full bg-gradient-to-t from-[#D6741A] to-[#FFBB63] shadow-lg" />
      <div className="absolute bottom-[8%] left-[28%] h-[14%] w-[18%] rounded-full bg-[#A85511] shadow-lg" />
      <div className="absolute bottom-[8%] right-[28%] h-[14%] w-[18%] rounded-full bg-[#A85511] shadow-lg" />
      <div className="absolute right-[10%] top-[18%] grid size-[19%] place-items-center rounded-full bg-amber-300 text-amber-800 shadow-lg"><Star className="size-1/2 fill-current" /></div>
    </div>
  );
}

export function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "P";
}

export const unreadCount = { n: 0 };
