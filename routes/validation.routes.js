const ValidationController = require('../controllers/validation.controller');
const passport = require('passport');

module.exports = (app) => {
  // GET
  app.get(
    '/api/validations/findByStatus/:status',
    // passport.authenticate('jwt', { session: false }),
    ValidationController.findByStatus
  );
  app.get(
    '/api/validations/findByUserAndStatus/:user_id/:status',
    // passport.authenticate('jwt', { session: false }),
    ValidationController.findByUserAndStatus
  );

  // POST
  app.post(
    '/api/validations/create',
    passport.authenticate('jwt', { session: false }),
    ValidationController.create
  );

  // PUT
  app.put(
    '/api/validations/updateToAttended',
    passport.authenticate('jwt', { session: false }),
    ValidationController.updateToAttended
  );

  // DELETE
  app.delete(
    '/api/validations/cancel/:validation_id',
    passport.authenticate('jwt', { session: false }),
    ValidationController.cancel
  );
};
