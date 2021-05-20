import {ChangeDetectionStrategy, Component, OnInit, VERSION} from '@angular/core';
import {User} from '../../models/user';
import {Observable} from "rxjs";
import {AuthService} from 'src/app/services/auth.service';
import {Router} from "@angular/router";

@Component({
  selector: 'navbar',
  template: `
    <nav>
      <h4>Angular Vietnam v{{ version }}</h4>
      <button *ngIf="isLoggedIn$ | async; else notLoggedIn" (click)="logOut()">
        <ng-container *ngIf="user$ | async as user">
          I am {{ user?.name }}, and I like {{ user?.likes }} and dislike
          {{ user?.dislikes }} pokemons / Log Out
        </ng-container>
      </button>
      <ng-template #notLoggedIn>
        <button (click)="logIn()">Log In</button>
      </ng-template>
    </nav>
  `,
  styles: [
    `
      nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background-color: hotpink;
        color: white;
      }

      h4 {
        margin: 0;
        font-size: 2rem;
      }

      button {
        background: transparent;
        outline: none;
        border: 1px solid;
        border-radius: 0.25rem;
        padding: 0.5rem 1rem;
        color: white;
        cursor: pointer;
        font-size: 1rem;
        font-family: 'Source Sans Pro';
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {
  version = VERSION.full;
  public user$?: Observable<User | null> = this.authService.currentUser$;
  isLoggedIn$: Observable<boolean>;

  constructor(private readonly authService: AuthService, private readonly router: Router) {
  }

  public ngOnInit() {
    this.authService.getCurrentUser();
    this.isLoggedIn$ = this.authService.isLogged$;
  }

  logIn() {
    this.authService.login();
    this.router.navigate(['/'])
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/not-auth'])
  }
}
