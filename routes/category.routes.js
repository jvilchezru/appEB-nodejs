const CategoyController = require('../controllers/category.controller');
const passport = require('passport');

module.exports = (app) => {
  // GET
  app.get(
    '/api/categories/getAll',
    // passport.authenticate('jwt', { session: false }),
    CategoyController.getAll
  );
  app.get(
    '/api/categories/findByName/:category_name',
    passport.authenticate('jwt', { session: false }),
    CategoyController.findByName
  );

  // POST
  app.post(
    '/api/categories/create',
    passport.authenticate('jwt', { session: false }),
    CategoyController.create
  );

  //PUT
  app.put(
    '/api/categories/update',
    passport.authenticate('jwt', { session: false }),
    CategoyController.update
  );

  // DELETE
  app.delete(
    '/api/categories/delete/:category_id',
    passport.authenticate('jwt', { session: false }),
    CategoyController.delete
  );
};
