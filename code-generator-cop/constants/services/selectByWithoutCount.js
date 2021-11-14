const selectByWithoutCount = `static async @@METHOT_NAME@@(@@ARGUMENT_OBJECT@@) {
    const data = await gres("@@SCHEMA@@@@ENTITY_NAME@@")
    .select(@@COLUMNS@@)
    .where(@@WHERE_ARRAY@@)
    .orderby({
      attr: sort,
      drt,
    })
    .limit(limit)
    .offset(offset)
    .run();

  return { 
    data: {
      code: 1,
      message: "İşlem Başarılı",
      data_obj: {
        @@ENTITY_NAME@@: data,
      }
    } 
  };
}
`;

module.exports = selectByWithoutCount;
