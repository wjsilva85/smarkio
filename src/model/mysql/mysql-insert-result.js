"use strict";

/**
 *
 * @param {number} fieldCount
 * @param {number} affectedRows
 * @param {number} insertId
 * @param {number} serverStatus
 * @param {number} warningCount
 * @param {string} message
 * @param {boolean} protocol41
 * @param {number} changedRows
 */
const InsertResponse = function(
  fieldCount,
  affectedRows,
  insertId,
  serverStatus,
  warningCount,
  message,
  protocol41,
  changedRows
) {
  this.fieldCount = fieldCount;
  this.affectedRows = affectedRows;
  this.insertId = insertId;
  this.serverStatus = serverStatus;
  this.warningCount = warningCount;
  this.message = message;
  this.protocol41 = protocol41;
  this.changedRows = changedRows;
};

module.exports.InsertResponse = InsertResponse;
