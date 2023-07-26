const Comment = require('../models/comment');

module.exports = {
  async create(req, res, next) {
    try {
      let comment = req.body;
      const data = await Comment.create(comment);
      return res.status(201).json({
        success: true,
        message: 'Su comentario ha sido publicado',
        data: data.insertId
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: 'Error al publicar comentario',
        error: error
      });
    }
  },

  async update(req, res, next) {
    try {
      let comment = req.body;
      const data = await Comment.update(comment);
      return res.status(201).json({
        success: true,
        message: 'Su comentario ha sido actualziado',
        data: data.insertId
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: 'Error al actualizar comentario',
        error: error
      });
    }
  },

  async delete(req, res, next) {
    try {
      const comment_id = req.params.comment_id;
      await Comment.delete(comment_id);
      return res.status(201).json({
        success: true,
        message: 'Su comentario ha sido eliminado'
      });
    } catch (error) {
      return res.status(501).json({
        success: false,
        message: 'Error al eliminar comentario'
      });
    }
  },

  async findByService(req, res, next) {
    try {
      const user_id = req.params.user_id;
      const service_id = req.params.service_id;
      const data = await Comment.findByService(user_id, service_id);
      for (const d of data) {
        d.user = JSON.parse(d.user);
        d.service = JSON.parse(d.service);
      }
      return res.status(201).json(data);
    } catch (error) {
      return res.status(501).json({
        success: false,
        message: `Error al listar comentarios por servicio: ${error}`,
        error: error
      });
    }
  },

  async findByUserAndService(req, res, next) {
    try {
      const user_id = req.params.user_id;
      const service_id = req.params.service_id;
      const data = await Comment.findByUserAndService(user_id, service_id);
      for (const d of data) {
        d.user = JSON.parse(d.user);
        d.service = JSON.parse(d.service);
      }
      return res.status(201).json(data);
    } catch (error) {
      return res.status(501).json({
        success: false,
        message: `Error al listar comentario por usuario y servicio: ${error}`,
        error: error
      });
    }
  }
};
