const User = require('../models/user');
const Rol = require('../models/rol');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const keys = require('../config/keys');

module.exports = {
  async getPersonByDocument(req, res, next) {
    try {
      const document = req.params.document_number;
      const myUser = await User.findByDocumentNumber(document);
      const typeDocument = document.length == 8 ? 'DNI' : 'RUC';
      const token = process.env.TOKEN_APIPERU;

      if (myUser) {
        return res.status(401).json({
          success: false,
          message: `¡El número de ${typeDocument} ya se encuentra registrado!`
        });
      }

      let url =
        document.length == 8
          ? `https://dniruc.apisperu.com/api/v1/dni/${document}?token=${token}`
          : `https://dniruc.apisperu.com/api/v1/ruc/${document}?token=${token}`;

      const response = await axios.get(url);
      const data = response.data;

      if (document.length == 8) {
        return res.status(201).json(data);
      } else {
        return res.status(201).json({
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

  async createUser(req, res, next) {
    try {
      const user = req.body;
      const data = await User.create(user);

      await Rol.create(data.user_id, 2); // ROL POR DEFECTO - CLIENTE

      return res.status(201).json({
        success: true,
        message: 'Registro exitoso',
        data: data.user_id
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

  async getAllUsers(req, res, next) {
    try {
      const data = await User.getAll();
      console.log(`Usuarios obtenidos: ${JSON.stringify(data)}`);
      return res.status(201).json(data);
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: 'Error al obtener los usuarios'
      });
    }
  },

  async signIn(req, res, next) {
    try {
      const document_number = req.body.document_number;
      const password = req.body.password;
      const myUser = await User.findByDocumentNumber(document_number);

      if (!myUser) {
        return res.status(401).json({
          success: false,
          message: '¡El usuario no se encuentra registrado!'
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
            expiresIn: 60 * 60 // 1 hora
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

        // await User.updateToken(myUser.id, `JWT ${token}`);

        console.log(`Usuario logeado: ${JSON.stringify(data)}`);

        return res.status(201).json({
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
  }
};
