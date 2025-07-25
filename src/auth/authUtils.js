"use strict";
const JWT = require("jsonwebtoken");
const createTokenPair = async (payload, publicKey, privateKey) => {
  console.log("publicKey", publicKey);
  try {
    /*
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days', 
        }) --> Thuật toán bất đối xứng  */

    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });
    
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error("Error verifying access token:", err);
      } else {
        console.log("Access token verified successfully:", decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error creating token pair:", error);
    throw error;
  }
};

module.exports = {
  createTokenPair,
};
