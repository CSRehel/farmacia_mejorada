const { config } = require('./../config/config');
const pool = require('../libs/postgres.pool');

const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');
const bcrypt = require('bcryptjs');


class AuthService {

    /**
     * @description busca un usuario en la BD a traves del email
     * @param {*} email correo del usuario
     * @returns retorna la data del usuario si se ha encontrado el correo
     */
    async findByEmail(email) {

        const query = `select * from users where email = '${email}'`;
        const resp = await pool.query(query);

        if (!resp) {
            throw boom.notFound('Correo no encontrado');
        }

        return resp.rows[0];
    }

    /**
     * @description crea un token para el acceso al sistema.
     * @param {*} user id del usuario
     * @returns retorna un token para el acceso al sistema
     */
    async signToken(user_id) {
        const payload = {
            sub: user_id
        }
        const token = await jwt.sign(payload, config.jwtSecret);
        const query = `UPDATE users SET token = '${token}' WHERE id = '${user_id}'`;
        const resp = await pool.query(query);

        return {
            resp: resp.rowCount,
            token
        };
    }

    /**
     * @description autenticación de usuario.
     * verifica si el usuario se encuentra en la BD y luego, compara el hash de las contraseñas
     * @param {*} email correo del usuario
     * @param {*} password contraseña del usuario
     * @returns retorna la data del usuario
     */
    async authenticateUser(email, password) {

        const user = await this.findByEmail(email);
        if (!user) {
            throw boom.unauthorized('Correo incorrecto / Usuario no registrado');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw boom.unauthorized('Contraseña incorrecta');;
        }

        // delete user.dataValues.password;
        return user;
    }

}

module.exports = AuthService;