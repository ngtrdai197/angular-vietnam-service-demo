import {ChangeDetectionStrategy, Component, HostBinding, OnInit} from '@angular/core';
import {BackendService} from "../../../services/backend.service";
import {ActivatedRoute, Router} from "@angular/router";
import {pluck, switchMap, tap} from "rxjs/operators";
import {Observable} from "rxjs";
import {SimplifiedPokemon} from "../../../models/pokemon";
import {AuthService, TOGGLE} from "../../../services/auth.service";

@Component({
  selector: 'pokemon-details',
  template: `
    <div class="flex gap-4 items-center justify-center">
      <button (click)="prevId()">
        <<
      </button>
      <pokemon-card [pokemon]="pokemon$ | async"></pokemon-card>
      <button (click)="nextId()">
        >>
      </button>
    </div>

    <div class="flex w-1/3 px-4 justify-between items-center">
      <button class="border border-gray-600 px-4 py-2 rounded" (click)="like()">
        Like
      </button>
      <button
        class="border border-gray-600 px-4 py-2 rounded"
        (click)="dislike()"
      >
        Dislike
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        height: calc(100% - 5rem);
      }
    `
  ]
})
export class DetailsComponent implements OnInit {
  @HostBinding('class') hostClass =
    'flex flex-col gap-4 items-center justify-center';

  public pokemon$: Observable<SimplifiedPokemon>;
  private pokemonId: number = 0;

  constructor(
    private readonly backendService: BackendService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {
  }

  ngOnInit() {
    this.pokemon$ = this.activatedRoute.params.pipe(
      pluck('id'),
      tap(pokemonId => this.pokemonId = Number(pokemonId)),
      switchMap((pokemonId) => {
          if (pokemonId > 0) {
            return this.backendService.getPokemonDetail(pokemonId);
          } else {
            this.router.navigate(['/pokemons', 1]);
            return this.backendService.getPokemonDetail(pokemonId);
          }
        }
      )
    );
  }

  nextId() {
    // go to next id
    this.router.navigate(['/pokemons', ++this.pokemonId]);
  }

  prevId() {
    // go to prev id
    this.router.navigate(['/pokemons', --this.pokemonId]);
  }

  like() {
    // like
    this.authService.toggle(TOGGLE.LIKE);
  }

  dislike() {
    // dislike
    this.authService.toggle(TOGGLE.DISLIKE);
  }
}
