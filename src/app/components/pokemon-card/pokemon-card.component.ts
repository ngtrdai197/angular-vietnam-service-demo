import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SimplifiedPokemon } from '../../models/pokemon';

@Component({
  selector: 'pokemon-card',
  template: `
    <div
      *ngIf="pokemon && pokemon?.name; else skeleton"
      class="bg-gradient-to-br max-h-120 max-w-xs p-4 rounded max-w-xs max-h-120 w-xs h-120"
      [class]="pokemonTypeColorMap[(pokemon?.type)]?.outer"
    >
      <div class="rounded grid grid-cols-1 grid-rows-3 h-full">
        <div
          class="row-span-1 relative flex items-center justify-center bg-gradient-to-br rounded-t"
          [class]="pokemonTypeColorMap[(pokemon?.type)]?.innerHeader"
        >
          <img class="w-1/2" [src]="pokemon?.image" [alt]="pokemon?.name" />
          <h3
            class="absolute -bottom-4 right-4 px-1 py-0.5 uppercase text-lg tracking-tight font-extralight"
            [class]="pokemonTypeColorMap[(pokemon?.type)]?.type"
          >
            {{ pokemon?.type }}
          </h3>
        </div>
        <div
          class="row-span-2 flex flex-col w-full items-center justify-between p-4 bg-gradient-to-br rounded-b"
          [class]="pokemonTypeColorMap[(pokemon?.type)]?.innerFooter"
        >
          <div class="w-full flex flex-col items-center gap-4">
            <h2 class="text-xl font-bold tracking-wider text-black">
              {{ pokemon?.name | titlecase }}
            </h2>
            <table class="w-full">
              <tbody>
                <tr *ngFor="let stat of pokemon?.stats">
                  <th
                    class="w-1/2 text-right pr-1 font-light text-sm text-black"
                  >
                    {{ stat.stat.name | uppercase }}
                  </th>
                  <td class="w-1/2 text-left pl-1 font-bold text-sm text-black">
                    {{ stat.base_stat }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="w-full grid grid-cols-2 justify-between">
            <h4 class="text-left text-lg font-bold text-black">
              <span class="block font-extralight tracking-wide text-sm"
                >Ability</span
              >
              {{ pokemon?.ability | titlecase }}
            </h4>
            <h4 class="text-right text-lg font-bold text-black">
              <span class="block font-extralight tracking-wide text-sm">Hidden Ability</span
              >
              {{ pokemon?.hiddenAbility | titlecase }}
            </h4>
          </div>
        </div>
      </div>
    </div>

    <ng-template #skeleton>
      <div
        class="animate-pulse bg-gradient-to-br from-gray-300 to-gray-500 max-h-120 max-w-xs p-4 rounded max-w-xs max-h-120 w-xs h-120"
      >
        <div class="rounded grid grid-cols-1 grid-rows-3 h-full">
          <div
            class="animate-pulse row-span-1 relative flex items-center justify-center bg-gradient-to-br from-gray-500 to-gray-700 rounded-t"
          >
            <img class="w-1/2" [src]="pokemon?.image" />
            <h3
              class="animate-pulse absolute -bottom-4 right-4 px-1 py-0.5 uppercase text-lg tracking-tight font-extralight bg-gray-600"
            >
              type
            </h3>
          </div>
          <div
            class="animate-pulse from-gray-100 to-gray-300 row-span-2 flex flex-col w-full items-center justify-between p-4 bg-gradient-to-br rounded-b"
          ></div>
        </div>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .max-h-120 {
        max-height: 30rem;
      }

      .h-120 {
        height: 30rem;
      }

      .w-xs {
        width: 20rem;
      }
    `
  ]
})
export class PokemonCardComponent {
  @Input()
  pokemon: SimplifiedPokemon;

