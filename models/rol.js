const { getConnection } = require('../config/config');

const Rol = {};

Rol.create = async (user_id, rol_id) => {
  const sql = `
        INSERT INTO eb_user_roles(
            user_id, rol_id, created_at, updated_at
        ) VALUES (
            ?, ?, ?, ?
        )
    `;

  const params = [user_id, rol_id, new Date(), new Date()];

  const db = await getConnection();
  const data = await db.query(sql, params);

  return data;
};

module.exports = Rol;
