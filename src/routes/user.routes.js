const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");

router.get("/profile", verifyToken, userController.getProfile);
router.put("/profile", verifyToken, userController.updateProfile);
router.get("/:id", verifyToken, userController.getUserProfile);
router.get("/following", verifyToken, userController.getFollowing);
router.get("/followers", verifyToken, userController.getFollowers);

module.exports = router;
