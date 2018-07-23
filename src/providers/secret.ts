import { Injectable } from "@angular/core";
import * as CryptoJS from "crypto-js";

const key = CryptoJS.enc.Utf8.parse('1234123412ABCDEF');  //十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412');   //十六位十六进制数作为密钥偏移量

@Injectable()
export class Secret {

  constructor() {

  }

  //解密方法
  static Decrypt(word) {
    let decrypt = CryptoJS.AES.decrypt(word, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  }

  //加密方法
  static Encrypt(word) {
    let encrypted = CryptoJS.AES.encrypt(word, key, {iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString();
  }



}
