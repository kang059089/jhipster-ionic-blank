import {ChangeDetectorRef, Component} from '@angular/core';
import { ActionSheetController, IonicPage, NavController, ViewController } from 'ionic-angular';
import { UserModel } from "../../models/user";
import { Secret } from "../../providers/secret";
import { UserServiceProvider } from "../../providers/user-service/user-service";
import { HttpResponse } from "@angular/common/http";
import { DEFAULT_AVATAR } from "../../providers/constants";
import { NativeServiceProvider } from "../../providers/native-service/native-service";
import { Camera } from "@ionic-native/camera";


/**
 * Generated class for the UserInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//declare var AlloyCrop;

@IonicPage()
@Component({
  selector: 'page-user-info',
  templateUrl: 'user-info.html',
})
export class UserInfoPage {
  user: UserModel;
  //头像是否改变标识
  isChange: boolean = false;
  //头像路径
  avatarPath: string;

  constructor(
    public navCtrl: NavController,
    public userService: UserServiceProvider,
    public cd: ChangeDetectorRef,
    public actionSheetCtrl: ActionSheetController,
    public nativeService: NativeServiceProvider,
    public viewCtrl: ViewController,
    public camera: Camera) {

    //实例化用户信息对象
    this.user =  new UserModel();
    //解析本地存储的userId
    this.user.id = Secret.Decrypt(localStorage.getItem('userId'));

  }

  ionViewDidLoad() {
    console.log('编辑用户信息页面');
    //获取用户信息
    this.userService.findUserById(this.user.id).subscribe((userRes: HttpResponse<UserModel>) => {
      if (userRes.body != null) {
        if (userRes.body.imageUrl == '') {
          this.avatarPath = DEFAULT_AVATAR;
        } else {
          this.avatarPath = userRes.body.imageUrl;
          console.log(this.avatarPath);
        }
        this.user = userRes.body;
      }
    });
  }

  /**
   * 选择头像上传
   */
  uploadImage() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '选择',
      buttons: [
        {
          text: '拍照',
          role: 'destructive',
          handler: () => {
            let options = {
              quality: 100,//相片质量 0 -100
              encodingType: this.camera.EncodingType.JPEG,//选择返回的图像文件的编码
              saveToPhotoAlbum: true//是否保存到相册
            };
            this.nativeService.getPictureByCamera(options).subscribe(fileUrl => {
              this.isChange = true;
              //this.avatarPath = imageBase64;
              this.saveAvatar(fileUrl, this.user.id);
            });
          }
        },
        {
          text: '从手机相册选择',
          handler: () => {
            let options: any = {
              quality: 100,//相片质量 0 -100
              targetWidth: 400,
              targetHeight: 400
            };
            this.nativeService.getPictureByPhotoLibrary(options).subscribe(fileUrl => {
              this.isChange = true;
              //this.avatarPath = imageBase64;
              this.saveAvatar(fileUrl, this.user.id);
            });
          }
        },
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  // 图片的截取
  // private getPictureSuccess(imageBase64) {
  //   console.log(fileUrl);
  //   new AlloyCrop({//api:https://github.com/AlloyTeam/AlloyCrop
  //     image_src: imageBase64,
  //     className: 'crop-box',
  //     circle: false, // optional parameters , the default value is false
  //     width: 300, // crop width
  //     height: 300, // crop height
  //     output: 2,
  //     ok: (base64) => {
  //       this.isChange = true;
  //       this.userInfo.avatarPath = base64;
  //     },
  //     cancel: () => {
  //     },
  //     ok_text: "确定", // optional parameters , the default value is ok
  //     cancel_text: "取消" // optional parameters , the default value is cancel
  //   });
  // }

  //上传图片到服务器
  saveAvatar(fileUrl, userId) {
    if (this.isChange) {
      console.log(fileUrl);//这是头像地址.
      this.nativeService.showLoading('正在上传....');
      //上传图片到服务器返回图片地址
      this.nativeService.uploadImg(fileUrl, userId).subscribe((avatarPath) => {
       if (avatarPath != '') {
         this.user.imageUrl = avatarPath;
         //将图片访问地址保存到数据库
         this.userService.update(this.user).subscribe((res: any) => {
           if (res.body.id != null) {
             this.nativeService.convertImgToBase64(fileUrl).subscribe((base64) => {
               this.avatarPath = base64;
             });
             this.cd.detectChanges();
             this.nativeService.hideLoading();
           }
         });
       } else {
         this.nativeService.hideLoading();
         this.nativeService.showToast('上传图片失败！')
       }
      });
    } else {
      this.nativeService.showToast('修改图片失败！');
      this.viewCtrl.dismiss();
    }
  }

  //编辑用户信息
  editUserInfo() {
    this.nativeService.showLoading();
    this.userService.update(this.user).subscribe((res: any) => {
      if (res.body.id != null) {
        this.cd.detectChanges();
        this.nativeService.hideLoading();
        this.viewCtrl.dismiss();
      }
    });
  }


}
