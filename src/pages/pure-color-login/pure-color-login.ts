import { Component } from '@angular/core';
import { App, Events, IonicPage, NavController, ToastController } from 'ionic-angular';
import { TranslateService } from "@ngx-translate/core";

import { LoginServiceProvider } from "../../providers/login-service/login-service";
import { VersionServiceProvider } from "../../providers/version-service/version-service";
import { MainPage } from "../main/main";

/**
 * Generated class for the PureColorLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pure-color-login',
  templateUrl: 'pure-color-login.html',
})
export class PureColorLoginPage {

  // The account fields for the login form.
  account: { username: string, password: string, rememberMe: boolean } = {
    username: '',
    password: '',
    rememberMe: true
  };

  //用来接收account帐户信息的属性
  loginAc: any;

  // Our translated text strings
  private loginErrorString: string;

  constructor(
    public app: App,
    public navCtrl: NavController,
    public events: Events,
    public loginService: LoginServiceProvider,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public versionService: VersionServiceProvider) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    });

    // 接收登录服务对应的事件，获取account帐户信息
    events.subscribe('login-account', (account) =>{
      //用户没有上传头像则显示默认，有则直接显示
      account.imageUrl == '' ? account.imageUrl = 'assets/imgs/avatar.png' : account.imageUrl;
      PureColorLoginPage.prototype.loginAc = account;
    });
  }

  ionViewDidLoad() {
    console.log('纯色背景登录页面');
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
      //登录成功设置根页面，只做跳转的话，侧边栏不会显示。
      let rootNav = this.app.getRootNavs()[0];
      rootNav.setRoot(MainPage);
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
   * 注册跳转到注册页面
   */
  register() {
    this.navCtrl.push('PureColorRegisterPage');
  }

  /**
   * 忘记密码跳转到找回密码页面（待完成）
   */
  forgetPassword() {
    this.navCtrl.push('PureColorResetpasswordPage');
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
