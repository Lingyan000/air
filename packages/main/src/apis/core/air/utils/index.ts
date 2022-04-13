import { Cheerio } from '@yongteng/cheerio/lib/slim';
import CryptoJS from 'crypto-js';

export interface IParsing {
  selectorArr: string[];
  attrName: string;
}

export function isJsCode(code) {
  return (
    /^\s*(?:function\s*\w*\s*\([^)]*\)\s*\{[^}]*\}|var\s+\w+\s*=\s*function\s*\([^)]*\)\s*\{[^}]*\})\s*$/.test(
      code
    ) || code.slice(0, 3) === 'js:'
  );
}

export function isLazyJsCode(code) {
  return code.slice(0, 4) === '.js:';
}

export function codeToJs(code) {
  return code.slice(0, 3) === 'js:' ? code.slice(3) : code;
}

export function lazyCodeToJs(code) {
  return code.slice(0, 4) === '.js:' ? code.slice(4) : code;
}

export function isPath(path) {
  return /^(?:[a-zA-Z]:)?[\\/]/.test(path);
}

export function parseDomRes(cNode: Cheerio<any>, parsing: IParsing) {
  for (let selector of parsing.selectorArr) {
    let eqIndex: string | number = 0;
    if (/,-?\d*/g.test(selector)) [selector, eqIndex] = selector.split(',');
    selector = selector.replace(/\|\|/g, ',');
    eqIndex = Number(eqIndex) || 0;
    cNode = cNode.find(selector).eq(eqIndex);
  }

  switch (parsing.attrName) {
    case 'Text':
      return cNode.text().replace(/\t/g, '');
    case 'Html':
      return cNode.html()?.replace(/\t/g, '');
    default:
      return cNode.attr(parsing.attrName)?.replace(/\t/g, '');
  }
}

export function replaceMark(value: string): string {
  return value.replace(/？？/g, '?').replace(/＆＆/g, '&');
}

const key = CryptoJS.enc.Base64.parse(HK_PRIVATE_KEY.join(''));

export function PrivateJsDecode(word: string): string {
  const decrypt = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
  });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

export function PrivateJsEncrypt(word: string): string {
  const srcs = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

export function isProtocol(url: string): boolean {
  return /^(?:https|http?:)?\/\//.test(url);
}

export function isHikerProtocol(url: string): boolean {
  return url.startsWith('hiker://');
}
