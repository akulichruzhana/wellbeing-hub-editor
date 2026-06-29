import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CATEGORY_META, useAppData, type AppEvent, type Category } from "@/lib/app-data";

interface Props {
  open: boolean;
  eventId: string | null; // null = create
  onClose: () => void;
}

export function EventEditor({ open, eventId, onClose }: Props) {
  const { events, trainers, addEvent, updateEvent } = useAppData();
  const existing = eventId ? events.find((e) => e.id === eventId) : null;

  const [form, setForm] = useState({
    title: "",
    category: "sport" as Category,
    date: new Date().toISOString().slice(0, 10),
    time: "10:00",
    duration: 60,
    location: "",
    trainerId: trainers[0]?.id ?? "",
    description: "",
    capacity: 15,
    tags: "Для всех",
  });

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title,
        category: existing.category,
        date: existing.date,
        time: existing.time,
        duration: existing.duration,
        location: existing.location,
        trainerId: existing.trainerId,
        description: existing.description,
        capacity: existing.capacity,
        tags: existing.tags.join(", "),
      });
    } else if (open) {
      setForm((f) => ({ ...f, title: "", description: "", location: "" }));
    }
  }, [existing, open]);

  if (!open) return null;

  const submit = () => {
    const data = {
      title: form.title,
      category: form.category,
      date: form.date,
      time: form.time,
      duration: Number(form.duration),
      location: form.location,
      trainerId: form.trainerId,
      description: form.description,
      capacity: Number(form.capacity),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    if (existing) {
      updateEvent(existing.id, data as Partial<AppEvent>);
    } else {
      addEvent(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm grid place-items-center p-4">
      <div className="bg-card rounded-3xl shadow-soft-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border flex items-center justify-between p-5 rounded-t-3xl">
          <h2 className="text-xl font-bold">{existing ? "Редактировать мероприятие" : "Создать мероприятие"}</h2>
          <button
            onClick={onClose}
            className="size-9 rounded-xl bg-muted hover:bg-secondary grid place-items-center"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="p-5 grid grid-cols-2 gap-4">
          <Field label="Название" className="col-span-2">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
              placeholder="Утренняя йога"
            />
          </Field>

          <Field label="Категория">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
              className="input"
            >
              {(Object.keys(CATEGORY_META) as Category[]).map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_META[c].label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Ведущий">
            <select
              value={form.trainerId}
              onChange={(e) => setForm({ ...form, trainerId: e.target.value })}
              className="input"
            >
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Дата">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="input"
            />
          </Field>

          <Field label="Время">
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="input"
            />
          </Field>

          <Field label="Длительность (мин)">
            <input
              type="number"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
              className="input"
            />
          </Field>

          <Field label="Лимит участников">
            <input
              type="number"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
              className="input"
            />
          </Field>

          <Field label="Место проведения" className="col-span-2">
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="input"
              placeholder="Зал релаксации, 5 этаж"
            />
          </Field>

          <Field label="Теги (через запятую)" className="col-span-2">
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="input"
              placeholder="Для всех, Семейное"
            />
          </Field>

          <Field label="Описание" className="col-span-2">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input min-h-24 resize-y"
              placeholder="Краткое описание мероприятия..."
            />
          </Field>
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-5 flex justify-end gap-2 rounded-b-3xl">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-muted font-semibold text-sm">
            Отмена
          </button>
          <button
            onClick={submit}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-soft"
          >
            {existing ? "Сохранить" : "Создать мероприятие"}
          </button>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.875rem;
          background: var(--color-muted);
          border: 1px solid var(--color-border);
          font-size: 0.875rem;
          font-family: inherit;
          outline: none;
          transition: box-shadow .15s, border-color .15s;
        }
        .input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 25%, transparent);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
      {children}
    </label>
  );
}
