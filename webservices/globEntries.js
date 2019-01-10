/*
##############################################
#### CUSTOM CLASS TO RETURN FILES AS GLOB ####
##############################################
*/

const glob = require("glob");
const getEntries = (patt) => {
    let globFiles = glob.sync(patt);
    let globOutput = [];
    globFiles.forEach((dir) => {
        let tmpObj = {};
        let filePatt = /([a-zA-Z0-9-_.]+\..{2,4})/;
        let file = filePatt.exec(dir)[0];
        let filenamePatt = /^([a-zA-Z0-9-_]+)/;
        let filename = filenamePatt.exec(file)[0];

        tmpObj.file = file;
        tmpObj.path = dir;
        tmpObj.name = filename;
        globOutput.push(tmpObj);
    })
    return globOutput;
}
module.exports = getEntries;