const express = require("express");
const router = express.Router();
const {protect} = require("../middleware/authMiddleware.js");

const {
    createStudySpace,
    getAllStudySpaces,
    getMyStudySpaces,
    joinSpace,
    getStudySpace,
    updateStudySpace,
    deleteSpace
} = require("../controllers/studySpaceController");

router.use(protect);

router.get("/mine", getMyStudySpaces);
router.get("/", getAllStudySpaces);
router.get("/:id", getStudySpace);


router.post("/create", createStudySpace);
router.post("/join", joinSpace);

router.put("/:id", updateStudySpace);
router.delete("/:id", deleteSpace);



module.exports = router;
