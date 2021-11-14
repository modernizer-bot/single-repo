const post = `exports.@@CONTROLLER_FUNCTION_NAME@@ = async function @@CONTROLLER_FUNCTION_NAME@@(req, res) {
  let data;
  try {
    const entity = req.body;
    data = await @@SERVICE_FUNCTION_NAME@@(entity);
    res.status(200).json(data);
  } catch (err) {
    data = {message:err.message};
    res.status(400).json(data);
  }
  @@LOGGER@@
}
`;

module.exports = { post };
