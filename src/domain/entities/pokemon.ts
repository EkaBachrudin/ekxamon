export interface EvolutionStage {
  species: string;
  imageUrl: string;
  types: string[];
  minLevel?: number;
}

export interface Pokemon {
  id: number;
  name: string;
  url: string;
  imageUrl?: string;
  types?: string[];
  description?: string;
  weight: number;
  height: number;
  abilities: string[];
  species?: string;
  genderRate: number;
  weaknesses?: string[];
  evolutionChain?: EvolutionStage[];
}
export interface PokemonList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}
