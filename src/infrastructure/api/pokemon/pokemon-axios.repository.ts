import { pokemonApiClient } from '../axios/axios-client';
import { PokemonRepository } from '../../../domain/repositories/pokemon.repository';
import { Pokemon, PokemonList, EvolutionStage } from '../../../domain/entities/pokemon';

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
    
    // Add IDs to Pokemon results
    const pokemonsWithIds = response.data.results.map(pokemon => ({
      ...pokemon,
      id: extractPokemonId(pokemon.url)
    }));
    
    return {
      ...response.data,
      results: pokemonsWithIds
    };
  }

  async searchPokemon(query: string): Promise<Pokemon[]> {
    const response = await pokemonApiClient.get<PokemonList>(
      `/pokemon?limit=100`
    );
    
    // Add IDs to Pokemon results
    const pokemonsWithIds = response.data.results.map(pokemon => ({
      ...pokemon,
      id: extractPokemonId(pokemon.url)
    }));
    
    // Filter results based on query
    const filtered = pokemonsWithIds.filter(pokemon => 
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
    
    return filtered;
  }

  async getPokemonById(id: number): Promise<Pokemon> {
    const pokemonResponse = await pokemonApiClient.get<any>(`/pokemon/${id}`);
    
    let description: string | undefined;
    let species: string | undefined;
    let genderRate = -1; // Default to genderless
    let weaknesses: string[] = [];
    let evolutionChain: EvolutionStage[] = [];
    
    try {
      const speciesResponse = await pokemonApiClient.get<any>(`/pokemon-species/${id}/`);
      const speciesData = speciesResponse.data;
      
      // Extract gender rate
      genderRate = speciesData.gender_rate ?? -1;
      
      const englishEntry = speciesData.flavor_text_entries.find(
        (entry: any) => entry.language.name === 'en'
      );
      
      if (englishEntry) {
        description = englishEntry.flavor_text
          .replace(/\f/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      }
      
      // Find English genus for category
      const englishGenus = speciesData.genera.find(
        (genus: any) => genus.language.name === 'en'
      );
      if (englishGenus) {
        species = englishGenus.genus.replace(' Pokémon', '');
      }
      
      // Get weaknesses from Pokemon types
      const types = pokemonResponse.data.types.map((t: any) => t.type.name);
      weaknesses = await this.getTypeWeaknesses(types);
      
      // Get evolution chain if available
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
      types: pokemonResponse.data.types.map((typeInfo: any) => typeInfo.type.name),
      description,
      weight: pokemonResponse.data.weight,
      height: pokemonResponse.data.height,
      abilities: pokemonResponse.data.abilities.map((a: any) => a.ability.name),
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
        const typeResponse = await pokemonApiClient.get<any>(`/type/${typeName}`);
        const damageRelations = typeResponse.data.damage_relations;
        
        // Add all double damage types
        damageRelations.double_damage_from.forEach((type: any) => {
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
      const response = await pokemonApiClient.get<any>(chainUrl);
      const chainData = response.data.chain;
      const evolutionChain: EvolutionStage[] = [];
      
      // Traverse evolution chain
      let currentStage = chainData;
      while (currentStage) {
        const speciesName = currentStage.species.name;
        
        // Get Pokemon details for the species
        const pokemonResponse = await pokemonApiClient.get<any>(`/pokemon/${speciesName}`);
        const pokemonData = pokemonResponse.data;
        
        // Extract evolution details
        const minLevel = currentStage.evolves_to[0]?.evolution_details[0]?.min_level;
        
        evolutionChain.push({
          species: speciesName,
          imageUrl: pokemonData.sprites.front_default,
          types: pokemonData.types.map((t: any) => t.type.name),
          minLevel
        });
        
        // Move to next evolution stage
        currentStage = currentStage.evolves_to[0];
      }
      
      return evolutionChain;
    } catch (error) {
      console.error(`Failed to fetch evolution chain:`, error);
      return [];
    }
  }
}
