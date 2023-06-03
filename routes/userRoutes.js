const UserController = require('../controllers/userController');

module.exports = (app) => {
	// GET
	app.get('/api/users/getAllUsers', UserController.getAllUsers);
	app.get('/api/users/getPersonByDocument/:document_number', UserController.getPersonByDocument);
	// searchUserByDni

	// POST
	app.post('/api/users/createUser', UserController.createUser);
	app.post('/api/users/signIn', UserController.signIn);
};
