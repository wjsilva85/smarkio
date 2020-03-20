"use strict";

const mysqlPool = require("../database/mysql-pool");
const InsertResponse = require("../model/mysql/mysql-insert-result")
  .InsertResponse;
const tools = require("../utils/tools");

/**
 *
 * @param {number} id
 * @param {number} cep | zipcode
 * @param {string} nome length 45
 * @param {string} endereco length 255
 * @param {string} bairro length 255
 * @param {string} estado length 2
 * @param {string} cidade length 255
 * @param {string} retorno_api Json String
 * @param {string} created_at datetime
 * @param {string} updated_at datetime
 */
const Dados_Dep = function(
  id,
  cep,
  nome,
  endereco,
  bairro,
  estado,
  cidade,
  retorno_api,
  created_at,
  updated_at
) {
  this.id = id;
  this.cep = cep;
  this.nome = nome;
  this.endereco = endereco;
  this.bairro = bairro;
  this.estado = estado;
  this.cidade = cidade;
  this.retorno_api = tools.getMysqlSaveStringFromJson(retorno_api || "");
  this.created_at = created_at;
  this.updated_at = updated_at;
};

/**
 *
 * @param {Dados_Dep} dados_dep
 * @returns {Promise<number>} new saved address id
 */
const saveAddress = function(dados_dep) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO dados_dep(cep, nome, endereco, bairro, estado, cidade, retorno_api)
    VALUES(
        '${dados_dep.cep}',
        '${dados_dep.nome}',
        '${dados_dep.endereco}',
        '${dados_dep.bairro}',
        '${dados_dep.estado}',
        '${dados_dep.cidade}',
        '${dados_dep.retorno_api}'

    );`;

    mysqlPool
      .query(sql)
      .then(results => {
        const insertResponse = new InsertResponse();
        Object.assign(insertResponse, results);

        return resolve(insertResponse.insertId);
      })
      .catch(err => {
        return reject(err);
      });
  });
};

/**
 *
 * @param {number} id new Address Saved ID
 * @returns {Promise<Dados_Dep>}
 */
const getAddressById = function(id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,
     cep,
      nome,
       endereco,
        bairro,
         estado,
          cidade,
           retorno_api,
            retorno_api,
             created_at,
              updated_at
              FROM dados_dep
              WHERE id = ${id};`;

    mysqlPool
      .query(sql)
      .then(results => {
        if (!results.length)
          return reject(new Error(`Address not found to id ${id}.`));

        const data = new Dados_Dep();
        Object.assign(data, results[0]);

        return resolve(data);
      })
      .catch(err => {
        return reject(err);
      });
  });
};

module.exports.getAddressById = getAddressById;
module.exports.saveAddress = saveAddress;
module.exports.Dados_Dep = Dados_Dep;
