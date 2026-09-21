import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { parties } from "@/lib/election";
import { cn } from "@/lib/utils";

export type FilterState = {
  q: string;
  party: string;
  status: string;
  onlyPicked: boolean;
};

export function FiltersBar({
  value,
  onChange,
  resultCount,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
  resultCount: number;
}) {
  const set = (patch: Partial<FilterState>) => onChange({ ...value, ...patch });
  const dirty = value.q || value.party || value.status || value.onlyPicked;

  return (
    <div className="sticky top-0 z-20 -mx-4 border-b border-line bg-navy/92 px-4 py-3 backdrop-blur-md md:-mx-0 md:rounded-lg md:border md:bg-navy-2/90 md:px-4">
      <div className="flex flex-col gap-2.5 md:flex-row md:items-center">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Buscar candidato</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mute" />
          <Input
            value={value.q}
            onChange={(e) => set({ q: e.target.value })}
            placeholder="Nome, número ou partido"
            className="pl-10"
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <select
            value={value.party}
            onChange={(e) => set({ party: e.target.value })}
            className="h-11 min-w-[8.5rem] rounded-md bg-navy-2 px-3 text-sm text-ice shadow-[0_0_0_1px_rgb(232_238_244_/_12%)] focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_rgb(201_168_76_/_55%)]"
            aria-label="Partido"
          >
            <option value="">Todos os partidos</option>
            {parties.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <select
            value={value.status}
            onChange={(e) => set({ status: e.target.value })}
            className="h-11 min-w-[9rem] rounded-md bg-navy-2 px-3 text-sm text-ice shadow-[0_0_0_1px_rgb(232_238_244_/_12%)] focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_rgb(201_168_76_/_55%)]"
            aria-label="Situação"
          >
            <option value="">Todas as situações</option>
            <option value="Deferido">Deferido</option>
            <option value="Aguardando julgamento">Aguardando julgamento</option>
          </select>
          <button
            type="button"
            onClick={() => set({ onlyPicked: !value.onlyPicked })}
            className={cn(
              "h-11 rounded-md px-3 text-sm transition-colors duration-150",
              value.onlyPicked
                ? "bg-gold text-navy"
                : "bg-navy-2 text-ice-2 shadow-[0_0_0_1px_rgb(232_238_244_/_12%)]",
            )}
          >
            Minhas escolhas
          </button>
          {dirty ? (
            <button
              type="button"
              onClick={() =>
                onChange({ q: "", party: "", status: "", onlyPicked: false })
              }
              className="inline-flex h-11 items-center gap-1 rounded-md px-3 text-sm text-mute hover:text-ice"
            >
              <X className="size-4" />
              Limpar
            </button>
          ) : null}
        </div>
      </div>
      <p className="mt-2 text-xs tabular-nums text-mute">
        {resultCount} candidatura{resultCount === 1 ? "" : "s"}
      </p>
    </div>
  );
}
