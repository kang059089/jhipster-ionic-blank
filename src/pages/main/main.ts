import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginServiceProvider } from "../../providers/login-service/login-service";
import { LoginPage } from "../login/login";
import { PureColorLoginPage } from "../pure-color-login/pure-color-login";

/**
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  rootPage: any;

  constructor(
    public app: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loginService: LoginServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('主页面');
  }

  loginOut() {
    this.loginService.logout();
    localStorage.clear();
    this.app.getRootNavs()[0].setRoot(PureColorLoginPage);
  }

}
