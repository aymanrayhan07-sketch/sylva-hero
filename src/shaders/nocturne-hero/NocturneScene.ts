export const NOCTURNE_VARIANTS = ["midnight"] as const;
export type NocturneVariant = (typeof NOCTURNE_VARIANTS)[number];
export const NOCTURNE_TITLES: Record<string, string> = { midnight: "Nocturne" };
export function buildNocturneDocument(variant: string) {
  return "";
}
