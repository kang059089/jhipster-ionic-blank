//用户信息对象
export class UserModel {
  public id: any;
  public login: string;
  public password: string;
  public firstName: string;
  public lastName: string;
  public email: string;
  public phone: string;
  public activeted: boolean;
  public langKey: string;
  public authorities: any[];
  public createdBy: string;
  public createdDate: Date;
  public lastModifiedBy: string;
  public lastModifiedDate: Date;
  public code: string;
  public clientId: string;
}
