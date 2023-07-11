const { getConnection } = require('../config/config');
const crypto = require('crypto');
const axios = require('axios');

const User = {};

User.create = async (user) => {
  const myPasswordHashed = crypto.createHash('md5').update(user.password).digest('hex');
  user.password = myPasswordHashed;
  const sql = `
  				INSERT INTO eb_users(
						user_type,
						document_number,
						user_name,
						address,
						phone,
						email,
						password,
						user_image,
						created_at,
						updated_at
					)
					VALUES(
						?, ?, ?, ?, ?, ?, ?, ?, ?, ?
					);
			`;
  const params = [
    user.user_type,
    user.document_number,
    user.user_name,
    user.address,
    user.phone,
    user.email,
    user.password,
    user.user_image,
    new Date(),
    new Date()
  ];
  const db = await getConnection();
  const data = await db.query(sql, params);
  db.end();
  return data;
};

User.getAll = async () => {
  const sql = `
			SELECT * FROM eb_users
	`;
  const db = await getConnection();
  const data = db.query(sql);
  db.end();
  return data;
};

User.findById = async (id, callback) => {
  const sql = `
				SELECT
          user_id,
					user_type,
          document_number,
          user_name,
          address,
          phone,
					email,
          password,
          user_image,
          session_token
        FROM
        	eb_users
        WHERE
          user_id = ?
			`;
  const db = await getConnection();
  const data = await db.query(sql, id).then((user) => {
    callback(null, user);
  });
  db.end();
  return data;
};

User.findUserById = async (id) => {
  const sql = `
				SELECT
					U.user_id,
					U.user_type,
					U.document_number,
					U.user_name,
					U.address,
					U.phone,
					U.email,
					U.password,
					U.user_image,
					U.is_available,
					U.session_token,
					CONCAT(
						'[',
							(
								SELECT
									GROUP_CONCAT(
										JSON_OBJECT(
											"rol_id", R.rol_id,
											"rol_name", R.rol_name,
											"rol_image", R.rol_image,
											"route", R.route
										)
									)
								FROM eb_roles AS R
								INNER JOIN
									eb_user_roles AS UR
								ON
									R.rol_id = UR.rol_id
								INNER JOIN
									eb_users AS U
								ON
									U.user_id = UR.user_id
								WHERE U.user_id= ${id}
							),
						']'
					) AS roles
				FROM
					eb_users AS U
				WHERE
					U.user_id = ${id}
			`;
  const db = await getConnection();
  const data = await db.query(sql);
  db.end();
  if (data.length == 0) {
    return null;
  }
  data[0].roles = JSON.parse(data[0].roles);
  return data[0];
};

User.findByDocumentNumber = async (document_number) => {
  const sql = `
				SELECT
					U.user_id,
					U.user_type,
					U.document_number,
					U.user_name,
					U.address,
					U.phone,
					U.email,
					U.password,
					U.user_image,
					U.is_available,
					U.session_token,
					CONCAT(
						'[',
							(
								SELECT
									GROUP_CONCAT(
										JSON_OBJECT(
											"rol_id", R.rol_id,
											"rol_name", R.rol_name,
											"rol_image", R.rol_image,
											"route", R.route
										)
									)
								FROM eb_roles AS R
								INNER JOIN
									eb_user_roles AS UR
								ON
									R.rol_id = UR.rol_id
								INNER JOIN
									eb_users AS U
								ON
									U.user_id = UR.user_id
								WHERE U.document_number= ${document_number}
							),
						']'
					) AS roles
				FROM
					eb_users AS U
				WHERE
					U.document_number = ${document_number}
			`;
  const db = await getConnection();
  const data = await db.query(sql);
  db.end();
  if (data.length == 0) {
    return null;
  }
  data[0].roles = JSON.parse(data[0].roles);
  return data[0];
};

User.disable = async (user_id) => {
  const sql = `
        UPDATE
          eb_users
        SET
          is_available = 0
        WHERE
          user_id = ?
    `;
  const db = await getConnection();
  const data = await db.query(sql, user_id);
  db.end();
  return data;
};

User.enable = async (user_id) => {
  const sql = `
        UPDATE
          eb_users
        SET
          is_available = 1
        WHERE
          user_id = ?
    `;
  const db = await getConnection();
  const data = await db.query(sql, user_id);
  db.end();
  return data;
};

User.update = async (user) => {
  const sql = `
        UPDATE
          eb_users
        SET
          address = ?,
          phone = ?,
          email = ?,
					user_image = ?,
          updated_at = ?
        WHERE
          user_id = ?
    `;
  const params = [
    user.address,
    user.phone,
    user.email,
    user.user_image,
    new Date(),
    user.user_id
  ];
  const db = await getConnection();
  const data = await db.query(sql, params);
  db.end();
  return data;
};

User.updateToken = async (user_id, token) => {
  const sql = `
        UPDATE
          eb_users
        SET
          session_token = ?
        WHERE
          user_id = ?
    `;
  const params = [token, user_id];
  const db = await getConnection();
  db.end();
  return db.query(sql, params);
};

User.isPasswordMatched = (userPassword, hash) => {
  const myPasswordHashed = crypto.createHash('md5').update(userPassword).digest('hex');
  if (myPasswordHashed === hash) {
    return true;
  }
  return false;
};

module.exports = User;
