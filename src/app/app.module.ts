import { MyApp } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from "@angular/common/http";
import { LocalStorageService, SessionStorageService } from "ngx-webstorage";
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from "@ionic/storage";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from "@ionic-native/network";
import { AppVersion } from "@ionic-native/app-version";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { FileOpener } from '@ionic-native/file-opener';
import { Diagnostic } from "@ionic-native/diagnostic";
import { File } from "@ionic-native/file";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { Toast } from "@ionic-native/toast";
import { Camera } from "@ionic-native/camera";
import { ImagePicker } from "@ionic-native/image-picker";

import { WelcomePage } from "../pages/welcome/welcome";
import { LoginPage} from "../pages/login/login";
import { LoginPageModule} from "../pages/login/login.module";
import { PureColorLoginPageModule } from "../pages/pure-color-login/pure-color-login.module";
import { PureColorLoginPage } from "../pages/pure-color-login/pure-color-login";
import { MainPage } from "../pages/main/main";
import { MainPageModule } from "../pages/main/main.module";
import { SetUpPageModule } from "../pages/set-up/set-up.module";
import { SetUpPage } from "../pages/set-up/set-up";

import { LoginServiceProvider } from '../providers/login-service/login-service';
import { Api } from "../providers/api/api";
import { AuthServerProvider } from "../providers/auth/auth-jwt.service";
import { Principal } from "../providers/auth/principal.service";
import { AccountService } from "../providers/auth/account.service";
import { AuthInterceptor } from "../providers/auth/auth-interceptor";
import { NativeServiceProvider } from '../providers/native-service/native-service';
import { VersionServiceProvider } from '../providers/version-service/version-service';
import { Secret } from "../providers/secret";
import { VerifyCodeServiceProvider } from '../providers/verify-code-service/verify-code-service';
import { InitServiceProvider } from "../providers/auth/init.service";
import { AesServerProvider } from "../providers/auth/aes.service";;
import { RsaServerProvider } from "../providers/auth/rsa.service";
import { UserServiceProvider } from '../providers/user-service/user-service';


export function createTranslateLoader( http: HttpClient ) {
  return new TranslateHttpLoader( http, './assets/i18n/', '.json' );
}

@NgModule({
  declarations: [
    MyApp,
    WelcomePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    LoginPageModule,
    PureColorLoginPageModule,
    MainPageModule,
    SetUpPageModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,
    LoginPage,
    PureColorLoginPage,
    MainPage,
    SetUpPage

  ],
  providers: [
    Api,
    StatusBar,
    SplashScreen,
    Principal,
    AccountService,
    AuthServerProvider,
    LocalStorageService,
    SessionStorageService,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    LoginServiceProvider,
    NativeServiceProvider,
    VersionServiceProvider,
    Network,
    AppVersion,
    InAppBrowser,
    Diagnostic,
    File,
    FileTransfer,
    FileTransferObject,
    FileOpener,
    Secret,
    Toast,
    VerifyCodeServiceProvider,
    InitServiceProvider,
    AesServerProvider,
    RsaServerProvider,
    UserServiceProvider,
    Camera,
    ImagePicker
  ]
})
export class AppModule {}
