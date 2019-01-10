// ~~~~~~~~~~~~~~~~~
// ### VARIABLES ###

// settings
const port = 3000;

// express
const express = require("express");
const app = express();
const path = require("path");

// command line
const cmd = require("node-cmd");

// sass variables
const sass = require("node-sass");
const getEntries = require("../webservices/globEntries.js");

// import watch/send events
const sendevent = require("sendevent");
const watch = require("watch");

// ~~~~~~~~~~~~~~~~~~~~~
// ### CONFIGURATION ###

// -- STYLESHEET HANDLING
let styleStreams = {};
function getSASS() {
    let styles = getEntries("./__src/sass/*.scss");
    styles.forEach((style) => {
        let stream = {};
        let results = sass.renderSync({
            file: style.path,
            outputStyle: 'compressed'
        })
        stream.file = style.file;
        stream.css = results.css;
        styleStreams[style.name + ".css"] = stream;
    })
}
getSASS();

// -- DEFINE PUBLIC DIRECTORY
app.use(express.static(path.join(__dirname, "../_public")));

// -- PASS VARIABLES
app.use((req, res, next) => {
    req.streams = styleStreams;
    next();
})

// -- LIVE RELOAD EVENTS
let events = sendevent("/eventstream");
app.use(events);

// -- DEFINE ROUTES
var index = require("../configs/routes");
app.use("/", index);

// -- DEFINE TEMPLATE ENGINE
app.set("views", path.join(__dirname, "../__src/base"));
app.set("view engine", "pug");

// -- FILE WATCH
watch.watchTree("_public/js", watchFeat);
watch.watchTree("__src/sass", watchFeat);
watch.watchTree("__src/templates", watchFeat);
function watchFeat(f, curr, prev) {
    if(typeof f == "object" && prev === null && curr === null) {
        // signal watch initialized
    } else if(prev === null) {
        // signal new file added
    } else if(curr.nlink === 0) {
        // file removed/deleted
    } else {
        // file changed
        if(f.indexOf("sass")>=0) getSASS();
        events.broadcast({msg: "reload"});
    }
}

// -- 404 HANDLER
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
})

// -- INTERNAL ERROR HANDLER
app.use((err, req, res) => {
    // set locals, only providing error in development mode
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render error page
    res.status(err.status || 500);
    res.render("error", err);
})

// -- INITIATE SERVER
app.listen(port, () => {
    console.log("Server running on port:", port);
    cmd.run("opener http://localhost:3000");
})