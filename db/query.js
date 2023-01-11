const pool = require('../libs/postgres.pool');
const boom = require('@hapi/boom');
const bcrypt = require('bcryptjs');

async function poolQuerys(query, data){
    const rta = await pool.query(query, data);
    return rta.rows;
}

async function create(body, table) {

    if (body.password) {
        body.password = await bcrypt.hash(body.password, 10);
    }

    const keys = [];
    const values = [];
    const data = [];

    Object.entries(body).forEach((entrie, i) => {
        keys.push(entrie[0]);
        values.push(`$${i + 1}`);
        data.push(entrie[1]);
    });

    const query = `insert into ${table}(${keys.join(', ')}) values (${values.join(', ')}) RETURNING*`;
    return await poolQuerys(query, data);
}

async function getAll(table) {
    const query = `select * from ${table} order by id asc`;
    return await poolQuerys(query);
}

async function getOne(id, table) {
    const query = `select * from ${table} where id = '${id}'`;
    const rta = await poolQuerys(query);

    if (rta.length === 0) {
        throw boom.notFound(`${table} not found`);
    }

    return rta;
}

async function getEmail(email, table) {
    const query = `select * from ${table} where email = '${email}'`;
    const rta = await poolQuerys(query);

    if (rta.length === 0) {
        throw boom.notFound(`email not found`);
    }

    return rta;
}

async function update(id, body, table) {
    const setQuery = [];
    const changes = [];

    await getOne(id, 'users');

    Object.entries(body).forEach((entrie, i) => {
        setQuery.push(entrie[0] + ` = $${i + 1}`);
        changes.push(entrie[1]);
    });

    const query = `UPDATE ${table} SET ${setQuery.join(", ")} WHERE id = '${id}'`;
    await poolQuerys(query, changes);

    return {
        id,
        ...body
    }
}

async function remove(id, table) {
    await getOne(id, 'users');
    const query = `DELETE FROM ${table} WHERE id = '${id}'`;
    await poolQuerys(query);
    return id;
}

module.exports = {
    create,
    getAll,
    getOne,
    getEmail,
    update,
    remove,
}