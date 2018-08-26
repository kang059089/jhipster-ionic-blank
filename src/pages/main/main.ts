import { Component } from '@angular/core';
import {App, Events, IonicPage, MenuController, NavController} from 'ionic-angular';
import { LoginServiceProvider } from "../../providers/login-service/login-service";
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

  constructor(
    public app: App,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loginService: LoginServiceProvider,
    public events: Events) {
    //左侧菜单栏
    this.menuCtrl.enable(true, 'authenticated');
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
