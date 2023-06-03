const CategoyController = require('../controllers/categoryController');

module.exports = (app) => {
	// GET
	app.get('/api/categories/getAllCategories', CategoyController.getAllCategories);

	// POST
	app.post('/api/categories/createCategory', CategoyController.createCategory);
};
