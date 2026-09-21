import { createFileRoute } from "@tanstack/react-router";
import { UrnaMachine } from "@/components/urna/urna-machine";

export const Route = createFileRoute("/urna")({ component: UrnaPage });

function UrnaPage() {
  return (
    <div className="space-y-6">
      <header className="max-w-2xl">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-gold">Simulador</p>
        <h1 className="mt-1 font-serif text-4xl text-ice">Urna de treino</h1>
        <p className="mt-2 text-sm leading-relaxed text-mute">
          Mesma ordem da urna oficial em 2026: federal, estadual, dois senadores,
          governador e presidente. Use os números da sua colinha. Nada é enviado
          a nenhum sistema eleitoral.
        </p>
      </header>
      <UrnaMachine />
    </div>
  );
}
