const post = `static async post(req, res) {
  let data;
  try {
    const entity = req.body;
    data = await @@SERVICE_CLASS_NAME@@.insert(entity);
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

module.exports = post;
