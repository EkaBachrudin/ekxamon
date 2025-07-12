export interface Pokemon {
  id: number;
  name: string;
  url: string;
  imageUrl?: string;
  types?: string[];
}

export interface PokemonList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}
