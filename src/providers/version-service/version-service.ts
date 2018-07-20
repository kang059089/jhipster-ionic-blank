import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NativeServiceProvider } from "../native-service/native-service";
import { Api } from "../api/api";
import { VersionFileModel } from "../../models/versionFile";
import { Observable } from "rxjs/Observable";
import { AlertController } from "ionic-angular";
import { Utils } from "../utils";
import { FILE_SERVE_URL, APP_VERSION_SERVE_URL } from "../constants";
import { File } from "@ionic-native/file";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { FileOpener } from "@ionic-native/file-opener";
import { AdminVersionFileModel } from "../../models/adminVersionFile";

/*
  Generated class for the VersionServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export type EntityResponseType = HttpResponse<VersionFileModel>;
export type AdminEntityResponseType = HttpResponse<AdminVersionFileModel>;

@Injectable()
export class VersionServiceProvider {

  appName;//如app id为com.kit.ionic2tabs,则appName为ionic2tabs
  appType;//android 或 ios
  currentVersionNo;//当前版本号
  latestVersionNo;//最新版本号
  lastVersionInfo;//从后台获取到的app最新版本信息
  versions;//app更新日志

  versionFile: VersionFileModel;//app版本信息对象（xml）
  adminVersionFile: AdminVersionFileModel;//管理员app版本信息对象
  isMobile = false;//是否移动端

  appDownloadPageUrl;//下载页访问地址
  apkUrl;//android apk地址

  //app更新进度.默认为0,在app升级过程中会改变
  updateProgress: number = -1;

  isInit: boolean = false; //初始化未完成

  constructor(
    public http: HttpClient,
    public api: Api,
    public nativeService: NativeServiceProvider,
    public alertCtrl: AlertController,
    public file: File,
    public fileTransfer: FileTransfer,
    public fileOpener: FileOpener) {
    console.log('版本服务');
  }

  /**
   * 初始化版本信息
   */
  init() {
    console.log('初始化版本');
    //判断是否为真机环境
    this.isMobile = this.nativeService.isMobile();
    if(this.isMobile) {
      //获取app版本号
      this.nativeService.getVersionNumber().subscribe((currentVersionNo) => {
        this.currentVersionNo = currentVersionNo;
        console.log(this.currentVersionNo);
      });
      //获取app包名
      this.nativeService.getPackageName().subscribe((packageName) => {
        //app名称
        this.appName = packageName.substring(packageName.lastIndexOf('.') + 1);
        //app类型（android或ios）
        this.appType = this.nativeService.isAndroid() ? 'android' : 'ios';
        //app文件下载页面地址
        this.appDownloadPageUrl = FILE_SERVE_URL + '/static/download.html?name=' + this.appName;
        //从后台查询app最新版本信息
        //region 此方法通过后台解析.xml文件返回版本信息

        // let versionUrl = Api.API_URL + '/version-files/' + this.appName + '/' + this.appType;
        // this.getLatestVersion(versionUrl).subscribe((versionFileResponse: HttpResponse<VersionFileModel>) => {
        //   console.log(versionFileResponse.body);
        //   if(versionFileResponse.body != null) {
        //     this.versionFile = versionFileResponse.body;
        //     //初始化已完成
        //     this.isInit = true;
        //   }
        // });

        //endregion
        //此方法通过传入版本状态（versionReleaseState = 1）查询管理员发布的版本信息
        let versionUrl =  Api.API_URL + '/admin-version-files/versionReleaseState/' + 1;
        this.getAdminLatestVersion(versionUrl).subscribe((adminVersionFileResponse: HttpResponse<AdminVersionFileModel>) => {
          console.log('管理员发布的版本信息为：');
          console.log(adminVersionFileResponse.body);
          if(adminVersionFileResponse.body.id != null) {
            this.adminVersionFile = adminVersionFileResponse.body;
            //初始化已完成
            this.isInit = true;
          }
        });
      });
    }
  }

  /**
   * 获取最新app版本信息
   * @param {string} versionUrl
   * @returns {Observable<EntityResponseType>}
   */
  getLatestVersion (versionUrl: string): Observable<EntityResponseType> {
    return this.http.get(versionUrl, {observe: 'response'})
      .map((res: EntityResponseType) => this.convertResponse(res));
  }

  /**
   * 获取管理员发布的最新app版本信息
   * @param {string} versionUrl
   * @returns {Observable<AdminEntityResponseType>}
   */
  getAdminLatestVersion(versionUrl: string): Observable<AdminEntityResponseType> {
    return this.http.get(versionUrl, {observe: 'response'})
      .map((res: AdminEntityResponseType) => this.adminConvertResponse(res));
  }

  /**
   * 是否需要升级
   */
  assertUpgrade() {
    if (this.isMobile) {
      if (!this.isInit) {
        //初始化未完成,延迟5秒
        setTimeout(() => {
          this.assertUpgrade();
        }, 5000);
      } else {
        //region 解析xml模式的app版本升级
        //
        // //判断版本号是否相等,不相等则需要更新
        // if(this.versionFile.latestVersionNo && (this.currentVersionNo != this.versionFile.latestVersionNo)) {
        //   let that = this;
        //   //判断是否强制更新
        //   if(this.versionFile.forceUpdateState == 1) {
        //     this.alertCtrl.create({
        //       title: '重要升级',
        //       subTitle: '您必须升级后才能使用！',
        //       enableBackdropDismiss: false,
        //       buttons: [{
        //         text: '确定', handler: () => {
        //           that.downloadApp();
        //         }
        //       }
        //       ]
        //     }).present();
        //   } else {
        //     this.alertCtrl.create({
        //       title: '升级',
        //       subTitle: '发现新版本,是否立即升级？',
        //       enableBackdropDismiss: false,
        //       buttons: [{text: '取消'}, {
        //         text: '确定', handler: () => {
        //           that.downloadApp();
        //         }
        //       }]
        //     }).present();
        //   }
        // }
        //
        //endregion
        //读取管理员发布的app版本升级
        //判断版本号是否相等,不相等则需要更新
        if(this.adminVersionFile.versionNo && (this.currentVersionNo != this.adminVersionFile.versionNo)) {
          let that = this;
          //判断是否强制更新
          if(this.adminVersionFile.forceUpdateState == true) {
            this.alertCtrl.create({
              title: '重要升级',
              subTitle: '您必须升级后才能使用！',
              enableBackdropDismiss: false,
              buttons: [{
                text: '确定', handler: () => {
                  that.downloadApp();
                }
              }
              ]
            }).present();
          } else {
            this.alertCtrl.create({
              title: '升级',
              subTitle: '发现新版本,是否立即升级？',
              enableBackdropDismiss: false,
              buttons: [{text: '取消'}, {
                text: '确定', handler: () => {
                  that.downloadApp();
                }
              }]
            }).present();
          }
        }
      }
    }
  }

  /**
   * 下载app
   */
  downloadApp() {
    //ios打开网页下载
    // if (this.nativeService.isIos()) {
    //   this.nativeService.openUrlByBrowser(this.appDownloadPageUrl);
    // }
    //region 解析xml版本信息后的下载
    //
    // //android本地下载
    // if (this.nativeService.isAndroid()) {
    //   if (!this.versionFile.appDownloadUrl) {
    //     this.nativeService.alert('未找到android apk下载地址');
    //     return;
    //   }
    //   this.nativeService.externalStoragePermissionsAuthorization().subscribe(() => {
    //     //是否后台下载
    //     let backgroundProcess = false;
    //     //显示下载进度
    //     let alert;
    //     //如果是强制更新则没有后台下载按钮
    //     if (this.versionFile.forceUpdateState == 1) {
    //       alert = this.alertCtrl.create({
    //         title: '下载进度：0%',
    //         enableBackdropDismiss: false
    //       });
    //     } else {
    //       alert = this.alertCtrl.create({
    //         title: '下载进度：0%',
    //         enableBackdropDismiss: false,
    //         buttons: [{
    //           text: '后台下载', handler: () => {
    //             backgroundProcess = true;
    //           }
    //         }]
    //       });
    //     }
    //     alert.present();
    //
    //     const fileTransfer: FileTransferObject = this.fileTransfer.create();
    //     //.apk文件下载地址
    //     let url = `${APP_VERSION_SERVE_URL}`;
    //     //apk保存的目录
    //     const apk = this.file.externalRootDirectory + 'download/' + `android_${Utils.getSequence()}.apk`;
    //     //下载并安装apk
    //     fileTransfer.download(this.versionFile.appDownloadUrl, apk).then(() => {
    //       alert && alert.dismiss();
    //       this.fileOpener.open(apk, 'application/vnd.android.package-archive');
    //     }, (err) => {
    //       this.updateProgress = -1;
    //       alert && alert.dismiss();
    //       console.log('android app 本地升级失败');
    //       console.log(err);
    //       this.alertCtrl.create({
    //         title: '前往网页下载',
    //         subTitle: '本地升级失败',
    //         buttons: [{
    //           text: '确定', handler: () => {
    //             this.nativeService.openUrlByBrowser(this.appDownloadPageUrl);//打开网页下载
    //           }
    //         }
    //         ]
    //       }).present();
    //     });
    //     //由于onProgress事件调用非常频繁,所以使用setTimeout用于函数节流
    //     let timer = null;
    //     fileTransfer.onProgress((event: ProgressEvent) => {
    //       //下载进度
    //       let progress = Math.floor(event.loaded / event.total * 100);
    //       console.log('下载进度：' + progress);
    //       this.updateProgress = progress;
    //       if(!timer) {
    //         //更新下载进度
    //         timer = setTimeout(() => {
    //           if (progress === 100) {
    //             alert && alert.dismiss();
    //           } else {
    //             if (!backgroundProcess) {
    //               let title = document.getElementsByClassName('alert-title')[0];
    //               title && (title.innerHTML = `下载进度：${progress}%`);
    //             }
    //           }
    //           clearTimeout(timer);
    //           timer = null;
    //         }, 10);
    //       }
    //     });
    //   });
    // }
    //
    //endregion
    //读取管理员发布的版本信息后的下载
    //android本地下载
    if (this.nativeService.isAndroid()) {
      if (!this.adminVersionFile.appDownloadUrl) {
        this.nativeService.alert('未找到android apk下载地址');
        return;
      }
      this.nativeService.externalStoragePermissionsAuthorization().subscribe(() => {
        //是否后台下载
        let backgroundProcess = false;
        //显示下载进度
        let alert;
        //如果是强制更新则没有后台下载按钮
        if (this.adminVersionFile.forceUpdateState == true) {
          alert = this.alertCtrl.create({
            title: '下载进度：0%',
            enableBackdropDismiss: false
          });
        } else {
          alert = this.alertCtrl.create({
            title: '下载进度：0%',
            enableBackdropDismiss: false,
            buttons: [{
              text: '后台下载', handler: () => {
                backgroundProcess = true;
              }
            }]
          });
        }
        alert.present();

        const fileTransfer: FileTransferObject = this.fileTransfer.create();
        //.apk文件下载地址
        let url = `${APP_VERSION_SERVE_URL}`;
        //apk保存的目录
        const apk = this.file.externalRootDirectory + 'download/' + `android_${Utils.getSequence()}.apk`;
        //下载并安装apk
        fileTransfer.download(this.adminVersionFile.appDownloadUrl, apk).then(() => {
          alert && alert.dismiss();
          this.fileOpener.open(apk, 'application/vnd.android.package-archive');
        }, (err) => {
          this.updateProgress = -1;
          alert && alert.dismiss();
          console.log('android app 本地升级失败');
          console.log(err);
          this.alertCtrl.create({
            title: '前往网页下载',
            subTitle: '本地升级失败',
            buttons: [{
              text: '确定', handler: () => {
                this.nativeService.openUrlByBrowser(this.appDownloadPageUrl);//打开网页下载
              }
            }
            ]
          }).present();
        });
        //由于onProgress事件调用非常频繁,所以使用setTimeout用于函数节流
        let timer = null;
        fileTransfer.onProgress((event: ProgressEvent) => {
          //下载进度
          let progress = Math.floor(event.loaded / event.total * 100);
          console.log('下载进度：' + progress);
          this.updateProgress = progress;
          if(!timer) {
            //更新下载进度
            timer = setTimeout(() => {
              if (progress === 100) {
                alert && alert.dismiss();
              } else {
                if (!backgroundProcess) {
                  let title = document.getElementsByClassName('alert-title')[0];
                  title && (title.innerHTML = `下载进度：${progress}%`);
                }
              }
              clearTimeout(timer);
              timer = null;
            }, 10);
          }
        });
      });
    }
  }



  private convertResponse(res: EntityResponseType): EntityResponseType {
    const body: VersionFileModel = this.convertItemFromServer(res.body);
    return res.clone({body});
  }

  private convertItemFromServer(versionFile: VersionFileModel): VersionFileModel {
    const copy: VersionFileModel = Object.assign(new VersionFileModel(), versionFile);
    return copy;
  }

  private adminConvertResponse(res: AdminEntityResponseType): AdminEntityResponseType {
    const body: AdminVersionFileModel = this.adminConvertItemFromServer(res.body);
    return res.clone({body});
  }

  private adminConvertItemFromServer(adminVersionFileModel: AdminVersionFileModel): AdminVersionFileModel {
    const copy: AdminVersionFileModel = Object.assign(new AdminVersionFileModel(), adminVersionFileModel);
    return copy;
  }

}
