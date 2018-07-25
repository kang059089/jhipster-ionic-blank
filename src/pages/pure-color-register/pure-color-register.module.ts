import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PureColorRegisterPage } from './pure-color-register';

@NgModule({
  declarations: [
    PureColorRegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(PureColorRegisterPage),
  ],
})
export class PureColorRegisterPageModule {}
