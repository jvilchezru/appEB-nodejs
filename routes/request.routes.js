const RequestController = require('../controllers/request.controller');
const passport = require('passport');

module.exports = (app) => {
  // GET
  app.get(
    '/api/requests/findByStatus/:status',
    passport.authenticate('jwt', { session: false }),
    RequestController.findByStatus
  );
  app.get(
    '/api/requests/findByUserAndStatus/:user_id/:status',
    passport.authenticate('jwt', { session: false }),
    RequestController.findByUserAndStatus
  );

  // POST
  app.post(
    '/api/requests/create',
    passport.authenticate('jwt', { session: false }),
    RequestController.create
  );

  //PUT
  app.put(
    '/api/requests/updateToAttended',
    passport.authenticate('jwt', { session: false }),
    RequestController.updateToAttended
  );

  // DELETE
  app.delete(
    '/api/requests/cancel/:request_id',
    passport.authenticate('jwt', { session: false }),
    RequestController.cancel
  );
};
