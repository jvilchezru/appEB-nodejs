const Category = require('../models/category');

module.exports = {
  async create(req, res, next) {
    try {
      const category = req.body;
      const data = await Category.create(category);
      return res.status(201).json({
        success: true,
        message: 'La categoría ha sido creada',
        data: data.insertId
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: 'Error al registrar',
        error: error
      });
    }
  },

  async update(req, res, next) {
    try {
      const category = req.body;
      await Category.update(category);
      return res.status(201).json({
        success: true,
        message: 'Los datos de la categoría han sido actualizados'
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: 'Error al actualizar categoría'
      });
    }
  },

  async delete(req, res, next) {
    try {
      const category_id = req.params.category_id;
      const data = await Category.delete(category_id);
      console.log(JSON.stringify(data));
      return res.status(201).json({
        success: true,
        message: 'La categoría se ha eliminado'
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: 'Error al eliminar categoría'
      });
    }
  },

  async getAll(req, res, next) {
    try {
      const data = await Category.getAll();
      return res.status(201).json(data);
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: 'Error al obtener las categorías'
      });
    }
  },

  async findByName(req, res, next) {
    try {
      const category_name = req.params.category_name;
      const data = await Category.findByName(category_name);
      return res.status(201).json(data);
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: 'Error al obtener las categorías',
        error: error
      });
    }
  }
};
