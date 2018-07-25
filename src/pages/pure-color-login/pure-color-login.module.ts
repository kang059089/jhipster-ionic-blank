import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PureColorLoginPage } from './pure-color-login';

@NgModule({
  declarations: [
    PureColorLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(PureColorLoginPage),
  ],
})
export class PureColorLoginPageModule {}
