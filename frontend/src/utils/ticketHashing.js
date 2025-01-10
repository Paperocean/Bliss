import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY || 'default_secure_key';

export const generateSecureHash = (ticketId) => {
  return CryptoJS.HmacSHA256(ticketId.toString(), SECRET_KEY).toString();
};
