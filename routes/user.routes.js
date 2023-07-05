const UserController = require('../controllers/user.controller');
const passport = require('passport');

module.exports = (app, upload) => {
  // GET
  app.get('/api/users/getAllUsers', UserController.getAllUsers);
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
  app.get('/api/users/getPersonByDocument/:document', UserController.getPersonByDocument);
  app.get(
    '/api/users/findUserById/:id',
    // passport.authenticate('jwt', { session: false }),
    UserController.findUserById
  );
  // POST
  app.post('/api/users/createUser', UserController.createUser);
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
