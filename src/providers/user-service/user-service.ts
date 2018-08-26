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

export type EntityResponseType = HttpResponse<UserModel>;

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
  registerUser(user: UserModel): Observable<EntityResponseType> {
    return this.http.post<UserModel>(Api.API_URL + '/register', user, {observe: 'response'});
  }

  /**
   * 用户重置密码
   * @param {UserModel} user
   * @returns {Observable<HttpResponse<UserModel>>}
   */
  resetPassword(user: UserModel): Observable<EntityResponseType> {
    return this.http.post<UserModel>(Api.API_URL + '/resetPassword', user, {observe: 'response'});
  }

  /**
   * 通过用户id查询用户信息
   * @param {string} userId 用户id
   * @returns {Observable<HttpResponse<UserModel>>} 该用户信息
   */
  findUserById(userId: string): Observable<EntityResponseType> {
    return this.http.get(`${this.resourceUrl}/userId/${userId}`, {observe: 'response'})
      .map((res: EntityResponseType) => this.convertResponse(res));
  }

  /**
   * 修改用户信息
   * @param user
   * @returns {Observable<Object>}
   */
  update(user: UserModel): Observable<EntityResponseType> {
    const copy = this.convert(user);
    return this.http.put<UserModel>(this.resourceUrl, copy, {observe: 'response'});
  }

  private convertResponse(res: EntityResponseType): EntityResponseType {
    const body: UserModel = this.convertItemFromServer(res.body);
    return res.clone({body});
  }

  private convertArrayResponse(res: HttpResponse<UserModel[]>): HttpResponse<UserModel[]> {
    const jsonResponse: UserModel[] = res.body;
    const body: UserModel[] = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      body.push(this.convertItemFromServer(jsonResponse[i]));
    }
    return res.clone({body});
  }

  private convertItemFromServer(user: UserModel): UserModel {
    const copy: UserModel = Object.assign(new UserModel(), user);
    return copy;
  }

  private convert(user: UserModel): UserModel {
    const copy: UserModel = Object.assign({}, user);
    return copy;
  }

}
