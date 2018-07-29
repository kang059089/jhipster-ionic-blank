import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'ngx-webstorage';

import { Api } from '../api/api'

import { AesServerProvider } from '../auth/aes.service';
import { RsaServerProvider } from '../auth/rsa.service';

@Injectable()
export class InitServiceProvider {
    constructor(
        private localStorage: LocalStorageService,
        private aesServerProvider: AesServerProvider,
        private rsaServerProvider: RsaServerProvider,
        private http: HttpClient
    ) {

    }

    init() {
        var p = new Promise((resolve, reject) => {
            const aesKey = this.aesServerProvider.randomString(16);
          this.localStorage.store('aesKey', aesKey);
            const aeskeyStr = this.rsaServerProvider.encrypt(aesKey);
          this.http.post(Api.API_URL + '/init', aeskeyStr)
                .subscribe((data) => {
                    const uuidStr = data['clientId'];
                  this.localStorage.store('clientId', uuidStr);
                    resolve(uuidStr);
                }, (err) => {
                    console.log(err);
                });
        });
        return p;
    }

}

