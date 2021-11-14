const helper = `export default class Helper {
  static serviceUrl = process.env.SERVICE_URL;

  static portalUrl = process.env.PORTAL_URL;

  static getHeaders() {
    return {
      "Content-Type": "application/json",
    };
  }

  /** @type {() => number} */
  static getUserIdx() {
    try {
      const id = Number(Helper.getCookie("AUTH_DATA"));
      if (id) return id;
      return null;
    } catch (err) {
      console.log({ getUserIdxErr: err });
      return null;
    }
  }

  /** @type {(name: string) => string} */
  static getCookie(name) {
    const value = \`; \${document.cookie}\`;
    const parts = value.split(\`; \${name}=\`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return "";
  }

  /** @type {() => Promise<boolean>} */
  static async getServerStatus() {
    try {
      const res = await fetch(\`\${Helper.serviceUrl}/api/status\`, {
        method: "get",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(\`getServerStatus request response status is not OK: \${res.status}\`);
      }
      return true;
    } catch (err) {
      console.log({ getServerStatusErr: err });
      return false;
    }
  }

  /** @type {() => Promise<boolean>} */
  static async getDatabaseStatus() {
    try {
      const res = await fetch(\`\${Helper.serviceUrl}/api/database/status\`, {
        method: "get",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(\`getDatabaseStatus request response status is not OK: \${res.status}\`);
      }
      return true;
    } catch (err) {
      console.log({ getDatabaseStatusErr: err });
      return false;
    }
  }

  /** @type {() => Promise<boolean>} */
  static async getAuthStatus() {
    try {
      const res = await fetch(\`\${Helper.serviceUrl}/api/auth/status\`, {
        method: "get",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(\`getAuthStatus request response status is not OK: \${res.status}\`);
      }
      return true;
    } catch (err) {
      console.log({ getAuthStatusErr: err });
      return false;
    }
  }

  /** @type {(first:{email:string,password:string}) => Promise<boolean>} */
  static async login({ email, password }) {
    try {
      const res = await fetch(\`\${Helper.serviceUrl}/api/auth/login\`, {
        method: "post",
        body: JSON.stringify({ email, password }),
        headers: Helper.getHeaders(),
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(\`Login request's response status is not OK: \${res.status}\`);
      }
      return true;
    } catch (err) {
      console.log({ loginErr: err });
      return false;
    }
  }

  /** @type {(first:{email:string,password:string}) => Promise<boolean>} */
  static async logout() {
    try {
      const res = await fetch(\`\${Helper.serviceUrl}/api/auth/logout\`, {
        method: "post",
        headers: Helper.getHeaders(),
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(\`Logout request's response status is not OK: \${res.status}\`);
      }
      return true;
    } catch (err) {
      console.log({ logoutErr: err });
      return false;
    }
  }

  /** @type {() => Promise<boolean>} */
  static async shouldRedirect() {
    const authStatus = await Helper.getAuthStatus();
    if (authStatus) {
      return true;
    }
    const portalRes = await Helper.getPortalStatus();
    if (portalRes) {
      window.location.replace(\`\${Helper.portalUrl}/login\`);
    }
    return false;
  }

  /** @type {() => Promise<boolean>} */
  static async getPortalStatus() {
    try {
      const res = await fetch(\`\${Helper.portalUrl}/api/status\`, {
        method: "get",
        credentials: "include",
      });
      if (res.ok) {
        return true;
      }
      throw new Error(\`getPortalStatus request response status is not OK: \${res.status}\`);
    } catch (err) {
      console.log({ getPortalStatusErr: err });
      return false;
    }
  }
}
`;

module.exports = { helper };
