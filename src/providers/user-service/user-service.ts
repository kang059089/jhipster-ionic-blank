import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Api } from "../api/api";
import { Observable } from "rxjs/Observable";

import { UserModel } from "../../models/user";


/*
  Generated class for the UserServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserServiceProvider {

  private resourceUrl = '/users';

  constructor(
    public api: Api,
    public http: HttpClient) {
    this.resourceUrl = Api.API_URL + this.resourceUrl;
    console.log('用户服务');
  }

  /**
   * 查询用户是否已注册
   * @param {string} phoneOrEmail 电话号码或邮箱
   * @returns {number} 返回0则表示用户没有注册过，返回1则表示用户注册过
   */
  findEmailOrPhone(phoneOrEmail: string) {
    return this.http.get(`${this.resourceUrl}/isRegister/${phoneOrEmail}`, {observe: 'response'});
  }

  /**
   * 用户注册
   * @param {UserModel} user
   * @returns {Observable<HttpResponse<User>>}
   */
  registerUser(user: UserModel): Observable<HttpResponse<UserModel>> {
    return this.http.post<UserModel>(Api.API_URL + '/register', user, {observe: 'response'});
  }

  /**
   * 用户重置密码
   * @param {UserModel} user
   * @returns {Observable<HttpResponse<UserModel>>}
   */
  resetPassword(user: UserModel): Observable<HttpResponse<UserModel>> {
    return this.http.post<UserModel>(Api.API_URL + '/resetPassword', user, {observe: 'response'});
  }

}
