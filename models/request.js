const pool = require('../config/config');
const Request = {};

Request.create = async (request) => {
  const sql = `
				INSERT INTO
					eb_requests (
						economy_activity, workers_number, status, service_id, user_id, created_at, updated_at
					)
				VALUES (?, ?, ?, ?, ?, ?, ?)
    	`;
  const params = [
    request.economy_activity,
    request.workers_number,
    request.status,
    request.service_id,
    request.user_id,
    new Date(),
    new Date()
  ];
  const data = pool.query(sql, params);
  return data;
};

Request.findByUserAndStatus = async (user_id, status) => {
  const sql = `
        SELECT
          R.request_id,
          R.economy_activity,
          R.workers_number,
          R.status,
          DATE_FORMAT(R.created_at, "%d-%m-%Y %H:%i:%s") as created,
          R.user_id,
          R.service_id,
          JSON_OBJECT(
            'user_id', U.user_id,
            'document_number', U.document_number,
            'user_name', U.user_name,
            'address', U.address,
            'phone', U.phone,
            'email', U.email,
            'user_image', U.user_image
          ) AS client,
          JSON_OBJECT(
            'service_id', S.service_id,
            'service_name', S.service_name,
            'service_description', S.service_description,
            'service_image1', S.service_image1,
            'service_image2', S.service_image1
          ) AS service,
          JSON_OBJECT(
            'category_id', C.category_id,
            'category_name', C.category_name,
            'category_description', C.category_description
          ) AS category
          FROM
            eb_requests AS R
          INNER JOIN
            eb_users AS U
          ON
            R.user_id = U.user_id
          INNER JOIN
            eb_services AS S
          ON
            R.service_id = S.service_id
          INNER JOIN
            eb_categories AS C
          ON
            S.category_id = C.category_id
          WHERE
             R.user_id = ? AND R.status = ?
          GROUP BY
            R.request_id, U.user_id, S.service_id
          ORDER BY
            R.created_at
        `;
  const params = [user_id, status];
  const data = pool.query(sql, params);
  return data;
};

Request.findByStatus = async (status) => {
  const sql = `
        SELECT
          R.request_id,
          R.economy_activity,
          R.workers_number,
          R.status,
          DATE_FORMAT(R.created_at, "%d-%m-%Y %H:%i:%s") AS created,
          R.user_id,
          R.service_id,
          JSON_OBJECT(
            'user_id', U.user_id,
            'document_number', U.document_number,
            'user_name', U.user_name,
            'address', U.address,
            'phone', U.phone,
            'email', U.email,
            'user_image', U.user_image
          ) AS client,
          JSON_OBJECT(
            'service_id', S.service_id,
            'service_name', S.service_name,
            'service_description', S.service_description,
            'service_image1', S.service_image1,
            'service_image2', S.service_image1
          ) AS service,
          JSON_OBJECT(
            'category_id', C.category_id,
            'category_name', C.category_name,
            'category_description', C.category_description
          ) AS category
          FROM
            eb_requests AS R
          INNER JOIN
            eb_users AS U
          ON
            R.user_id = U.user_id
          INNER JOIN
            eb_services AS S
          ON
            R.service_id = S.service_id
          INNER JOIN
            eb_categories AS C
          ON
            S.category_id = C.category_id
          WHERE
            R.status = ?
          GROUP BY
            R.request_id, U.user_id, S.service_id
          ORDER BY
            R.created_at
        `;
  const data = pool.query(sql, [status]);
  return data;
};

Request.update = async (request) => {
  const sql = `
			    UPDATE
            eb_requests
          SET
            user_id = ?,
            service_id = ?,
            status = ?,
            updated_at = ?
          WHERE
            request_id = ?
	    `;
  const params = [
    request.user_id,
    request.service_id,
    request.status,
    new Date(),
    request.request_id
  ];
  const data = pool.query(sql, params);
  return data;
};

Request.delete = async (request_id) => {
  const sql = `
			    DELETE FROM eb_requests
          WHERE
            request_id = ?
	    `;
  const data = pool.query(sql, [request_id]);
  return data;
};

module.exports = Request;
