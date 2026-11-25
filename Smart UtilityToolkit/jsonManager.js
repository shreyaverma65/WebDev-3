const fs = require("fs");

fs.readFile("data.json", "utf8", (err, data) => {

    // Handle file reading error
    if (err) {
        console.log("Error reading file:", err);
        return;
    }

    let user;

    // Handle invalid JSON
    try {
        user = JSON.parse(data);
    } catch (error) {
        console.log("Invalid JSON:", error.message);
        return;
    }

    // JSON validation
    if (!user.name || typeof user.name !== "string") {
        console.log("Invalid name");
        return;
    }

    if (typeof user.age !== "number") {
        console.log("Invalid age");
        return;
    }

    if (!user.course || typeof user.course !== "string") {
        console.log("Invalid course");
        return;
    }

    console.log("JSON validation successful.");
    console.log("User:", user);

    // Update age
    user.age = 21;

    const updatedData = JSON.stringify(user, null, 2);

    // Write updated JSON
    fs.writeFile("data.json", updatedData, (err) => {
        if (err) {
            console.log("Error updating file:", err);
            return;
        }

        console.log("JSON file updated successfully.");
        console.log("After update:", user);
    });
});