import CryptoJS from "crypto-js";

const key = CryptoJS.enc.Utf8.parse("1234567890123456");
const iv = CryptoJS.enc.Utf8.parse("abcdefghijklmnop");

export function decrypt<T>(encryptedBase64: string): T {
  const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

  if (!decryptedText) {
    throw new Error("Failed to decrypt or empty string returned");
  }

  return JSON.parse(decryptedText) as T;
}
