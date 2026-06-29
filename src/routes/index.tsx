import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { CATEGORY_META, useAppData, type Category, formatWeekday } from "@/lib/app-data";
import { EventCard } from "@/components/EventCard";
import { EventEditor } from "@/components/EventEditor";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Календарь мероприятий — БелВЭБ.Благополучие" },
      { name: "description", content: "Расписание корпоративных well-being мероприятий Банка БелВЭБ с фильтрами и быстрой записью." },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const { events, bookings, bookEvent, deleteEvent } = useAppData();
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<Category | "all">("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return events
      .filter((e) => (activeCat === "all" ? true : e.category === activeCat))
      .filter((e) => (selectedDate ? e.date === selectedDate : true))
      .filter((e) => (query ? e.title.toLowerCase().includes(query.toLowerCase()) : true))
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }, [events, activeCat, selectedDate, query]);

  // Build next 14 days
  const days = useMemo(() => {
    const arr: { iso: string; day: number; weekday: string; count: number }[] = [];
    const t = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(t);
      d.setDate(t.getDate() + i);
      const iso = d.toISOString().slice(0, 10);
      arr.push({
        iso,
        day: d.getDate(),
        weekday: formatWeekday(iso),
        count: events.filter((e) => e.date === iso).length,
      });
    }
    return arr;
  }, [events]);

  const bookingByEvent = (eid: string) => bookings.find((b) => b.eventId === eid);

  return (
    <div className="flex flex-col gap-6 max-w-7xl">
      {/* Hero */}
      <section className="card-soft p-6 md:p-8 gradient-cream-lavender flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Календарь мероприятий</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl">
            Записывайтесь на йогу, тренинги, семейные события и нейробрейки в несколько кликов.
            Все активности программы well-being — в одном пространстве.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setEditorOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-soft hover:shadow-soft-lg transition-shadow"
        >
          <Plus className="size-4" />
          Создать мероприятие
        </button>
      </section>

      {/* Day strip */}
      <section className="card-soft p-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Ближайшие 14 дней</h2>
          {selectedDate && (
            <button onClick={() => setSelectedDate(null)} className="text-xs font-semibold text-primary">
              Сбросить дату
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {days.map((d) => {
            const active = selectedDate === d.iso;
            return (
              <button
                key={d.iso}
                onClick={() => setSelectedDate(active ? null : d.iso)}
                className={[
                  "shrink-0 w-16 py-3 rounded-2xl text-center transition-all border",
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-soft"
                    : d.count > 0
                      ? "bg-card border-border hover:bg-muted"
                      : "bg-muted/50 border-transparent text-muted-foreground",
                ].join(" ")}
              >
                <div className="text-xs uppercase opacity-70">{d.weekday}</div>
                <div className="text-xl font-bold leading-tight mt-0.5">{d.day}</div>
                <div className="text-[10px] mt-0.5">{d.count > 0 ? `${d.count} меропр.` : "—"}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Filters */}
      <section className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по названию мероприятия..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-card border border-border text-sm outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <CatChip active={activeCat === "all"} onClick={() => setActiveCat("all")} label="Все" />
          {(Object.keys(CATEGORY_META) as Category[]).map((c) => (
            <CatChip
              key={c}
              active={activeCat === c}
              onClick={() => setActiveCat(c)}
              label={CATEGORY_META[c].label}
              dot={CATEGORY_META[c].dot}
            />
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.length === 0 && (
          <div className="col-span-full card-soft p-10 text-center text-muted-foreground">
            <Filter className="size-8 mx-auto mb-3 opacity-50" />
            На выбранные фильтры мероприятий не найдено
          </div>
        )}
        {filtered.map((ev) => (
          <EventCard
            key={ev.id}
            event={ev}
            onBook={(id) => bookEvent(id)}
            onEdit={(id) => {
              setEditingId(id);
              setEditorOpen(true);
            }}
            onDelete={(id) => {
              if (confirm("Отменить и удалить мероприятие? Все участники будут уведомлены.")) deleteEvent(id);
            }}
            bookingStatus={bookingByEvent(ev.id)?.status}
          />
        ))}
      </section>

      <EventEditor open={editorOpen} eventId={editingId} onClose={() => setEditorOpen(false)} />
    </div>
  );
}

function CatChip({
  active,
  onClick,
  label,
  dot,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  dot?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all border",
        active
          ? "bg-foreground text-background border-foreground"
          : "bg-card text-foreground border-border hover:bg-muted",
      ].join(" ")}
    >
      {dot && <span className={`size-2 rounded-full ${dot}`} />}
      {label}
    </button>
  );
}
