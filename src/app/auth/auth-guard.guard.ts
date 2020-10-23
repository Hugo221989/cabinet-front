import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../pages/login/service/token-storage.service';
import { actionSettingsIsAuthenticated } from '../settings/settings.actions';
import { SettingsState } from '../settings/settings.models';
import { selectSettingsisAuthenticated } from '../settings/settings.selectors';

const LOGIN_PATH = 'login';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  private isLoggedIn = false;

  constructor(private store: Store<{settings: SettingsState}>,
    private tokenStorageService: TokenStorageService,
    private router: Router) { } 
    
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
        this.store.dispatch(actionSettingsIsAuthenticated({
          isAuthenticated: true
        }))
      }else{
        this.tokenStorageService.signOut();
        this.router.navigate([LOGIN_PATH]);
      }
      return this.store.pipe(select(selectSettingsisAuthenticated));
  }
  
}
