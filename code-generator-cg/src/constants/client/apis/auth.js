const auth = `@@SIGNATURE@@
import {getHeaders,url} from "./helper";

/** @type {(first: {p_email: string, p_username: string, p_password: string}) => Promise<any>} */
export async function login({ p_email, p_username, p_password }) {
  const result = await fetch(\`\${url}/api/login\`, {
    method: "POST",
    body: JSON.stringify({ p_email, p_username, p_password }),
    headers: getHeaders(),
  });
  const body = await result.json();
  if (result.ok) {
    return body;
  }
  throw new Error(body.message);
}

/** @type {(state:any) => Promise<any>} */
export async function register(state) {
  const result = await fetch(\`\${url}/api/register\`, {
    method: "POST",
    body: JSON.stringify(state),
    headers: getHeaders(),
  });
  const body = await result.json();
  if (result.ok) {
    return body;
  }
  throw new Error(body.message);
}

`;

module.exports = { auth };
