const express = require('express');

const router = express.Router();
const Search = require('../models/Search');

router.get('/', async (req, res) => {
  try {
    const result = await Search.collection
      .aggregate([
        {
          $search: {
            autocomplete: {
              query: `${req.query.term}`,
              path: 'title',
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

module.exports = router;
