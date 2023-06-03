const db = require("../config/config");
const crypto = require("crypto");
const axios = require("axios");

const User = {};

User.create = (user) => {
	const myPasswordHashed = crypto.createHash("md5").update(user.password).digest("hex");
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
					$1, $2, $3, $4, $5, $6, $7, $8, $9, $10
				)
				RETURNING
					user_id
			`;

	return db.oneOrNone(sql, [
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
	]);
};

User.getAll = () => {
	const sql = `
			SELECT * FROM eb_users
	`;
	console.log(db.manyOrNone(sql));
	return db.manyOrNone(sql);
};

User.findById = (id, callback) => {
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
          user_id = $1
			`;

	return db.oneOrNone(sql, id).then((user) => {
		callback(null, user);
	});
};

User.findByDocumentNumber = (document_number) => {
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
					U.session_token,
					json_agg(json_build_object (
						'rol_id', R.rol_id,
						'rol_name', R.rol_name,
						'rol_image', R.rol_image,
						'route', R.route
					)) AS roles
				FROM
					eb_users AS U
				INNER JOIN
					eb_user_roles AS UR
				ON
					UR.user_id = U.user_id
				INNER JOIN
					eb_roles AS R
				ON
					R.rol_id = UR.rol_id
				WHERE
					document_number = $1
				GROUP BY
					U.user_id
			`;

	return db.oneOrNone(sql, document_number);
};

User.isPasswordMatched = (userPassword, hash) => {
	const myPasswordHashed = crypto.createHash("md5").update(userPassword).digest("hex");

	if (myPasswordHashed === hash) {
		return true;
	}

	return false;
};

module.exports = User;
