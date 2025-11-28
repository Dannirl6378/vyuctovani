import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Billing } from "../types/biling";

interface BillingsState {
  billings: Billing[];

  addBilling: (billing: Billing) => void;
  updateBilling: (id: string, data: Partial<Billing>) => void;
  deleteBilling: (id: string) => void;
  duplicateBilling: (id: string) => void;
}

export const useBillingsStore = create<BillingsState>()(
  persist(
    (set, get) => ({
      billings: [],

      addBilling: (billing) =>
        set((state) => ({
          billings: [...state.billings, billing],
        })),

      updateBilling: (id, data) =>
        set((state) => ({
          billings: state.billings.map((b) =>
            b.id === id ? { ...b, ...data } : b
          ),
        })),

      deleteBilling: (id) =>
        set((state) => ({
          billings: state.billings.filter((b) => b.id !== id),
        })),

      duplicateBilling: (id) =>
        set((state) => {
          const original = state.billings.find((b) => b.id === id);
          if (!original) return state;

          const copy: Billing = {
            ...original,
            id: crypto.randomUUID(), // nový unikátní ID
          };

          return {
            billings: [...state.billings, copy],
          };
        }),
    }),

    {
      name: "billing-app-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
/*
napověda: const billings = useBillingsStore((s) => s.billings); ziskani všech billing
 nápověda: useBillingsStore.getState().addBilling(newBilling); přidani billing
 nápověda: useBillingsStore.getState().updateBilling(id, { heating: { year2025: 9000 } }); update Billing
 nápověda: useBillingsStore.getState().deleteBilling(id); smazani billing
 nápověda: useBillingsStore.getState().duplicateBilling(id); duplikovaní billing





*/