import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController } from 'ionic-angular';
import { LocalStorageService } from 'ngx-webstorage';

import { UserModel } from "../../models/user";

import { NativeServiceProvider } from "../../providers/native-service/native-service";
import { VerifyCodeServiceProvider } from "../../providers/verify-code-service/verify-code-service";
import { UserServiceProvider } from "../../providers/user-service/user-service";


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
  registerInfo: { phoneOrEmail: string, password: string, code: string, checkboxStyle: boolean, state: number, clientId: string} = {
    phoneOrEmail: '',//电话号码或邮箱
    password: '',//密码
    code: '',//验证码
    checkboxStyle: false,//控制用户协议是否勾选
    state: -1,
    clientId: '',
  };

  //验证码倒计时
  verifyCode: any = {
    verifyCodeTips: "获取验证码",
    countdown: 60,
    disable: true
  }


  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public localStorageService: LocalStorageService,
    public nativeService: NativeServiceProvider,
    public verifyCodeService: VerifyCodeServiceProvider,
    public userService: UserServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('纯色背景注册页面');
  }

  /**
   * 注册用户
   */
  doRegister() {
    //验证手机号码或邮箱格式
    if (this.verifyingEmailOrPhone()) {
      //验证手机号码或邮箱是否被注册
      this.userService.findEmailOrPhone(this.registerInfo.phoneOrEmail).subscribe((res) => {
        if (res.body == 0) {
          if (this.registerInfo.state != -1) {
            //验证密码格式
            if (this.verifyingPwd()) {
              //验证验证码是否填写
              if (this.registerInfo.code != '') {
                //验证用户协议是否勾选
                if (this.registerInfo.checkboxStyle == true) {
                  let user = new UserModel();
                  if(this.registerInfo.state == 0) {
                    user.phone = this.registerInfo.phoneOrEmail;
                  } else if(this.registerInfo.state == 1) {
                    user.email = this.registerInfo.phoneOrEmail;
                  }
                  user.login = this.registerInfo.phoneOrEmail;
                  user.password = this.registerInfo.password;
                  user.code = this.registerInfo.code;
                  user.clientId = this.registerInfo.clientId;
                  user.langKey = 'en';
                  //注册用户
                  this.userService.registerUser(user).subscribe((res: any) => {
                    if (res.body == 1) {
                      this.nativeService.showToast('注册失败，请重新注册！', 3000);
                      return;
                    } else if (res.body == 2) {
                      this.nativeService.showToast('验证码错误！', 3000);
                      return;
                    }
                    //注册成功返回登录页面
                    this.navCtrl.push('PureColorLoginPage');
                  });
                } else {
                  this.nativeService.showToast('请同意用户协议！', 3000);
                }
              } else {
                this.nativeService.showToast('请填写验证码！', 3000);
              }
            }
          }
        } else {
          if (this.registerInfo.state == 0) {
            this.nativeService.showToast('该号码已被注册！', 3000);
          } else if (this.registerInfo.state == 1) {
            this.nativeService.showToast('该邮箱已被注册！', 3000);
          }
        }
      });
    }
  }

  /**
   * 发送验证码
   */
  sendVerificationCode() {
    if (this.registerInfo.phoneOrEmail == '') {
      this.nativeService.showToast('请填写手机号 / 邮箱!', 3000);
      return;
    }
    //发送验证码成功后开始倒计时
    this.verifyCode.disable = false;
    this.settime();

    this.registerInfo.clientId = this.localStorageService.retrieve('clientId');
    //向后台发送生成验证码的请求
    this.verifyCodeService.sendVerificationCode(this.registerInfo.phoneOrEmail, this.registerInfo.state, this.registerInfo.clientId).subscribe(() => {

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

  /**
   * 验证邮箱或者手机号码是否有效
   */
  verifyingEmailOrPhone() {
    //判断phoneOrEmail是中否包含@，包含则进行邮箱验证，不包含则进行手机号码验证
    if (this.registerInfo.phoneOrEmail.indexOf('@') == -1) {
      //中国手机号码正则
      let regexPhoneCN = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      //美国手机号码正则
      let regexPhoneEN = /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/;
      if (this.registerInfo.phoneOrEmail.length == 11) {
        if (!regexPhoneCN.test(this.registerInfo.phoneOrEmail)) {
          this.nativeService.showToast('请填写正确的手机号码！', 3000);
          return false;
        }
        this.registerInfo.state = 0;
        return true;
      } else if(this.registerInfo.phoneOrEmail.length == 10) {
        if (!regexPhoneEN.test(this.registerInfo.phoneOrEmail)) {
          this.nativeService.showToast('Please fill in the correct phone number！', 3000);
          return false;
        }
        this.registerInfo.state = 0;
        return true;
      } else {
        this.nativeService.showToast('请填写正确的手机号码！', 3000);
        return false;
      }
    } else {
      //邮箱正则
      let regexEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      if (!regexEmail.test(this.registerInfo.phoneOrEmail)) {
        this.nativeService.showToast('请填写正确的邮箱地址！', 3000);
        return false;
      }
      this.registerInfo.state = 1;
      return true;
    }
  }

  /**
   * 验证密码是否有效
   */
  verifyingPwd() {
    //密码正则（6-18位至少包含一个字母和数字的正则）
    let regexPwd = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/;
    if (this.registerInfo.password.length < 6) {
      this.nativeService.showToast('密码不能低于6位数！', 3000);
      return false;
    } else if (this.registerInfo.password.length > 18) {
      this.nativeService.showToast('密码不能超过18位数！', 3000);
      return false;
    } else {
      if (!regexPwd.test(this.registerInfo.password)) {
        this.nativeService.showToast('密码至少包含一个字母和数字！', 3000);
        return false;
      }
      return true;
    }
  }

}
