import React from 'react';
import { Pokemon } from '../../../domain/entities/pokemon';
import './PokemonDetail.scss';
import { getColorsFromTypes } from '@/utils/pokemonColors';

interface PokemonDetailProps {
  pokemon: Pokemon;
}

const DetailItem = ({ label, value, assetPath }: { label: string; value: string | number, assetPath: string }) => (
  <div className="pokemon-desc">
    <p className="pokemon-desc-label"><img src={assetPath} alt="" />  <span>{label}</span></p>
    <p className="pokemon-desc-value">{value}</p>
  </div>
);

const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemon }) => {
  const malePercent = pokemon.genderRate === -1
    ? 0
    : ((8 - pokemon.genderRate) / 8 * 100).toFixed(1);

  const femalePercent = pokemon.genderRate === -1
    ? 0
    : (pokemon.genderRate / 8 * 100).toFixed(1);

  const getElementImage = (pokemon: Pokemon): string => {
    const firstType = pokemon.types?.[0] ?? 'notype';
    return firstType;
  }

  return (
    <div className="pokemon-detail">
      {pokemon.imageUrl && (
        <img
          src={pokemon.imageUrl}
          alt={pokemon.name}
          className="pokemon-detail-image"
        />
      )}

      <div className='bg-image' style={{ backgroundColor: getColorsFromTypes(pokemon.types)[0] }}>
        <img
          className="element-image-detail"
          src={`/elements/${getElementImage(pokemon)}.svg`}
          width={180}
          alt="element"
        />
      </div>  

      <h1 className="pokemon-detail-title">{pokemon.name}</h1>

      
      <div className="pokemon-detail-typesList">
        {pokemon.types?.map((type, index) => (
          <div key={type} className='type-badge-detail' style={{ backgroundColor: getColorsFromTypes(pokemon.types)[index], color: 'white' }}>
            <div className='w-[23px] h-[23px] bg-white rounded-full flex justify-center items-center'>
              <img src={`/elementsColor/${type}.svg`} className='size-[15px]' alt="typeimagedetail" />
            </div>
            <span>{type}</span>
          </div>
        ))}
      </div>

      {pokemon.description && (
        <div className="pokemon-detail-description">
          <p className="pokemon-detail-descriptionText">{pokemon.description}</p>
        </div>
      )}

      <div className='devider'></div>

      <div className="pokemon-detail-detailsGrid">
        <DetailItem label="Weight" value={`${(pokemon.weight / 10).toFixed(1)} kg`} assetPath='/icons/weight.svg'/>
        <DetailItem label="Height" value={`${(pokemon.height * 10).toFixed(1)} cm`} assetPath='/icons/height.svg'/>
        <DetailItem label="Category" value={pokemon.species || 'Unknown'} assetPath='/icons/category.svg'/>
        <DetailItem label="Ability" value={pokemon.abilities[0]} assetPath='/icons/ability.svg'/>
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
          <h2 className="pokemon-detail-genderTitle">Gender</h2>
          {pokemon.genderRate === -1 ? (
            <p className="text-gray-700">Genderless</p>
          ) : (
            <>  
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
              </div>

              <div className="pokemon-detail-genderPercentage">
                  <span>{malePercent}%</span> <span>{femalePercent}%</span>
              </div>
            </>
          )}
        </div>

        
      </div>

      <div className='lg:flex lg:justify-between lg:gap-6'>
        <div className="pokemon-detail-weaknessesContainer w-full">
          <h2 className="pokemon-detail-weaknessesTitle">Weaknesses</h2>
          <div className="pokemon-detail-weaknessesList">
            {pokemon.weaknesses?.map((weakness, index) => (
              <div key={index} className='type-badge-weak' style={{ backgroundColor: getColorsFromTypes(pokemon.weaknesses)[index], color: 'white' }}>
                <div className='w-[23px] h-[23px] bg-white rounded-full flex justify-center items-center'>
                  <img src={`/elementsColor/${weakness}.svg`} className='size-[15px]' alt="typeimagedetail" />
                </div>
                <span>{weakness}</span>
              </div>
            ))}
          </div>
        </div>

        {pokemon.evolutionChain && pokemon.evolutionChain.length > 0 && (
          <div className="pokemon-detail-evolutionContainer w-full">
            <h2 className="pokemon-detail-evolutionTitle">Evolution</h2>
            <div className="pokemon-detail-evolutionTitle-inner">
              {pokemon.evolutionChain.map((stage, index) => (
                <React.Fragment key={index}>
                  <div className="pokemon-detail-evolutionStage">
                    <div className='evo-image-container' style={{ backgroundColor: getColorsFromTypes(pokemon.types)[0] }}>
                      <img
                        className="evo-image"
                        src={`/elements/${getElementImage(pokemon)}.svg`}
                        alt="element"
                      />

                      <img
                        src={stage.imageUrl}
                        alt={stage.species}
                        className="pokemon-detail-evolutionStageImage"
                      />
                    </div>
                    <div className='w-[65%] ml-4'>
                      <p className="pokemon-detail-evolutionStageName">{stage.species}</p>
                      <div className="pokemon-detail-evolutionStageTypes">
                        {stage.types.map((type, i) => (
                          <div key={type} className='type-badge-evo' style={{ backgroundColor: getColorsFromTypes(stage.types)[i], color: 'white' }}>
                            <div className='w-[23px] h-[23px] bg-white rounded-full flex justify-center items-center'>
                              <img src={`/elementsColor/${type}.svg`} className='size-[15px]' alt="typeimagedetail" />
                            </div>
                          </div>
                        ))}
                      </div>
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
      </div>
    </div>
  );
};

export default PokemonDetail;
