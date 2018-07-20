import { Component } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from "../pages/login/login";
import { WelcomePage } from "../pages/welcome/welcome";
import { Storage } from '@ionic/storage';
import { NativeServiceProvider } from "../providers/native-service/native-service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private storage: Storage,
    private nativeService: NativeServiceProvider,
    private toastCtrl: ToastController) {
    this.storage.get('firstIn').then((result) => {
      if(result) {
        this.rootPage = LoginPage;
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

