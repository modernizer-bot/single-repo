const logger = `@@SIGNATURE@@
/** @type {(req: any, response_data: any) => Promise<void>} */
async function logger(req, response_data) {
  try {
    const log = {
      ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
      method: req.method,
      url: req.originalUrl,
      user_idx: getUserIdx(req),
      object_idx: getObjectIdx(req, response_data),
      message: response_data.message,
      creation_time: new Date().toISOString(),
    };
    console.log({ log });
  } catch (err) {
    console.log({ loggerErr: err });
  }
}

/** @type {(req:any) => null | number } */
function getUserIdx(req) {
  try {
    const { userIdx } = req.tokenData;

    return userIdx || null;
  } catch (err) {
    return null;
  }
}
/** @type {(req:any,response_data:any) => null | number } */
function getObjectIdx(req, response_data) {
  if (req.method === "GET") {
    return null;
  }
  if (Array.isArray(response_data)) {
    return response_data[0].idx;
  }
  if (response_data && response_data.idx) {
    return response_data.idx;
  }
  return null;
}

module.exports = { logger };
`;

module.exports = {logger};
