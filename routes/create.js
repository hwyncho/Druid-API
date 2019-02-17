const crypto = require("crypto");
const express = require("express");
const druid = require("../models/druid");

const models = druid("models");
const info = druid("info");

const router = express.Router();

router.post("/api/create/doc", (req, res) => {
  const keys = Object.keys(req.body);

  let subject = null;
  if (keys.includes("subject")) {
    subject = req.body.subject;
  } else {
    return res.status(400).json({ success: false });
  }

  let title = null;
  if (keys.includes("title")) {
    title = req.body.title;
  } else {
    return res.status(400).json({ success: false });
  }

  let content = null;
  if (keys.includes("content")) {
    content = req.body.content;
  } else {
    return res.status(400).json({ success: false });
  }

  let pwd = null;
  if (keys.includes("pwd")) {
    pwd = crypto
      .pbkdf2Sync(req.body.pwd, info.crypt.salt, info.crypt.iterations, info.crypt.length, info.crypt.digest)
      .toString("base64");
  } else {
    return res.status(400).json({ success: false });
  }

  let date = new Date();
  let click = 0;

  let doc = new models[subject]({
    title: title,
    content: content,
    date: date,
    pwd: pwd,
    click: click,
  });

  if (info.subjects.includes(subject)) {
    models[subject].create(doc, (err, docs) => {
      if (err) {
        return res.status(500).json({ success: false });
      } else {
        if (docs) {
          return res.status(200).json({ success: true });
        } else {
          return res.status(500).json({ success: false });
        }
      }
    });
  } else {
    return res.status(400).json({ success: false });
  }
});

module.exports = router;
