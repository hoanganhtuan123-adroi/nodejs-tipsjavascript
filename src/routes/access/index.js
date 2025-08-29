const express = require("express");
const { authenticationV2 } = require("../../auth/authUtils.js");
const router = express.Router();
const accessController = require("../../controllers/access.controller.js");
const { asyncHandler } = require("../../helpers/asyncHandler.js");
// sign up
router.post("/shop/signup", asyncHandler(accessController.signUp));
router.post("/shop/login", asyncHandler(accessController.login));
// authentication
router.use(authenticationV2);
router.post("/shop/logout", asyncHandler(accessController.logout));
router.post("/shop/refreshtoken", asyncHandler(accessController.handleRefreshToken))
module.exports = router;
