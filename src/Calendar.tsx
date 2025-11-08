import { Calendar as RBC, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useStore } from "./store";

// Define the event shape react-big-calendar expects
type CalEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resourceId?: string; // used for resource lanes (cars)
  status: "available" | "booked";
};

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarView() {
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
        defaultView={Views.WEEK}
        views={[Views.DAY, Views.WEEK]}
        step={30}
        timeslots={2}
        resources={resources}
        resourceIdAccessor="resourceId"
        resourceTitleAccessor="resourceTitle"
        eventPropGetter={(event: CalEvent) => {
          const backgroundColor =
            event.status === "available" ? "#22c55e" : "#ef4444"; // green/red
          return { style: { backgroundColor, border: "none", color: "white" } };
        }}
      />
    </div>
  );
}
