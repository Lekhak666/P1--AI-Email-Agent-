const fs = require("fs");

function getKnowledge() {
    return fs.readFileSync("data.txt", "utf8");
}

module.exports = { getKnowledge };