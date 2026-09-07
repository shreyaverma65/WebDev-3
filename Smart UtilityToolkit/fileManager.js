const fs = require("fs");
fs.readFile("test.txt", "utf8", (err, data) => {
    if (err) {
        console.log("Error reading file:", err);
    } else {
        console.log("File content:", data);
    }
});
fs.appendFile("test.txt", "\nThis line was added using appendFile.", (err) => {
    if (err) {
        console.log("Error updating file:", err);
    } else {
        console.log("File updated successfully.");
    }
});