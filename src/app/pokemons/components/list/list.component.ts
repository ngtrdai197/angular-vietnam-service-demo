import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import type {PaginatorState} from '../../../components/paginator/paginator.component';
import {PaginatedPokemon} from "../../../models/pokemon";
import {BackendService} from "../../../services/backend.service";
import {finalize, tap} from "rxjs/operators";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'pokemon-list',
  template: `
    <paginator
      [currentPage]="currentPage"
      [rowsPerPageOptions]="[10, 20, 40, 80]"
      [rows]="20"
      [totalRecords]="(dataSource$ | async)?.count"
      (onPageChange)="onPageChanged($event)"
    ></paginator>
    <input
      type="text"
      class="w-2/4 p-2 rounded border border-gray-600"
      placeholder="Filter by pokemon name..."
      [formControl]="query"
      (keyup)="onSearchPokemons()"
    />
    <data-table [isLoading]="isLoading" [data]="(dataSource$ | async)?.results"></data-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit, OnDestroy {
  query = new FormControl('');
  public dataSource$: Observable<PaginatedPokemon | null>;
  public isLoading: boolean = false;
  public currentPage: number;
  private subscriptions: Subscription[] = [];

  constructor(private readonly backendService: BackendService) {
  }

  public ngOnInit() {
    this.fetchPokemons();
    this.onSearchPokemons();
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onPageChanged(paginatorState: PaginatorState) {
    console.log(paginatorState);
    this.fetchPokemons(paginatorState.rows, paginatorState.first, paginatorState.page);
  }

  onSearchPokemons(): void {
    this.subscriptions.push(this.query.valueChanges.pipe(
      tap(key => console.log({key})),
    ).subscribe(keySearch => {
      this.backendService.onSearchPokemons(keySearch);
    }));
  }

  private fetchPokemons(limit = 20, offset = 0, currentPage = 1): void {
    this.currentPage = currentPage;
    this.isLoading = true;
    this.subscriptions.push(this.backendService.getPokemons(limit, offset).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe());
    this.dataSource$ = this.backendService.pokemonsList;
  }
}
