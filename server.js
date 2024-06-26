const express = require("express");
const fileSystem = require("fs-extra");
const path = require("path");

const bodyParser = require("body-parser");

const server = express();

server.use(bodyParser.urlencoded({ extended: false }));

//Help us to format the date with - instead of :
const formatTime = () => {
  return new Date().toISOString().replace(/:/g, "-");
};

// This API endpoint "createFile" is used to create a file
server.post("/createFile", (req, res) => {
  const date = formatTime();

  fileSystem.writeFile(
    path.join(__dirname, "text", `${date}.txt`),
    `${date}`,
    (err) => {
      if (err) {
        return res.status(500).send("error: " + err.message);
      }
      res.send("user Created");
    }
  );
});

// This API endpoint "getFile" is used to serve a file which is created
server.get("/getFile", async (req, res) => {
  try {
    const files = await fileSystem.readdir(
      path.join(__dirname, "text"),
      "utf8"
    );
    const filteredFiles = files.filter((file) => file.endsWith(".txt"));
    res.send(filteredFiles);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
