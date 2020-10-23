import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const AUTH_API = `${environment.urlAddress}api/auth/`;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  login(credentials): Observable<any> {
    return this.httpClient.post(AUTH_API + 'signin', {
      username: credentials.username,
      password: credentials.password,
      rememberLogin: credentials.rememberLogin
    }, httpOptions);
  }

  register(user): Observable<any> {console.log("USER: ",user);
    return this.httpClient.post(AUTH_API + 'signup', {
      username: user.username,
      email: user.email,
      password: user.password
    }, httpOptions);
  }
  
}
