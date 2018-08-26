import {Injectable} from '@angular/core';

import CryptoJS from 'crypto-js'

@Injectable()
export class AesServerProvider {

  encrypt(encryptedData, AESKEY) {
    // 加密
    // key 为秘钥
    // key 和 iv 可以一致
    let key = CryptoJS.enc.Utf8.parse(AESKEY);

    let encrypted = CryptoJS.AES.encrypt(JSON.stringify(encryptedData), key, {
      iv: key,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    // 转换为字符串 -- 加密后的内容
    return encrypted.toString();
  }

  decrypt(decryptedData, AESKEY) {
    // 解密
    // key 为秘钥
    let key = CryptoJS.enc.Utf8.parse(AESKEY);
    // key 和 iv 可以一致

    // mode 支持 CBC、CFB、CTR、ECB、OFB, 默认 CBC
    // padding 支持 Pkcs7、AnsiX923、Iso10126
    // 、NoPadding、ZeroPadding, 默认 Pkcs7, 即 Pkcs5 ]
    try {
      let decrypted = CryptoJS.AES.decrypt(decryptedData, key, {
        iv: key,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      // 转换为 utf8 字符串
      let decrypteds =  CryptoJS.enc.Utf8.stringify(decrypted);
      try {
        return JSON.parse(decrypteds);
      } catch (error) {
        return decrypteds;
      }
    } catch (error) {
      return '';
    }
  }

  // 生成16位随机字符串函数
  randomString(len) {
    len = len || 16;
    let chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    let maxPos = chars.length;
    let randomStr = '';
    for (let i = 0; i < len; i++) {
      randomStr += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return randomStr;
  }

}
