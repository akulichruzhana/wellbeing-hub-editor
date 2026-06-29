import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Star, Pencil, Trash2, X } from "lucide-react";
import { useAppData, type Trainer } from "@/lib/app-data";

export const Route = createFileRoute("/trainers")({
  head: () => ({
    meta: [
      { title: "Тренеры и ведущие — БелВЭБ.Благополучие" },
      { name: "description", content: "База ведущих well-being мероприятий: специализация, квалификация и рейтинг." },
    ],
  }),
  component: TrainersPage,
});

function TrainersPage() {
  const { trainers, addTrainer, updateTrainer, deleteTrainer, events } = useAppData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Trainer | null>(null);

  return (
    <div className="flex flex-col gap-6 max-w-7xl">
      <section className="card-soft p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Тренеры и ведущие</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl">
            База внешних специалистов и информация о них для участников и HR-департамента.
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setOpen(true); }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-soft"
        >
          <Plus className="size-4" /> Добавить тренера
        </button>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {trainers.map((t) => {
          const upcoming = events.filter((e) => e.trainerId === t.id).length;
          return (
            <article key={t.id} className="card-soft p-6 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div
                  className="size-16 rounded-2xl grid place-items-center text-xl font-extrabold shrink-0"
                  style={{ background: `oklch(0.9 0.05 ${t.avatarHue})` }}
                >
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold leading-tight">{t.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{t.specialization}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="inline-flex items-center gap-1">
                      <Star className="size-3.5 fill-peach text-peach-foreground" />
                      {t.rating > 0 ? t.rating.toFixed(1) : "—"}
                    </span>
                    <span className="text-muted-foreground">Опыт: {t.experience}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">{t.bio}</p>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">{upcoming} мероприятий</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditing(t); setOpen(true); }}
                    className="size-9 rounded-xl bg-muted hover:bg-secondary grid place-items-center"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    onClick={() => confirm(`Удалить ${t.name}?`) && deleteTrainer(t.id)}
                    className="size-9 rounded-xl bg-muted hover:bg-destructive/15 grid place-items-center"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {open && (
        <TrainerEditor
          trainer={editing}
          onClose={() => setOpen(false)}
          onSave={(data) => {
            if (editing) updateTrainer(editing.id, data);
            else addTrainer(data);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

function TrainerEditor({
  trainer, onClose, onSave,
}: {
  trainer: Trainer | null;
  onClose: () => void;
  onSave: (data: Omit<Trainer, "id" | "rating" | "avatarHue">) => void;
}) {
  const [form, setForm] = useState({
    name: trainer?.name ?? "",
    specialization: trainer?.specialization ?? "",
    experience: trainer?.experience ?? "",
    bio: trainer?.bio ?? "",
  });

  return (
    <div className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm grid place-items-center p-4">
      <div className="bg-card rounded-3xl shadow-soft-lg w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-bold">{trainer ? "Редактировать тренера" : "Добавить тренера"}</h2>
          <button onClick={onClose} className="size-9 rounded-xl bg-muted grid place-items-center">
            <X className="size-4" />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-3">
          <FieldInput label="ФИО" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <FieldInput label="Специализация" value={form.specialization} onChange={(v) => setForm({ ...form, specialization: v })} />
          <FieldInput label="Опыт работы" value={form.experience} onChange={(v) => setForm({ ...form, experience: v })} />
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Биография</span>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-muted border border-border text-sm outline-none focus:border-primary min-h-24"
            />
          </label>
        </div>
        <div className="p-5 border-t border-border flex justify-end gap-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-muted font-semibold text-sm">
            Отмена
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-soft"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-2xl bg-muted border border-border text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
