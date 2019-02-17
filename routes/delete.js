const crypto = require("crypto");
const express = require("express");
const druid = require("../models/druid");

const models = druid("models");
const info = druid("info");

const router = express.Router();

router.delete("/api/delete/doc", (req, res) => {
  const keys = Object.keys(req.body);

  let subject = null;
  if (keys.includes("subject")) {
    subject = req.body.subject;
  } else {
    return res.status(400).json({ success: false });
  }

  let id = null;
  if (keys.includes("id")) {
    id = parseInt(req.body.id);
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

  if (info.subjects.includes(subject)) {
    models[subject].findOneAndDelete({ id: id, pwd: pwd }).exec((err, doc) => {
      if (err) {
        return res.status(500).json({ success: false });
      } else {
        if (doc) {
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
