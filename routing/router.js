const express = require("express");
const router = express.Router();

const mainController = require("../controller/main");
const authController = require("../controller/auth");
const middlewares = require("../utils/middlewares");

router.get("/therepistRegister",authController.get_therepist_register);
router.post("/therepistRegister",authController.post_therepist_register);
router.get("/userRegister",authController.get_user_register);
router.post("/userRegister",authController.post_user_register);
router.get("/login",authController.get_login);
router.post("/login",authController.post_login);
router.get("/otp",authController.get_otp);
router.post("/otp",authController.post_otp);

router.get("/",mainController.get_index);
router.get("/checkup",middlewares.auth,mainController.get_checkup);
router.get("/vent",mainController.get_vent);
module.exports = router;