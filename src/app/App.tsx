
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

import {
  cn,
  Button,
  Card,
  Badge,
  SectionTitle,
  Stat,
  ProgressBar,
  Avatar,
  EmptyState,
  SimulatedBadge,
  DataTable,
  Mascot,
  roleMeta,
  navigation,
  screens,
  initials,
  unreadCount,
  type Role,
} from "./kit";

function Header({
  role,
  screen,
  onMenu,
  onRole,
}: {
  role: Role;
  screen: string;
  onMenu: () => void;
  onRole: (role: Role) => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200/70 bg-background/90 px-4 backdrop-blur-xl md:px-7">
      <div className="flex items-center gap-3">
        <button
          className="grid size-10 place-items-center rounded-xl border bg-white md:hidden"
          onClick={onMenu}
        >
          <Menu className="size-5" />
        </button>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">
            {roleMeta[role].label} space
          </p>

          <h1 className="font-display text-xl font-semibold leading-tight tracking-tight text-[#0D1625]">
            {screen}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {(role === "parent" || role === "child") && (
          <button
            onClick={() =>
              onRole(role === "parent" ? "child" : "parent")
            }
            className="hidden rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-[#0D1625] outline-none sm:block"
          >
            {role === "parent" ? "Switch to child view" : "Back to parent"}
          </button>
        )}

        <button className="relative grid size-10 place-items-center rounded-xl border border-border bg-white text-slate-500 hover:text-blue-600">
          <Bell className="size-4" />

          {unreadCount.n > 0 && (
            <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>

        <Avatar
          text={initials(roleMeta[role].name)}
          className="hidden sm:grid"
        />
      </div>
    </header>
  );
}

function Sidebar({
  role,
  active,
  open,
  navigate,
  close,
  logout,
}: {
  role: Role;
  active: string;
  open: boolean;
  navigate: (id: string) => void;
  close: () => void;
  logout: () => void;
}) {
  return (
    <>
      {open && (
        <button
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={close}
          aria-label="Close menu"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col overflow-hidden bg-[#0B1728] text-white transition-transform duration-200 md:static md:z-0 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-white/[0.07] px-4">
          <button
            onClick={() => navigate("home")}
            className="flex items-center gap-2.5"
          >
            <img
              src="logo.png"
              alt="PATCHY logo"
              className="h-10 w-10 object-contain"
            />

            <div className="text-left">
              <span className="block text-[17px] font-semibold tracking-wide">
                PATCHY
              </span>
              <span className="block text-[9px] tracking-wider text-slate-400">
                VISION CARE
              </span>
            </div>
          </button>

          <button
            className="md:hidden"
            onClick={close}
            aria-label="Close menu"
          >
            <X className="size-4 text-slate-400" />
          </button>
        </div>

        {/* User */}
        <div className="shrink-0 px-3 pt-4">
          <div className="flex items-center gap-2.5 rounded-lg bg-white/[0.04] px-2.5 py-2">
            <Avatar
              text={initials(roleMeta[role].name)}
              className="size-8 bg-white/10 text-white"
            />

            <div className="min-w-0">
              <p className="truncate text-[11px] font-medium text-white">
                {roleMeta[role].name}
              </p>
              <p className="truncate text-[10px] text-slate-400">
                {roleMeta[role].caption}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="min-h-0 flex-1 overflow-y-auto px-2.5 py-4 [scrollbar-width:thin] [scrollbar-color:#334155_transparent]">
          <p className="mb-2 px-2 text-[9px] font-medium uppercase tracking-[0.16em] text-slate-500">
            Workspace
          </p>

          <nav className="space-y-0.5">
            {navigation[role].map((item) => {
              const Icon = item.icon;

              const selected =
                active === item.id ||
                (active.includes("detail") &&
                  [
                    "children",
                    "plans",
                    "sessions",
                    "accounts",
                    "games",
                    "ai-services",
                    "support",
                  ].includes(item.id));

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.id);
                    close();
                  }}
                  className={cn(
                    "group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[11px] transition-colors",
                    selected
                      ? "bg-blue-600/90 text-white"
                      : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-[15px] shrink-0",
                      selected
                        ? "text-white"
                        : "text-slate-500 group-hover:text-blue-300"
                    )}
                  />

                  <span className="min-w-0 flex-1 truncate">
                    {item.label}
                  </span>

                  {item.id === "notifications" &&
                    unreadCount.n > 0 && (
                      <span className="rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] text-white">
                        {unreadCount.n}
                      </span>
                    )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sign out */}
        <div className="shrink-0 border-t border-white/[0.07] p-2.5">
          <button
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            <LogOut className="size-[15px]" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

function CompanionScreen() {
  const [messages, setMessages] = useState([
    "Hi Lina! I remembered that you love space stories. Want one after your quest?",
  ]);
  const [listening, setListening] = useState(false);

  return (
    <div className="-m-4 min-h-[calc(100vh-76px)] bg-[radial-gradient(circle_at_20%_10%,#d7f5ff,transparent_30%),radial-gradient(circle_at_80%_30%,#eadcff,transparent_35%),#faf8ff] p-4 md:-m-7 md:p-7">
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[.8fr_1.2fr]">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-b from-violet-500 to-violet-800 p-6 text-center text-white">
          <div className="absolute -right-12 -top-12 size-40 rounded-full bg-white/10" />
          <Badge tone="violet">
            <span className="size-1.5 rounded-full bg-emerald-400" /> Pip is here
          </Badge>
          <div className="mt-4">
            <Mascot />
          </div>
          <h2 className="font-display text-3xl font-semibold">Pip</h2>
          <p className="mt-1 text-xs text-violet-200">
            Your brave little vision buddy
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Button
              className="bg-white text-violet-700"
              onClick={() => setListening(!listening)}
            >
              {listening ? (
                <Volume2 className="size-4 animate-pulse" />
              ) : (
                <Mic className="size-4" />
              )}
              {listening ? "Listening…" : "Talk to Pip"}
            </Button>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="flex min-h-[380px] flex-col p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold">Pip chat</h3>
              <Badge tone="green">Child-safe</Badge>
            </div>

            <div className="mt-5 flex-1 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className="flex gap-3">
                  <Mascot small />
                  <div className="h-fit max-w-lg rounded-2xl rounded-bl-md bg-violet-50 p-4 text-sm leading-6 text-violet-900">
                    {m}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                placeholder="Tell Pip something…"
                className="flex-1 rounded-xl border px-4 text-sm outline-none focus:border-violet-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setMessages([
                      ...messages,
                      "That sounds fun! I’ll remember it for our next adventure.",
                    ]);
                    (e.target as HTMLInputElement).value = "";
                  }
                }}
              />
              <Button
                onClick={() =>
                  setMessages([
                    ...messages,
                    "You are doing an amazing job, Lina!",
                  ])
                }
              >
                <Send className="size-4" />
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {[
              ["Space story", "4 min", Star],
              ["Eye break", "2 min", Eye],
              ["Memory match", "6 min", Gamepad2],
            ].map(([a, b, I]) => {
              const Icon = I as React.ComponentType<{
                className?: string;
              }>;

              return (
                <button
                  key={String(a)}
                  onClick={() => toast.success(`${a} started`)}
                  className="rounded-2xl border border-white bg-white/80 p-4 text-left shadow-lg shadow-violet-100/40"
                >
                  <Icon className="size-5 text-violet-600" />
                  <p className="mt-4 text-xs font-bold">{a}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {b}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function CompanionSettings() {
  const [memory, setMemory] = useState(true);

  return (
    <div className="grid gap-5 xl:grid-cols-[.7fr_1.3fr]">
      <Card className="bg-gradient-to-b from-violet-100 to-white p-5 text-center">
        <Mascot />
        <h2 className="font-display text-2xl font-semibold">Pip</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Lina’s companion · Active
        </p>
        <Button
          className="mt-5"
          variant="secondary"
          onClick={() => toast.success("Mascot gallery opened")}
        >
          Change mascot
        </Button>
      </Card>

      <div className="space-y-5">
        <Card className="p-5">
          <SectionTitle
            eyebrow="Child experience"
            title="Voice & activity controls"
          />

          <div className="space-y-3">
            {[
              ["Voice interaction", "Allow Lina to talk to Pip", true],
              ["Child-safe chat", "Moderated text conversation", true],
              ["Activity suggestions", "Only approved treatment activities", true],
              ["Quiet hours", "8:00 PM – 7:00 AM", true],
            ].map(([a, b, c]) => (
              <label
                key={String(a)}
                className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
              >
                <div>
                  <p className="text-xs font-bold">{a}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {b}
                  </p>
                </div>
                <input type="checkbox" defaultChecked={Boolean(c)} />
              </label>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">Pip's memory</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Remember approved preferences between sessions.
              </p>
            </div>
            <input
              type="checkbox"
              checked={memory}
              onChange={(e) => setMemory(e.target.checked)}
            />
          </div>

          {memory && (
            <div className="mt-5 space-y-2">
              {[
                "Lina loves space stories",
                "Favorite color: purple",
                "Prefers gentle voice reminders",
              ].map((x) => (
                <div
                  key={x}
                  className="flex items-center justify-between rounded-xl bg-violet-50 p-3 text-xs text-violet-900"
                >
                  {x}
                  <button onClick={() => toast.success("Memory removed")}>
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Button
            className="mt-4"
            variant="danger"
            onClick={() => toast.success("Pip's memory cleared")}
          >
            Clear all memory
          </Button>
        </Card>
      </div>
    </div>
  );
}

function ChildHelp() {
  return (
    <div className="-m-4 min-h-[calc(100vh-76px)] bg-gradient-to-b from-rose-50 to-blue-50 p-4 md:-m-7 md:p-7">
      <Card className="mx-auto max-w-4xl p-7 text-center">
        <Heart className="mx-auto size-12 fill-rose-100 text-rose-500" />
        <h2 className="mt-4 font-display text-3xl font-semibold">
          Need some help?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You can always pause and ask a grown-up.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {[
            ["Call my parent", Heart],
            ["My patch feels funny", Eye],
            ["The camera is not working", Camera],
            ["Ask Pip for help", Bot],
          ].map(([a, I]) => {
            const Icon = I as React.ComponentType<{
              className?: string;
            }>;

            return (
              <button
                key={String(a)}
                onClick={() => toast.success(`${a}: help request sent`)}
                className="rounded-2xl border border-slate-100 p-5 text-left text-sm font-bold hover:bg-blue-50"
              >
                <Icon className="mb-3 size-5 text-blue-600" />
                {a}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

import { useCallback, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { api, session } from "./api";
import { NavCtx, useNav, type Me, type Sel, type NavCtxValue } from "./core";
import {
  AddChildCard,
  AdminDashboard,
  AuthScreen,
  ChildDashboard,
  ChildDetail,
  ChildrenScreen,
  DoctorDashboard,
  ParentDashboard,
  PlanDetail,
  PlansScreen,
  SessionDetail,
  SessionsScreen,
} from "./screens-a";
import {
  AIServicesScreen,
  AccountsScreen,
  AssistantScreen,
  AuditScreen,
  ChildHistory,
  ChildProgress,
  GamesScreen,
  GenericDetail,
  MeasurementsScreen,
  MessagesScreen,
  MonitoringScreen,
  NotificationsScreen,
  OCRScreen,
  ProfileScreen,
  ProgressScreen,
  ReportsScreen,
  RewardsScreen,
  ServiceDetail,
  SettingsScreen,
  SupportScreen,
  TodaySession,
} from "./screens-b";

function ParentChildProfile() {
  const [adding, setAdding] = useState(false);
  const { go } = useNav();

  return (
    <div className="space-y-5">
      <ChildDetail role="parent" />

      <div className="flex justify-center">
        <Button
          variant="secondary"
          onClick={() => setAdding(!adding)}
        >
          {adding ? "Close" : "Add another child"}
        </Button>
      </div>

      {adding && (
        <AddChildCard
          onDone={() => {
            setAdding(false);
            go("home");
          }}
        />
      )}
    </div>
  );
}

function MainScreen({
  role,
  screen,
  logout,
  refreshUnread,
}: {
  role: Role;
  screen: string;
  logout: () => void;
  refreshUnread: () => void;
}) {
  const common = (() => {
    if (screen === "notifications")
      return <NotificationsScreen onChanged={refreshUnread} />;

    if (screen === "profile") return <ProfileScreen />;

    if (screen === "settings")
      return <SettingsScreen onLogout={logout} />;

    if (screen === "support")
      return <SupportScreen admin={role === "admin"} />;

    if (screen === "support-detail")
      return <SupportScreen admin={role === "admin"} detail />;

    return null;
  })();

  if (common) return common;

  if (role === "doctor") {
    if (screen === "home") return <DoctorDashboard />;
    if (screen === "children") return <ChildrenScreen />;
    if (screen === "child-detail") return <ChildDetail role="doctor" />;
    if (screen === "plans") return <PlansScreen />;
    if (screen === "plan-detail") return <PlanDetail role="doctor" />;
    if (screen === "sessions") return <SessionsScreen />;
    if (screen === "session-detail") return <SessionDetail />;
    if (screen === "progress") return <ProgressScreen role="doctor" />;
    if (screen === "reports") return <ReportsScreen role="doctor" />;
    if (screen === "vision") return <MeasurementsScreen />;
    if (screen === "monitoring")
      return <MonitoringScreen role="doctor" />;
    if (screen === "ocr") return <OCRScreen />;
    if (screen === "assistant")
      return <AssistantScreen role="doctor" />;
    if (screen === "messages")
      return <MessagesScreen role="doctor" />;
  }

  if (role === "parent") {
    if (screen === "home") return <ParentDashboard />;
    if (screen === "child-profile") return <ParentChildProfile />;
    if (screen === "plans") return <PlanDetail role="parent" />;
    if (screen === "sessions") return <SessionsScreen />;
    if (screen === "session-detail") return <SessionDetail />;

    if (screen === "progress")
      return (
        <>
          <ProgressScreen role="parent" />
          <div className="mt-5">
            <ReportsScreen role="parent" />
          </div>
        </>
      );

    if (screen === "monitoring")
      return <MonitoringScreen role="parent" />;

    if (screen === "ocr") return <OCRScreen />;

    if (screen === "assistant")
      return <AssistantScreen role="parent" />;

    if (screen === "companion-settings")
      return <CompanionSettings />;

    if (screen === "messages")
      return <MessagesScreen role="parent" />;
  }

  if (role === "admin") {
    if (screen === "home") return <AdminDashboard />;
    if (screen === "accounts") return <AccountsScreen />;
    if (screen === "account-detail")
      return <GenericDetail kind="account" />;
    if (screen === "games") return <GamesScreen admin />;
    if (screen === "game-detail")
      return <GenericDetail kind="game" />;
    if (screen === "ai-services") return <AIServicesScreen />;
    if (screen === "service-detail") return <ServiceDetail />;
    if (screen === "ai-audit") return <AuditScreen />;
  }

  if (role === "child") {
    if (screen === "home") return <ChildDashboard />;
    if (screen === "session") return <TodaySession />;
    if (screen === "companion") return <CompanionScreen />;
    if (screen === "games") return <GamesScreen />;
    if (screen === "rewards") return <RewardsScreen />;
    if (screen === "progress") return <ChildProgress />;
    if (screen === "sessions") return <ChildHistory />;
    if (screen === "help") return <ChildHelp />;
  }

  return (
    <EmptyState
      icon={LayoutGrid}
      title="Nothing here yet"
      copy="This area is not available for your account."
      action="Go home"
    />
  );
}

const captions: Record<Role, string> = {
  admin: "Platform administrator",
  doctor: "Ophthalmologist",
  parent: "Parent / guardian",
  child: "Young explorer",
};

export default function App() {
  const [me, setMe] = useState<Me | null>(null);
  const [booting, setBooting] = useState(!!session.token);
  const [role, setRole] = useState<Role>("doctor");
  const [screen, setScreen] = useState("home");
  const [sel, setSel] = useState<Sel>({});
  const [menu, setMenu] = useState(false);
  const [unread, setUnread] = useState(0);

  const parentToken = useRef<string | null>(null);
  unreadCount.n = unread;

  const enter = useCallback(async (user: any, page = "home") => {
    const r = String(user.role).toLowerCase() as Role;

    roleMeta[r].name = user.fullName;
    roleMeta[r].caption = captions[r];

    setMe({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      doctorCode: user.doctorCode,
    });

    setRole(r);
    setScreen(page);

    if (r === "child") {
      setSel({ childId: user.id });
    } else if (r === "parent" || r === "doctor") {
      try {
        const kids = await api.get<any[]>("/children");
        setSel({ childId: kids[0]?.id });
      } catch {
        setSel({});
      }
    } else {
      setSel({});
    }
  }, []);

  const logout = useCallback(() => {
    session.clear();
    parentToken.current = null;
    setMe(null);
    setSel({});
    setScreen("home");
    setUnread(0);
  }, []);

  useEffect(() => {
    if (!session.token) return;

    api
      .get("/auth/me")
      .then((u) => enter(u))
      .catch(() => session.clear())
      .finally(() => setBooting(false));
  }, [enter]);

  useEffect(() => {
    const h = () => {
      setMe(null);
      toast.error("Your session ended. Please sign in again.");
    };

    window.addEventListener("patchy-unauthorized", h);

    return () => window.removeEventListener("patchy-unauthorized", h);
  }, []);

  const refreshUnread = useCallback(() => {
    if (!me || role === "child") return;

    api
      .get<any[]>("/notifications")
      .then((l) => setUnread(l.filter((n) => !n.isRead).length))
      .catch(() => {});
  }, [me, role]);

  useEffect(() => {
    refreshUnread();

    const t = setInterval(refreshUnread, 30000);

    return () => clearInterval(t);
  }, [refreshUnread]);


  const go = useCallback((id: string, p?: Sel) => {
    if (p) setSel((s) => ({ ...s, ...p }));

    if (id !== "__keep__") {
      if (id !== screen) {
        window.history.pushState(
          { patchyScreen: id },
          "",
          window.location.pathname
        );
      }

      setScreen(id);
      setMenu(false);
    }
  }, [screen]);


  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const previousScreen = event.state?.patchyScreen;

      if (previousScreen) {
        setScreen(previousScreen);
      } else {
        setScreen("home");
      }

      setMenu(false);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);


  const switchToChild = useCallback(
    async (childId?: number, target = "session") => {
      try {
        const cid = childId ?? sel.childId;

        if (!cid) return toast.error("Add a child first.");

        const child = await api.get(`/children/${cid}`);
        const r = await api.post("/auth/child-login", {
          code: child.loginCode,
        });

        parentToken.current = session.token;
        session.set(r.token);

        await enter(r.user, target);

        toast.success(`Now in ${child.fullName}'s space`);
      } catch (e) {
        toast.error(
          e instanceof Error ? e.message : "Could not switch"
        );
      }
    },
    [sel.childId, enter]
  );

  const backToParent = useCallback(async () => {
    if (!parentToken.current) return logout();

    session.set(parentToken.current);
    parentToken.current = null;

    const u = await api.get("/auth/me");
    await enter(u);
  }, [enter, logout]);

  const onRole = (next: Role) => {
    if (next === "child") switchToChild(sel.childId, "home");
    else backToParent();
  };

  if (booting)
    return (
      <div className="grid h-screen place-items-center">
        <Loader2 className="size-8 animate-spin text-blue-500" />
      </div>
    );

  if (!me)
    return (
      <>
        <AuthScreen
          onAuth={(token, user) => {
            session.set(token);
            enter(user);
          }}
        />
        <Toaster richColors position="top-right" />
      </>
    );

  const ctx: NavCtxValue = {
    sel,
    go,
    me,
    role,
    switchToChild: (c, t) => switchToChild(c, t),
    refreshMe: () => api.get("/auth/me").then((u) => enter(u, "profile")),
    logout,
  };

  const title = screens[role][screen] || "PATCHY";

  return (
    <NavCtx.Provider value={ctx}>
      <div className="flex h-screen overflow-hidden bg-background font-sans">
        <Sidebar
          role={role}
          active={screen}
          open={menu}
          navigate={(id) => go(id)}
          close={() => setMenu(false)}
          logout={logout}
        />

        <div className="min-w-0 flex-1 overflow-y-auto">
          <Header
            role={role}
            screen={title}
            onMenu={() => setMenu(true)}
            onRole={onRole}
          />

          <main className="mx-auto max-w-[1500px] p-4 md:p-7">
            <motion.div
              key={`${role}-${screen}-${sel.childId ?? ""}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <MainScreen
                role={role}
                screen={screen}
                logout={logout}
                refreshUnread={refreshUnread}
              />
            </motion.div>
          </main>
        </div>

        <Toaster richColors position="top-right" />
      </div>
    </NavCtx.Provider>
  );
}

