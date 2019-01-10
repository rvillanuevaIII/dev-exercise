const express = require("express");
const router = express.Router();

var _inject = {
    pages: ["Instructions", "Tabs", "Test"]
}

router.get("/css/:file([0-9a-zA-Z\._-]+.(css))", (req, res) => {
    let css = (req.params.file) ? req.params.file : null;
    let stylesheet = (css) ? req.streams[css] : null;
    if (!stylesheet) res.status(404).send("Invalid File or File Not Found");
    else {
        res.set("Content-Type", "text/css");
        res.send(stylesheet.css);
    }
});

// -- Root Index
router.get("/", (req, res) => {
    res.redirect("instructions");
})

// -- Home Template
router.get("/instructions", (req, res) => {
    _inject.slug = "/instructions";
    res.render("index", _inject);
})

// -- Tab Template
router.get("/tabs", (req, res) => {
    _inject.slug = "/tabs";
    res.render("tabs", _inject);
})

// -- Test Page
router.get("/test", (req, res) => {
    _inject.slug = "/test";
    res.render("test", _inject);
})

module.exports = router;