import {Injectable} from '@angular/core';

import RSA from 'rsa-encrypt.js';

@Injectable()
export class RsaServerProvider {
    encrypt(data) {
        const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCecBYJZwmWmBsgcTXykDpWh8zT' +
            'WXv6hPh0SyOIr1CeJXTH7JVI0UoccQZd188PVJB/TiZ4CWlXjm673tDAieOoYNNX' +
            'Xr4mCAt0vvb73o/X0/h4DtMhoWfOrNIlxAQe9u7Tup4oOR5ZaCR2mVmUu2eHCocH' +
            'CaFIKLz/fUj0he41ZQIDAQAB';

        const rsa = new RSA(publicKey);
        // set a new public key:
        // rsa.setPublicKey('')
        return rsa.encrypt(data);
    }
}
