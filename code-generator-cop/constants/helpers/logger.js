const logger = `async function logger(req, response_data) {
  try {
    const log = {
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      method: req.method,
      url: req.originalUrl,
      user_idx: await getUserIdx(req),
      object_idx: getObjectIdx(req, response_data),
      message: response_data.message,
      creation_time: new Date().toISOString(),
    };
    console.log({ log });
  } catch (err) {
    console.log({ loggerErr: err });
  }
}

async function getUserIdx(req) {
  try {
    const { id: userIdx } = req.credentials;
    return userIdx || null;
  } catch (err) {
    return null;
  }
}

function getObjectIdx(req, response_data) {
  if (req.method === 'GET') {
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

module.exports = logger;
`;

module.exports = logger;
