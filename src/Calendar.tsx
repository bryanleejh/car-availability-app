import { useState } from "react";
import { Calendar as RBC, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { useStore } from "./store";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Keep our own event shape (we stubbed types)
type CalEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resourceId?: string;
  status: "available" | "booked";
};

export default function CalendarView() {
  const [view, setView] = useState<(typeof Views)[keyof typeof Views]>(
    Views.WEEK
  );
  const [date, setDate] = useState(new Date());

  const cars = useStore((s) => s.cars);
  const slots = useStore((s) => s.slots);

  const events: CalEvent[] = slots.map((s) => ({
    title: s.note ?? (s.status === "available" ? "Available" : "Booked"),
    start: new Date(s.start),
    end: new Date(s.end),
    resourceId: s.carId,
    status: s.status,
    allDay: false,
  }));

  const resources = cars.map((c) => ({
    resourceId: c.id,
    resourceTitle: c.name,
  }));

  return (
    <div style={{ height: 600 }}>
      <RBC
        localizer={localizer}
        events={events}
        view={view}
        onView={(v: (typeof Views)[keyof typeof Views]) => setView(v)}
        date={date}
        onNavigate={(d: Date) => setDate(d)}
        views={[Views.DAY, Views.WEEK, Views.MONTH]}
        toolbar
        step={30}
        timeslots={2}
        resources={view === Views.MONTH ? undefined : resources}
        resourceIdAccessor="resourceId"
        resourceTitleAccessor="resourceTitle"
        eventPropGetter={(event: CalEvent) => {
          const backgroundColor =
            event.status === "available" ? "#22c55e" : "#ef4444";
          return { style: { backgroundColor, border: "none", color: "white" } };
        }}
      />
    </div>
  );
}
