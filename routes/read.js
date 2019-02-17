const express = require("express");
const druid = require("../models/druid");

const models = druid("models");
const info = druid("info");

/* Router */
const router = express.Router();

router.get("/api/read/docs", (req, res) => {
  const keys = Object.keys(req.query);
  const projection = { id: 1, title: 1, date: 1 };

  let subject = null;
  if (keys.includes("subject")) {
    subject = req.query.subject;
  } else {
    return res.status(400).json([]);
  }

  let limit = 10;
  if (keys.includes("limit")) {
    limit = parseInt(req.query.limit);
  }

  if (info.subjects.includes(subject)) {
    models[subject]
      .find({}, projection)
      .sort({ date: -1 })
      .limit(limit)
      .exec((err, docs) => {
        if (err) {
          return res.status(500).json([]);
        } else {
          return res.status(200).json(docs);
        }
      });
  } else {
    return res.status(400).json([]);
  }
});

router.get("/api/read/doc", (req, res) => {
  const keys = Object.keys(req.query);
  const projection = { id: 1, title: 1, content: 1, date: 1, click: 1 };

  let subject = null;
  if (keys.includes("subject")) {
    subject = req.query.subject;
  } else {
    return res.status(400).json({});
  }

  let id = null;
  if (keys.includes("id")) {
    id = parseInt(req.query.id);
  } else {
    return res.status(400).json({});
  }

  if (info.subjects.includes(subject)) {
    models[subject]
      .findOneAndUpdate({ id: id }, { $inc: { click: 1 } }, { projection: projection })
      .exec((err, doc) => {
        if (err) {
          return res.status(500).json({});
        } else {
          if (doc) {
            return res.status(200).json(doc);
          } else {
            return res.status(500).json({});
          }
        }
      });
  } else {
    return res.status(400).json({});
  }
});

module.exports = router;
