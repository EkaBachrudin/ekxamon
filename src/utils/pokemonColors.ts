/* typesng.ts (atau utils/_types.ts) */
export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

/* Warna standard (hex). Mengambil dari sumber resmi Pokémon Wiki + UI. */
export const TYPE_COLORS: Record<PokemonType, string> = {
  normal:  '#A8A878',
  fire:    '#F08030',
  water:   '#6890F0',
  electric:'#F8D030',
  grass:   '#78C850',
  ice:     '#98D8D8',
  fighting:'#C03028',
  poison:  '#B567CE',
  ground:  '#D97845',
  flying:  '#A890F0',
  psychic: '#F85888',
  bug:     '#A8B820',
  rock:    '#B8A038',
  ghost:   '#705898',
  dragon:  '#7038F8',
  dark:    '#5A5465',
  steel:   '#B8B8D0',
  fairy:   '#EE99AC',
};

export function getColorsFromTypes(
  types?: string[]
): string[] {
  if (!Array.isArray(types)) return [];

  return types.map((t) => {
    const key = t.toLowerCase() as PokemonType;
    return TYPE_COLORS[key] ?? '#777777'; // fallback abu‑abu
  });
}