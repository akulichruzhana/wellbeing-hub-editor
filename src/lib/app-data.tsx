import { createContext, useContext, useState, type ReactNode } from "react";

export type Category = "sport" | "training" | "family" | "neuro" | "charity";
export type EventStatus = "open" | "full" | "canceled";

export interface AppEvent {
  id: string;
  title: string;
  category: Category;
  date: string; // ISO
  time: string; // "09:30"
  duration: number; // minutes
  location: string;
  trainerId: string;
  description: string;
  capacity: number;
  registered: number;
  waitlist: number;
  tags: string[];
  status: EventStatus;
  rating: number;
}

export interface Trainer {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  bio: string;
  avatarHue: number;
}

export interface Booking {
  id: string;
  eventId: string;
  status: "confirmed" | "waiting";
}

export const CATEGORY_META: Record<
  Category,
  { label: string; tokenBg: string; tokenText: string; dot: string }
> = {
  sport: { label: "Спорт / Фитнес", tokenBg: "bg-cat-sport", tokenText: "text-foreground", dot: "bg-[oklch(0.72_0.12_160)]" },
  training: { label: "Тренинг / Семинар", tokenBg: "bg-cat-training", tokenText: "text-foreground", dot: "bg-[oklch(0.65_0.12_245)]" },
  family: { label: "Семейное", tokenBg: "bg-cat-family", tokenText: "text-foreground", dot: "bg-[oklch(0.72_0.12_50)]" },
  neuro: { label: "Нейробрейк / Мастер-класс", tokenBg: "bg-cat-neuro", tokenText: "text-foreground", dot: "bg-[oklch(0.68_0.14_20)]" },
  charity: { label: "Благотворительность", tokenBg: "bg-cat-charity", tokenText: "text-foreground", dot: "bg-[oklch(0.65_0.12_305)]" },
};

const today = new Date();
const iso = (offset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

const INITIAL_TRAINERS: Trainer[] = [
  { id: "t1", name: "Анна Соколова", specialization: "Йога, медитация", experience: "8 лет", rating: 4.9, bio: "Сертифицированный преподаватель хатха-йоги.", avatarHue: 300 },
  { id: "t2", name: "Игорь Петров", specialization: "Функциональный фитнес", experience: "6 лет", rating: 4.7, bio: "Мастер спорта, тренер по ОФП.", avatarHue: 160 },
  { id: "t3", name: "Мария Климова", specialization: "Психология, нейробрейк", experience: "10 лет", rating: 4.8, bio: "Клинический психолог, КПТ-практик.", avatarHue: 20 },
  { id: "t4", name: "Дмитрий Лавров", specialization: "ART & BUSINESS, коучинг", experience: "12 лет", rating: 4.9, bio: "Бизнес-коуч, фасилитатор стратегических сессий.", avatarHue: 245 },
  { id: "t5", name: "Ольга Жук", specialization: "Арт-терапия, семейные мероприятия", experience: "7 лет", rating: 4.6, bio: "Ведущая семейных мастер-классов.", avatarHue: 50 },
];

const INITIAL_EVENTS: AppEvent[] = [
  { id: "e1", title: "Утренняя йога", category: "sport", date: iso(0), time: "08:00", duration: 60, location: "Зал релаксации, 5 этаж", trainerId: "t1", description: "Мягкая практика для пробуждения тела и ума.", capacity: 20, registered: 14, waitlist: 0, tags: ["Для всех"], status: "open", rating: 4.8 },
  { id: "e2", title: "Нейробрейк: 15 минут тишины", category: "neuro", date: iso(0), time: "13:30", duration: 15, location: "Переговорная Aurora", trainerId: "t3", description: "Короткая практика для снижения когнитивной нагрузки.", capacity: 12, registered: 12, waitlist: 3, tags: ["Для всех"], status: "full", rating: 4.9 },
  { id: "e3", title: "ART & BUSINESS: латеральное мышление", category: "training", date: iso(1), time: "10:00", duration: 120, location: "Лофт «Гранат»", trainerId: "t4", description: "Тренинг по развитию креативных подходов в работе.", capacity: 25, registered: 18, waitlist: 0, tags: ["Для руководителей"], status: "open", rating: 4.7 },
  { id: "e4", title: "День открытых дверей для детей", category: "family", date: iso(3), time: "11:00", duration: 180, location: "Главный офис", trainerId: "t5", description: "Экскурсия и мастер-классы для детей сотрудников.", capacity: 40, registered: 22, waitlist: 0, tags: ["Семейное"], status: "open", rating: 4.9 },
  { id: "e5", title: "Функциональный фитнес", category: "sport", date: iso(2), time: "18:30", duration: 60, location: "Спортзал банка", trainerId: "t2", description: "Силовая и кардио-нагрузка средней интенсивности.", capacity: 16, registered: 9, waitlist: 0, tags: ["Для всех"], status: "open", rating: 4.6 },
  { id: "e6", title: "Психологический тренинг: стресс-менеджмент", category: "training", date: iso(5), time: "15:00", duration: 90, location: "Конференц-зал «Аметист»", trainerId: "t3", description: "Инструменты управления стрессом в рабочей среде.", capacity: 20, registered: 11, waitlist: 0, tags: ["Для всех"], status: "open", rating: 4.8 },
  { id: "e7", title: "Благотворительная ярмарка", category: "charity", date: iso(7), time: "12:00", duration: 240, location: "Атриум", trainerId: "t5", description: "Сбор средств в поддержку детского хосписа.", capacity: 100, registered: 47, waitlist: 0, tags: ["Семейное"], status: "open", rating: 5.0 },
  { id: "e8", title: "Нейрогимнастика", category: "neuro", date: iso(-2), time: "10:30", duration: 30, location: "Зал релаксации, 5 этаж", trainerId: "t3", description: "Упражнения для активации обоих полушарий мозга.", capacity: 15, registered: 15, waitlist: 0, tags: ["Для всех"], status: "open", rating: 4.7 },
];

const INITIAL_BOOKINGS: Booking[] = [
  { id: "b1", eventId: "e1", status: "confirmed" },
  { id: "b2", eventId: "e2", status: "waiting" },
  { id: "b3", eventId: "e3", status: "confirmed" },
  { id: "b4", eventId: "e8", status: "confirmed" },
];

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  notifyEmail: boolean;
  notifyPush: boolean;
}

