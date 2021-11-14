const insert = `static async insert(entity = {}) {
  const data = await gres("@@SCHEMA@@@@ENTITY_NAME@@")
    .insert(entity)
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

module.exports = insert;