  pokemonTypeColorMap: Record<
    string,
    {
      outer: string[];
      innerHeader: string[];
      innerFooter: string[];
      type: string[];
    }
  > = {
    normal: {
      outer: ['from-yellow-400', 'to-purple-400'],
      innerHeader: ['from-yellow-600', 'to-purple-600'],
      innerFooter: ['from-yellow-200', 'to-purple-200'],
      type: ['bg-yellow-600', 'text-white']
    },
    fire: {
      outer: ['from-amber-400', 'to-red-400'],
      innerHeader: ['from-amber-600', 'to-red-600'],
      innerFooter: ['from-amber-100', 'to-red-300'],
      type: ['bg-red-500', 'text-white']
    },
    water: {
      outer: ['from-lightBlue-400', 'to-cyan-600'],
      innerHeader: ['from-lightBlue-600', 'to-cyan-800'],
      innerFooter: ['from-lightBlue-100', 'to-cyan-300'],
      type: ['bg-lightBlue-500', 'text-white']
    },
    electric: {
      outer: ['from-yellow-300', 'to-lime-300'],
      innerHeader: ['from-yellow-500', 'to-lime-500'],
      innerFooter: ['from-yellow-200', 'to-lime-200'],
      type: ['bg-yellow-500', 'text-white']
    },
    grass: {
      outer: ['from-lime-200', 'to-lime-400'],
      innerHeader: ['from-lime-500', 'to-lime-700'],
      innerFooter: ['from-lime-100', 'to-lime-300'],
      type: ['bg-lime-500', 'text-white']
    },
    psychic: {
      outer: ['from-pink-300', 'to-rose-300'],
      innerHeader: ['from-pink-500', 'to-rose-500'],
      innerFooter: ['from-pink-200', 'to-rose-200'],
      type: ['bg-pink-500', 'text-white']
    },
    dark: {
      outer: ['from-fuchsia-700', 'to-gray-700'],
      innerHeader: ['from-fuchsia-900', 'to-gray-900'],
      innerFooter: ['from-fuchsia-100', 'to-gray-100'],
      type: ['bg-fuchsia-600', 'text-white']
    },
    fairy: {
      outer: ['from-rose-200', 'to-rose-400'],
      innerHeader: ['from-rose-600', 'to-rose-800'],
      innerFooter: ['from-rose-100', 'to-rose-300'],
      type: ['bg-rose-500', 'text-white']
    },
    ice: {
      outer: ['from-cyan-300', 'to-lightBlue-300'],
      innerHeader: ['from-cyan-700', 'to-lightBlue-700'],
      innerFooter: ['from-cyan-200', 'to-lightBlue-200'],
      type: ['bg-cyan-600', 'text-white']
    },
    poison: {
      outer: ['from-green-200', 'to-green-400'],
      innerHeader: ['from-green-500', 'to-green-700'],
      innerFooter: ['from-green-100', 'to-green-300'],
      type: ['bg-green-500', 'text-white']
    },
    rock: {
      outer: ['from-trueGray-200', 'to-blueGray-400'],
      innerHeader: ['from-trueGray-500', 'to-blueGray-700'],
      innerFooter: ['from-trueGray-100', 'to-blueGray-300'],
      type: ['bg-trueGray-500', 'text-white']
    },
    dragon: {
      outer: ['from-indigo-200', 'to-orange-400'],
      innerHeader: ['from-indigo-500', 'to-orange-700'],
      innerFooter: ['from-indigo-100', 'to-orange-300'],
      type: ['bg-indigo-500', 'text-white']
    },
    steel: {
      outer: ['from-warmGray-200', 'to-gray-400'],
      innerHeader: ['from-warmGray-500', 'to-gray-700'],
      innerFooter: ['from-warmGray-100', 'to-gray-300'],
      type: ['bg-warmGray-500', 'text-white']
    },
    bug: {
      outer: ['from-lime-200', 'to-emerald-400'],
      innerHeader: ['from-lime-500', 'to-emerald-700'],
      innerFooter: ['from-lime-100', 'to-emerald-300'],
      type: ['bg-lime-500', 'text-white']
    },
    ground: {
      outer: ['from-amber-200', 'to-gray-400'],
      innerHeader: ['from-amber-500', 'to-gray-700'],
      innerFooter: ['from-amber-100', 'to-gray-300'],
      type: ['bg-amber-500', 'text-white']
    },
    fighting: {
      outer: ['from-emerald-300', 'to-violet-300'],
      innerHeader: ['from-emerald-700', 'to-violet-700'],
      innerFooter: ['from-emerald-200', 'to-violet-200'],
      type: ['bg-emerald-600', 'text-white']
    },
    ghost: {
      outer: ['from-cyan-300', 'to-amber-300'],
      innerHeader: ['from-cyan-700', 'to-amber-700'],
      innerFooter: ['from-cyan-200', 'to-amber-200'],
      type: ['bg-cyan-600', 'text-white']
    },
    flying: {
      outer: ['from-teal-300', 'to-rose-300'],
      innerHeader: ['from-teal-700', 'to-rose-700'],
      innerFooter: ['from-teal-200', 'to-rose-200'],
      type: ['bg-teal-600', 'text-white']
    }
  };
}
