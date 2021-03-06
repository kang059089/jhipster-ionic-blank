import { Injectable } from '@angular/core';
import { Principal } from "../auth/principal.service";
import { AuthServerProvider } from "../auth/auth-jwt.service";
import { TranslateService } from "@ngx-translate/core";
import { Events } from "ionic-angular";
import { Secret } from "../secret";

/*
  Generated class for the LoginServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginServiceProvider {

  constructor(
    private principal: Principal,
    private authServerProvider: AuthServerProvider,
    private events: Events,
    private translate: TranslateService) {
    console.log('登录服务');
  }

  login(credentials, callback?) {
    const cb = callback || function() {};

    return new Promise((resolve, reject) => {
      this.authServerProvider.login(credentials).subscribe((data) => {
        this.principal.identity(true).then((account) => {
          // After the login the language will be changed to
          // the language selected by the user during his registration
          // 发布一个事件，把account账户信息发送给登录组件
          this.events.publish('login-account', account);
          //将用户id本地加密存储，方便其它组件调用
          localStorage.setItem('userId', Secret.Encrypt(account.id + '') + '');
          if (account !== null) {
            this.translate.use(account.langKey);
          }
          resolve(data);
        });
        return cb();
      }, (err) => {
        this.logout();
        reject(err);
        return cb(err);
      });
    });
  }

  loginWithToken(jwt, rememberMe) {
    return this.authServerProvider.loginWithToken(jwt, rememberMe);
  }

  logout() {
    this.authServerProvider.logout().subscribe();
    this.principal.authenticate(null);
  }

}
