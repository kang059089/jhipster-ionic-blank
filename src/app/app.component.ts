import { Component } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from "../pages/login/login";
import { WelcomePage } from "../pages/welcome/welcome";
import { Storage } from '@ionic/storage';
import { NativeServiceProvider } from "../providers/native-service/native-service";
import { Secret } from "../providers/secret";
import { LoginServiceProvider } from "../providers/login-service/login-service";
import { MainPage } from "../pages/main/main";
import { VersionServiceProvider } from "../providers/version-service/version-service";
import { PureColorLoginPage } from "../pages/pure-color-login/pure-color-login";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  account: { username: string, password: string, rememberMe: boolean } = {
    username: '',
    password: '',
    rememberMe: true,
  };

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private storage: Storage,
    private nativeService: NativeServiceProvider,
    private toastCtrl: ToastController,
    private loginService: LoginServiceProvider,
    public versionService: VersionServiceProvider) {
    this.storage.get('firstIn').then((result) => {
      console.log(result);
      if(result) {
        //加载app的时候获取本地存储的用户信息并解密
        if(localStorage.getItem('username') != null && localStorage.getItem('password') != null) {
          this.account.username = Secret.Decrypt(localStorage.getItem('username'));
          this.account.password = Secret.Decrypt(localStorage.getItem('password'));
          let rememberMe = localStorage.getItem('rememberMe');
          console.log(this.account);
          if(rememberMe != 'false' || rememberMe != null) {
            this.account.rememberMe = true;
            this.loginService.login(this.account).then((response) => {
              //初始化版本信息
              this.versionService.init();
              setTimeout(() => {
                //检测app是否升级
                this.versionService.assertUpgrade();
              }, 5000);
              //登录成功设置根页面为MainPage
              this.rootPage = 'MainPage';
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

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      //检测网络
      this.assertNetwork();



    });
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
}

