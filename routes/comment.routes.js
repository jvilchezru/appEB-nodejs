const CommentsController = require('../controllers/comment.controller');
const passport = require('passport');

module.exports = (app) => {
  // GET
  app.get(
    '/api/comments/findByUserAndService/:user_id/:service_id',
    passport.authenticate('jwt', { session: false }),
    CommentsController.findByUserAndService
  );
  app.get(
    '/api/comments/findByService/:user_id/:service_id',
    passport.authenticate('jwt', { session: false }),
    CommentsController.findByService
  );
  // POST
  app.post(
    '/api/comments/create',
    passport.authenticate('jwt', { session: false }),
    CommentsController.create
  );
  //PUT
  app.put(
    '/api/comments/update',
    passport.authenticate('jwt', { session: false }),
    CommentsController.update
  );
  // DELETE
  app.delete(
    '/api/comments/delete/:comment_id',
    passport.authenticate('jwt', { session: false }),
    CommentsController.delete
  );
};
