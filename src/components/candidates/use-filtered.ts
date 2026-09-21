import { useMemo } from "react";
import type { FilterState } from "@/components/candidates/filters-bar";
import { type CargoId, candidatesFor } from "@/lib/election";
import { fold } from "@/lib/utils";
import { usePicks } from "@/store/picks";

export function useFiltered(cargo: CargoId, filters: FilterState) {
  const picks = usePicks((s) => s.picks[cargo]);
  return useMemo(() => {
    const needle = fold(filters.q);
    return candidatesFor(cargo).filter((c) => {
      if (filters.party && c.party !== filters.party) return false;
      if (filters.status && c.status !== filters.status) return false;
      if (filters.onlyPicked && !picks.includes(c.id)) return false;
      if (!needle) return true;
      return (
        fold(c.name).includes(needle) ||
        c.number.includes(needle) ||
        fold(c.party).includes(needle)
      );
    });
  }, [cargo, filters, picks]);
}
