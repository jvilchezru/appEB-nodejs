const pool = require('../config/config');
const Service = {};

Service.create = async (service) => {
  const sql = `
				INSERT INTO
					eb_services (
						service_name,
            service_description,
            service_image1,
            service_image2,
            category_id,
            created_at,
            updated_at
					)
				VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    	`;

  const params = [
    service.service_name,
    service.service_description,
    service.service_image1,
    service.service_image2,
    service.category_id
  ];

  const data = pool.query(sql, params);
  return data;
};

Service.findByCategory = async (category_id) => {
  const sql = `
        SELECT
          S.service_id,
          S.service_name,
          S.service_description,
          S.service_image1,
          S.service_image2,
          S.category_id
        FROM
          eb_services AS S
        INNER JOIN
          eb_categories AS C
        ON
          S.category_id = C.category_id
        WHERE
          C.category_id = ?
    `;

  const data = pool.query(sql, [category_id]);
  return data;
};

Service.update = async (service) => {
  const sql = `
        UPDATE
          eb_services
        SET
          service_name = ?,
          service_description = ?,
          service_image1 = ?,
          service_image2 = ?,
          category_id = ?,
          updated_at = NOW()
        WHERE
          service_id = ?
    `;

  const params = [
    service.service_name,
    service.service_description,
    service.service_image1,
    service.service_image2,
    service.category_id,
    service.service_id
  ];

  const data = pool.query(sql, params);
  return data;
};

Service.delete = async (service_id) => {
  const sql = `
			    DELETE FROM eb_services
          WHERE
            service_id = ?
	    `;

  const data = pool.query(sql, [service_id]);
  return data;
};

Service.getAll = async () => {
  const sql = `
			  SELECT * FROM eb_services
	    `;

  const data = pool.query(sql);
  return data;
};

Service.findByName = async (service_name) => {
  const sql = `
        SELECT * FROM
          eb_services
        WHERE
          service_name LIKE ?
    `;

  const data = pool.query(sql, [`%${service_name}%`]);
  return data;
};

Service.findByCategoryAndName = async (category_id, service_name) => {
  const sql = `
        SELECT
          S.service_id,
          S.service_name,
          S.service_description,
          S.service_image1,
          S.service_image2,
          S.category_id
        FROM
          eb_services AS S
        INNER JOIN
          eb_categories AS C
        ON
          S.category_id = C.category_id
        WHERE
          C.category_id = ? AND service_name LIKE ?
    `;

  const params = [category_id, `%${service_name}%`];

  const data = pool.query(sql, params);
  return data;
};

module.exports = Service;
