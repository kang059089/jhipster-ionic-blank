import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { NativeServiceProvider } from "../../providers/native-service/native-service";
import { VerifyCodeServiceProvider } from "../../providers/verify-code-service/verify-code-service";
import { LocalStorageService } from 'ngx-webstorage';

/**
 * Generated class for the PureColorRegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pure-color-register',
  templateUrl: 'pure-color-register.html',
})
export class PureColorRegisterPage {

  //注册信息
  registerInfo: { phoneOrEmail: string, password: string, code: string, checkboxStyle: boolean} = {
    phoneOrEmail: '',//电话号码或邮箱
    password: '',//密码
    code: '',//验证码
    checkboxStyle: false//控制用户协议是否勾选
  };

  //验证码倒计时
  verifyCode: any = {
    verifyCodeTips: "获取验证码",
    countdown: 60,
    disable: true
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public nativeService: NativeServiceProvider,
    public verifyCodeService: VerifyCodeServiceProvider,
    public localStorageService: LocalStorageService) {
  }

  ionViewDidLoad() {
    console.log('纯色背景注册页面');
  }

  /**
   * 注册用户
   */
  doRegister() {

  }

  /**
   * 发送验证码
   */
  sendVerificationCode() {
    if (this.registerInfo.phoneOrEmail == '') {
      this.nativeService.showToast('请填写手机号 / 邮箱!', 3000)
      return;
    }
    //发送验证码成功后开始倒计时
    this.verifyCode.disable = false;
    this.settime();
    //向后台发送生成验证码的请求
    const clientId = this.localStorageService.retrieve('clientId');
    this.verifyCodeService.sendVerificationCode(this.registerInfo.phoneOrEmail, 1, clientId).subscribe((res) => {
      console.log('返回的验证码');
      console.log(res);
    });
  }

  /**
   * 验证码倒计时
   */
  settime() {
    if (this.verifyCode.countdown == 1) {
      this.verifyCode.countdown = 60;
      this.verifyCode.verifyCodeTips = "获取验证码";
      this.verifyCode.disable = true;
      return;
    } else {
      this.verifyCode.countdown--;
    }

    this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + ")";
    setTimeout(() => {
      this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + ")";
      this.settime();
    }, 1000);
  }

  /**
   *控制用户协议的勾选
   */
  checkbox() {
    this.registerInfo.checkboxStyle = !this.registerInfo.checkboxStyle;
  }

  /**
   * 跳转到用户协议页面
   */
  userAgreement() {
    this.navCtrl.push('UserAgreementPage');
  }

}
