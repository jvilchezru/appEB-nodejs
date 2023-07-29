const pool = require('../config/config');
const Rol = {};

Rol.create = async (user_id, rol_id) => {
  const sql = `
        INSERT INTO eb_user_roles(
            user_id, rol_id, created_at, updated_at
        ) VALUES (
            ?, ?, NOW(), NOW()
        )
    `;

  const params = [user_id, rol_id];

  const data = pool.query(sql, params);
  return data;
};

module.exports = Rol;
