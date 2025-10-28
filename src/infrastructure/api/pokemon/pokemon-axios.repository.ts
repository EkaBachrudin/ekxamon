import { pokemonApiClient } from '../axios/axios-client';
import { PokemonRepository } from '../../../domain/repositories/pokemon.repository';
import { Pokemon, PokemonList, EvolutionStage } from '../../../domain/entities/pokemon';

// Type definitions for API responses
interface PokemonSpeciesResponse {
  gender_rate: number;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: { name: string };
  }>;
  genera: Array<{
    genus: string;
    language: { name: string };
  }>;
  evolution_chain?: {
    url: string;
  };
}

interface PokemonTypeResponse {
  type: { name: string };
}

interface PokemonAbilityResponse {
  ability: { name: string };
}

interface PokemonSprites {
  front_default: string;
}

interface PokemonDetailsResponse {
  id: number;
  name: string;
  sprites: PokemonSprites;
  types: PokemonTypeResponse[];
  abilities: PokemonAbilityResponse[];
  weight: number;
  height: number;
}

interface TypeDetailsResponse {
  damage_relations: {
    double_damage_from: Array<{ name: string }>;
  };
}

interface TypeResponse {
  pokemon: Array<{
    pokemon: { name: string; url: string };
  }>;
}

interface EvolutionChainResponse {
  chain: {
    species: { name: string };
    evolves_to?: Array<{
      species: { name: string };
      evolution_details?: Array<{
        min_level?: number;
      }>;
      evolves_to?: Array<{
        species: { name: string };
        evolution_details?: Array<{
          min_level?: number;
        }>;
      }>;
    }>;
  };
}

interface EvolutionStageNode {
  species: { name: string };
  evolves_to?: EvolutionStageNode[];
  evolution_details?: Array<{
    min_level?: number;
  }>;
}

// Helper function to extract Pokemon ID from URL
function extractPokemonId(url: string): number {
  const parts = url.split('/');
  return parseInt(parts[parts.length - 2], 10);
}

export class PokemonAxiosRepository implements PokemonRepository {
  async getPokemonList(offset = 0, limit = 20): Promise<PokemonList> {
    const response = await pokemonApiClient.get<PokemonList>(
      `/pokemon?offset=${offset}&limit=${limit}`
    );
    
    const pokemonsWithDetails = await Promise.all(
      response.data.results.map(async (pokemon) => {
        const id = extractPokemonId(pokemon.url);
        const detailsResponse = await pokemonApiClient.get<PokemonDetailsResponse>(`/pokemon/${id}`);

        return {
          ...pokemon,
          id,
          imageUrl: detailsResponse.data.sprites.front_default,
          types: detailsResponse.data.types.map((t) => t.type.name)
        };
      })
    );
    
    return {
      ...response.data,
      results: pokemonsWithDetails
    };
  }

