import { useState } from "react";
import CalendarView from "./Calendar";
import { useStore } from "./store";

export default function App() {
  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Car Bookings Demo</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <AddCar />
          <AddBooking />
          <BookingList />
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

function AddBooking() {
  const { cars, addBooking } = useStore();
  const [carId, setCarId] = useState<string>("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [note, setNote] = useState("");

  return (
    <div className="border rounded p-3">
      <h2 className="font-medium mb-2">Add Booking</h2>
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

        <input
          className="border rounded px-2 py-1 w-full"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button
          className="border rounded px-3"
          onClick={() => {
            if (!carId || !start || !end) return;
            const s = new Date(start),
              e = new Date(end);
            if (s >= e) return;
            addBooking({ carId, start: s, end: e, note: note || undefined });
            setNote("");
            setStart("");
            setEnd("");
          }}
        >
          Add Booking
        </button>
      </div>
    </div>
  );
}

function BookingList() {
  const bookings = useStore((s) => s.bookings);
  const cars = useStore((s) => s.cars);
  const removeBooking = useStore((s) => s.removeBooking);
  const nameOf = (id: string) =>
    cars.find((c) => c.id === id)?.name ?? "Unknown";
  return (
    <div className="border rounded p-3">
      <h2 className="font-medium mb-2">All Bookings</h2>
      <ul className="space-y-2 max-h-64 overflow-auto">
        {bookings.map((b) => (
          <li
            key={b.id}
            className="border rounded px-2 py-1 flex items-center justify-between"
          >
            <div>
              <div className="text-sm">
                <span className="font-medium">{nameOf(b.carId)}</span> — booked
              </div>
              <div className="text-xs text-gray-600">
                {b.start.toLocaleString()} → {b.end.toLocaleString()}{" "}
                {b.note ? `· ${b.note}` : ""}
              </div>
            </div>
            <button
              className="text-xs underline"
              onClick={() => removeBooking(b.id)}
            >
              remove
            </button>
          </li>
        ))}
        {bookings.length === 0 && (
          <li className="text-sm text-gray-500">No bookings yet.</li>
        )}
      </ul>
    </div>
  );
}
