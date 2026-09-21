import raw from "@/data/candidates.json";

export type CargoId =
  | "federal"
  | "estadual"
  | "senador"
  | "governador"
  | "presidente";

export type Candidate = {
  id: string;
  cargo: CargoId;
  name: string;
  number: string;
  party: string;
  status: string;
  ficha: string;
  photo: string | null;
};

export type CargoMeta = {
  id: CargoId;
  label: string;
  short: string;
  digits: number;
  urnOrder: number;
  maxChoices: number;
};

type Payload = {
  updatedAt: string;
  state: string;
  source: string;
  disclaimer: string;
  cargos: CargoMeta[];
  candidates: Candidate[];
  parties: string[];
};

export const election = raw as Payload;

export const cargos = election.cargos;
export const candidates = election.candidates;
export const parties = election.parties;

export const cargoById: Record<CargoId, CargoMeta> = Object.fromEntries(
  cargos.map((c) => [c.id, c]),
) as Record<CargoId, CargoMeta>;

const byId = new Map(candidates.map((c) => [c.id, c]));
const byCargoNumber = new Map(
  candidates.map((c) => [`${c.cargo}:${c.number}`, c]),
);

export function isCargoId(value: string): value is CargoId {
  return value in cargoById;
}

export function getCandidate(id: string) {
  return byId.get(id);
}

export function findByNumber(cargo: CargoId, number: string) {
  return byCargoNumber.get(`${cargo}:${number}`);
}

export function candidatesFor(cargo: CargoId) {
  return candidates.filter((c) => c.cargo === cargo);
}

export const URN_STEPS: Array<{ cargo: CargoId; slot: number; label: string }> = [
  { cargo: "federal", slot: 0, label: "DEPUTADO FEDERAL" },
  { cargo: "estadual", slot: 0, label: "DEPUTADO ESTADUAL" },
  { cargo: "senador", slot: 0, label: "SENADOR — 1ª vaga" },
  { cargo: "senador", slot: 1, label: "SENADOR — 2ª vaga" },
  { cargo: "governador", slot: 0, label: "GOVERNADOR" },
  { cargo: "presidente", slot: 0, label: "PRESIDENTE" },
];

export const TOTAL_SLOTS = URN_STEPS.length;
