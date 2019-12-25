const express = require("express");
const router = express.Router();

// @route GET api/posts/users
//@desc Tests Users Routes
//access Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));
module.exports = router;
