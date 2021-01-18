const express = require("express");
const router = express.Router();
const Search = require("../models/Search");
const UserSearch = require("../models/UserSearch");

router.get("/", async (req, res) => {
  try {
    const result = await Search.collection
      .aggregate([
        {
          $search: {
            autocomplete: {
              query: `${req.query.term}`,
              path: "title",
              fuzzy: {
                maxEdits: 2,
              },
            },
          },
        },
      ])
      .toArray();
    res.send(result);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

router.get("/user", async (req, res) => {
  try {
    const userResult = await UserSearch.collection
      .aggregate([
        {
          $search: {
            autocomplete: {
              query: `${req.query.term}`,
              path: "userName",
              fuzzy: {
                maxEdits: 2,
              },
            },
          },
        },
      ])
      .toArray();
    res.send(userResult);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = router;
