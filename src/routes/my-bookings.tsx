import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookmarkCheck, History, BarChart3, Bell, CalendarDays } from "lucide-react";
import { useAppData, formatDate } from "@/lib/app-data";
import { EventCard } from "@/components/EventCard";

export const Route = createFileRoute("/my-bookings")({
  head: () => ({
    meta: [
      { title: "Мои записи — Личный кабинет" },
      { name: "description", content: "Управление записями, история участия и личная статистика по well-being программам." },
    ],
  }),
  component: MyBookingsPage,
});

const TABS = [
  { id: "active", label: "Активные записи", icon: BookmarkCheck },
  { id: "history", label: "История", icon: History },
  { id: "stats", label: "Моя статистика", icon: BarChart3 },
  { id: "notify", label: "Уведомления", icon: Bell },
] as const;

function MyBookingsPage() {
  const { bookings, events, cancelBooking, user, updateUser } = useAppData();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("active");

  const todayIso = new Date().toISOString().slice(0, 10);
  const myEvents = bookings
    .map((b) => ({ booking: b, event: events.find((e) => e.id === b.eventId)! }))
    .filter((x) => x.event);

  const active = myEvents.filter((x) => x.event.date >= todayIso);
  const history = myEvents.filter((x) => x.event.date < todayIso);

  const byCategory = history.reduce<Record<string, number>>((acc, x) => {
    acc[x.event.category] = (acc[x.event.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6 max-w-7xl">
      <section className="card-soft p-6 md:p-8 gradient-mint-sky flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Личный кабинет</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl">
            Управляйте записями, отслеживайте свою активность и настраивайте уведомления.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Активных" value={active.length} />
          <Stat label="Посещено" value={history.length} />
          <Stat label="Категорий" value={Object.keys(byCategory).length} />
        </div>
      </section>

      <div className="flex gap-2 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={[
              "shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all border",
              tab === id
                ? "bg-foreground text-background border-foreground"
                : "bg-card border-border hover:bg-muted",
            ].join(" ")}
          >
            <Icon className="size-4" strokeWidth={1.75} />
            {label}
          </button>
        ))}
      </div>

      {tab === "active" && (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {active.length === 0 && <EmptyState />}
          {active.map(({ booking, event }) => (
            <div key={booking.id} className="flex flex-col gap-2">
              <EventCard event={event} bookingStatus={booking.status} />
              <button
                onClick={() => cancelBooking(booking.id)}
                className="px-4 py-2 rounded-xl bg-muted hover:bg-destructive/15 text-sm font-semibold transition-colors"
              >
                {booking.status === "waiting" ? "Покинуть лист ожидания" : "Отменить запись"}
              </button>
            </div>
          ))}
        </section>
      )}

      {tab === "history" && (
        <section className="card-soft overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/60">
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="p-4">Мероприятие</th>
                <th className="p-4">Дата</th>
                <th className="p-4">Категория</th>
                <th className="p-4 text-right">Оценка</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    История участия пока пуста
                  </td>
                </tr>
              )}
              {history.map(({ booking, event }) => (
                <tr key={booking.id} className="border-t border-border">
                  <td className="p-4 font-semibold">{event.title}</td>
                  <td className="p-4 text-muted-foreground">{formatDate(event.date)} · {event.time}</td>
                  <td className="p-4 text-muted-foreground">{event.category}</td>
                  <td className="p-4 text-right">⭐ {event.rating.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {tab === "stats" && (
        <section className="grid md:grid-cols-2 gap-5">
          <div className="card-soft p-6">
            <h3 className="font-bold mb-4">Распределение по категориям</h3>
            <div className="space-y-3">
              {Object.entries(byCategory).map(([cat, count]) => {
                const pct = (count / Math.max(1, history.length)) * 100;
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold">{cat}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              {Object.keys(byCategory).length === 0 && (
                <p className="text-sm text-muted-foreground">Посетите мероприятия, чтобы увидеть статистику</p>
              )}
            </div>
          </div>
          <div className="card-soft p-6 gradient-cream-lavender">
            <h3 className="font-bold mb-2">Вовлечённость</h3>
            <div className="text-5xl font-extrabold my-3">{history.length + active.length}</div>
            <p className="text-sm text-muted-foreground">мероприятий в вашем профиле well-being</p>
            <Link to="/" className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-xl bg-card text-sm font-semibold shadow-soft">
              <CalendarDays className="size-4" /> Найти новые
            </Link>
          </div>
        </section>
      )}

      {tab === "notify" && (
        <section className="card-soft p-6 max-w-xl">
          <h3 className="font-bold mb-4">Каналы уведомлений</h3>
          <ToggleRow
            label="Email-уведомления"
            sub="Подтверждения, напоминания, изменения в расписании"
            value={user.notifyEmail}
            onChange={(v) => updateUser({ notifyEmail: v })}
          />
          <ToggleRow
            label="Push-уведомления"
            sub="Мгновенные уведомления в браузере"
            value={user.notifyPush}
            onChange={(v) => updateUser({ notifyPush: v })}
          />
        </section>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-card/80 rounded-2xl p-3 text-center min-w-20">
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function ToggleRow({
  label, sub, value, onChange,
}: { label: string; sub: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <div className="font-semibold text-sm">{label}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={[
          "w-12 h-7 rounded-full p-0.5 transition-colors",
          value ? "bg-primary" : "bg-muted",
        ].join(" ")}
      >
        <div
          className={[
            "size-6 rounded-full bg-card shadow transition-transform",
            value ? "translate-x-5" : "translate-x-0",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full card-soft p-10 text-center text-muted-foreground">
      <BookmarkCheck className="size-8 mx-auto mb-3 opacity-50" />
      <p>У вас пока нет активных записей.</p>
      <Link to="/" className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">
        Перейти к календарю
      </Link>
    </div>
  );
}
