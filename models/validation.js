const pool = require('../config/config');
const Validation = {};

Validation.create = async (validation) => {
  const sql = `
				INSERT INTO
					eb_validations (
						owner_name, folio_number, course_code, status, user_id, created_at, updated_at
					)
				VALUES (?, ?, ?, ?, ?, ?, ?)
    	`;

  const params = [
    validation.owner_name,
    validation.folio_number,
    validation.course_code,
    validation.status,
    validation.user_id,
    new Date(),
    new Date()
  ];

  const data = pool.query(sql, params);
  return data;
};

Validation.findByUserAndStatus = async (user_id, status) => {
  const sql = `
          SELECT
          V.validation_id,
          V.owner_name,
          V.folio_number,
          V.course_code,
          V.status,
          DATE_FORMAT(V.created_at, "%d-%m-%Y %H:%i:%s") as created,
          V.user_id,
          JSON_OBJECT(
            'user_id', U.user_id,
            'document_number', U.document_number,
            'user_name', U.user_name,
            'address', U.address,
            'phone', U.phone,
            'email', U.email,
            'user_image', U.user_image
          ) AS client
          FROM
            eb_validations AS V
          INNER JOIN
            eb_users AS U
          ON
            V.user_id = U.user_id
          WHERE
            V.user_id = ? AND V.status = ?
          GROUP BY
            V.validation_id, U.user_id
          ORDER BY
            V.created_at
        `;
  const params = [user_id, status];

  const data = pool.query(sql, params);
  return data;
};

Validation.findByStatus = async (status) => {
  const sql = `
        SELECT
          V.validation_id,
          V.owner_name,
          V.folio_number,
          V.course_code,
          V.status,
          DATE_FORMAT(V.created_at, "%d-%m-%Y %H:%i:%s") as created,
          V.user_id,
          JSON_OBJECT(
            'user_id', U.user_id,
            'document_number', U.document_number,
            'user_name', U.user_name,
            'address', U.address,
            'phone', U.phone,
            'email', U.email,
            'user_image', U.user_image
          ) AS client
          FROM
            eb_validations AS V
          INNER JOIN
            eb_users AS U
          ON
            V.user_id = U.user_id
          WHERE
            V.status = ?
          GROUP BY
            V.validation_id, U.user_id
          ORDER BY
            V.created_at
        `;

  const data = pool.query(sql, [status]);
  return data;
};

Validation.update = async (validation) => {
  const sql = `
			    UPDATE
            eb_validations
          SET
            user_id = ?,
            status = ?,
            updated_at = ?
          WHERE
            validation_id = ?
	    `;

  const params = [
    validation.user_id,
    validation.status,
    new Date(),
    validation.validation_id
  ];

  const data = pool.query(sql, params);
  return data;
};

Validation.delete = async (validation_id) => {
  const sql = `
			    DELETE FROM eb_validations
          WHERE
          validation_id = ?
	    `;

  const data = pool.query(sql, [validation_id]);
  return data;
};

module.exports = Validation;
