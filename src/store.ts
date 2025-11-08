import { create } from "zustand";

export type Car = { id: string; name: string };
export type Booking = {
  id: string;
  carId: string;
  start: Date;
  end: Date;
};

type Store = {
  cars: Car[];
  bookings: Booking[];
  addCar: (name: string) => void;
  addBooking: (b: Omit<Booking, "id">) => void;
  removeBooking: (id: string) => void;
};

const uid = () => crypto.randomUUID();

export const useStore = create<Store>((set) => ({
  cars: [],
  bookings: [],
  addCar: (name) => set((s) => ({ cars: [...s.cars, { id: uid(), name }] })),
  addBooking: (b) =>
    set((s) => ({ bookings: [...s.bookings, { ...b, id: uid() }] })),
  removeBooking: (id) =>
    set((s) => ({ bookings: s.bookings.filter((x) => x.id !== id) })),
}));
