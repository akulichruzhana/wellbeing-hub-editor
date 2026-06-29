import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Save, Upload } from "lucide-react";
import { useAppData } from "@/lib/app-data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Мой профиль — БелВЭБ.Благополучие" },
      { name: "description", content: "Управление личными данными, контактами и настройками профиля." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, updateUser } = useAppData();
  const [form, setForm] = useState(user);
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateUser(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <section className="card-soft p-6 md:p-8 gradient-mint-sky flex items-center gap-5">
        <div className="size-20 rounded-3xl bg-card grid place-items-center text-2xl font-extrabold shadow-soft">
          {user.fullName.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">{user.fullName}</h1>
          <p className="text-sm text-muted-foreground mt-1">{user.position} · {user.department}</p>
        </div>
      </section>

      <section className="card-soft p-6">
        <h3 className="font-bold mb-5">Личные данные</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="ФИО">
            <input className="input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </Field>
          <Field label="Должность">
            <input className="input" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
          </Field>
          <Field label="Email">
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Телефон">
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label="Подразделение" className="sm:col-span-2">
            <input className="input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          </Field>
        </div>

        <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted text-sm font-semibold">
            <Upload className="size-4" /> Загрузить фото
          </button>
          <div className="flex items-center gap-3">
            {saved && <span className="text-sm text-mint-foreground font-semibold">✓ Сохранено</span>}
            <button
              onClick={save}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-soft"
            >
              <Save className="size-4" /> Сохранить изменения
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.875rem;
          background: var(--color-muted);
          border: 1px solid var(--color-border);
          font-size: 0.875rem;
          outline: none;
          font-family: inherit;
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
