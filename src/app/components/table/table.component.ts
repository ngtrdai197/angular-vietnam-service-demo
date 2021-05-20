import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Pokemon} from '../../models/pokemon';

@Component({
  selector: 'data-table',
  template: `
    <table [class.overlay]="isLoading">
      <thead>
      <tr>
        <th class="border-bottom">Name</th>
        <th class="border-bottom">Detail URL</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let result of data">
        <td>
          <a [routerLink]="['/pokemons', result.id]">{{ result.name }}</a>
        </td>
        <td class="border-left">
          <a [href]="result.url" target="_blank">{{ result.url }}</a>
        </td>
      </tr>
      </tbody>
    </table>
  `,
  styles: [
    `
      table {
        width: 100%;
        text-align: center;
      }

      .border-bottom {
        border-bottom: 1px solid;
      }

      .border-left {
        border-left: 1px solid;
      }

      .overlay {
        position: relative;
      }

      .overlay::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.3);
      }

      .overlay::after {
        content: 'Loading...';
        font-size: 2rem;
        font-weight: bold;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {
  @Input() isLoading = false;
  @Input() data: Pokemon[] = [];
}
