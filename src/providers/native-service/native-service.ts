import { Injectable } from '@angular/core';
import { AlertController, Loading, LoadingController, Platform, ToastController } from "ionic-angular";
import { Observable } from "rxjs/Observable";
import { Network } from "@ionic-native/network";
import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { Diagnostic } from "@ionic-native/diagnostic";
import { Toast } from "@ionic-native/toast";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { IMAGE_SIZE, QUALITY_SIZE } from "../constants";
import { ImagePicker } from "@ionic-native/image-picker";
import { File, FileEntry } from "@ionic-native/file";
import { FileTransferObject } from "@ionic-native/file-transfer";
import { Api } from "../api/api";


/*
  Generated class for the NativeServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NativeServiceProvider {

  private loading: Loading;
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private network: Network,
    private appVersion: AppVersion,
    private inAppBrowser: InAppBrowser,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private toast: Toast,
    private diagnostic: Diagnostic,
    private camera: Camera,
    private imagePicker: ImagePicker,
    private loadingCtrl: LoadingController,
    private file: File,
    private fileTransfer: FileTransferObject) {
    console.log('本地服务');
  }

  /**
   * 状态栏
   */
  statusBarStyle(): void {
    if (this.isMobile()) {
      //状态栏是否覆盖主应用程序视图
      this.statusBar.overlaysWebView(true);
      this.statusBar.styleLightContent();
      //状态栏颜色
      this.statusBar.backgroundColorByHexString('#33000000');//3261b3
    }
  }

  /**
   * 隐藏启动页面
   */
  splashScreenHide(): void {
    this.isMobile() && this.splashScreen.hide();
  }

  /**
   * 判断是否有网络
   */
  isConnecting(): boolean {
    return this.getNetworkType() != 'none';
  }

  /**
   * 获取网络类型 如`unknown`, `ethernet`, `wifi`, `2g`, `3g`, `4g`, `cellular`, `none`
   */
  getNetworkType(): string {
    if (!this.isMobile()) {
      return 'wifi';
    }
    return this.network.type;
  }

  /**
   * 是否真机环境
   */
  isMobile(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /**
   * 是否android真机环境
   */
  isAndroid(): boolean {
    return this.isMobile() && this.platform.is('android');
  }

  /**
   * 是否ios真机环境
   */
  isIos(): boolean {
    return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
  }

  /**
   * 获得app版本号,如0.01
   * @description  对应/config.xml中version的值
   */
  getVersionNumber(): Observable<string> {
    return Observable.create(observer => {
      this.appVersion.getVersionNumber().then((value: string) => {
        observer.next(value);
      }).catch(err => {
        console.log('获得app版本号失败');
        console.log(err);
        //this.logger.log(err, '获得app版本号失败');
        observer.error(false);
      });
    });
  }

  /**
   * 获得app包名/id,如com.kit.ionic2tabs
   * @description  对应/config.xml中id的值
   */
  getPackageName(): Observable<string> {
    return Observable.create(observer => {
      this.appVersion.getPackageName().then((value: string) => {
        observer.next(value);
      }).catch(err => {
        console.log('获得app包名失败');
        console.log(err);
        //this.logger.log(err, '获得app包名失败');
        observer.error(false);
      });
    });
  }

  /**
   * 通过浏览器打开url
   */
  openUrlByBrowser(url: string): void {
    this.inAppBrowser.create(url, '_system');
  }

  /**
   * 只有一个确定按钮的弹出框.
   * 如果已经打开则不再打开
   */
  alert = (() => {
    let isExist = false;
    return (title: string, subTitle: string = '', message: string = '', callBackFun = null): void => {
      if (!isExist) {
        isExist = true;
        this.alertCtrl.create({
          title: title,
          subTitle: subTitle,
          message: message,
          buttons: [{
            text: '确定', handler: () => {
              isExist = false;
              callBackFun && callBackFun();
            }
          }],
          enableBackdropDismiss: false
        }).present();
      }
    };
  })();

  /**
   * 统一调用此方法显示提示信息
   * @param message 信息内容
   * @param duration 显示时长
   */
  showToast(message: string = '操作完成', duration: number = 2000): void {
    if (this.isMobile()) {
      this.toast.show(message, String(duration), 'center').subscribe();
    } else {
      this.toastCtrl.create({
        message: message,
        duration: duration,
        position: 'middle',
        showCloseButton: false
      }).present();
    }
  };

  /**
   * 统一调用此方法显示loading
   * @param content 显示的内容
   */
  showLoading(content = ''): void {
    if (!this.loading) {// 如果loading已经存在则不再打开
      const loading = this.loadingCtrl.create({
        content
      });
      loading.present();
      this.loading = loading;
    }
  }

  /**
   * 关闭loading
   */
  hideLoading(): void {
    this.loading && this.loading.dismiss();
    this.loading = null;
  }

  /**
   * 检测app是否有读取存储权限,如果没有权限则会请求权限
   */
  externalStoragePermissionsAuthorization = (() => {
    let havePermission = false;
    return () => {
      return Observable.create(observer => {
        if (havePermission) {
          observer.next(true);
        } else {
          let permissions = [this.diagnostic.permission.READ_EXTERNAL_STORAGE, this.diagnostic.permission.WRITE_EXTERNAL_STORAGE];
          this.diagnostic.getPermissionsAuthorizationStatus(permissions).then(res => {
            if (res.READ_EXTERNAL_STORAGE == 'GRANTED' && res.WRITE_EXTERNAL_STORAGE == 'GRANTED') {
              havePermission = true;
              observer.next(true);
            } else {
              havePermission = false;
              this.diagnostic.requestRuntimePermissions(permissions).then(res => {//请求权限
                if (res.READ_EXTERNAL_STORAGE == 'GRANTED' && res.WRITE_EXTERNAL_STORAGE == 'GRANTED') {
                  havePermission = true;
                  observer.next(true);
                } else {
                  havePermission = false;
                  this.alertCtrl.create({
                    title: '缺少读取存储权限',
                    subTitle: '请在手机设置或app权限管理中开启',
                    buttons: [{text: '取消'},
                      {
                        text: '去开启',
                        handler: () => {
                          this.diagnostic.switchToSettings();
                        }
                      }
                    ]
                  }).present();
                  observer.error(false);
                }
              }).catch(err => {
                console.log('调用diagnostic.requestRuntimePermissions方法失败');
                console.log(err);
                observer.error(false);
              });
            }
          }).catch(err => {
            console.log('调用diagnostic.getPermissionsAuthorizationStatus方法失败');
            console.log(err);
            observer.error(false);
          });
        }
      });
    };
  })();

  /**
   * 使用cordova-plugin-camera获取照片
   * @param options
   */
  getPicture(options: CameraOptions = {}): Observable<string> {
    const ops: CameraOptions = {
      sourceType: this.camera.PictureSourceType.CAMERA, // 图片来源,CAMERA:拍照,PHOTOLIBRARY:相册
      destinationType: this.camera.DestinationType.FILE_URI, // 默认返回图片路径：DATA_URL:base64字符串，FILE_URI:图片路径
      quality: QUALITY_SIZE, // 图像质量，范围为0 - 100
      allowEdit: false, // 选择图片前是否允许编辑
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: IMAGE_SIZE, // 缩放图像的宽度（像素）
      targetHeight: IMAGE_SIZE, // 缩放图像的高度（像素）
      saveToPhotoAlbum: false, // 是否保存到相册
      correctOrientation: true, ...options
    };
    return Observable.create(observer => {
      this.camera.getPicture(ops).then((imgData: string) => {
        if (ops.destinationType === this.camera.DestinationType.DATA_URL) {
          observer.next('data:image/jpg;base64,' + imgData);
        } else {
          observer.next(imgData);
        }
      }).catch(err => {
        if (err == 20) {
          this.alert('没有权限,请在设置中开启权限');
        } else if (String(err).indexOf('cancel') != -1) {
          console.log('用户点击了取消按钮');
        } else {
          console.log('使用cordova-plugin-camera获取照片失败');
          console.log(err);
          //this.logger.log(err, '使用cordova-plugin-camera获取照片失败');
          //this.alert('获取照片失败');
        }
        observer.error(false);
      });
    });
  };

  /**
   * 通过拍照获取照片
   * @param options
   */
  getPictureByCamera(options: CameraOptions = {}): Observable<string> {
    let ops: CameraOptions = Object.assign({
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.FILE_URI//DATA_URL: 0 base64字符串, FILE_URI: 1图片路径
    }, options);
    return this.getPicture(ops);
  };

  /**
   * 通过图库获取照片
   * @param options
   */
  getPictureByPhotoLibrary(options: CameraOptions = {}): Observable<string> {
    let ops: CameraOptions = Object.assign({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI//DATA_URL: 0 base64字符串, FILE_URI: 1图片路径
    }, options);
    return this.getPicture(ops);
  };

  //上传图片
  uploadImg(fileUrl, userId): Observable<any> {
    let avatarServeUrl = Api.API_URL + '/avatar';
    let options = {
      fileKey: 'avatarUpload',//接收图片时的key
      fileName: 'avatar' + userId + '.jpg',
      headers: {
        'Accept':'application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'//不加入 发生错误！！
      },
      params: {
        userId: userId
      }//需要额外上传的参数
    };
    return Observable.create(observer => {
      this.fileTransfer.upload(fileUrl, avatarServeUrl, options).then((imgPath) => {
        observer.next(imgPath.response);
      }).catch(err => {
        console.log('上传图片错误');
        console.log(err);
        observer.error(false);
      });
    });
  }

  /**
   * 通过图库选择多图
   * @param options
   */
  getMultiplePicture(options = {}): Observable<any> {
    const that = this;
    const ops = {
      maximumImagesCount: 6,
      width: IMAGE_SIZE, // 缩放图像的宽度（像素）
      height: IMAGE_SIZE, // 缩放图像的高度（像素）
      quality: QUALITY_SIZE, ...options
    };
    return Observable.create(observer => {
      this.imagePicker.getPictures(ops).then(files => {
        const destinationType = options['destinationType'] || 0; // 0:base64字符串,1:图片url
        if (destinationType === 1) {
          observer.next(files);
        } else {
          const imgBase64s = []; // base64字符串数组
          for (const fileUrl of files) {
            that.convertImgToBase64(fileUrl).subscribe(base64 => {
              imgBase64s.push(base64);
              if (imgBase64s.length === files.length) {
                observer.next(imgBase64s);
              }
            });
          }
        }
      }).catch(err => {
        console.log('通过图库选择多图失败');
        console.log(err);
        //this.logger.log(err, '通过图库选择多图失败');
        this.alert('获取照片失败');
        observer.error(false);
      });
    });
  }

  /**
   * 根据图片绝对路径转化为base64字符串
   * @param path 绝对路径
   */
  convertImgToBase64(path: string): Observable<string> {
    return Observable.create(observer => {
      this.file.resolveLocalFilesystemUrl(path).then((fileEnter: FileEntry) => {
        fileEnter.file(file => {
          const reader = new FileReader();
          reader.onloadend = function (e) {
            observer.next(this.result);
          };
          reader.readAsDataURL(file);
        });
      }).catch(err => {
        console.log('根据图片绝对路径转化为base64字符串失败');
        console.log(err);
        //this.logger.log(err, '根据图片绝对路径转化为base64字符串失败');
        observer.error(false);
      });
    });
  }

}
