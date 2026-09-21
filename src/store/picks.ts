import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type CargoId,
  cargoById,
  cargos,
  getCandidate,
} from "@/lib/election";

export type Picks = Record<CargoId, string[]>;

const empty = (): Picks => ({
  federal: [],
  estadual: [],
  senador: [],
  governador: [],
  presidente: [],
});

type Store = {
  picks: Picks;
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  toggle: (cargo: CargoId, id: string) => { ok: boolean; reason?: string };
  clearCargo: (cargo: CargoId) => void;
  clearAll: () => void;
  replaceAll: (next: Picks) => void;
};

export const usePicks = create<Store>()(
  persist(
    (set, get) => ({
      picks: empty(),
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      toggle: (cargo, id) => {
        const max = cargoById[cargo].maxChoices;
        const current = get().picks[cargo];
        if (current.includes(id)) {
          set({
            picks: {
              ...get().picks,
              [cargo]: current.filter((x) => x !== id),
            },
          });
          return { ok: true };
        }
        if (max === 1) {
          set({ picks: { ...get().picks, [cargo]: [id] } });
          return { ok: true };
        }
        if (current.length >= max) {
          return {
            ok: false,
            reason: `Este cargo admite ${max} escolhas. Desmarque uma para trocar.`,
          };
        }
        set({ picks: { ...get().picks, [cargo]: [...current, id] } });
        return { ok: true };
      },
      clearCargo: (cargo) =>
        set({ picks: { ...get().picks, [cargo]: [] } }),
      clearAll: () => set({ picks: empty() }),
      replaceAll: (next) => set({ picks: { ...empty(), ...next } }),
    }),
    {
      name: "jrs-colinha-2026",
      partialize: (s) => ({ picks: s.picks }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

export function filledCount(picks: Picks) {
  return cargos.reduce((n, c) => n + Math.min(picks[c.id].length, c.maxChoices), 0);
}

export function requiredCount() {
  return cargos.reduce((n, c) => n + c.maxChoices, 0);
}

export function encodePicks(picks: Picks) {
  const ids = cargos.flatMap((c) => picks[c.id]);
  return ids.join(",");
}

export function decodePicks(raw: string): Picks {
  const next = empty();
  for (const id of raw.split(",").map((s) => s.trim()).filter(Boolean)) {
    const cand = getCandidate(id);
    if (!cand) continue;
    const max = cargoById[cand.cargo].maxChoices;
    if (next[cand.cargo].includes(id)) continue;
    if (next[cand.cargo].length >= max) continue;
    next[cand.cargo].push(id);
  }
  return next;
}

export function isPicked(picks: Picks, id: string, cargo: CargoId) {
  return picks[cargo].includes(id);
}
