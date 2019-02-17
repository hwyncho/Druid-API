const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const sf = require("sf");

const info = {
  crypt: {
    salt: "mysalt",
    iterations: 2048,
    length: 64,
    digest: "sha512",
  },
  db: {
    host: "127.0.0.1",
    port: 27017,
    dbName: "druid",
  },
  subjects: ["dm", "al", "ds1", "ds2"],
};

/* Database */
const db = mongoose.createConnection(sf("mongodb://{host}:{port}/{dbName}", info.db), { useNewUrlParser: true });
db.once("open", () => {
  console.log("MongoDB connected.");
});
db.on("error", (err) => {
  console.log("MongoDB connect ERROR: ", err);
});

autoIncrement.initialize(db);

const dmSchema = new mongoose.Schema({ title: String, content: String, date: Date, pwd: String, click: Number });
dmSchema.plugin(autoIncrement.plugin, { model: "dm", field: "id", startAt: 0, incrementBy: 1 });

const alSchema = new mongoose.Schema({ title: String, content: String, date: Date, pwd: String, click: Number });
alSchema.plugin(autoIncrement.plugin, { model: "al", field: "id", startAt: 0, incrementBy: 1 });

const ds1Schema = new mongoose.Schema({ title: String, content: String, date: Date, pwd: String, click: Number });
ds1Schema.plugin(autoIncrement.plugin, { model: "ds1", field: "id", startAt: 0, incrementBy: 1 });

const ds2Schema = new mongoose.Schema({ title: String, content: String, date: Date, pwd: String, click: Number });
ds2Schema.plugin(autoIncrement.plugin, { model: "ds2", field: "id", startAt: 0, incrementBy: 1 });

const models = {
  dm: db.model("dm", dmSchema),
  al: db.model("al", alSchema),
  ds1: db.model("ds1", ds1Schema),
  ds2: db.model("ds2", ds2Schema),
};

module.exports = (params) => {
  if (params == "models") {
    return models;
  }
  if (params == "info") {
    return info;
  }
};
