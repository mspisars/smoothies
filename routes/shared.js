const express = require('express');
const router = express.Router();
const db = require('../models');


/* GET /shared/:url page. */
router.get('/:url', async function (req, res, next) {
  const { url } = req.params;
  const pub = await db.Published.findOne({ where: { url } });
  if (pub) {
    const recipe = await db.Recipe.findOne({
      where: {id: pub.RecipeId},
      include: ['ingredients', 'instructions'],
    });
    console.log("SHARED", pub, recipe)
    res.render('shared', recipe.toJSON());
  }
  else {
    res.render('shared', { name: "Recipe not found!", description: "", serving: "", username: "", ingredients: [], instructions: [] });
  }
});

module.exports = router;
