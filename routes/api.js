var express = require('express');
var router = express.Router();
const passport = require('passport');
const db = require('../models');

/* /api/findSmoothies - POST with query */
router.post('/findSmoothies', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  console.log("/api/findSmoothies", req.user, req.body);
  const { Op } = db.Sequelize;
  const { query = '' } = req.body;
  // note: Postgres supports iLike operator which ignores case...
  // and we do the search on the recipe name + description
  const where = {
    [Op.or]: [
      {
        name: {
          [Op.iLike]: `%${query}%`
        }
      },
      {
        description: {
          [Op.iLike]: `%${query}%`
        }
      }
    ],
    username: req.user.username
  }
  console.log("/api/findSmoothies", req.user, where);

  const result = await db.Recipe.findAll({ where });
  res.json(result);
});

/* /api/getSmoothie - GET users smoothies */
router.get('/getSmoothies', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  console.log("/api/getSmoothies", req.user);
  const where = { username: req.user.username };
  const result = await db.Recipe.findAll({ where });
  res.json(result);
});

/* /api/getSmoothie - eager GET */
router.get('/getSmoothie/:recipe_id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  console.log("/api/getSmoothie/:recipe_id", req.user);
  const { recipe_id } = req.params;
  const where = { 
    username: req.user.username,
    recipe_id
   };
  //  note we eager load the relationships here.
  const result = await db.Recipe.findOne({ 
    where, 
    include: ['ingredients', 'instructions', 'published'],
   });
  res.json(result);
});

/* /api/createSmoothie - POST */
router.post('/createSmoothie', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  console.log("/api/createSmoothie", req.user, req.body);
  // fill in username...
  const payload = {...req.body, username: req.user.username };
  try {
    const result = await db.Recipe.create(payload, { include: [
      { model: db.Ingredient, as: 'ingredients' },
      { model: db.Instruction, as: 'instructions' },
    ] });
    console.log(result);
    res.json(result);
  }
  catch (e) {
    console.log(e);
  }
});

/* /api/publishRecipe - POST */
router.post('/publishRecipe', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  console.log("/api/publishRecipe", req.user, req.body);
  // fill in username...
  const { id, url } = req.body;
  const payload = { RecipeId: id, publishedId: id, url };
  const check = await db.Published.findAll(payload);
  if (check.length) res.json();
  else {
    try {
      const result = await db.Published.create(payload);
      res.json(result);
    }
    catch (e) {
      console.log(e);
      res.json();
    }
  }
});

// UPDATE (PUT) Recipe route
// /api/Recipe/{id}
router.put('/Recipe/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  console.log("/api/Recipe/:id", req.user);
  const { id } = req.params;
  const where = {
    id
  };
  const { name, description, serving, ingredients = [], instructions = [] } = req.body;

  const [ count, [ result ] ] = await db.Recipe.update({ name, description, serving }, { where, returning: true });
  console.log("/api/Recipe/:id", where, count);
  ingredients.forEach(async (item) => {
    const { name, description, quantity, uom } = item;
    if (item.id) await db.Ingredient.update({ name, description, quantity, uom }, { where: {id: item.id} });
    else await db.Ingredient.create({ name, description, quantity, uom, RecipeId: result.id });
  });
  instructions.forEach(async (item) => {
    const { sequence, description } = item;
    if (item.id) await db.Instruction.update({ sequence, description }, { where: { id: item.id } });
    else await db.Instruction.create({ sequence, description, RecipeId: result.id });
  });
  res.json(result);
});

// DELETE route
// /api/{className}/{id}
router.delete('/:className/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  console.log("/api/:className/:id", req.user);
  const { id, className } = req.params;
  const where = {
    id
  };

  const result = await db[className].destroy({ where });
  console.log("/api/:className/:id", where, result);
  res.json(result);
});



module.exports = router;