  async searchPokemon(query: string, signal?: AbortSignal): Promise<Pokemon[]> {
    const response = await pokemonApiClient.get<PokemonList>(
      `/pokemon?limit=100000`,
      { signal }
    );
    
    const pokemonsWithIds = await Promise.all(
      response.data.results.map(async (pokemon) => {
        const id = extractPokemonId(pokemon.url);
        const detailsResponse = await pokemonApiClient.get<PokemonDetailsResponse>(`/pokemon/${id}`, { signal });

        return {
          ...pokemon,
          id,
          imageUrl: detailsResponse.data.sprites.front_default,
          types: detailsResponse.data.types.map((t) => t.type.name)
        };
      })
    );
    
    const filtered = pokemonsWithIds.filter(pokemon => 
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
    
    return filtered;
  }

  async getPokemonByType(type: string): Promise<Pokemon[]> {
    const response = await pokemonApiClient.get<TypeResponse>(`/type/${type}`);
    const pokemons = response.data.pokemon;

    const pokemonsWithDetails = await Promise.all(
      pokemons.map(async (p) => {
        const id = extractPokemonId(p.pokemon.url);
        const detailsResponse = await pokemonApiClient.get<PokemonDetailsResponse>(`/pokemon/${id}`);
        const speciesResponse = await pokemonApiClient.get<PokemonSpeciesResponse>(`/pokemon-species/${id}`);

        return {
          id,
          name: p.pokemon.name,
          url: p.pokemon.url,
          imageUrl: detailsResponse.data.sprites.front_default,
          types: detailsResponse.data.types.map((t) => t.type.name),
          weight: detailsResponse.data.weight,
          height: detailsResponse.data.height,
          abilities: detailsResponse.data.abilities.map((a) => a.ability.name),
          genderRate: speciesResponse.data.gender_rate
        };
      })
    );

    return pokemonsWithDetails;
  }

  async getPokemonById(id: number): Promise<Pokemon> {
    const pokemonResponse = await pokemonApiClient.get<PokemonDetailsResponse>(`/pokemon/${id}`);
    
    let description: string | undefined;
    let species: string | undefined;
    let genderRate = -1;
    let weaknesses: string[] = [];
    let evolutionChain: EvolutionStage[] = [];
    
    try {
      const speciesResponse = await pokemonApiClient.get<PokemonSpeciesResponse>(`/pokemon-species/${id}/`);
      const speciesData = speciesResponse.data;

      genderRate = speciesData.gender_rate ?? -1;

      const englishEntry = speciesData.flavor_text_entries.find(
        (entry) => entry.language.name === 'en'
      );

      if (englishEntry) {
        description = englishEntry.flavor_text
          .replace(/\f/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      }

      const englishGenus = speciesData.genera.find(
        (genus) => genus.language.name === 'en'
      );
      if (englishGenus) {
        species = englishGenus.genus.replace(' Pokémon', '');
      }
      
      const types = pokemonResponse.data.types.map((t) => t.type.name);
      weaknesses = await this.getTypeWeaknesses(types);
      
      if (speciesData.evolution_chain?.url) {
        evolutionChain = await this.getEvolutionChain(speciesData.evolution_chain.url);
      }
    } catch (error) {
      console.error(`Failed to fetch species or type data for Pokemon ${id}:`, error);
    }
    
    return {
      id: pokemonResponse.data.id,
      name: pokemonResponse.data.name,
      url: `https://pokeapi.co/api/v2/pokemon/${id}/`,
      imageUrl: pokemonResponse.data.sprites.front_default,
      types: pokemonResponse.data.types.map((typeInfo) => typeInfo.type.name),
      description,
      weight: pokemonResponse.data.weight,
      height: pokemonResponse.data.height,
      abilities: pokemonResponse.data.abilities.map((a) => a.ability.name),
      species,
      genderRate,
      weaknesses,
      evolutionChain,
    };
  }

  private async getTypeWeaknesses(types: string[]): Promise<string[]> {
    const weaknesses = new Set<string>();
    
    for (const typeName of types) {
      try {
        const typeResponse = await pokemonApiClient.get<TypeDetailsResponse>(`/type/${typeName}`);
        const damageRelations = typeResponse.data.damage_relations;

        damageRelations.double_damage_from.forEach((type) => {
          weaknesses.add(type.name);
        });
      } catch (error) {
        console.error(`Failed to fetch weaknesses for type ${typeName}:`, error);
      }
    }
    
    return Array.from(weaknesses);
  }
  
  private async getEvolutionChain(chainUrl: string): Promise<EvolutionStage[]> {
    try {
      const response = await pokemonApiClient.get<EvolutionChainResponse>(chainUrl);
      const chainData = response.data.chain;
      const evolutionChain: EvolutionStage[] = [];

      let currentStage: EvolutionStageNode = chainData;
      while (currentStage && currentStage.species) {
        const speciesName = currentStage.species.name;

        const pokemonResponse = await pokemonApiClient.get<PokemonDetailsResponse>(`/pokemon/${speciesName}`);
        const pokemonData = pokemonResponse.data;

        const minLevel = currentStage.evolves_to?.[0]?.evolution_details?.[0]?.min_level;

        evolutionChain.push({
          species: speciesName,
          imageUrl: pokemonData.sprites.front_default,
          types: pokemonData.types.map((t) => t.type.name),
          minLevel
        });

        if (currentStage.evolves_to && currentStage.evolves_to.length > 0) {
          currentStage = currentStage.evolves_to[0];
        } else {
          break;
        }
      }

      return evolutionChain;
    } catch (error) {
      console.error(`Failed to fetch evolution chain:`, error);
      return [];
    }
  }
}
