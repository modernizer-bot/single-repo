const getBy = `static async @@CONTROLLER_METHOD_NAME@@(req, res) {
  let data;
  try {
    const options = req.query;
    data = await @@SERVICE_CLASS_NAME@@.@@SERVICE_METHOD_NAME@@(options);
    res.status(200).json(data);
  } catch (err) {
      console.log({err})
      res.status(400).json({
        data: {
          code: -1,
          message: err.message,
          data_obj: {
            "@@ENTITY_NAME@@": null
          },
        }
      });
  }
  @@LOGGER@@
}
`;

module.exports = getBy;
