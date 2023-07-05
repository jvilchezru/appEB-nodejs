const { getConnection } = require('../config/config');

const Category = {};

Category.create = async (category) => {
  const sql = `
				INSERT INTO
					eb_categories (
						category_name, category_description, created_at, updated_at
					)
				VALUES (?, ?, ?, ?)
    	`;
  const params = [
    category.category_name,
    category.category_description,
    new Date(),
    new Date()
  ];
  const db = await getConnection();
  const data = await db.query(sql, params);
  return data;
};

Category.getAll = async () => {
  const sql = `
			  SELECT * FROM eb_categories
	    `;
  const db = await getConnection();
  return db.query(sql);
};

Category.update = async (category) => {
  const sql = `
			    UPDATE
            eb_categories
          SET
            category_name = ?,
            category_description = ?,
            updated_at = ?
          WHERE
            category_id = ?
	    `;
  const params = [
    category.category_name,
    category.category_description,
    new Date(),
    category.category_id
  ];
  const db = await getConnection();
  return db.query(sql, params);
};

Category.delete = async (category_id) => {
  const sql = `
			    DELETE FROM eb_categories
          WHERE
            category_id = ?
	    `;
  const db = await getConnection();
  return db.query(sql, category_id);
};

Category.findByName = async (category_name) => {
  const sql = `
        SELECT * FROM
          eb_categories
        WHERE
          category_name LIKE ?
    `;
  const db = await getConnection();
  const data = await db.query(sql, `%${category_name}%`);
  return data;
};

module.exports = Category;
