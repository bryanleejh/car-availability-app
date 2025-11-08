import { useState } from "react";
import CalendarView from "./Calendar";
import { useStore } from "./store";

export default function App() {
  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Car Availability Demo</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <AddCar />
          <AddSlot />
          <SlotList />
        </div>
        <div className="md:col-span-2">
          <CalendarView />
        </div>
      </div>
    </div>
  );
}

function AddCar() {
  const addCar = useStore((s) => s.addCar);
  const [name, setName] = useState("");
  return (
    <div className="border rounded p-3">
      <h2 className="font-medium mb-2">Create Car</h2>
      <div className="flex gap-2">
        <input
          className="border rounded px-2 py-1 w-full"
          value={name}
          placeholder="e.g. Prius #1"
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="border rounded px-3"
          onClick={() => {
            if (name.trim()) {
              addCar(name.trim());
              setName("");
            }
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

function AddSlot() {
  const { cars, addSlot } = useStore();
  const [carId, setCarId] = useState<string>("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [status, setStatus] = useState<"available" | "booked">("available");
  const [note, setNote] = useState("");

  return (
    <div className="border rounded p-3">
      <h2 className="font-medium mb-2">Add Availability/Booking</h2>
      <div className="space-y-2">
        <select
          className="border rounded px-2 py-1 w-full"
          value={carId}
          onChange={(e) => setCarId(e.target.value)}
        >
          <option value="">Select car…</option>
          {cars.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="datetime-local"
            className="border rounded px-2 py-1"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
          <input
            type="datetime-local"
            className="border rounded px-2 py-1"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <select
            className="border rounded px-2 py-1"
            value={status}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e) => setStatus(e.target.value as any)}
          >
            <option value="available">Available</option>
            <option value="booked">Booked</option>
          </select>
          <input
            className="border rounded px-2 py-1"
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <button
          className="border rounded px-3"
          onClick={() => {
            if (!carId || !start || !end) return;
            const s = new Date(start),
              e = new Date(end);
            if (s >= e) return;
            addSlot({
              carId,
              start: s,
              end: e,
              status,
              note: note || undefined,
            });
            setNote("");
            setStart("");
            setEnd("");
          }}
        >
          Add Slot
        </button>
      </div>
    </div>
  );
}

function SlotList() {
  const slots = useStore((s) => s.slots);
  const cars = useStore((s) => s.cars);
  const removeSlot = useStore((s) => s.removeSlot);
  const nameOf = (id: string) =>
    cars.find((c) => c.id === id)?.name ?? "Unknown";
  return (
    <div className="border rounded p-3">
      <h2 className="font-medium mb-2">All Slots</h2>
      <ul className="space-y-2 max-h-64 overflow-auto">
        {slots.map((s) => (
          <li
            key={s.id}
            className="border rounded px-2 py-1 flex items-center justify-between"
          >
            <div>
              <div className="text-sm">
                <span className="font-medium">{nameOf(s.carId)}</span> —{" "}
                {s.status}
              </div>
              <div className="text-xs text-gray-600">
                {s.start.toLocaleString()} → {s.end.toLocaleString()}{" "}
                {s.note ? `· ${s.note}` : ""}
              </div>
            </div>
            <button
              className="text-xs underline"
              onClick={() => removeSlot(s.id)}
            >
              remove
            </button>
          </li>
        ))}
        {slots.length === 0 && (
          <li className="text-sm text-gray-500">No slots yet.</li>
        )}
      </ul>
    </div>
  );
}
