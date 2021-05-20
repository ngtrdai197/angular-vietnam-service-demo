import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

export interface PaginatorState {
  page: number;
  pageCount: number;
  rows: number;
  first: number;
}

/**
 * Simplified PrimeNG Paginator component
 */

@Component({
  selector: 'paginator',
  template: `
    <div
      class="h-8 w-8 mr-1 inline-flex justify-center items-center"
      [class]="
        currentPage === 1
          ? ['opacity-50', 'pointer-events-none', 'cursor-not-allowed']
          : ['cursor-pointer']
      "
      (click)="changePageToFirst($event)"
    >
      <<
    </div>
    <div
      class="h-8 w-8 mr-1 inline-flex justify-center items-center"
      [class]="
        currentPage === 1
          ? ['opacity-50', 'pointer-events-none', 'cursor-not-allowed']
          : ['cursor-pointer']
      "
      (click)="changePageToPrev($event)"
    >
      <
    </div>
    <div
      *ngFor="let pageLink of pageLinks"
      (click)="onPageLinkClick($event, pageLink)"
      [class]="
        pageLink === currentPage
          ? ['border-gray-600', 'border-b-2']
          : ['border-base_experience-0']
      "
      class="w-8 inline-flex justify-center items-center cursor-pointer leading-5 ease-in d-flex"
    >
      {{ pageLink }}
    </div>
    <div
      class="h-8 w-8 ml-1 inline-flex justify-center items-center"
      [class]="
        currentPage === lastPage
          ? ['opacity-50', 'pointer-events-none', 'cursor-not-allowed']
          : ['cursor-pointer']
      "
      (click)="changePageToNext($event)"
    >
      >
    </div>
    <div
      class="h-8 w-8 ml-1 inline-flex justify-center items-center"
      [class]="
        currentPage === lastPage
          ? ['opacity-50', 'pointer-events-none', 'cursor-not-allowed']
          : ['cursor-pointer']
      "
      (click)="changePageToLast($event)"
    >
      >>
    </div>
    <div *ngIf="rowsPerPageOptions.length">
      <select
        class="rounded border border-gray-600"
        [(ngModel)]="rows"
        (ngModelChange)="onRppChange()"
      >
        <option *ngFor="let rpp of rowsPerPageOptions" [value]="rpp">
          {{ rpp }}
        </option>
      </select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent implements OnInit, OnChanges {
  @Input() currentPage = 1;

  @Output() onPageChange: EventEmitter<PaginatorState> = new EventEmitter<PaginatorState>();
  @Input() rowsPerPageOptions: number[] = [];
  public pageLinks: number[] = [];
  paginatorState: any;
  lastPage = this.currentPage;

  _first: number = 0;

  @Input() get first(): number {
    return this._first;
  }

  set first(val: number) {
    this._first = val;
  }

  private _rows = 20;

  get rows() {
    return this._rows;
  }

  @Input()
  set rows(rows: number) {
    this._rows = rows;
    this.lastPage = Math.ceil(this.totalRecords / rows);
  }

  private _totalRecords = 0;

  get totalRecords() {
    return this._totalRecords;
  }

  @Input()
  set totalRecords(total: number) {
    this._totalRecords = total;
    this.lastPage = Math.ceil(total / this.rows);
  }

  ngOnInit() {
    this.updatePaginatorState();
  }

  ngOnChanges(simpleChange: SimpleChanges) {
    if (simpleChange.totalRecords) {
      this.updatePageLinks();
      this.updatePaginatorState();
      this.updateFirst();
    }

    if (simpleChange.first) {
      this._first = simpleChange.first.currentValue;
      this.updatePageLinks();
      this.updatePaginatorState();
    }

    if (simpleChange.rows) {
      this.updatePageLinks();
      this.updatePaginatorState();
    }
  }

  isFirstPage() {
    return this.getPage() === 0;
  }

  isLastPage() {
    console.log(this.getPageCount());
    return this.getPage() === this.getPageCount() - 1;
  }

  getPageCount() {
    return Math.ceil(this.totalRecords / this.rows) || 1;
  }

  calculatePageLinkBoundaries() {
    let numberOfPages = this.getPageCount(),
      visiblePages = numberOfPages;

    //calculate range, keep current in middle if necessary
    let start = Math.max(0, Math.ceil(this.getPage() - visiblePages / 2)),
      end = Math.min(numberOfPages - 1, start + visiblePages - 1);

    //check when approaching to last page
    const delta = end - start + 1;
    start = Math.max(0, start - delta);

    return [start, end];
  }

  updatePageLinks() {
    this.pageLinks = [];
    let boundaries = this.calculatePageLinkBoundaries(),
      start = boundaries[0],
      end = boundaries[1];

    for (let i = start; i <= end; i++) {
      this.pageLinks.push(i + 1);
    }
  }

  changePage(p: number) {
    const pc = this.getPageCount();
    const rows = Number(this.rows);

    if (p >= 0 && p <= pc) {
      this._first = rows * p;
      const state = {
        page: p,
        first: this.first,
        rows: rows,
        pageCount: pc
      };
      this.updatePageLinks();

      this.onPageChange.emit(state);
      this.updatePaginatorState();
    }
  }

  updateFirst() {
    const page = this.getPage();
    if (page > 0 && this.totalRecords && this.first >= this.totalRecords) {
      Promise.resolve(null).then(() => this.changePage(page - 1));
    }
  }

  getPage(): number {
    const dummy = Math.floor(this.first / this.rows);
    return dummy === 0 ? dummy + 1 : dummy;
  }

  changePageToFirst(event: any) {
    if (!this.isFirstPage()) {
      this.changePage(1);
    }

    event.preventDefault();
  }

  changePageToPrev(event: any) {
    this.changePage(this.getPage() - 1);
    event.preventDefault && event.preventDefault();
  }

  changePageToNext(event: any) {
    this.changePage(this.getPage() + 1);
    event.preventDefault && event.preventDefault();
  }

  changePageToLast(event: any) {
    if (!this.isLastPage()) {
      this.changePage(this.getPageCount());
    }

    event.preventDefault();
  }

  onPageLinkClick(event: any, page: number) {
    console.log(page)
    this.changePage(page);
    event.preventDefault();
  }

  onRppChange() {
    this.changePage(this.getPage());
  }

  updatePaginatorState() {
    this.paginatorState = {
      page: this.getPage(),
      pageCount: this.getPageCount(),
      rows: Number(this.rows),
      first: this.first,
      totalRecords: this.totalRecords
    };
  }

  @HostListener('window:keyup', ['$event'])
  private onWindowKeyUp(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      this.changePageToNext(event);
    } else if (event.key === 'ArrowLeft') {
      this.changePageToPrev(event);
    }
  }
}
