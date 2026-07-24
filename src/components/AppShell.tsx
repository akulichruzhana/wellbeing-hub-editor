import { Link, useRouterState } from "@tanstack/react-router";
import {
  CalendarDays,
  BookmarkCheck,
  Users,
  BarChart3,
  UserCircle2,
  Settings2,
  Sparkles,
  Bell,
} from "lucide-react";
import type { ReactNode } from "react";
import { useAppData } from "@/lib/app-data";

const NAV = [
  { to: "/", label: "Календарь", icon: CalendarDays },
  { to: "/my-bookings", label: "Мои записи", icon: BookmarkCheck },
  { to: "/trainers", label: "Тренеры", icon: Users },
  { to: "/analytics", label: "Аналитика", icon: BarChart3 },
  { to: "/profile", label: "Мой профиль", icon: UserCircle2 },
  { to: "/admin", label: "Админ-панель", icon: Settings2 },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { user } = useAppData();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-sidebar border-r border-sidebar-border p-5 gap-1">
        <Link to="/" className="flex items-center gap-2 px-2 py-3 mb-4">
          <div className="size-9 rounded-2xl gradient-cream-lavender grid place-items-center shadow-soft">
            <Sparkles className="size-5 text-lavender-foreground" />
          </div>
          <div>
            <div className="font-bold text-base leading-tight">БелВЭБ</div>
            <div className="text-xs text-muted-foreground leading-tight">Благополучие</div>
          </div>
        </Link>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={[
                  "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-all",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-soft"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60",
                ].join(" ")}
              >
                <Icon className="size-[18px]" strokeWidth={1.75} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto card-soft p-4 gradient-mint-sky">
          <div className="text-xs font-semibold text-foreground/70">Совет дня</div>
          <div className="text-sm mt-1">Сделайте 3 глубоких вдоха — это снизит уровень стресса за 30 секунд.</div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur sticky top-0 z-10 flex items-center justify-between px-5 md:px-8">
          <div className="md:hidden flex items-center gap-2">
            <div className="size-8 rounded-2xl gradient-cream-lavender grid place-items-center">
              <Sparkles className="size-4 text-lavender-foreground" />
            </div>
            <span className="font-bold">БелВЭБ.Благополучие</span>
          </div>
          <div className="hidden md:block text-sm text-muted-foreground">
            Доброе утро, <span className="text-foreground font-semibold">{user.fullName.split(" ")[0]}</span> ✨
          </div>
          <div className="flex items-center gap-3">
            <button className="size-10 rounded-2xl bg-card border border-border grid place-items-center hover:shadow-soft transition-shadow relative">
              <Bell className="size-[18px]" strokeWidth={1.75} />
              <span className="absolute top-2 right-2 size-2 rounded-full bg-peach" />
            </button>
            <div className="flex items-center gap-2.5">
              <div
                className="size-10 rounded-2xl grid place-items-center text-sm font-bold text-foreground"
                style={{ background: `oklch(0.9 0.05 300)` }}
              >
                {user.fullName.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="text-sm font-semibold">{user.fullName}</div>
                <div className="text-xs text-muted-foreground">{user.department}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile nav */}
        <nav className="md:hidden flex overflow-x-auto gap-2 p-3 border-b border-border bg-background">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={[
                  "flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs whitespace-nowrap",
                  active ? "bg-sidebar-accent font-semibold" : "bg-card text-muted-foreground",
                ].join(" ")}
              >
                <Icon className="size-4" strokeWidth={1.75} />
                {label}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
