const Validation = require('../models/validation');

module.exports = {
  async create(req, res, next) {
    try {
      let validation = req.body;
      validation.status = 'PENDIENTE';
      const data = await Validation.create(validation);
      return res.status(201).json({
        success: true,
        message: 'La solictud ha sido enviada',
        data: data.insertId
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: 'Error al enviar solicitud',
        error: error
      });
    }
  },

  async updateToAttended(req, res, next) {
    try {
      let validation = req.body;
      validation.status = 'ATENDIDO';
      const data = await Validation.update(validation);
      return res.status(201).json({
        success: true,
        message: 'La solictud ha sido atendida y respondida',
        data: data.insertId
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: 'Error al actualizar solicitud',
        error: error
      });
    }
  },

  async findByStatus(req, res, next) {
    try {
      const status = req.params.status;
      const data = await Validation.findByStatus(status);
      for (const d of data) {
        d.client = JSON.parse(d.client);
      }
      return res.status(201).json(data);
    } catch (error) {
      return res.status(501).json({
        success: false,
        message: `Error al listar las solicitudes por estado: ${error}`,
        error: error
      });
    }
  },

  async findByUserAndStatus(req, res, next) {
    try {
      const user_id = req.params.user_id;
      const status = req.params.status;
      const data = await Validation.findByUserAndStatus(user_id, status);
      for (const d of data) {
        d.client = JSON.parse(d.client);
      }
      return res.status(201).json(data);
    } catch (error) {
      return res.status(501).json({
        success: false,
        message: `Error al listar las solicitudes por estado: ${error}`,
        error: error
      });
    }
  },

  async cancel(req, res, next) {
    try {
      const validation_id = req.params.validation_id;
      await Validation.delete(validation_id);
      return res.status(201).json({
        success: true,
        message: 'La solicitud ha sido cancelada'
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: 'Error al cancelar solicitud'
      });
    }
  }
};
