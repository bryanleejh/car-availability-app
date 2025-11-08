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

type CalEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resourceId?: string;
};

export default function CalendarView() {
  const [view, setView] = useState<(typeof Views)[keyof typeof Views]>(
    Views.WEEK
  );
  const [date, setDate] = useState(new Date());

  const cars = useStore((s) => s.cars);
  const bookings = useStore((s) => s.bookings);

  const carName = (id: string) =>
    cars.find((c) => c.id === id)?.name ?? "Unknown";

  const events: CalEvent[] = bookings.map((b) => ({
    title: `${carName(b.carId)} — Booked`,
    start: new Date(b.start),
    end: new Date(b.end),
    resourceId: b.carId,
    allDay: false,
  }));

  const resources = cars.map((c) => ({
    resourceId: c.id,
    resourceTitle: c.name,
  }));
  const usingResources = view !== Views.MONTH && resources.length > 0;

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
        resources={usingResources ? resources : undefined}
        resourceIdAccessor="resourceId"
        resourceTitleAccessor="resourceTitle"
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        eventPropGetter={(_event: CalEvent) => {
          return {
            style: {
              backgroundColor: "#ef4444",
              border: "none",
              color: "white",
            },
          };
        }}
      />
      {!usingResources && view !== Views.MONTH && cars.length === 0 && (
        <p className="text-sm text-gray-500 mt-2">
          Add a car to see lanes in Week/Day view.
        </p>
      )}
    </div>
  );
}
