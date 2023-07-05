const Request = require('../models/request');

module.exports = {
  async create(req, res, next) {
    try {
      let request = req.body;
      request.status = 'PENDIENTE';
      const data = await Request.create(request);
      return res.status(201).json({
        success: true,
        message: 'La solictud se ha enviado correctamente',
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
      let request = req.body;
      request.status = 'ATENDIDO';
      const data = await Request.update(request);
      return res.status(201).json({
        success: true,
        message: 'La solictud se actualizó correctamente',
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
      const data = await Request.findByStatus(status);
      for (const d of data) {
        d.client = JSON.parse(d.client);
        d.service = JSON.parse(d.service);
        d.category = JSON.parse(d.category);
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
      const data = await Request.findByUserAndStatus(user_id, status);
      for (const d of data) {
        d.client = JSON.parse(d.client);
        d.service = JSON.parse(d.service);
        d.category = JSON.parse(d.category);
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
      const request_id = req.params.request_id;
      await Request.delete(request_id);
      return res.status(201).json({
        success: true,
        message: 'La solicitud se canceló correctamente'
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
