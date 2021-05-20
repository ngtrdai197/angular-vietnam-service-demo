import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {delay, map, tap} from 'rxjs/operators';
import {PaginatedPokemon, PokemonDetail, SimplifiedPokemon} from '../models/pokemon';

@Injectable({providedIn: 'root'})
export class BackendService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2/pokemon';
  private readonly _pokemonsList$ = new BehaviorSubject<PaginatedPokemon | null>(null);
  public readonly pokemonsList = this._pokemonsList$.asObservable();
  private _previousPokemonsList: PaginatedPokemon;

  constructor(private readonly httpClient: HttpClient) {
  }

  private static getSimplifiedPokemon(pokemon: PokemonDetail | null): SimplifiedPokemon {
    return {
      name: pokemon?.name || '',
      ability: pokemon?.abilities?.find((ability) => !ability.is_hidden)?.ability?.name || '',
      hiddenAbility: pokemon?.abilities?.find((ability) => ability.is_hidden)?.ability?.name || '',
      image: pokemon?.sprites?.other?.['official-artwork']?.front_default || '',
      stats: pokemon?.stats || [],
      type: pokemon?.types[0].type?.name || '',
    }
  }

  getPokemons(limit = 20, offset = 0): Observable<PaginatedPokemon> {
    return this.httpClient
      .get<PaginatedPokemon>(this.baseUrl, {
        params: {limit, offset}
      })
      .pipe(
        delay(1500),
        tap((paginatedPokemon: PaginatedPokemon) => {
          const paginator = {
            ...paginatedPokemon,
            results: paginatedPokemon.results.map(pokemon => ({
              ...pokemon,
              id: pokemon.url
                .split('/')
                .filter(Boolean)
                .pop()
            }))
          };
          this._previousPokemonsList = paginator;
          this._pokemonsList$.next(paginator);
        }),
      );
  }

  getPokemonDetail(id: string): Observable<SimplifiedPokemon> {
    return this.httpClient
      .get<SimplifiedPokemon>(`${this.baseUrl}/${id}`)
      .pipe(
        delay(1500),
        map((pokemon) => BackendService.getSimplifiedPokemon(pokemon as any))
        // delay(1500),
        // map((pokemon: PokemonDetail) => BackendService.getSimplifiedPokemon(pokemon))
      );
  }

  public onSearchPokemons(keyword: string): void {
    if (keyword.length === 0) {
      this._pokemonsList$.next(this._previousPokemonsList);
      return;
    }
    if (this._previousPokemonsList) {
      const results = this._previousPokemonsList.results.filter(pokemon => pokemon.name.toLowerCase().includes(keyword.toLowerCase()));
      this._pokemonsList$.next({
        ...this._previousPokemonsList,
        results
      })
    }
  }
}
