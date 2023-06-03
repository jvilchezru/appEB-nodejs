const db = require('../config/config');

const Category = {};

Category.create = (category) => {
	const sql = `
				INSERT INTO eb_categories(
					category_name,
					category_description,
					created_at,
					updated_at
				)
				VALUES(
					$1, $2, $3, $4
				) RETURNING category_id
    `;

	return db.oneOrNone(sql, [
		category.category_name,
		category.category_description,
		new Date(),
		new Date()
	]);
}

Category.getAll = () => {
	const sql = `
			SELECT * FROM eb_categories
	`;

	return db.manyOrNone(sql);
};

module.exports = Category;
