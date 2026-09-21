import { Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { Candidate } from "@/lib/election";
import { cargoById } from "@/lib/election";
import { cn } from "@/lib/utils";
import { isPicked, usePicks } from "@/store/picks";
import { CandidatePhoto } from "./candidate-photo";

export function CandidateCard({ candidate }: { candidate: Candidate }) {
  const picks = usePicks((s) => s.picks);
  const toggle = usePicks((s) => s.toggle);
  const selected = isPicked(picks, candidate.id, candidate.cargo);
  const pending = candidate.status !== "Deferido";
  const meta = cargoById[candidate.cargo];

  return (
    <article
      className={cn(
        "group flex gap-3 rounded-lg bg-navy-2 p-3 shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]",
        selected
          ? "shadow-[0_0_0_1px_rgb(201_168_76_/_70%)]"
          : "hover:shadow-[var(--shadow-border-hover)]",
      )}
    >
      <CandidatePhoto candidate={candidate} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-sans text-sm font-medium leading-snug text-ice">
            {candidate.name}
          </h3>
          <button
            type="button"
            aria-pressed={selected}
            aria-label={selected ? "Remover escolha" : "Marcar escolha"}
            onClick={() => {
              const res = toggle(candidate.cargo, candidate.id);
              if (!res.ok && res.reason) toast.message(res.reason);
            }}
            className={cn(
              "relative mt-0.5 size-8 shrink-0 rounded-sm after:absolute after:left-1/2 after:top-1/2 after:size-11 after:-translate-x-1/2 after:-translate-y-1/2",
              selected
                ? "bg-gold text-navy"
                : "bg-navy-3 text-mute shadow-[0_0_0_1px_rgb(232_238_244_/_12%)] hover:text-gold",
            )}
          >
            <Check className="mx-auto size-4" strokeWidth={2.4} />
          </button>
        </div>
        <p className="mt-1 font-mono text-2xl font-medium leading-none tracking-wide text-gold tabular-nums">
          {candidate.number}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs uppercase tracking-widest text-mute">
          <span className="text-ice-2">{candidate.party}</span>
          <span aria-hidden="true">·</span>
          <span className={pending ? "text-warn" : "text-moss-2"}>{candidate.status}</span>
          {meta.maxChoices > 1 ? (
            <>
              <span aria-hidden="true">·</span>
              <span>até {meta.maxChoices}</span>
            </>
          ) : null}
        </div>
        {candidate.ficha ? (
          <a
            href={candidate.ficha}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs text-mute transition-colors duration-150 hover:text-gold"
          >
            Abrir ficha
            <ExternalLink className="size-3" />
          </a>
        ) : null}
      </div>
    </article>
  );
}
