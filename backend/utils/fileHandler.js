const fs = require("fs");
const path = require("path");

function readFromFileAsJson(fileName) {
  const fullFilePath = path.join(__dirname, fileName);
  if (!fs.existsSync(fullFilePath)) return null;
  const data = fs.readFileSync(fullFilePath, "utf-8");
  return data ? JSON.parse(data) : [];
}

// Save users array to file
function writeToFileAsJson(data, fileName) {
  const fullFilePath = path.join(__dirname, fileName);
  fs.writeFileSync(fullFilePath, JSON.stringify(data, null, 2), "utf-8");
}

module.exports = { writeToFileAsJson, readFromFileAsJson };
