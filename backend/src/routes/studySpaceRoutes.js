const express = require("express");
const router = express.Router();

const {
    createStudySpace,
    getAllStudySpaces,
    getStudySpace,
    updateStudySpace,
    deleteStudySpace
} = require("../controllers/studySpaceController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getAllStudySpaces);
router.get("/:id", getStudySpace);

router.post("/", protect, createStudySpace);

router.put("/:id", protect, adminOnly, updateStudySpace);
router.delete("/:id", protect, adminOnly, deleteStudySpace);



module.exports = router;
