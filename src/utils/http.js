const request = require("request");
const http = require("http");
const https = require("https");

//Limit concurrent requests to 5. Prevents any API to be flooded with thousants of requests
//http pool
const pool = http.Agent();
pool.maxSockets = 5;
//https pool
const sPool = https.Agent();
sPool.maxSockets = 5;

/**
 *
 * @param {string} url Full url, with protocol ex.: https://smarkio.com
 * @returns {http.Agent} http | https
 */
const getProtocol = url => {
  const protocolString = url.split("/")[0];

  if (protocolString === "http") {
    return pool;
  } else if (protocolString === "https") {
    return sPool;
  }
};

/**
 * @param {string} url ex.: https://smarkio.com
 * @param {object} [qs] {name:value}
 * @param {string} [encoding] ex.: utf-8 | latin1
 * @returns {Promise<any>}
 */
const get = function(url, qs, encoding, _headers) {
  return new Promise((resolve, reject) => {
    //Choses proper protocol (http or https)
    const _pool = getProtocol(url);

    //Set basic header if not provided one
    const headers = _headers || {
      "User-Agent": "Smarkio Address Server",
      "Content-Type": "application/json;charset=utf8mb4",
      Accept: "application/json"
    };

    const options = {
      url: url,
      timeout: 10000,
      headers,
      agent: _pool
    };
    if (qs) options.qs = qs;

    if (encoding) options.encoding = encoding;

    const errorHandler = (error, code) => {
      console.error(`Error source is: ${options.url}`);
      console.error(error, `statusCode: ${code}`);
      return reject(error);
    };

    request.get(
      options,

      (err, res, body) => {
        if (err) {
          errorHandler(err, "no status code");
        } else if (res.statusCode >= 200 && res.statusCode <= 299) {
          return resolve(body);
        } else {
          errorHandler(body, res.statusCode);
        }
      }
    );
  });
};

module.exports.get = get;
