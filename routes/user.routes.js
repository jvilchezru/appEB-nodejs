const UserController = require('../controllers/user.controller');
const passport = require('passport');

module.exports = (app, upload) => {
  // GET
  app.get('/api/users/getAll', UserController.getAll);
  app.get('/api/users/findByDocument/:document', UserController.findByDocument);
  app.get(
    '/api/users/findById/:id',
    passport.authenticate('jwt', { session: false }),
    UserController.findUserById
  );
  app.get(
    '/api/users/getImagesOfExperience',
    passport.authenticate('jwt', { session: false }),
    UserController.getImagesOfExperience
  );
  app.get(
    '/api/users/getCompanyImages',
    passport.authenticate('jwt', { session: false }),
    UserController.getCompanyImages
  );

  // POST
  app.post('/api/users/create', UserController.create);
  app.post('/api/users/signIn', UserController.signIn);
  app.post('/api/users/signOff', UserController.signOff);
  // PUT
  app.put(
    '/api/users/updateUser',
    passport.authenticate('jwt', { session: false }),
    upload.array('user_image', 1),
    UserController.updateUser
  );
  app.put('/api/users/disableUser/:id', UserController.disableUser);
  app.put('/api/users/enableUser/:id', UserController.enableUser);
};
