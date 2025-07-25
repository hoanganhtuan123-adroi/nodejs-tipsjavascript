"use strict";
const shopSchema = require("../models/shop.model.js");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./key.services.js");
const { createTokenPair } = require("../auth/authUtils.js");
const { getInfoData } = require("../utils/index.js");
const {
  BadRequestError,
  ConflictRequestError,
} = require("../core/error.response.js");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    const holderShop = await shopSchema.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop already registed!");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newShop = await shopSchema.create({
      name,
      email,
      password: hashPassword,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      /* version 1: Using crypto.generateKeyPairSync --> advanced usage
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        }); */

      // version 2: Using crypto.getRandomValues --> basic usage
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      // const publicKeyString = await KeyTokenService.createKeyToken({ // thuật toán bất đối xứng
      //   user: newShop._id,
      //   publicKey: publicKey
      // });

      const keyStore = await KeyTokenService.createKeyToken({
        // Thuật toán đối xứng
        userId: newShop._id,
        publicKey: publicKey,
        privateKey: privateKey, // Basic usage, save the private key in the database -> advanced usage doesn't save the private key in the database
      });

      if (!keyStore) {
        return {
          code: "XXXX",
          message: "Error keyStore",
          status: "error",
        };
      }

      // const publicKeyObject = crypto.createPublicKey(publicKeyString);

      const tokens = await createTokenPair(
        {
          userId: newShop._id,
          email,
        },
        publicKey,
        privateKey
      );
      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
