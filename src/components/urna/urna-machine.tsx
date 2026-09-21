import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CandidatePhoto } from "@/components/candidates/candidate-photo";
import { Button } from "@/components/ui/button";
import {
  URN_STEPS,
  cargoById,
  findByNumber,
  getCandidate,
} from "@/lib/election";
import { cn } from "@/lib/utils";
import { usePicks } from "@/store/picks";

type StepVote =
  | { kind: "candidate"; id: string }
  | { kind: "blank" }
  | { kind: "null"; digits: string };

export function UrnaMachine() {
  const picks = usePicks((s) => s.picks);
  const [step, setStep] = useState(0);
  const [digits, setDigits] = useState("");
  const [phase, setPhase] = useState<"input" | "review" | "end">("input");
  const [pending, setPending] = useState<StepVote | null>(null);
  const [votes, setVotes] = useState<StepVote[]>([]);

  const current = URN_STEPS[step];
  const meta = current ? cargoById[current.cargo] : cargoById.federal;
  const match = current ? findByNumber(current.cargo, digits) : undefined;
  const full = digits.length === meta.digits;
  const suggestion = current ? picks[current.cargo][current.slot] : undefined;
  const suggested = suggestion ? getCandidate(suggestion) : undefined;
  const keypad = useMemo(() => ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], []);

  function press(n: string) {
    if (phase !== "input" || !current) return;
    setDigits((d) => (d.length >= meta.digits ? d : d + n));
  }

  function corrige() {
    if (phase === "end") return;
    setDigits("");
    setPending(null);
    setPhase("input");
  }

  function advance(vote: StepVote) {
    const nextVotes = [...votes.slice(0, step), vote];
    setVotes(nextVotes);
    const next = step + 1;
    if (next >= URN_STEPS.length) {
      setPhase("end");
      return;
    }
    setStep(next);
    setDigits("");
    setPending(null);
    setPhase("input");
  }

  function branco() {
    if (!current || phase === "end") return;
    setDigits("");
    setPending({ kind: "blank" });
    setPhase("review");
  }

  function confirma() {
    if (!current) return;
    if (phase === "review" && pending) {
      advance(pending);
      return;
    }
    if (phase !== "input") return;
    if (full && match) {
      advance({ kind: "candidate", id: match.id });
      return;
    }
    if (full && !match) {
      setPending({ kind: "null", digits });
      setPhase("review");
    }
  }

  function restart() {
    setStep(0);
    setDigits("");
    setPhase("input");
    setPending(null);
    setVotes([]);
  }

  if (phase === "end") {
    return (
      <div className="mx-auto max-w-md rounded-xl bg-navy-2 p-6 text-center shadow-[var(--shadow-border)]">
        <p className="text-xs uppercase tracking-widest text-gold">Fim</p>
        <h2 className="mt-2 font-serif text-4xl text-ice">Voto registrado</h2>
        <p className="mt-3 text-sm text-mute">
          Simulação apenas. Nada foi enviado à urna oficial. Imprima a colinha
          com as escolhas do painel.
        </p>
        <ol className="mt-6 space-y-2 text-left">
          {URN_STEPS.map((s, i) => {
            const vote = votes[i];
            const cand =
              vote?.kind === "candidate" ? getCandidate(vote.id) : undefined;
            return (
              <li
                key={`${s.cargo}-${s.slot}`}
                className="flex items-center justify-between gap-3 rounded-md bg-navy px-3 py-2 text-sm"
              >
                <span className="text-mute">{s.label}</span>
                <span className="font-mono tabular-nums text-gold">
                  {cand?.number ?? (vote?.kind === "blank" ? "BRANCO" : "NULO")}
                </span>
              </li>
            );
          })}
        </ol>
        <div className="mt-6 flex flex-col gap-2">
          <Button asChild>
            <Link to="/colinha">Abrir colinha</Link>
          </Button>
          <Button variant="secondary" onClick={restart}>
            Simular de novo
          </Button>
        </div>
      </div>
    );
  }

  const reviewBlank = phase === "review" && pending?.kind === "blank";
  const reviewNull = phase === "review" && pending?.kind === "null";

  return (
    <div className="mx-auto grid max-w-3xl gap-6 lg:grid-cols-2">
      <div className="overflow-hidden rounded-xl bg-urn p-4 shadow-[var(--shadow-border)]">
        <div className="rounded-lg bg-lcd p-4 text-lcd-ink">
          <p className="text-xs font-semibold uppercase tracking-widest">
            {current?.label}
          </p>
          <div className="mt-3 flex gap-1.5">
            {Array.from({ length: meta.digits }).map((_, i) => (
              <span
                key={i}
                className="flex h-12 w-9 items-center justify-center border border-lcd-ink bg-lcd-cell font-mono text-2xl tabular-nums"
              >
                {digits[i] ?? ""}
              </span>
            ))}
          </div>
          {reviewBlank ? (
            <p className="mt-6 font-serif text-3xl">VOTO EM BRANCO</p>
          ) : reviewNull ? (
            <p className="mt-6 font-serif text-3xl">NÚMERO ERRADO</p>
          ) : match && full ? (
            <div className="mt-5 flex gap-3">
              <CandidatePhoto
                candidate={match}
                className="relative h-24 w-16 overflow-hidden bg-lcd-photo"
              />
              <div>
                <p className="text-xs uppercase tracking-widest">Nome</p>
                <p className="font-serif text-2xl leading-tight">{match.name}</p>
                <p className="mt-2 text-xs uppercase tracking-widest">Partido</p>
                <p className="text-lg">{match.party}</p>
              </div>
            </div>
          ) : (
            <p className="mt-8 text-sm opacity-70">
              Digite o número com {meta.digits} dígitos.
            </p>
          )}
        </div>
        <p className="mt-3 text-center text-xs uppercase tracking-widest text-mute">
          Simulador · a Justiça Eleitoral não endossa este treino
        </p>
      </div>

      <div>
        <div className="grid grid-cols-3 gap-2">
          {keypad.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => press(n)}
              className={cn(
                "h-14 rounded-md bg-navy-3 font-mono text-xl text-ice shadow-[0_0_0_1px_rgb(232_238_244_/_12%)] transition-[transform,background-color] duration-150 active:scale-[0.98] hover:bg-steel",
                n === "0" && "col-start-2",
              )}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={branco}
            className="h-14 rounded-md bg-ice text-xs font-semibold uppercase tracking-wide text-navy"
          >
            Branco
          </button>
          <button
            type="button"
            onClick={corrige}
            className="h-14 rounded-md bg-danger text-xs font-semibold uppercase tracking-wide text-ice"
          >
            Corrige
          </button>
          <button
            type="button"
            onClick={confirma}
            className="h-14 rounded-md bg-moss text-xs font-semibold uppercase tracking-wide text-navy"
          >
            Confirma
          </button>
        </div>
        {suggested ? (
          <button
            type="button"
            onClick={() => {
              setPhase("input");
              setPending(null);
              setDigits(suggested.number);
            }}
            className="mt-4 w-full rounded-md bg-navy-2 px-3 py-3 text-left text-sm shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]"
          >
            <span className="block text-xs uppercase tracking-widest text-gold">
              Sua escolha neste cargo
            </span>
            <span className="mt-1 block text-ice">
              {suggested.name} · {suggested.number}
            </span>
          </button>
        ) : (
          <p className="mt-4 text-sm text-mute">
            Marque no painel para puxar o número automaticamente.
          </p>
        )}
      </div>
    </div>
  );
}
