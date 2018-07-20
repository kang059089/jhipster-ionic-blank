import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { LoginServiceProvider } from "../../providers/login-service/login-service";
import { TranslateService } from '@ngx-translate/core';
import {VersionServiceProvider} from "../../providers/version-service/version-service";
import {Utils} from "../../providers/utils";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  // The account fields for the login form.
  account: { username: string, password: string, rememberMe: boolean } = {
    username: '',
    password: '',
    rememberMe: false,
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(
    public navCtrl: NavController,
    public loginService: LoginServiceProvider,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public versionService: VersionServiceProvider) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  ionViewDidLoad() {
    console.log('登录页面');
  }

  /**
   * 登录跳转到主页面
   */
  login() {
    this.loginService.login(this.account).then((response) => {
      //初始化版本信息
      this.versionService.init();
      setTimeout(() => {
        //检测app是否升级
        this.versionService.assertUpgrade();
      }, 5000);
      this.navCtrl.push('MainPage');
    }, (err) => {
      // Unable to log in
      this.account.password = '';
      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 3000,
        position: 'middle'
      });
      toast.present();
    });
  }

  /**
   * 注册跳转到注册页面（待完成）
   */
  signup() {

  }

  /**
   * 忘记密码跳转到找回密码页面（待完成）
   */
  forgetPassword() {

  }

  /**
   * 第三方授权微信登录（待完成）
   */
  wechatLogin() {

  }

  /**
   * 第三方授权qq登录（待完成）
   */
  qqLogin() {

  }

  /**
   * 第三方授权新浪微博登录（待完成）
   */
  sinaweiboLogin() {

  }

}
