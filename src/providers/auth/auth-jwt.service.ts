import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { Api } from '../api/api';
import { HttpClient } from '@angular/common/http';
import { Secret } from "../secret";
import { AesServerProvider } from "../auth/aes.service"

@Injectable()
export class AuthServerProvider {

  constructor(private http: HttpClient,
    private $localStorage: LocalStorageService,
    private $sessionStorage: SessionStorageService,
    private aesServerProvider: AesServerProvider) {
  }

  getToken() {
    return this.$localStorage.retrieve('authenticationToken') || this.$sessionStorage.retrieve('authenticationToken');
  }

  login(credentials): Observable<any> {

    let useInfo = credentials.username + '####' + credentials.password;
    useInfo = this.aesServerProvider.encrypt(useInfo, this.$localStorage.retrieve('aesKey'));
    useInfo = useInfo + '####' + this.$localStorage.retrieve('clientId');

    const data = {
      username: 'username',
      password: 'password',
      rememberMe: credentials.rememberMe,
      useInfo: useInfo
    };

    //将用户登录信息本地存储
    localStorage.setItem('username', Secret.Encrypt(credentials.username) + '');
    localStorage.setItem('password', Secret.Encrypt(credentials.password) + '');
    localStorage.setItem('rememberMe', data.rememberMe + '');

    return this.http.post(Api.API_URL + '/authenticate', data).map((response: any) => {
      const jwt = response['id_token'];
      if (jwt) {
        this.storeAuthenticationToken(jwt, credentials.rememberMe);
        return jwt;
      }
    });
  }

  loginWithToken(jwt, rememberMe) {
    if (jwt) {
      this.storeAuthenticationToken(jwt, rememberMe);
      return Promise.resolve(jwt);
    } else {
      return Promise.reject('auth-jwt-service Promise reject'); // Put appropriate error message here
    }
  }

  storeAuthenticationToken(jwt, rememberMe) {
    if (rememberMe) {
      this.$localStorage.store('authenticationToken', jwt);
    } else {
      this.$sessionStorage.store('authenticationToken', jwt);
    }
  }

  logout(): Observable<any> {
    return new Observable((observer) => {
      this.$localStorage.clear('authenticationToken');
      this.$sessionStorage.clear('authenticationToken');
      observer.complete();
    });
  }
}
