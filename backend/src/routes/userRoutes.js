const express = require("express");
const router = express.Router();
const { getMe, updateMe, deleteMe, changePassword, getFavorites, toggleFavorite } = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/me", getMe);
router.put("/me",  updateMe);
router.delete("/me",  deleteMe);
router.put("/change-password",  changePassword);
router.get("/:id/favorites", getFavorites);
router.post("/:userId/favorites/:spaceId", toggleFavorite);





module.exports = router;
