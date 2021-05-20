import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {User} from '../models/user';
import {map} from "rxjs/operators";

const CURRENT_USER_KEY = 'currentUser';

export const enum TOGGLE {
  LIKE,
  DISLIKE
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _currentUser$ = new BehaviorSubject<User | null>(null);
  public readonly currentUser$ = this._currentUser$.asObservable();
  public readonly isLogged$ = this._currentUser$.pipe(
    map(user => {
      if (user) return true;
      return false;
    })
  );

  constructor() {
  }

  private static get currentuserLocal(): User | undefined {
    const local = localStorage.getItem(CURRENT_USER_KEY);
    if (!local) return;
    return JSON.parse(local) as User;
  }

  private static updateLocal(user: User): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  public getCurrentUser(): void {
    if (AuthService.currentuserLocal) {
      this._currentUser$.next(AuthService.currentuserLocal);
    }
  }

  public login(): void {
    if (AuthService.currentuserLocal) {
      this.getCurrentUser()
    } else {
      const user = {name: "I am Dai Nguyen", likes: 0, dislikes: 0};
      AuthService.updateLocal(user);
      this._currentUser$.next(user);
    }
  }

  public logOut(): void {
    this._currentUser$.next(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  public toggle(action: TOGGLE): void {
    const user = this._currentUser$.getValue();
    if (user) {
      let newData: User;
      if(action === TOGGLE.LIKE) {
        newData = {
          ...user,
          likes: ++user.likes
        }
      } else {
        newData = {
          ...user,
          dislikes: ++user.dislikes
        }
      }
      this._currentUser$.next(newData);
      AuthService.updateLocal(newData);
    }
  }
}
