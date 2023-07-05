const Service = require('../models/service');
const storage = require('../utils/cloud_storage').uploadFileToFirebaseStorage;
const asyncForEach = require('../utils/async_foreach');

module.exports = {
  async create(req, res, next) {
    let service = JSON.parse(req.body.service);
    const files = req.files;
    let inserts = 0;
    if (files.length === 0) {
      return res.status(501).json({
        message: 'Error al registrar el servicio, no tiene imagen',
        success: false
      });
    } else {
      try {
        const data = await Service.create(service);
        service.service_id = data.insertId;
        const start = async () => {
          await asyncForEach(files, async (file) => {
            const pathImage = `image_${Date.now()}`;
            const url = await storage(file, pathImage);
            if (url !== null && url !== undefined) {
              if (inserts === 0) {
                service.service_image1 = url;
              } else if (inserts === 1) {
                service.service_image2 = url;
              }
            }
            await Service.update(service);
            inserts++;
            if (inserts == files.length) {
              return res.status(201).json({
                success: true,
                message: 'El servicio se registró correctamente'
              });
            }
          });
        };
        start();
      } catch (error) {
        return res.status(501).json({
          success: false,
          message: `Error al registrar el servicio ${error}`,
          error: error
        });
      }
    }
  },

  async update(req, res, next) {
    try {
      const service = JSON.parse(req.body.service);
      const files = req.files;
      const index = req.params.index;
      console.log(index);
      let inserts = 0;
      const start = async () => {
        await asyncForEach(files, async (file) => {
          const pathImage = `image_${Date.now()}`;
          const url = await storage(file, pathImage);
          if (url !== null && url !== undefined) {
            if (inserts === 0) {
              if (index == 0) service.service_image1 = url;
              else if (index == 1) service.service_image2 = url;
            } else if (inserts === 1) {
              service.service_image2 = url;
            }
            // }
          }
          await Service.update(service);
          inserts++;
          if (inserts == files.length) {
            return res.status(201).json({
              success: true,
              message: 'El servicio se actualizó correctamente'
            });
          }
        });
      };
      if (files.length > 0) {
        start();
      } else {
        await Service.update(service);
        return res.status(201).json({
          success: true,
          message: 'El servicio se actualizó correctamente'
        });
      }
    } catch (error) {
      return res.status(501).json({
        success: false,
        message: `Error al actualizar el servicio ${error}`,
        error: error
      });
    }
  },

  async delete(req, res, next) {
    try {
      const service_id = req.params.service_id;
      const data = await Service.delete(service_id);
      console.log(JSON.stringify(data));
      return res.status(201).json({
        success: true,
        message: 'El servicio se ha eliminado correctamente'
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: 'Error al eliminar servicio'
      });
    }
  },

  async findByCategory(req, res, next) {
    try {
      const category_id = req.params.category_id;
      const data = await Service.findByCategory(category_id);
      return res.status(201).json(data);
    } catch (error) {
      return res.status(501).json({
        success: false,
        message: `Error al listar los servicios por categoría: ${error}`,
        error: error
      });
    }
  },

  async findByCategoryAndName(req, res, next) {
    try {
      const category_id = req.params.category_id;
      const service_name = req.params.service_name;
      const data = await Service.findByCategoryAndName(category_id, service_name);
      return res.status(201).json(data);
    } catch (error) {
      return res.status(501).json({
        success: false,
        message: `Error al listar los servicios: ${error}`,
        error: error
      });
    }
  },

  async getAll(req, res, next) {
    try {
      const data = await Service.getAll();
      return res.status(201).json(data);
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: 'Error al obtener los servicios'
      });
    }
  },

  async findByName(req, res, next) {
    try {
      const service_name = req.params.service_name;
      const data = await Service.findByName(service_name);
      return res.status(201).json(data);
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: 'Error al obtener los servicios',
        error: error
      });
    }
  }
};
