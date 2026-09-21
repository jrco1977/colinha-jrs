import { useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { CandidateCard } from "@/components/candidates/candidate-card";
import { FiltersBar, type FilterState } from "@/components/candidates/filters-bar";
import { useFiltered } from "@/components/candidates/use-filtered";
import { cargoById, isCargoId } from "@/lib/election";
import { usePicks } from "@/store/picks";

export const Route = createFileRoute("/cargo/$cargo")({
  component: CargoPage,
  loader: ({ params }) => {
    if (!isCargoId(params.cargo)) throw notFound();
    return { cargo: params.cargo };
  },
});

function CargoPage() {
  const { cargo } = Route.useLoaderData();
  const meta = cargoById[cargo];
  const chosen = usePicks((s) => s.picks[cargo].length);
  const [filters, setFilters] = useState<FilterState>({
    q: "",
    party: "",
    status: "",
    onlyPicked: false,
  });
  const list = useFiltered(cargo, filters);

  return (
    <div className="space-y-5">
      <header>
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-gold">
          Urna {meta.urnOrder} · {meta.digits} dígitos
        </p>
        <h1 className="mt-1 font-serif text-4xl text-ice">{meta.label}</h1>
        <p className="mt-2 text-sm text-mute">
          {meta.maxChoices === 2
            ? "Marque até duas candidaturas, com números diferentes."
            : "Uma escolha neste cargo."}{" "}
          {chosen}/{meta.maxChoices} marcada{chosen === 1 ? "" : "s"}.
        </p>
      </header>
      <FiltersBar value={filters} onChange={setFilters} resultCount={list.length} />
      {list.length === 0 ? (
        <p className="py-16 text-center text-sm text-mute">
          Nenhum candidato com esses filtros.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => (
            <CandidateCard key={c.id} candidate={c} />
          ))}
        </div>
      )}
    </div>
  );
}
