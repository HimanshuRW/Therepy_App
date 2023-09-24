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
router.get("/logout",authController.get_logout);

router.get("/",middlewares.auth,mainController.get_index);
router.get("/experts",middlewares.auth,mainController.get_experts);
router.get("/talk/:therepistID",middlewares.auth,mainController.get_talk_therepist);
router.post("/msgTherepist",middlewares.auth, mainController.post_talk_therepist);
router.get("/deleteMsg/:id",middlewares.auth, mainController.delete_msg);
router.get("/checkup",middlewares.auth,mainController.get_checkup);
router.get("/vent",mainController.get_vent);

router.get("/test",middlewares.auth,mainController.get_test1);
router.post("/test1",middlewares.auth,mainController.post_test1);
router.post("/test2",middlewares.auth,mainController.post_test2);
router.post("/test3",middlewares.auth,mainController.post_test3);
router.get("/join/:issue",middlewares.auth,mainController.join);
router.get("/chat",middlewares.auth,mainController.get_chat);
router.post("/chat",middlewares.auth,mainController.post_chat);
module.exports = router;