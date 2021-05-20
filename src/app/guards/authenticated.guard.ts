import {Injectable} from '@angular/core';
import {CanActivate, CanActivateChild, CanLoad, Router} from '@angular/router';
import {tap} from 'rxjs/operators';
import {AuthService} from "../services/auth.service";

@Injectable({providedIn: 'root'})
export class AuthenticatedGuard
  implements CanLoad, CanActivate, CanActivateChild {
  constructor(private readonly router: Router, private readonly authService: AuthService) {
  }

  canLoad() {
    return this.isAuth$();
  }

  canActivate() {
    return this.isAuth$();
  }

  canActivateChild() {
    return this.isAuth$();
  }

  private isAuth$() {
    return this.authService.isLogged$.pipe(
      tap(isAuth => {
        if (!isAuth) {
          this.router.navigate(['/not-auth']);
        }
      }))
  }
}
