import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, TrendingUp, Users, Star, CalendarCheck } from "lucide-react";
import { CATEGORY_META, useAppData, type Category } from "@/lib/app-data";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Аналитика и отчёты — БелВЭБ.Благополучие" },
      { name: "description", content: "Дашборд по well-being мероприятиям: посещаемость, заполняемость, рейтинги, топ-10 событий." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { events } = useAppData();
  const [period, setPeriod] = useState<"week" | "month" | "quarter">("month");
  const [cat, setCat] = useState<Category | "all">("all");

  const filtered = useMemo(
    () => events.filter((e) => (cat === "all" ? true : e.category === cat)),
    [events, cat]
  );

  const totalEvents = filtered.length;
  const totalVisits = filtered.reduce((s, e) => s + e.registered, 0);
  const avgFill = filtered.length
    ? Math.round((filtered.reduce((s, e) => s + e.registered / e.capacity, 0) / filtered.length) * 100)
    : 0;
  const avgRating = filtered.length
    ? (filtered.reduce((s, e) => s + e.rating, 0) / filtered.length).toFixed(1)
    : "—";

  const top10 = [...filtered].sort((a, b) => b.registered - a.registered).slice(0, 10);

  const byCat = (Object.keys(CATEGORY_META) as Category[]).map((c) => ({
    cat: c,
    label: CATEGORY_META[c].label,
    dot: CATEGORY_META[c].dot,
    count: events.filter((e) => e.category === c).reduce((s, e) => s + e.registered, 0),
  }));
  const maxCat = Math.max(1, ...byCat.map((b) => b.count));

  return (
    <div className="flex flex-col gap-6 max-w-7xl">
      <section className="card-soft p-6 md:p-8 gradient-cream-lavender flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Аналитика well-being программы</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl">
            Сводные показатели, рейтинги и эффективность мероприятий для принятия управленческих решений.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-card border border-border font-semibold shadow-soft">
          <Download className="size-4" /> Сформировать отчёт
        </button>
      </section>

      <section className="flex flex-wrap gap-3">
        <div className="flex gap-2">
          {(["week", "month", "quarter"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={[
                "px-4 py-2 rounded-2xl text-sm font-semibold border",
                period === p ? "bg-foreground text-background border-foreground" : "bg-card border-border",
              ].join(" ")}
            >
              {p === "week" ? "Неделя" : p === "month" ? "Месяц" : "Квартал"}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <Chip active={cat === "all"} onClick={() => setCat("all")} label="Все категории" />
          {(Object.keys(CATEGORY_META) as Category[]).map((c) => (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)} label={CATEGORY_META[c].label} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI icon={CalendarCheck} label="Мероприятий" value={totalEvents} tint="lavender" />
        <KPI icon={Users} label="Человеко-посещений" value={totalVisits} tint="mint" />
        <KPI icon={TrendingUp} label="Средняя заполняемость" value={`${avgFill}%`} tint="peach" />
        <KPI icon={Star} label="Средняя оценка" value={avgRating} tint="lavender" />
      </section>

      <section className="grid lg:grid-cols-2 gap-5">
        <div className="card-soft p-6">
          <h3 className="font-bold mb-4">Посещения по категориям</h3>
          <div className="space-y-4">
            {byCat.map((b) => (
              <div key={b.cat}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="inline-flex items-center gap-2">
                    <span className={`size-2 rounded-full ${b.dot}`} />
                    <span className="font-semibold">{b.label}</span>
                  </span>
                  <span className="text-muted-foreground">{b.count}</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(b.count / maxCat) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-soft p-6">
          <h3 className="font-bold mb-4">Топ-10 самых популярных</h3>
          <ol className="space-y-2">
            {top10.map((e, i) => {
              const fill = Math.round((e.registered / e.capacity) * 100);
              return (
                <li key={e.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50">
                  <span className="size-7 rounded-lg bg-muted grid place-items-center text-xs font-bold text-muted-foreground">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{e.title}</div>
                    <div className="text-xs text-muted-foreground">{e.registered} участников · {fill}% заполн.</div>
                  </div>
                  <span className="text-xs font-semibold">⭐ {e.rating.toFixed(1)}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </div>
  );
}

function KPI({
  icon: Icon, label, value, tint,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string | number;
  tint: "lavender" | "mint" | "peach";
}) {
  const bg = tint === "lavender" ? "bg-lavender" : tint === "mint" ? "bg-mint" : "bg-peach";
  return (
    <div className="card-soft p-5">
      <div className={`size-10 rounded-2xl ${bg} grid place-items-center mb-3`}>
        <Icon className="size-5" strokeWidth={1.75} />
      </div>
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={[
        "shrink-0 px-4 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap border",
        active ? "bg-foreground text-background border-foreground" : "bg-card border-border",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
