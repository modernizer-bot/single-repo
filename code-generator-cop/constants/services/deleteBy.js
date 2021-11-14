const remove = `static async @@METHOT_NAME@@(@@ARGUMENT_OBJECT@@) {
  const data = await gres("@@SCHEMA@@@@ENTITY_NAME@@")
    .delete()
    .where(@@WHERE_ARRAY@@)
    .returning()
    .run();

  return {
    data: {
      code: 1,
      message: "İşlem Başarılı",
      data_obj: {
        "@@ENTITY_NAME@@": data
      },
    }
  };
}
`;

module.exports = remove;
