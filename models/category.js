const pool = require('../config/config');
const Category = {};

Category.create = async (category) => {
  const sql = `
				INSERT INTO
					eb_categories (
						category_name, category_description, created_at, updated_at
					)
				VALUES (?, ?, NOW(), NOW())
    	`;

  const params = [category.category_name, category.category_description];

  const data = pool.query(sql, params);
  return data;
};

Category.getAll = async () => {
  const sql = `
			  SELECT * FROM eb_categories
	    `;

  const data = pool.query(sql);
  return data;
};

Category.update = async (category) => {
  const sql = `
			    UPDATE
            eb_categories
          SET
            category_name = ?,
            category_description = ?,
            updated_at = NOW()
          WHERE
            category_id = ?
	    `;

  const params = [
    category.category_name,
    category.category_description,
    category.category_id
  ];

  const data = pool.query(sql, params);
  return data;
};

Category.delete = async (category_id) => {
  const sql = `
			    DELETE FROM
            eb_categories
          WHERE
            category_id = ?
	    `;

  const data = pool.query(sql, [category_id]);
  return data;
};

Category.findByName = async (category_name) => {
  const sql = `
        SELECT * FROM
          eb_categories
        WHERE
          category_name LIKE ?
    `;

  const data = pool.query(sql, [`%${category_name}%`]);
  return data;
};

module.exports = Category;
