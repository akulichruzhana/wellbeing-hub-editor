import { Calendar, Clock, MapPin, Users, Star, Pencil, Trash2 } from "lucide-react";
import { CATEGORY_META, formatDate, useAppData, type AppEvent } from "@/lib/app-data";

interface Props {
  event: AppEvent;
  onBook?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  bookingStatus?: "confirmed" | "waiting";
}

export function EventCard({ event, onBook, onEdit, onDelete, bookingStatus }: Props) {
  const { trainers } = useAppData();
  const trainer = trainers.find((t) => t.id === event.trainerId);
  const cat = CATEGORY_META[event.category];
  const free = Math.max(0, event.capacity - event.registered);
  const isFull = free === 0;

  return (
    <article className="card-soft p-5 flex flex-col gap-4 hover:shadow-soft-lg transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cat.tokenBg}`}>
            <span className={`size-1.5 rounded-full ${cat.dot}`} />
            {cat.label}
          </span>
          {event.tags.map((t) => (
            <span key={t} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
        {event.rating > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Star className="size-3.5 fill-peach text-peach-foreground" />
            {event.rating.toFixed(1)}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-bold leading-tight">{event.title}</h3>
        <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{event.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="size-4" strokeWidth={1.75} />
          {formatDate(event.date)}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="size-4" strokeWidth={1.75} />
          {event.time} · {event.duration} мин
        </div>
        <div className="flex items-center gap-2 text-muted-foreground col-span-2">
          <MapPin className="size-4" strokeWidth={1.75} />
          {event.location}
        </div>
      </div>

      {trainer && (
        <div className="flex items-center gap-2.5 pt-3 border-t border-border">
          <div
            className="size-8 rounded-full grid place-items-center text-xs font-bold"
            style={{ background: `oklch(0.9 0.05 ${trainer.avatarHue})` }}
          >
            {trainer.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="text-xs">
            <div className="font-semibold">{trainer.name}</div>
            <div className="text-muted-foreground">{trainer.specialization}</div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5 text-sm">
          <Users className="size-4 text-muted-foreground" strokeWidth={1.75} />
          <span className="font-semibold">{event.registered}</span>
          <span className="text-muted-foreground">/ {event.capacity}</span>
          {event.waitlist > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-status-waiting/40 text-foreground/80 ml-1">
              лист ожидания · {event.waitlist}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(event.id)}
              className="size-9 rounded-xl bg-muted hover:bg-secondary grid place-items-center transition-colors"
              aria-label="Редактировать"
            >
              <Pencil className="size-4" strokeWidth={1.75} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(event.id)}
              className="size-9 rounded-xl bg-muted hover:bg-destructive/15 grid place-items-center transition-colors"
              aria-label="Удалить"
            >
              <Trash2 className="size-4" strokeWidth={1.75} />
            </button>
          )}
          {onBook && !bookingStatus && (
            <button
              onClick={() => onBook(event.id)}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-soft hover:shadow-soft-lg transition-shadow"
            >
              {isFull ? "В лист ожидания" : "Записаться"}
            </button>
          )}
          {bookingStatus && (
            <span
              className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                bookingStatus === "confirmed"
                  ? "bg-mint text-mint-foreground"
                  : "bg-status-waiting/50 text-foreground/80"
              }`}
            >
              {bookingStatus === "confirmed" ? "Вы записаны" : "В листе ожидания"}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
