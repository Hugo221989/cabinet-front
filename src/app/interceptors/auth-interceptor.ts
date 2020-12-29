import { HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { TokenStorageService } from '../pages/login/service/token-storage.service';
import { catchError } from 'rxjs/operators';
import { EMPTY, throwError } from 'rxjs';
import { SettingsState } from '../settings/settings.models';
import { Store } from '@ngrx/store';
import { actionSettingsIsAuthenticated } from '../settings/settings.actions';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenStorageService: TokenStorageService,
    private store: Store<{settings: SettingsState}>) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let authReq = req;
    const token = this.tokenStorageService.getToken();
    if (token != null) {
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
    }
    return next.handle(authReq).pipe(catchError(this.handleResposeError));
  }

  handleResposeError = (error: HttpErrorResponse) => {
    console.log(error);
    if(error.error.status != null && error.error.status == 401){
    this.store.dispatch(actionSettingsIsAuthenticated({
      isAuthenticated: false
    }))
     return throwError(error);
    }
    return EMPTY;
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];