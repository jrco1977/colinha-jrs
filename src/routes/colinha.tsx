import { createFileRoute } from "@tanstack/react-router";
import { Printer, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ColinhaSheet } from "@/components/colinha/colinha-sheet";
import { Button } from "@/components/ui/button";
import { encodePicks, filledCount, requiredCount, usePicks } from "@/store/picks";

export const Route = createFileRoute("/colinha")({ component: ColinhaPage });

function ColinhaPage() {
  const picks = usePicks((s) => s.picks);
  const clearAll = usePicks((s) => s.clearAll);
  const filled = filledCount(picks);

  async function share() {
    const url = new URL(window.location.href);
    const encoded = encodePicks(picks);
    if (encoded) url.searchParams.set("picks", encoded);
    else url.searchParams.delete("picks");
    try {
      await navigator.clipboard.writeText(url.toString());
      toast.success("Link copiado. Quem abrir vê as mesmas escolhas.");
    } catch {
      toast.message("Não foi possível copiar. Selecione o endereço do navegador.");
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div className="no-print flex flex-wrap items-center gap-2">
        <div className="mr-auto">
          <h1 className="font-serif text-4xl text-ice">Colinha</h1>
          <p className="mt-1 text-sm text-mute">
            {filled}/{requiredCount()} cargos preenchidos. Imprima em papel — o
            celular não entra na cabine.
          </p>
        </div>
        <Button onClick={() => window.print()}>
          <Printer className="size-4" />
          Imprimir
        </Button>
        <Button variant="secondary" onClick={share}>
          <Share2 className="size-4" />
          Copiar link
        </Button>
        <Button variant="ghost" onClick={clearAll}>
          <Trash2 className="size-4" />
          Limpar
        </Button>
      </div>
      <ColinhaSheet />
    </div>
  );
}
