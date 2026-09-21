import { initials } from "@/lib/utils";
import type { Candidate } from "@/lib/election";

export function CandidatePhoto({
  candidate,
  className,
}: {
  candidate: Candidate;
  className?: string;
}) {
  return (
    <div className={className ?? "relative h-20 w-14 shrink-0 overflow-hidden rounded-sm bg-navy-3"}>
      {candidate.photo ? (
        <img
          src={candidate.photo}
          alt=""
          width={180}
          height={252}
          loading="lazy"
          decoding="async"
          className="size-full object-cover object-top outline outline-1 -outline-offset-1 outline-ice/15"
        />
      ) : (
        <div className="flex size-full items-center justify-center font-serif text-lg text-gold">
          {initials(candidate.name)}
        </div>
      )}
    </div>
  );
}