const INITIAL_USER: UserProfile = {
  fullName: "Раиса Акулич",
  email: "r.akulich@belveb.by",
  phone: "+375 29 123-45-67",
  department: "HR-департамент",
  position: "Стажёр",
  notifyEmail: true,
  notifyPush: true,
};

interface Ctx {
  events: AppEvent[];
  trainers: Trainer[];
  bookings: Booking[];
  user: UserProfile;
  addEvent: (e: Omit<AppEvent, "id" | "registered" | "waitlist" | "status" | "rating">) => void;
  updateEvent: (id: string, patch: Partial<AppEvent>) => void;
  deleteEvent: (id: string) => void;
  bookEvent: (eventId: string) => void;
  cancelBooking: (bookingId: string) => void;
  addTrainer: (t: Omit<Trainer, "id" | "rating" | "avatarHue">) => void;
  updateTrainer: (id: string, patch: Partial<Trainer>) => void;
  deleteTrainer: (id: string) => void;
  updateUser: (patch: Partial<UserProfile>) => void;
}

const AppContext = createContext<Ctx | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<AppEvent[]>(INITIAL_EVENTS);
  const [trainers, setTrainers] = useState<Trainer[]>(INITIAL_TRAINERS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);

  const value: Ctx = {
    events,
    trainers,
    bookings,
    user,
    addEvent: (e) =>
      setEvents((prev) => [
        ...prev,
        { ...e, id: `e${Date.now()}`, registered: 0, waitlist: 0, status: "open", rating: 0 },
      ]),
    updateEvent: (id, patch) =>
      setEvents((prev) => prev.map((ev) => (ev.id === id ? { ...ev, ...patch } : ev))),
    deleteEvent: (id) => {
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
      setBookings((prev) => prev.filter((b) => b.eventId !== id));
    },
    bookEvent: (eventId) => {
      const ev = events.find((e) => e.id === eventId);
      if (!ev) return;
      const isFull = ev.registered >= ev.capacity;
      setBookings((prev) => [
        ...prev,
        { id: `b${Date.now()}`, eventId, status: isFull ? "waiting" : "confirmed" },
      ]);
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? isFull
              ? { ...e, waitlist: e.waitlist + 1 }
              : { ...e, registered: e.registered + 1, status: e.registered + 1 >= e.capacity ? "full" : "open" }
            : e
        )
      );
    },
    cancelBooking: (bookingId) => {
      const b = bookings.find((x) => x.id === bookingId);
      if (!b) return;
      setBookings((prev) => prev.filter((x) => x.id !== bookingId));
      setEvents((prev) =>
        prev.map((e) =>
          e.id === b.eventId
            ? b.status === "confirmed"
              ? { ...e, registered: Math.max(0, e.registered - 1), status: "open" }
              : { ...e, waitlist: Math.max(0, e.waitlist - 1) }
            : e
        )
      );
    },
    addTrainer: (t) =>
      setTrainers((prev) => [
        ...prev,
        { ...t, id: `t${Date.now()}`, rating: 0, avatarHue: Math.floor(Math.random() * 360) },
      ]),
    updateTrainer: (id, patch) =>
      setTrainers((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t))),
    deleteTrainer: (id) => setTrainers((prev) => prev.filter((t) => t.id !== id)),
    updateUser: (patch) => setUser((prev) => ({ ...prev, ...patch })),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}

export function formatWeekday(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", { weekday: "short" });
}
