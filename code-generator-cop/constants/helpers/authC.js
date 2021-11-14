const authC = `const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("./logger");
const SpCheckUserPermissionsService = require("../services/spCheckUserPermissions");
const SpSysLoginWithEmailService = require("../services/spSysLoginWithEmail");
const {
  JWT_EXPIRES_IN, COOKIE_DOMAIN, NODE_ENV, JWT_SECRET
} = require("./config");

class Auth {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const loginRes = await SpSysLoginWithEmailService.execute({
        p_json: { email, password },
        p_response_obj: null,
      });
      console.log({ loginRes });
      const {
        code,
        message,
        data_obj: {
          sp_sys_login_with_email: [user],
        },
      } = loginRes.data;
      if (code !== "1" || user == null) {
        throw new Error(message);
      }
      const id = user.idx;
      const token = await Auth.sign({ id });
      Auth.setCookie({ res, key: "AUTH_TOKEN", value: token });
      Auth.setCookie({ res, key: "AUTH_DATA", value: id });
      res.status(200).json({
        data: {
          code: "1",
          message: "İşlem başarılı",
          data_obj: { login: null },
        },
      });
    } catch (err) {
      console.log({ loginErr: err });
      await logger(req, err.message);
      res.status(400).json({
        data: {
          code: "999",
          message: err.message,
          data_obj: { login: null },
        },
      });
    }
  }

  static async logout(req, res) {
    try {
      Auth.clearCookie({ res, key: "AUTH_DATA" });
      Auth.clearCookie({ res, key: "AUTH_TOKEN" });
      res.status(200).json({
        data: {
          code: "1",
          message: "İşlem başarılı",
          data_obj: { logout: null },
        },
      });
    } catch (err) {
      console.log({ logoutErr: err });
      await logger(req, err.message);
      res.status(400).json({
        data: {
          code: "999",
          message: err.message,
          data_obj: { login: null },
        },
      });
    }
  }

  static async authenticate(req, res, next) {
    try {
      const authResult = await Auth.isAuthenticated(req, res);
      if (authResult) {
        next();
      } else {
        const message = "Authentication required";
        await logger(req, message);
        res.status(401).json({
          data: {
            code: "999",
            message,
            data_obj: { authenticate: null },
          },
        });
      }
    } catch (err) {
      console.log({ authenticateErr: err });
      await logger(req, err.message);
      res.status(400).json({
        data: {
          code: "999",
          message: err.message,
          data_obj: { authenticate: null },
        },
      });
    }
  }

  static authorize(permissionId) {
    return async (req, res, next) => {
      try {
        const authResult = await Auth.isAuthorized(req, permissionId);
        if (authResult) {
          next();
        } else {
          const message = "Authorization required";
          await logger(req, message);
          res.status(401).json({
            data: {
              code: "999",
              message,
              data_obj: { authorize: null },
            },
          });
        }
      } catch (err) {
        console.log({ authorizeErr: err });
        await logger(req, err.message);
        res.status(400).json({
          data: {
            code: "999",
            message: err.message,
            data_obj: { authorize: null },
          },
        });
      }
    };
  }

  static async isAuthenticated(req, res) {
    try {
      const token = req.cookies.AUTH_TOKEN;
      console.log({ token });
      const decoded = await Auth.verify(token);
      // console.log({ decoded });
      req.credentials = decoded;
      await Auth.refreshAuthToken(res, decoded);
      return true;
    } catch (err) {
      console.log({ isAuthenticatedErr: err });
      return false;
    }
  }

  static async isAuthorized(req, requiredPermissionIdxs) {
    const { id: userIdx } = req.credentials;
    const result = await SpCheckUserPermissionsService.execute({
      p_user_idx: userIdx,
      p_permission_attribute_list: requiredPermissionIdxs,
    });
    return result;
  }

  static async refreshAuthToken(res, decoded) {
    const diff = decoded.exp * 1000 - Date.now();
    if (diff > 0 && diff < 1000 * 60 * 5) {
      const token = Auth.sign(decoded);
      Auth.setCookie({ res, key: "AUTH_DATA", value: decoded.id });
      Auth.setCookie({ res, key: "AUTH_TOKEN", value: token });
    }
  }

  static setCookie({
    res,
    key,
    value,
    domain = COOKIE_DOMAIN,
    path = "/",
    maxAge = JWT_EXPIRES_IN,
    // secure = NODE_ENV === "production",
  }) {
    res.cookie(key, value, {
      domain,
      path,
      maxAge,
      // secure,
    });
  }

  static clearCookie({
    res,
    key,
    domain = COOKIE_DOMAIN,
    path = "/",
    maxAge = JWT_EXPIRES_IN,
    // secure = NODE_ENV === "production",
  }) {
    res.clearCookie(key, {
      domain,
      path,
      maxAge,
      // secure,
    });
  }

  static async sign(data) {
    return new Promise((resolve, reject) => {
      jwt.sign(data, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }, (err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      });
    });
  }

  static async verify(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
          return;
        }
        if (!decoded) {
          reject(new Error("token payload is undefined"));
          return;
        }
        resolve(decoded);
      });
    });
  }

  static async compare(securePassword, password) {
    try {
      const result = await bcrypt.compare(password, securePassword);
      return result;
    } catch (error) {
      return false;
    }
  }

  static async hash(password) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    if (!hash) {
      throw new Error("hash valus is falsy.");
    }
    return hash;
  }
}

module.exports = Auth;
`;

module.exports = authC;
