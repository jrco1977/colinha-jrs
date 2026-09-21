import { Link } from "@tanstack/react-router";
import { ArrowRight, Landmark, Printer, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { JrsMark } from "@/components/brand/jrs-mark";
import { CandidateCard } from "@/components/candidates/candidate-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cargos, candidates, candidatesFor, election } from "@/lib/election";
import { fold } from "@/lib/utils";
import { filledCount, requiredCount, usePicks } from "@/store/picks";

export function Overview() {
  const picks = usePicks((s) => s.picks);
  const filled = filledCount(picks);
  const need = requiredCount();
  const [q, setQ] = useState("");

  const hits = useMemo(() => {
    const needle = fold(q);
    if (needle.length < 2) return [];
    return candidates
      .filter(
        (c) =>
          fold(c.name).includes(needle) ||
          c.number.includes(needle) ||
          fold(c.party).includes(needle),
      )
      .slice(0, 12);
  }, [q]);

  const partyLeaders = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of candidates) counts.set(c.party, (counts.get(c.party) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, []);
  const maxParty = partyLeaders[0]?.[1] ?? 1;
  const dateLabel = election.updatedAt.split("-").reverse().join("/");

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-xl bg-navy-2 p-6 shadow-[var(--shadow-border)] md:p-8">
        <div className="flex items-start gap-4">
          <JrsMark className="size-16 md:size-20" />
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-widest text-gold">
              JRS Soluções e Consultoria e Gestão Empresarial
            </p>
            <h1 className="mt-2 font-serif text-4xl leading-none text-ice md:text-5xl">
              Painel eleitoral 2026
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ice-2">
              {election.candidates.length} candidaturas em Goiás, na ordem da
              urna. Marque, treine na urna e imprima a colinha — para usar de
              qualquer lugar e compartilhar com quem precisar.
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/colinha">
              <Printer className="size-4" />
              Gerar colinha
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/urna">Treinar na urna</Link>
          </Button>
        </div>
        <p className="mt-4 text-xs tabular-nums text-mute">
          Escolhas neste aparelho: {filled} de {need} · atualizado em {dateLabel}
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {cargos.map((c) => {
          const n = candidatesFor(c.id).length;
          const chosen = picks[c.id].length;
          return (
            <Link
              key={c.id}
              to="/cargo/$cargo"
              params={{ cargo: c.id }}
              className="group rounded-lg bg-navy-2 p-4 shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]"
            >
              <p className="text-xs uppercase tracking-widest text-gold">
                {c.digits} dígitos · urna {c.urnOrder}
              </p>
              <h2 className="mt-2 font-serif text-xl text-ice">{c.short}</h2>
              <p className="mt-3 text-sm text-mute">
                <span className="tabular-nums text-ice">{n}</span> concorrendo
              </p>
              <p className="mt-1 text-xs text-mute">
                {chosen}/{c.maxChoices} escolhido{c.maxChoices > 1 ? "s" : ""}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs text-gold">
                Abrir lista
                <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </section>

      <section className="rounded-lg bg-navy-2 p-4 shadow-[var(--shadow-border)] md:p-5">
        <label className="relative block">
          <span className="sr-only">Busca geral</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mute" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar em todos os cargos"
            className="pl-10"
            autoComplete="off"
          />
        </label>
        {q.length >= 2 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {hits.length === 0 ? (
              <p className="text-sm text-mute">Nenhum nome ou número encontrado.</p>
            ) : (
              hits.map((c) => <CandidateCard key={c.id} candidate={c} />)
            )}
          </div>
        ) : null}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-navy-2 p-5 shadow-[var(--shadow-border)]">
          <h2 className="font-serif text-2xl text-ice">Partidos com mais candidaturas</h2>
          <ul className="mt-5 space-y-2.5">
            {partyLeaders.map(([party, n]) => (
              <li key={party} className="grid grid-cols-[7rem_1fr_3rem] items-center gap-3 text-sm">
                <span className="truncate text-ice-2">{party}</span>
                <span className="h-2 overflow-hidden rounded-full bg-navy-3">
                  <span
                    className="block h-full rounded-full bg-gold/80"
                    style={{ width: `${(n / maxParty) * 100}%` }}
                  />
                </span>
                <span className="text-right tabular-nums text-mute">{n}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg bg-navy-2 p-5 shadow-[var(--shadow-border)]">
          <Landmark className="size-5 text-gold" />
          <h2 className="mt-3 font-serif text-2xl text-ice">Como usar</h2>
          <ol className="mt-4 space-y-3 text-sm leading-relaxed text-ice-2">
            <li>1. Abra o cargo, filtre e marque a escolha — senador admite dois números distintos.</li>
            <li>2. Treine a digitação no simulador, na mesma ordem da urna.</li>
            <li>3. Imprima a colinha. Compartilhe o link para outra pessoa montar a dela.</li>
          </ol>
        </div>
      </section>
    </div>
  );
}
