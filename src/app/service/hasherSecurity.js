//apply hash to password
import CryptoJS from "crypto-js";

/**
 * Aplica hash a la contraseña
 * @param {String} password valor de la contraseña
 * @returns retorna la contraseña hasheada
 */
export const hashPassword = (password) => {
  const hashedPassword = CryptoJS.SHA256(password).toString();
  return hashedPassword;
};


