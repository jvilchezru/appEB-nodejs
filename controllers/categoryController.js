const Category = require('../models/category');

module.exports = {

	async createCategory(req, res, next) {
		try {
			const category = req.body;
			console.log(req.body);
			const data = await Category.create(category);

			return res.status(201).json({
				success: true,
				message: "Registro exitoso",
				data: data.category_id
			});
		} catch (error) {
			console.log(`Error: ${error}`);
			return res.status(501).json({
				success: false,
				message: "Error al registrar",
				error: error
			});
		}
	},

	async getAllCategories(req, res, next) {
		try {
			const data = await Category.getAll();
			console.log(`Categorias obtenidos: ${JSON.stringify(data)}`);
			return res.status(201).json(data);
		} catch (error) {
			console.log(`Error: ${error}`);
			return res.status(501).json({
				success: false,
				message: 'Error al obtener las categorías'
			});
		}
	},
};
