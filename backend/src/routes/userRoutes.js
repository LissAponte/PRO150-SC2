const express = require("express");
const router = express.Router();
const { getMe, updateMe, deleteMe, changePassword } = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.delete("/me", protect, deleteMe);
router.put("/change-password", protect, changePassword);


module.exports = router;
