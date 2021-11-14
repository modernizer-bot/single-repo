const execute = `static async execute(@@ARGUMENTS@@) {;
    let data = await gres("@@SCHEMA@@@@ENTITY_NAME@@")
      .execute(@@PARAMETERS_ARRAY@@@@CALL@@)
      .run();
    if (Array.isArray(data) && data[0] && data[0]["@@ENTITY_NAME@@"] != null) {
      data = data[0]["@@ENTITY_NAME@@"];
    }
    return { data };
  }

`;

module.exports = execute;
