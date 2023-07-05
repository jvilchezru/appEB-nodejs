const Comment = require('../models/comment');

module.exports = {
  async create(req, res, next) {
    try {
      let comment = req.body;
      const data = await Comment.create(comment);
      return res.status(201).json({
        success: true,
        message: 'El comentario se publicó correctamente',
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
        message: 'Ha editado su comentario',
        data: data.insertId
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: 'Error al editar',
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
        message: 'El comentario se ha eliminado correctamente'
      });
    } catch (error) {
      return res.status(501).json({
        success: false,
        message: 'Error al eliminar comentario'
      });
    }
  },

  // async findRequestsByStatus(req, res, next) {
  //   try {
  //     const status = req.params.status;
  //     const data = await Request.findByStatus(status);
  //     for (const d of data) {
  //       d.client = JSON.parse(d.client);
  //       d.service = JSON.parse(d.service);
  //       d.category = JSON.parse(d.category);
  //     }
  //     return res.status(201).json(data);
  //   } catch (error) {
  //     return res.status(501).json({
  //       success: false,
  //       message: `Error al listar las solicitudes por estado: ${error}`,
  //       error: error
  //     });
  //   }
  // },
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

  // async updateCategory(req, res, next) {
  //   try {
  //     const category = req.body;
  //     await Category.update(category);
  //     return res.status(201).json({
  //       success: true,
  //       message: 'Los datos de la categoría se han actualizado correctamente'
  //     });
  //   } catch (error) {
  //     console.log(`Error: ${error}`);
  //     return res.status(501).json({
  //       success: false,
  //       message: 'Error al actualizar categoría'
  //     });
  //   }
  // },

  // async deleteCategory(req, res, next) {
  //   try {
  //     const category_id = req.params.category_id;
  //     const data = await Category.delete(category_id);
  //     console.log(JSON.stringify(data));
  //     return res.status(201).json({
  //       success: true,
  //       message: 'La categoría se ha eliminado correctamente'
  //     });
  //   } catch (error) {
  //     console.log(`Error: ${error}`);
  //     return res.status(501).json({
  //       success: false,
  //       message: 'Error al eliminar categoría'
  //     });
  //   }
  // },

  // async getAllCategories(req, res, next) {
  //   try {
  //     const data = await Category.getAll();
  //     return res.status(201).json(data);
  //   } catch (error) {
  //     console.log(`Error: ${error}`);
  //     return res.status(501).json({
  //       success: false,
  //       message: 'Error al obtener las categorías'
  //     });
  //   }
  // }
};
