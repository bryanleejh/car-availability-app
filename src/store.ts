import { create } from "zustand";

export type Car = { id: string; name: string };
export type Availability = {
  id: string;
  carId: string;
  start: Date;
  end: Date;
  status: "available" | "booked";
  note?: string;
};

type Store = {
  cars: Car[];
  slots: Availability[];
  addCar: (name: string) => void;
  addSlot: (slot: Omit<Availability, "id">) => void;
  removeSlot: (id: string) => void;
};

const uid = () => crypto.randomUUID();

export const useStore = create<Store>((set) => ({
  cars: [],
  slots: [],
  addCar: (name) => set((s) => ({ cars: [...s.cars, { id: uid(), name }] })),
  addSlot: (slot) =>
    set((s) => ({ slots: [...s.slots, { ...slot, id: uid() }] })),
  removeSlot: (id) =>
    set((s) => ({ slots: s.slots.filter((x) => x.id !== id) })),
}));
