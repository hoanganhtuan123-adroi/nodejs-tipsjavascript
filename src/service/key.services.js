"use strict";

const keytokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");
class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      // const publicKeyString = publicKey.toString(); -> advanced usage
      const tokens = await keytokenModel.create({
        user: userId,
        publicKey,
        privateKey, // Basic usage, save the private key in the database -> advanced usage doesn't save the private key in the database
      });

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      console.error("Error creating key token:", error);
      throw error;
    }
  };

  static createKeyTokenAdvanced = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    const filter = { user: userId };
    const update = {
      publicKey,
      privateKey,
      refreshTokenUsed: [],
      refreshToken,
    };
    const options = { upsert: true, new: true };
    const tokens = await keytokenModel.findOneAndUpdate(
      filter,
      update,
      options
    );
    return tokens ? tokens.publicKey : null;
  };

  static findByUserId = async (userId) => {
    return await keytokenModel
      .findOne({ user: new Types.ObjectId(userId) }).lean()
  };

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne({ _id: id });
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel
      .findOne({ refreshTokenUsed: refreshToken })
      .lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken });
  };

  static deleteKeyById = async (userId) => {
    return await keytokenModel.deleteOne({ user: userId });
  };

  static updateRefreshTokenUsed = async (userId, refreshToken) => {
    return await keytokenModel.findOneAndUpdate(
      { user: new Types.ObjectId(userId) },
      { $push: { refreshTokenUsed: refreshToken }, refreshToken: refreshToken }
    );
  };
}

module.exports = KeyTokenService;
