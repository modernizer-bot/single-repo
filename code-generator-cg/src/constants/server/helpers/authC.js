const authC = `@@SIGNATURE@@
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_EXPIRES_IN, JWT_SECRET, NODE_ENV } = require("./config");
const { logger } = require("./logger");
const { spSysLoginServiceExecute } = require("../services/spSysLogin");
const { spSysRegisterServiceExecute } = require("../services/spSysRegister");
const {
  vSysUserRolePermissionsServiceSelectByUsernameEq,
} = require("../services/vSysUserRolePermissions");
const {
  spSysUserHasPermissionsServiceExecute
} = require("../services/spSysUserHasPermissions");

async function login(req, res) {
  let result;
  try {
    result = await spSysLoginServiceExecute(req.body);
    if (!result.data[0].sp_sys_login) {
      const message = "Email or password is incorrect";
      await logger(req, message);
      res.status(400).json({ code: "BAD_REQUEST", message });
      return;
    }
    result = await vSysUserRolePermissionsServiceSelectByUsernameEq({
      offset: 0,
      limit: 1,
      sort: "user_id",
      drt: "asc",
      usernameEq: req.body.p_username,
    });
    const { user_id, uuid, username, email } = result.data[0];
    const token = await sign(user_id);
    res.cookie("AUTH_TOKEN", token, { maxAge: 90000000, httpOnly: true });
    req.credentials = { id: user_id, uuid };
    const response_data = { user_id, uuid, username, email };
    await logger(req, response_data);
    res.status(200).json(response_data);
    return;
  } catch (err) {
    console.log({ error: err });
    await logger(req, err.message);
    res.status(400).json({ code: "BAD_REQUEST", message: err.message });
  }
}

async function register(req, res) {
  try {
    console.log({ body: req.body });
    const result = await spSysRegisterServiceExecute(req.body);
    await logger(req, result.data[0]);
    res.status(200).json({ data: result.data[0] });
  } catch (err) {
    console.log({ error: err });
    await logger(req, err.message);
    res.status(400).json({ message: err.message });
  }
}
/** @type {(req:any,res:any,next:any) => Promise<void>} */
async function authenticate(req, res, next) {
  const authResult = await isAuthenticated(req);
  if (authResult) {
    next();
  } else {
    const message = "Authentication required";
    await logger(req, message);
    res.status(401).json({ code: "UNAUTHENTICATED", message });
  }
}

/** @type {(permissionId: number[]) => (req:any,res:any,next:any) => Promise<void>} */
function authorize(permissionId) {
  return async (req, res, next) => {
    try {
      const authResult = await isAuthorized(req, permissionId);
      if (authResult) {
        next();
      } else {
        const message = "Authorization required";
        await logger(req, message);
        res.status(401).json({ code: "UNAUTHORIZED", message });
      }
    } catch (err) {
      await logger(req, \`authorizeErr: \${err.message}\`);
      res.status(401).json({ code: "UNAUTHORIZED", message: err.message });
    }
  };
}

/** @type {(req: any) => Promise<boolean>} */
async function isAuthenticated(req) {
  if (NODE_ENV !== "production") {
    req.credentials = { id: 3 };
    return true;
  }
  try {
    const [bearer, token] = req.cookies.AUTH_TOKEN.split(" ");
    if (bearer === "Bearer") {
      const authData = await verify(token);
      req.credentials = authData;
      return true;
    }
  } catch (err) {
    logger(req, { message: \`isAuthenticatedErr: \${err.message}\` });
    return false;
  }
}

/** @type {(req: any,requiredPermissionIdL: number[]) => Promise<boolean>} */
async function isAuthorized(req, requiredPermissionId) {
  if (NODE_ENV !== "production") {
    return true;
  }
  try {
    const { id: userIdx } = req;
    const result = await spSysUserHasPermissionsServiceExecute({
      p_user_idx: userIdx,
      p_permission_attribute_list: requiredPermissionId,
    });
    return result[0].sp_check_user_permission;
  } catch (err) {
    logger(req, { message: \`isAuthorizedErr: \${err.message}\` });
    return false;
  }
}

async function sign(userIdx) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        userIdx,
      },
      JWT_SECRET,
      { expiresIn: \`\${JWT_EXPIRES_IN}ms\` },
      (err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      }
    );
  });
}

/** @type {(token: string) => Promise<any>} */
async function verify(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, function (err, decoded) {
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

/** @type {(securePassword: string, password: string) => Promise<boolean>} */
async function compare(securePassword, password) {
  try {
    const result = await bcrypt.compare(password, securePassword);
    return result;
  } catch (error) {
    return false;
  }
}

/** @type {(password: string) => Promise<string>} */
async function hash(password) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  if (!hash) {
    throw new Error("hash valus is falsy.");
  }
  return hash;
}

module.exports = {
  login,
  register,
  authenticate,
  authorize,
};
`;

module.exports = { authC };
