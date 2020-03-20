"use strict";

const express = require("express");
const router = express.Router();
const Address = require("../address");

router.get(
  //First Middleware
  "/getaddress",
  (req, res, next) => {
    let isValid = true;

    const sendValidationError = function(errorMessage) {
      isValid = false;
      res.status(422).send(errorMessage);
    };

    //Ensure Zipcode
    const zipcode = req.query.zipcode;
    if (!zipcode)
      return sendValidationError(
        "Missing Parameter. Zipcode variable must be provided"
      );

    //Check if zipcode is a valid length
    const onlyNumbers = zipcode.toString().replace(/\D/g, "");
    if (onlyNumbers.length !== 8)
      return sendValidationError("Zipcode must be 8 characteres length");

    //Check addressee name
    const name = req.query.name;
    if (!name) return sendValidationError("A name must be provided.");
    if (name.length < 5)
      return sendValidationError("Minimum length to name is 5.");

    if (isValid) {
      req.params.zipcode = onlyNumbers;
      req.params.name = name;
      return next();
    }
  },
  //Last
  (req, res) => {
    const zipcode = req.params.zipcode;
    const name = req.params.name;
    let address = new Address(zipcode, name);

    Promise.resolve(address)
      .then(address => {
        console.log(`Searching ${address.zipcode} address. Please wait.`);

        return address.getFullAddress();
      })
      .then(_ => {
        console.log("Now, saving in MySql...");
        return address.saveInMysql();
      })
      .then(newAddressId => {
        return address.getAddressById(newAddressId);
      })
      .then(addressData => {
        try {
          const json = JSON.stringify(addressData);
          console.log(`It works:
          ${json}
          :-)`);
          res.setHeader("Content-type", "application/json");
          res.status(200).send(json);
        } catch (error) {
          throw error;
        }
      })
      .catch(err => {
        console.error(err);

        res.status(err.code || 500).send(err.message);
      });
  }
);

module.exports = router;
