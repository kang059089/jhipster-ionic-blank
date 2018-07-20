import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { WelcomePage } from "../pages/welcome/welcome";
import { IonicStorageModule } from "@ionic/storage";
import { LoginPage} from "../pages/login/login";
import { LoginPageModule} from "../pages/login/login.module";
import { LoginServiceProvider } from '../providers/login-service/login-service';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from "@angular/common/http";
import { Api } from "../providers/api/api";
import { LocalStorageService, SessionStorageService } from "ngx-webstorage";
import { AuthServerProvider } from "../providers/auth/auth-jwt.service";
import { Principal } from "../providers/auth/principal.service";
import { AccountService } from "../providers/auth/account.service";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AuthInterceptor } from "../providers/auth/auth-interceptor";
import { NativeServiceProvider } from '../providers/native-service/native-service';
import { VersionServiceProvider } from '../providers/version-service/version-service';
import { Network } from "@ionic-native/network";
import { AppVersion } from "@ionic-native/app-version";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { FileOpener } from '@ionic-native/file-opener';
import { Diagnostic } from "@ionic-native/diagnostic";
import { File } from "@ionic-native/file";
import { FileTransfer } from "@ionic-native/file-transfer";



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
    LoginPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,
    LoginPage
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
    FileOpener
  ]
})
export class AppModule {}
