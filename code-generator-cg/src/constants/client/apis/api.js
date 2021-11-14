const api = `@@SIGNATURE@@
import {url, getHeaders} from "./helper";
import fetch from "node-fetch"; // remove later

@@POST@@
@@EXECUTE@@
@@GET_ALL@@
@@GET_BY@@
@@PUT_BY@@
@@DELETE_BY@@
`;

module.exports = { api };
