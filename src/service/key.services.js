'use strict';

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
    static createKeyToken = async ({userId, publicKey, privateKey})=>{
        try {
            // const publicKeyString = publicKey.toString(); -> advanced usage
            const tokens = await keytokenModel.create({
                user: userId,
                publicKey,
                privateKey, // Basic usage, save the private key in the database -> advanced usage doesn't save the private key in the database
            })

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            console.error('Error creating key token:', error);
            throw error;
        }
    }
}

module.exports = KeyTokenService;