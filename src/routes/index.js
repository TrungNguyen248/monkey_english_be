const express = require("express");

const router = express.Router();

router.use("/api/auth", require("./auth"));
router.use("/api/courses", require("./course"));
router.use("/api/lessons", require("./lesson"));
router.use("/api/vocabularies", require("./vocabulary"));
router.use("/api/grammars", require("./grammar"));
router.use("/api/quizzes", require("./quiz"));
router.use("/api/qa", require("./qa"));
router.use("/api/progress", require("./progress"));
router.use("/api/leaderboard", require("./leaderboard"));

module.exports = router;
