const ServiceController = require('../controllers/service.controller');
const passport = require('passport');

module.exports = (app, upload) => {
  // GET
  app.get(
    '/api/services/getAll',
    passport.authenticate('jwt', { session: false }),
    ServiceController.getAll
  );
  app.get(
    '/api/services/findByCategory/:category_id',
    passport.authenticate('jwt', { session: false }),
    ServiceController.findByCategory
  );
  app.get(
    '/api/services/findByName/:service_name',
    passport.authenticate('jwt', { session: false }),
    ServiceController.findByName
  );
  app.get(
    '/api/services/findByCategoryAndName/:category_id/:service_name',
    passport.authenticate('jwt', { session: false }),
    ServiceController.findByCategoryAndName
  );

  // POST
  app.post(
    '/api/services/create',
    passport.authenticate('jwt', { session: false }),
    upload.array('service_image', 2),
    ServiceController.create
  );

  // PUT
  app.put(
    '/api/services/update/:index',
    passport.authenticate('jwt', { session: false }),
    upload.array('service_image', 2),
    ServiceController.update
  );

  // DELETE
  app.delete(
    '/api/services/delete/:service_id',
    passport.authenticate('jwt', { session: false }),
    ServiceController.delete
  );
};
