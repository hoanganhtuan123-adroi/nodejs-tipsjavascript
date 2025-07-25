const express = require('express');
const router = express.Router();
const accessController = require("../../controllers/access.controller.js");
const {asyncHandler} = require("../../auth/checkAuth.js")
// sign up
router.post('/shop/signup',asyncHandler(accessController.signUp));

module.exports = router;