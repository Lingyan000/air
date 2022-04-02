import CryptoJS from 'crypto-js';

export default () => {
  return {
    base64Encode(src: string) {
      return CryptoJS.enc.Utf8.parse(src).toString(CryptoJS.enc.Base64);
    },
    base64Decode(src: string) {
      return CryptoJS.enc.Base64.parse(src).toString(CryptoJS.enc.Utf8);
    },
    aesEncode(key: string, input: string) {
      return CryptoJS.AES.encrypt(input, key).toString();
    },
    aesDecode(key: string, input: string) {
      return CryptoJS.AES.decrypt(input, key).toString(CryptoJS.enc.Utf8);
    },
  };
};
