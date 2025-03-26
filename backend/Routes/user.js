const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/user');
const auth = require('../Authentication/Auth');

//Public Routes
router.post('/register',UserController.register);
router.post('/login',UserController.login);

//Protected Routes
router.get("/searchedMember",auth,UserController.searchMember);
router.post("/logout",auth,UserController.logout);

module.exports = router;