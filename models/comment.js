const pool = require('../config/config');
const Comment = {};

Comment.create = async (comment) => {
  const sql = `
				INSERT INTO
					eb_comments (
						comment, rating, service_id, user_id, created_at, updated_at
					)
				VALUES (?, ?, ?, ?, ?, ?)
    	`;
  const params = [
    comment.comment,
    comment.rating,
    comment.service_id,
    comment.user_id,
    new Date(),
    new Date()
  ];
  const data = pool.query(sql, params);
  return data;
};

Comment.findByUserAndService = async (user_id, service_id) => {
  const sql = `
        SELECT
          C.comment_id,
          C.comment,
          C.rating,
          DATE_FORMAT(C.created_at, "%d/%m/%Y") as created,
          DATE_FORMAT(C.updated_at, "%d/%m/%Y") as updated,
          C.user_id,
          C.service_id,
          JSON_OBJECT(
            'user_id', U.user_id,
            'document_number', U.document_number,
            'user_name', U.user_name,
            'address', U.address,
            'phone', U.phone,
            'email', U.email,
            'user_image', U.user_image
          ) AS user,
          JSON_OBJECT(
            'service_id', S.service_id,
            'service_name', S.service_name,
            'service_description', S.service_description,
            'service_image1', S.service_image1,
            'service_image2', S.service_image1
          ) AS service
          FROM
            eb_comments AS C
          INNER JOIN
            eb_users AS U
          ON
            C.user_id = U.user_id
          INNER JOIN
            eb_services AS S
          ON
            C.service_id = S.service_id
          WHERE
            C.user_id = ? AND C.service_id = ?
          GROUP BY
            C.comment_id, C.user_id, C.service_id
        `;
  const params = [user_id, service_id];
  const data = pool.query(sql, params);
  return data;
};

Comment.findByService = async (user_id, service_id) => {
  const sql = `
        SELECT
          C.comment_id,
          C.comment,
          C.rating,
          DATE_FORMAT(C.created_at, "%d/%m/%Y") as created,
          DATE_FORMAT(C.updated_at, "%d/%m/%Y") as updated,
          C.user_id,
          C.service_id,
          JSON_OBJECT(
            'user_id', U.user_id,
            'document_number', U.document_number,
            'user_name', U.user_name,
            'address', U.address,
            'phone', U.phone,
            'email', U.email,
            'user_image', U.user_image
          ) AS user,
          JSON_OBJECT(
            'service_id', S.service_id,
            'service_name', S.service_name,
            'service_description', S.service_description,
            'service_image1', S.service_image1,
            'service_image2', S.service_image1
          ) AS service
          FROM
            eb_comments AS C
          INNER JOIN
            eb_users AS U
          ON
            C.user_id = U.user_id
          INNER JOIN
            eb_services AS S
          ON
            C.service_id = S.service_id
          WHERE
            C.user_id != ? AND C.service_id = ?
          GROUP BY
            C.comment_id, C.user_id, C.service_id
        `;
  const params = [user_id, service_id];
  const data = pool.query(sql, params);
  return data;
};

Comment.update = async (comment) => {
  const sql = `
			    UPDATE
            eb_comments
          SET
            comment = ?,
            rating = ?,
            user_id = ?,
            service_id = ?,
            updated_at = ?
          WHERE
            comment_id = ?
	    `;
  const params = [
    comment.comment,
    comment.rating,
    comment.user_id,
    comment.service_id,
    new Date(),
    comment.comment_id
  ];
  const data = pool.query(sql, params);
  return data;
};

Comment.delete = async (comment_id) => {
  const sql = `
			    DELETE FROM eb_comments
          WHERE
            comment_id = ?
	    `;
  const data = pool.query(sql, [comment_id]);
  return data;
};

module.exports = Comment;
