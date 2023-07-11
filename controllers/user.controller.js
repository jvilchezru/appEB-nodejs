const User = require('../models/user');
const Rol = require('../models/rol');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const keys = require('../config/keys');
const storage = require('../utils/cloud_storage').uploadFileToFirebaseStorage;
const experience = require('../utils/cloud_storage').getImagesOfExperience;
const companies = require('../utils/cloud_storage').getCompanyImages;

module.exports = {
  async getAll(req, res, next) {
    try {
      const data = await User.getAll();
      return res.status(200).json(data);
    } catch (error) {
      console.log(`Error: ${error}`);
      if (error.code === 'ECONNRESET') {
        return res.status(500).json({
          success: false,
          message: 'Error de conexión a la base de datos'
        });
      }
      return res.status(501).json({
        success: false,
        message: 'Error al obtener los usuarios'
      });
    }
  },

  async findByDocument(req, res, next) {
    try {
      const document = req.params.document;
      const token_api = process.env.TOKEN_APIPERU;
      const isNotValid = document.length == 8 || document.length == 11 ? false : true;
      if (isNotValid) {
        return res.status(401).json({
          success: false,
          message: `¡El número de documento no es válido!`
        });
      }
      const [myUser] = await User.findByDocument(document);
      if (myUser) {
        myUser.roles = JSON.parse(myUser.roles);
        return res.status(401).json({
          success: false,
          message: `¡El número de documento ya se encuentra registrado!`,
          data: myUser
        });
      }

      let url =
        document.length == 8
          ? `https://dniruc.apisperu.com/api/v1/dni/${document}?token=${token_api}`
          : `https://dniruc.apisperu.com/api/v1/ruc/${document}?token=${token_api}`;

      const response = await axios.get(url);
      const data = response.data;

      if (document.length == 8) {
        return res.status(200).json(data);
      } else {
        return res.status(200).json({
          success: true,
          data: data
        });
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: 'Error al consultar usuario'
      });
    }
  },

  async findUserById(req, res, next) {
    try {
      const id = req.params.id;
      const [data] = await User.findUserById(id);
      if (data) data.roles = JSON.parse(data.roles);
      return res.status(200).json(data);
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: 'Error al obtener el usuario'
      });
    }
  },

  async create(req, res, next) {
    try {
      const user = req.body;
      const data = await User.create(user);
      await Rol.create(data.insertId, 2); // ROL POR DEFECTO - CLIENTE
      return res.status(201).json({
        success: true,
        message: 'Registro exitoso',
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

  async updateUser(req, res, next) {
    try {
      const user = JSON.parse(req.body.user);
      const files = req.files;
      if (files.length > 0) {
        const pathImage = `image_${Date.now()}`; // NOMBRE DE LA IMAGEN
        const url = await storage(files[0], pathImage);
        if (url != undefined && url != null) {
          user.user_image = url;
        }
      }
      await User.update(user);
      return res.status(201).json({
        success: true,
        message: '¡Los datos fueron actualizados correctamente!'
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      if (error.code === 'ECONNRESET') {
        // Manejar el error de conexión aquí
        return res.status(500).json({
          success: false,
          message: 'Error de conexión a la base de datos'
        });
      }
      return res.status(501).json({
        success: false,
        message: 'Error al actualizar los datos',
        error: error
      });
    }
  },

  async getImagesOfExperience(req, res, next) {
    try {
      const data = await experience();
      if (data != null) return res.status(201).json(data);
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: 'Error al obtener las imágenes'
      });
    }
  },

  async getCompanyImages(req, res, next) {
    try {
      const data = await companies();
      if (data != null) return res.status(201).json(data);
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: 'Error al obtener las imágenes'
      });
    }
  },

  async signIn(req, res, next) {
    try {
      const document_number = req.body.document_number;
      const password = req.body.password;
      const [myUser] = await User.findByDocument(document_number);
      if (!myUser) {
        return res.status(401).json({
          success: false,
          message: '¡El usuario no se encuentra registrado!'
        });
      } else {
        myUser.roles = JSON.parse(myUser.roles);
      }
      if (myUser.is_available == 0) {
        return res.status(401).json({
          success: false,
          message: '¡El usuario ha sido deshabilitado. No puede iniciar sesión!'
        });
      }
      if (User.isPasswordMatched(password, myUser.password)) {
        const token = jwt.sign(
          {
            id: myUser.user_id,
            document_number: myUser.document_number
          },
          keys.secretOrKey,
          {
            // expiresIn: 60 * 0.3 // 1 hora
          }
        );
        const data = {
          user_id: myUser.user_id,
          user_type: myUser.user_type,
          document_number: myUser.document_number,
          user_name: myUser.user_name,
          address: myUser.address,
          phone: myUser.phone,
          email: myUser.email,
          user_image: myUser.user_image,
          session_token: `JWT ${token}`,
          roles: myUser.roles
        };
        await User.updateToken(myUser.user_id, `JWT ${token}`);
        return res.status(200).json({
          success: true,
          data: data,
          message: '¡Inicio de sesión exitoso!'
        });
      } else {
        return res.status(401).json({
          success: false,
          message: '¡La contraseña es incorrecta!'
        });
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: 'Error al hacer login',
        error: error
      });
    }
  },

  async signOff(req, res, next) {
    try {
      const id = req.body.user_id;
      await User.updateToken(id, null);
      return res.status(200).json({
        success: true,
        message: '¡La sesión del usuario ha finalizado!'
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: 'Error al momento de cerrar sesión',
        error: error
      });
    }
  },

  async disableUser(req, res, next) {
    try {
      const user_id = req.params.id;
      const data = await User.disable(user_id);

      if (data.affectedRows == 0) {
        return res.status(404).json({
          success: false,
          message: '¡El id del usuario enviado no existe o es incorrecto!'
        });
      }

      return res.status(201).json({
        success: true,
        message: '¡El usuario ha sido deshabilitado!'
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: 'Error al deshabilitar al usuario',
        error: error
      });
    }
  },

  async enableUser(req, res, next) {
    try {
      const user_id = req.params.id;
      const data = await User.enable(user_id);

      if (data.affectedRows == 0) {
        return res.status(404).json({
          success: false,
          message: '¡El id del usuario enviado no existe o es incorrecto!'
        });
      }

      return res.status(201).json({
        success: true,
        message: '¡El usuario ha sido habilitado!'
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: 'Error al habilitar al usuario',
        error: error
      });
    }
  }
};
