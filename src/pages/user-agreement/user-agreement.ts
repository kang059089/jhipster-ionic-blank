import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserAgreementModel } from "../../models/userAgreement";

/**
 * Generated class for the UserAgreementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-agreement',
  templateUrl: 'user-agreement.html',
})
export class UserAgreementPage {
  //用户协议信息
  userAgreement: UserAgreementModel;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {
    //实例化用户协议信息对象
    this.userAgreement = new UserAgreementModel();
    this.userAgreement.title = '唐诗三百首';
    this.userAgreement.subtitle1 = '1、登鹳雀楼';
    this.userAgreement.st1content1 = '白日依山尽，黄河入海流.欲穷千里目，更上一层楼.';
    this.userAgreement.st1content2 = '该诗是唐代诗人王之涣仅存的六首绝句之一。作者早年及第，曾任过冀州衡水（今河北衡水）县的主薄，不久因遭人诬陷而罢官，不到三十岁的王之涣从此过上了访友漫游的生活。写这首诗的时候，王之涣只有三十五岁。';
    this.userAgreement.subtitle2 = '2、静夜思';
    this.userAgreement.st2content1 = '床前明月光，疑是地上霜.举头望明月，低头思故乡.';
    this.userAgreement.st2content2 = '李白《静夜思》一诗的写作时间是公元726年（唐玄宗开元之治十四年）旧历九月十五日左右。李白时年26岁，写作地点在当时扬州旅舍。其《秋夕旅怀》诗当为《静夜思》的续篇，亦同时同地所作。';
  }

  ionViewDidLoad() {
    console.log('用户协议页面');
  }

}
