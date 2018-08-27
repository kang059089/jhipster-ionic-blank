import { Component, ViewChild } from '@angular/core';
import { Events, Nav, Platform, ToastController } from 'ionic-angular';
import { WelcomePage } from "../pages/welcome/welcome";
import { Storage } from '@ionic/storage';
import { NativeServiceProvider } from "../providers/native-service/native-service";
import { Secret } from "../providers/secret";
import { LoginServiceProvider } from "../providers/login-service/login-service";
import { MainPage } from "../pages/main/main";
import { VersionServiceProvider } from "../providers/version-service/version-service";
import { PureColorLoginPage } from "../pages/pure-color-login/pure-color-login";
import { InitServiceProvider } from "../providers/auth/init.service"
import { SetUpPage } from "../pages/set-up/set-up";
import { DEFAULT_AVATAR } from "../providers/constants";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  account: { username: string, password: string, rememberMe: boolean } = {
    username: '',
    password: '',
    rememberMe: true,
  };
  pages: Array<{title: string, component: any, icon: string}>;
  //用来接收account帐户信息的属性
  loginAc: any;

  constructor(
    private platform: Platform,
    private storage: Storage,
    private nativeService: NativeServiceProvider,
    private toastCtrl: ToastController,
    private events: Events,
    private loginService: LoginServiceProvider,
    private versionService: VersionServiceProvider,
    private initServiceProvider: InitServiceProvider) {

    // 接收登录服务对应的事件，获取account帐户信息
    events.subscribe('login-account', (account) =>{
      //用户没有上传头像则显示默认，有则直接显示
      if (account.imageUrl == '') {
        account.imageUrl = DEFAULT_AVATAR;
      } else {
        MyApp.prototype.loginAc = account;
      }
    });

    this.initServiceProvider.init().then((clientId) => {
      this.storage.get('firstIn').then((result) => {
        if (result) {
          //加载app的时候获取本地存储的用户信息并解密
          if (localStorage.getItem('username') != null && localStorage.getItem('password') != null) {
            this.account.username = Secret.Decrypt(localStorage.getItem('username'));
            this.account.password = Secret.Decrypt(localStorage.getItem('password'));
            let rememberMe = localStorage.getItem('rememberMe');
            if (rememberMe != 'false' || rememberMe != null) {
              this.account.rememberMe = true;
              this.loginService.login(this.account).then((response) => {
                //初始化版本信息
                this.versionService.init();
                setTimeout(() => {
                  //检测app是否升级
                  this.versionService.assertUpgrade();
                }, 5000);
                //登录成功设置根页面为MainPage
                this.rootPage = MainPage;
              }, (err) => {
                console.log(err);
              });
            }
          } else {
            //背景图片的登录页面
            //this.rootPage = LoginPage;
            //纯色背景的登录页面
            this.rootPage = PureColorLoginPage;
          }
        } else {
          this.storage.set('firstIn', true);
          this.rootPage = WelcomePage;
        }
      });
    });

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //状态栏样式
      this.nativeService.statusBarStyle();
      //隐藏启动页
      this.nativeService.splashScreenHide();
      //检测网络
      this.assertNetwork();



    });

    this.pages = [
      { title: '设置', component: SetUpPage, icon: 'md-setUp'}
    ];
  }

  /**
   * 检测网络连接情况
   */
  assertNetwork() {
    if (!this.nativeService.isConnecting()) {
      this.toastCtrl.create({
        message: '未检测到网络,请连接网络',
        showCloseButton: true,
        closeButtonText: '确定'
      }).present();
    }
  }

  /**
   * 点击菜单侧边栏中的按钮打开对应页面
   * @param page
   */
  openPage(page) {
    this.nav.push(page.component);
  }

  /**
   * 点击菜单侧边栏中的头像、用户信息等打开编辑用户信息页面
   */
  openUserInfo() {
    this.nav.push('UserInfoPage');
  }
}

