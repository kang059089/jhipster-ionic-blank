import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from "../api/api";

/*
  Generated class for the VerifyCodeServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VerifyCodeServiceProvider {

  private resourceUrl =  '/verify-code';

  constructor(
    public api: Api,
    public http: HttpClient) {
    this.resourceUrl = Api.API_URL + this.resourceUrl;
    console.log('验证码服务');
  }

  /**
   * 向后台发送生成验证码的请求
   * @param {string} phoneOrEmail 手机号码或邮箱
   * @param {number} state 判断phoneOrEmail是手机还是邮箱（0：手机号码，1：邮箱）
   * @returns {Observable<Object>}
   */
  sendVerificationCode(phoneOrEmail: string, state: number, clientId: string) {
    return this.http.get(`${this.resourceUrl}/send/${phoneOrEmail}/${state}/${clientId}`);
  }

}
