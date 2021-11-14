const helper = `@@SIGNATURE@@
/** @type {string} */
const url = "http://localhost:8080";

/** @type {{contentType?:string,token?:string}} */
const headers = {};

/** @type {() => {"Content-Type": string, Authorization:string}} */
function getHeaders() {
  return {
    "Content-Type": headers["Content-Type"] || "application/json",
    Authorization: headers.token || "No Token",
  };
}

module.exports = { url, getHeaders, headers };

`;

module.exports = { helper };
