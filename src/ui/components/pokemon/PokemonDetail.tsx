import React from 'react';
import { Pokemon } from '../../../domain/entities/pokemon';
import './PokemonDetail.scss';
import { getColorsFromTypes } from '@/utils/pokemonColors';

interface PokemonDetailProps {
  pokemon: Pokemon;
}

const DetailItem = ({ label, value }: { label: string; value: string | number }) => (
  <div className="pokemon-detail-detailItem">
    <p className="pokemon-detail-detailLabel">{label}</p>
    <p className="pokemon-detail-detailValue">{value}</p>
  </div>
);

const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemon }) => {
  const malePercent = pokemon.genderRate === -1 
    ? 0 
    : ((8 - pokemon.genderRate) / 8 * 100).toFixed(1);
    
  const femalePercent = pokemon.genderRate === -1 
    ? 0 
    : (pokemon.genderRate / 8 * 100).toFixed(1);

  return (
    <div className="pokemon-detail">
      <div className="flex flex-col items-center">
        <h1 className="pokemon-detail-title">{pokemon.name}</h1>
        
        {pokemon.imageUrl && (
          <img 
            src={pokemon.imageUrl} 
            alt={pokemon.name} 
            className="pokemon-detail-image"
          />
        )}

        <div className='bg-image' style={{backgroundColor: getColorsFromTypes(pokemon.types)[0]}}>
            
        </div>
        
        <div className="pokemon-detail-typesContainer">
          <h2 className="pokemon-detail-typesTitle">Types</h2>
          <div className="pokemon-detail-typesList">
            {pokemon.types?.map((type, index) => (
              <span 
                key={index}
                className="pokemon-detail-typeItem"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        <div className="pokemon-detail-detailsGrid">
          <DetailItem label="Weight" value={`${(pokemon.weight / 10).toFixed(1)} kg`} />
          <DetailItem label="Height" value={`${(pokemon.height * 10).toFixed(1)} cm`} />
          <DetailItem label="Category" value={pokemon.species || 'Unknown'} />
          <div className="pokemon-detail-abilitiesContainer">
            <h2 className="pokemon-detail-abilitiesTitle">Abilities</h2>
            <div className="pokemon-detail-abilitiesList">
              {pokemon.abilities?.map((ability, index) => (
                <span
                  key={index}
                  className="pokemon-detail-abilityItem"
                >
                  {ability}
                </span>
              ))}
            </div>
          </div>
          
          <div className="pokemon-detail-genderContainer">
            <h2 className="pokemon-detail-genderTitle">Gender Distribution</h2>
            {pokemon.genderRate === -1 ? (
              <p className="text-gray-700">Genderless</p>
            ) : (
              <div className="pokemon-detail-genderDistribution">
                <span className="pokemon-detail-maleSymbol">♂</span>
                <div className="pokemon-detail-genderBar">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-pink-400" 
                    style={{ 
                      width: '100%',
                      background: `linear-gradient(to right, blue ${malePercent}%, pink 0%)`
                    }}
                  />
                </div>
                <span className="pokemon-detail-femaleSymbol">♀</span>
                <span className="pokemon-detail-genderPercentage">
                  ♂ {malePercent}% ♀ {femalePercent}%
                </span>
              </div>
            )}
          </div>
          
          <div className="pokemon-detail-weaknessesContainer">
            <h2 className="pokemon-detail-weaknessesTitle">Weaknesses</h2>
            <div className="pokemon-detail-weaknessesList">
              {pokemon.weaknesses?.map((weakness, index) => (
                <span
                  key={index}
                  className="pokemon-detail-weaknessItem"
                >
                  {weakness}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {pokemon.evolutionChain && pokemon.evolutionChain.length > 0 && (
          <div className="pokemon-detail-evolutionContainer">
            <h2 className="pokemon-detail-evolutionTitle">Evolution Chain</h2>
            <div className="flex flex-col items-center">
              {pokemon.evolutionChain.map((stage, index) => (
                <React.Fragment key={index}>
                  <div className="pokemon-detail-evolutionStage">
                    <img 
                      src={stage.imageUrl} 
                      alt={stage.species} 
                      className="pokemon-detail-evolutionStageImage"
                    />
                    <p className="pokemon-detail-evolutionStageName">{stage.species}</p>
                    <div className="pokemon-detail-evolutionStageTypes">
                      {stage.types.map((type, i) => (
                        <span key={i} className="pokemon-detail-evolutionStageType">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {index < pokemon.evolutionChain!.length - 1 && (
                    <div className="pokemon-detail-evolutionArrow">
                      <div className="text-xl text-gray-500">↓</div>
                      {stage.minLevel !== undefined && (
                        <div className="pokemon-detail-evolutionLevel">
                          Level {stage.minLevel}
                        </div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
        
        {pokemon.description && (
          <div className="pokemon-detail-description">
            <h2 className="pokemon-detail-descriptionTitle">Description</h2>
            <p className="pokemon-detail-descriptionText">{pokemon.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonDetail;
