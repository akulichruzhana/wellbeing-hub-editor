import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, Download, Database, ShieldCheck, Activity } from "lucide-react";
import { CATEGORY_META, formatDate, useAppData } from "@/lib/app-data";
import { EventEditor } from "@/components/EventEditor";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Админ-панель — БелВЭБ.Благополучие" },
      { name: "description", content: "Управление мероприятиями, пользователями, ролями и системными параметрами well-being платформы." },
    ],
  }),
  component: AdminPage,
});

const LOG = [
  { time: "09:42", user: "Е. Иванова", action: "Создала мероприятие «Утренняя йога»" },
  { time: "09:15", user: "Д. Петров", action: "Изменил лимит участников «Нейробрейк»" },
  { time: "Вчера", user: "О. Сидорова", action: "Удалила тренера «А. Тестовый»" },
  { time: "Вчера", user: "Система", action: "Выполнено резервное копирование БД" },
];

const USERS = [
  { name: "Раиса Акулич", role: "Сотрудник", department: "HR" },
  { name: "Елена Иванова", role: "HR-специалист", department: "HR" },
  { name: "Дмитрий Петров", role: "Администратор", department: "IT" },
  { name: "Ольга Сидорова", role: "HR-специалист", department: "HR" },
  { name: "Анна Соколова", role: "Тренер", department: "Внешн." },
];

function AdminPage() {
  const { events, deleteEvent } = useAppData();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tab, setTab] = useState<"events" | "users" | "logs" | "system">("events");

  return (
    <div className="flex flex-col gap-6 max-w-7xl">
      <section className="card-soft p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Административная панель</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl">
            Управление мероприятиями, пользователями, ролями доступа и системными параметрами.
          </p>
        </div>
      </section>

      <div className="flex gap-2 overflow-x-auto">
        {([
          { id: "events", label: "Мероприятия" },
          { id: "users", label: "Пользователи и роли" },
          { id: "logs", label: "Журнал действий" },
          { id: "system", label: "Системные параметры" },
        ] as const).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={[
              "shrink-0 px-4 py-2.5 rounded-2xl text-sm font-semibold border",
              tab === t.id ? "bg-foreground text-background border-foreground" : "bg-card border-border",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "events" && (
        <>
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">{events.length} мероприятий в системе</div>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-sm font-semibold">
                <Download className="size-4" /> Экспорт CSV
              </button>
              <button
                onClick={() => { setEditingId(null); setEditorOpen(true); }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-soft"
              >
                <Plus className="size-4" /> Новое мероприятие
              </button>
            </div>
          </div>
          <section className="card-soft overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                <tr className="text-left">
                  <th className="p-4">Название</th>
                  <th className="p-4">Категория</th>
                  <th className="p-4">Дата</th>
                  <th className="p-4">Заполн.</th>
                  <th className="p-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id} className="border-t border-border hover:bg-muted/40">
                    <td className="p-4 font-semibold">{e.title}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${CATEGORY_META[e.category].tokenBg}`}>
                        <span className={`size-1.5 rounded-full ${CATEGORY_META[e.category].dot}`} />
                        {CATEGORY_META[e.category].label}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{formatDate(e.date)} · {e.time}</td>
                    <td className="p-4">{e.registered}/{e.capacity}</td>
                    <td className="p-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => { setEditingId(e.id); setEditorOpen(true); }}
                          className="size-8 rounded-lg bg-muted grid place-items-center hover:bg-secondary"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          onClick={() => confirm("Удалить мероприятие?") && deleteEvent(e.id)}
                          className="size-8 rounded-lg bg-muted grid place-items-center hover:bg-destructive/15"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}

      {tab === "users" && (
        <section className="card-soft overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr className="text-left">
                <th className="p-4">ФИО</th>
                <th className="p-4">Роль</th>
                <th className="p-4">Подразделение</th>
                <th className="p-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {USERS.map((u) => (
                <tr key={u.name} className="border-t border-border hover:bg-muted/40">
                  <td className="p-4 font-semibold">{u.name}</td>
                  <td className="p-4">
                    <select defaultValue={u.role} className="px-2 py-1 rounded-lg bg-muted text-xs">
                      <option>Сотрудник</option>
                      <option>Тренер</option>
                      <option>HR-специалист</option>
                      <option>Администратор</option>
                    </select>
                  </td>
                  <td className="p-4 text-muted-foreground">{u.department}</td>
                  <td className="p-4 text-right">
                    <button className="size-8 rounded-lg bg-muted grid place-items-center hover:bg-destructive/15 ml-auto">
                      <Trash2 className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {tab === "logs" && (
        <section className="card-soft p-2">
          <ul className="divide-y divide-border">
            {LOG.map((l, i) => (
              <li key={i} className="flex items-center gap-4 p-4">
                <Activity className="size-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm">
                    <span className="font-semibold">{l.user}</span>{" "}
                    <span className="text-muted-foreground">{l.action}</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{l.time}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === "system" && (
        <section className="grid md:grid-cols-2 gap-5">
          <div className="card-soft p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 rounded-2xl bg-mint grid place-items-center">
                <Database className="size-5" />
              </div>
              <div>
                <h3 className="font-bold">Резервное копирование</h3>
                <p className="text-xs text-muted-foreground">Последняя копия: сегодня в 03:00</p>
              </div>
            </div>
            <button className="w-full mt-3 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-soft">
              Запустить резервное копирование
            </button>
          </div>
          <div className="card-soft p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 rounded-2xl bg-lavender grid place-items-center">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <h3 className="font-bold">Безопасность</h3>
                <p className="text-xs text-muted-foreground">HTTPS, разграничение ролей, аудит</p>
              </div>
            </div>
            <div className="flex justify-between text-sm mt-3"><span>Активных сессий</span><span className="font-semibold">12</span></div>
            <div className="flex justify-between text-sm mt-1"><span>Записей в журнале</span><span className="font-semibold">1 248</span></div>
          </div>
        </section>
      )}

      <EventEditor open={editorOpen} eventId={editingId} onClose={() => setEditorOpen(false)} />
    </div>
  );
}
