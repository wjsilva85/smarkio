"use strict";
const http = require("./utils/http");
const addressDB = require("./database/address");

/**
 *
 * @param {string} logradouro Street Name
 * @param {string} bairro  neighborhood
 * @param {string} localidade city
 * @param {string} uf state symbol
 * @param {string} cep zipcode
 */
const AddressData = function(logradouro, bairro, localidade, uf, cep) {
  (this.logradouro = logradouro),
    (this.bairro = bairro),
    (this.localidade = localidade),
    (this.uf = uf),
    (this.cep = cep);
};

/**
 *
 * @param {number} code Api returned code
 * @param {string} message Api message of success or error
 * @param {AddressData} addressData
 */
const FullAddress = function(code, message, addressData, id = null) {
  this.code = code;
  this.message = message;
  this.result = addressData;
  this.id = id;
};

/**
 *
 * @param {string} zipcode
 * @param {string} name
 */
const Address = function(zipcode, name) {
  this.zipcode = zipcode;
  this.name = name;
  this.fullAddress = null;
};

/**
 * @returns {Promise<FullAddress>}
 */
Address.prototype.getFullAddress = function() {
  return new Promise((resolve, reject) => {
    const qs = { cep: this.zipcode };
    const url = "http://cep.bldstools.com/";

    http
      .get(url, qs, "UTF8")
      .then(result => {
        result = JSON.parse(result);

        //List of all possible results from API
        const responseList = [
          { code: 404, message: "CEP not found", success: false },
          { code: 401, message: "Invalid CEP provided", success: false },
          { code: 200, message: "CEP found", success: true }
        ];

        //Get response sent from smarkio api
        const response = responseList.find(item => {
          return item.code === result.code;
        });

        if (!response.success)
          throw { message: response.message, code: esponse.code };

        console.log(response.code, "=>", response.message);

        const fullAddress = new FullAddress();
        Object.assign(fullAddress, result);

        //Save in memory
        this.fullAddress = fullAddress;

        return resolve(fullAddress);
      })
      .catch(err => {
        return reject(err);
      });
  });
};

/**
 * @returns {Promise<number>}
 */
Address.prototype.saveInMysql = function() {
  return new Promise(async (resolve, reject) => {
    //Ensure that there will be an Address to be saved in Mysql
    try {
      if (!this.fullAddress) await this.getFullAddress();
    } catch (error) {
      return reject(error);
    }
    const address = this.fullAddress.result;
    const json = JSON.stringify(this.fullAddress);
    const dadosDep = new addressDB.Dados_Dep(
      null,
      address.cep,
      this.name,
      address.logradouro,
      address.bairro,
      address.uf,
      address.localidade,
      json
    ); //missing json

    addressDB
      .saveAddress(dadosDep)
      .then(newItemId => {
        this.fullAddress.id = newItemId;
        return resolve(newItemId);
      })
      .catch(err => {
        return reject(err);
      });
  });
};

Address.prototype.getAddressById = function() {
  return new Promise(async (resolve, reject) => {
    try {
      if (!this.fullAddress) await this.getFullAddress();
      if (!this.fullAddress.id) await this.saveInMysql();
    } catch (error) {
      return reject(error);
    }

    addressDB
      .getAddressById(this.fullAddress.id)
      .then(addressData => {
        return resolve(addressData);
      })
      .catch(err => {
        return reject(err);
      });
  });
};

module.exports = Address;
