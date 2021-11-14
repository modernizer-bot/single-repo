const updateBy = `static async @@METHOT_NAME@@(@@ARGUMENT_OBJECT@@, entity = {}) {
  const data = await gres("@@SCHEMA@@@@ENTITY_NAME@@")
    .update(entity)
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
  }
}
`;

module.exports = updateBy;
