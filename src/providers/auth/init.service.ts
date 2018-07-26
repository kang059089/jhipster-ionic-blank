import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'ngx-webstorage';

import { Api } from '../api/api'

import { AesServerProvider } from '../auth/aes.service';
import { RsaServerProvider } from '../auth/rsa.service';

@Injectable()
export class InitServiceProvider {
    constructor(
        private $localStorage: LocalStorageService,
        private aesServerProvider: AesServerProvider,
        private rsaServerProvider: RsaServerProvider,
        private http: HttpClient
    ) {

    }

    init() {
        const that = this;
        var p = new Promise(function (resolve, reject) {
            const aesKey = that.aesServerProvider.randomString(16);
            that.$localStorage.store('aesKey', aesKey);
            const aeskeyStr = that.rsaServerProvider.encrypt(aesKey);
            that.http.post(Api.API_URL + '/init', aeskeyStr)
                .subscribe(function (data) {
                    const uuidStr = data['clientId'];
                    that.$localStorage.store('clientId', uuidStr);
                    resolve(uuidStr);
                }, function (err) {
                    console.log(err);
                });
        });
        return p;
    }

}

