const bodyParser = require("body-parser");
const express = require('express');

const app = express();
const appInfo = {
  "host": "127.0.0.1",
  "port": 8080
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/create/:apiName", require(__dirname + "/routes/create"));
app.get("/api/read/:apiName", require(__dirname + "/routes/read"));
app.put("/api/update/:apiName", require(__dirname + "/routes/update"));
app.delete("/api/delete/:apiName", require(__dirname + "/routes/delete"));

app.listen(appInfo.port, () => { console.log("Server start."); });
