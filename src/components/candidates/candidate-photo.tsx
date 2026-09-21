import { useState } from "react";
import { initials } from "@/lib/utils";
import type { Candidate } from "@/lib/election";

export function CandidatePhoto({
  candidate,
  className,
}: {
  candidate: Candidate;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = candidate.photo && !failed ? candidate.photo : null;

  return (
    <div className={className ?? "relative h-20 w-14 shrink-0 overflow-hidden rounded-sm bg-navy-3"}>
      {src ? (
        <img
          src={src}
          alt=""
          width={180}
          height={252}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
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
