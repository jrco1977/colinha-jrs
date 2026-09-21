import { Link } from "@tanstack/react-router";
import { JrsMark } from "@/components/brand/jrs-mark";
import { CandidatePhoto } from "@/components/candidates/candidate-photo";
import { Button } from "@/components/ui/button";
import { URN_STEPS, cargoById, getCandidate } from "@/lib/election";
import { usePicks } from "@/store/picks";

export function ColinhaSheet() {
  const picks = usePicks((s) => s.picks);

  return (
    <section className="overflow-hidden rounded-xl bg-paper text-ink shadow-[0_24px_80px_rgb(0_0_0_/_45%)] print:rounded-none print:shadow-none">
      <header className="flex items-center gap-3 border-b border-ink/15 px-5 py-4">
        <JrsMark className="size-12 print:size-10" />
        <div>
          <p className="text-xs uppercase tracking-widest text-steel">
            JRS Soluções · Colinha de votação
          </p>
          <h1 className="font-serif text-2xl leading-none text-navy">
            Eleições 2026 · Goiás
          </h1>
        </div>
        <p className="ml-auto hidden text-right text-xs leading-snug text-steel sm:block">
          Ordem da urna
          <br />
          4 · 5 · 3 · 3 · 2 · 2 dígitos
        </p>
      </header>
      <ol className="divide-y divide-ink/10">
        {URN_STEPS.map((step, index) => {
          const id = picks[step.cargo][step.slot];
          const cand = id ? getCandidate(id) : undefined;
          const meta = cargoById[step.cargo];
          return (
            <li key={`${step.cargo}-${step.slot}`} className="flex items-center gap-3 px-5 py-3.5">
              <span className="w-5 font-mono text-xs tabular-nums text-steel">{index + 1}</span>
              {cand ? (
                <CandidatePhoto
                  candidate={cand}
                  className="relative h-16 w-12 shrink-0 overflow-hidden rounded-sm bg-navy-3"
                />
              ) : (
                <div className="h-16 w-12 shrink-0 rounded-sm bg-navy/10" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-widest text-steel">{step.label}</p>
                {cand ? (
                  <>
                    <p className="truncate font-sans text-sm font-medium text-navy">{cand.name}</p>
                    <p className="text-xs text-steel">{cand.party}</p>
                  </>
                ) : (
                  <p className="text-sm text-steel/70">Sem escolha — preencha no painel</p>
                )}
              </div>
              <p className="font-mono text-3xl font-medium tabular-nums tracking-wide text-navy">
                {cand ? cand.number : "—".repeat(meta.digits)}
              </p>
            </li>
          );
        })}
      </ol>
      <footer className="space-y-2 border-t border-ink/15 px-5 py-4 text-xs leading-relaxed text-steel">
        <p>
          Base TSE de 21/09/2026. Confira a situação no DivulgaCandContas. O
          celular não pode entrar na cabine — leve este papel.
        </p>
        <p>JRS Soluções e Consultoria e Gestão Empresarial · Goiânia/GO</p>
        <div className="no-print pt-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/">Voltar ao painel</Link>
          </Button>
        </div>
      </footer>
    </section>
  );
}
