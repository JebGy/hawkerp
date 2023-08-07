//apply hash to password
import CryptoJS from "crypto-js";

export const hashPassword = (password) => {
  const hashedPassword = CryptoJS.SHA256(password).toString();
  return hashedPassword;
};


