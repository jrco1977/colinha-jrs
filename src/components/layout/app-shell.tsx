import { useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Printer, Share2 } from "lucide-react";
import { toast } from "sonner";
import { JrsMark } from "@/components/brand/jrs-mark";
import { Button } from "@/components/ui/button";
import { cargos } from "@/lib/election";
import { cn } from "@/lib/utils";
import {
  decodePicks,
  encodePicks,
  filledCount,
  requiredCount,
  usePicks,
} from "@/store/picks";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const picks = usePicks((s) => s.picks);
  const replaceAll = usePicks((s) => s.replaceAll);
  const filled = filledCount(picks);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("picks");
    if (!raw) return;
    replaceAll(decodePicks(raw));
  }, [replaceAll]);

  async function share() {
    const url = new URL(window.location.origin + "/colinha");
    const encoded = encodePicks(picks);
    if (encoded) url.searchParams.set("picks", encoded);
    const href = url.toString();
    try {
      await navigator.clipboard.writeText(href);
      toast.success("Link da colinha copiado.");
    } catch {
      toast.message(href);
    }
  }

  return (
    <div className="min-h-dvh bg-navy text-ice">
      <div aria-hidden="true" className="ambient-wash pointer-events-none fixed inset-0 opacity-40" />
      <header className="no-print relative z-30 border-b border-line bg-navy/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <JrsMark className="size-10" />
            <span className="min-w-0">
              <span className="block font-serif text-lg leading-none text-ice">
                Colinha JRS
              </span>
              <span className="mt-1 block truncate text-xs uppercase tracking-widest text-gold">
                Eleições 2026 · Goiás
              </span>
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={share} className="hidden sm:inline-flex">
              <Share2 className="size-4" />
              Compartilhar
            </Button>
            <Button asChild size="sm">
              <Link to="/colinha">
                <Printer className="size-4" />
                Colinha
                <span className="tabular-nums text-navy/70">
                  {filled}/{requiredCount()}
                </span>
              </Link>
            </Button>
          </div>
        </div>
        <nav className="mx-auto max-w-6xl overflow-x-auto px-2 pb-2">
          <ul className="flex min-w-max gap-1">
            <li>
              <NavLink to="/" active={pathname === "/"}>
                Painel
              </NavLink>
            </li>
            {cargos.map((c) => (
              <li key={c.id}>
                <Link
                  to="/cargo/$cargo"
                  params={{ cargo: c.id }}
                  className={cn(
                    "inline-flex h-10 items-center rounded-md px-3 text-xs uppercase tracking-widest transition-colors duration-150",
                    pathname === `/cargo/${c.id}`
                      ? "bg-navy-3 text-gold"
                      : "text-mute hover:bg-navy-3 hover:text-ice",
                  )}
                >
                  {c.short}
                </Link>
              </li>
            ))}
            <li>
              <NavLink to="/colinha" active={pathname === "/colinha"}>
                Colinha
              </NavLink>
            </li>
            <li>
              <NavLink to="/urna" active={pathname === "/urna"}>
                Urna
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <div className="relative mx-auto max-w-6xl px-4 py-6 md:py-8">{children}</div>
      <footer className="no-print relative border-t border-line px-4 py-8 text-center">
        <p className="font-serif text-lg text-ice">
          JRS Soluções e Consultoria e Gestão Empresarial
        </p>
        <p className="mt-1 text-xs uppercase tracking-widest text-mute">
          Goiânia · GO · serviço interno de apoio ao voto
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-mute">
          Levantamento de 21/09/2026 a partir do TSE. Situações podem mudar.
          Confira no DivulgaCandContas antes de votar. O celular não entra na
          cabine — imprima a colinha.
        </p>
      </footer>
    </div>
  );
}

function NavLink({
  to,
  active,
  children,
}: {
  to: "/" | "/colinha" | "/urna";
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex h-10 items-center rounded-md px-3 text-xs uppercase tracking-widest transition-colors duration-150",
        active ? "bg-navy-3 text-gold" : "text-mute hover:bg-navy-3 hover:text-ice",
      )}
    >
      {children}
    </Link>
  );
}
