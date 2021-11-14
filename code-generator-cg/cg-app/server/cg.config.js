module.exports = {
  conn: "postgres://postgres:postgres@localhost:5432/postgres",
  formatter: "prettier",
  url: "http://localhost:8080",
  paths: {
    apis: "/home/tc/Documents/projects/cg/cg-app/client/src/apis",
    routers: "/home/tc/Documents/projects/cg/cg-app/server/src/routers",
    controllers: "/home/tc/Documents/projects/cg/cg-app/server/src/routers",
    services: "/home/tc/Documents/projects/cg/cg-app/server/src/services",
    helpers: "/home/tc/Documents/projects/cg/cg-app/server/src/helpers",
  },
  permissions: {
    schema: "public",
    tableName: "t_sys_permissions",
    idCol: "id",
    nameCol: "name",
  },
  tables: {
    t_sys_user: {
      schema: "public",
      auth: true,
      logger: true,
      rest: true,
      insert: true,
      select: true,
      permissions: ["BASIC", "ROI_MANAGEMENT"],
      selectBy: ["true,idx@@=,extended_name@@ILIKE"],
      updateBy: ["idx@@=,extended_name@@ILIKE"],
      deleteBy: ["idx@@=,extended_name@@ILIKE"],
    },
    t_sys_role: {
      schema: "public",
      auth: true,
      logger: true,
      rest: true,
      insert: true,
      select: true,
      permissions: ["BASIC", "ROI_MANAGEMENT"],
      selectBy: ["true,idx@@=,extended_name@@ILIKE"],
      updateBy: ["idx@@=,extended_name@@ILIKE"],
      deleteBy: ["idx@@=,extended_name@@ILIKE"],
    },
  },
  views: {
    v_sys_user_info: {
      schema: "public",
      auth: true,
      rest: true,
      logger: true,
      select: true,
      permissions: ["BASIC"],
      selectBy: [
        "true,idx@@=",
        "false,username@@=",
        "false,extended_name@@ILIKE",
        "false,username@@=,extended_name@@ILIKE",
        "true,idx@@=,username@@=,extended_name@@ILIKE",
      ],
    },
    v_sys_user_role_permissions: {
      schema: "public",
      auth: true,
      rest: true,
      logger: true,
      select: true,
      permissions: ["BASIC"],
      selectBy: ["false,username@@=", "false,user_id@@="],
    },
  },
  sp: {
    sp_sys_login: {
      schema: "public",
      rest: true,
      auth: false,
      logger: true,
      call: false,
      permissions: [],
      parameters: ["p_email", "p_username", "p_password"],
    },
    sp_sys_register: {
      schema: "public",
      auth: false,
      rest: true,
      logger: true,
      call: false,
      permissions: [],
      parameters: [
        "p_first_name",
        "p_middle_name",
        "p_last_name",
        "p_username",
        "p_email",
        "p_password",
        "p_birth_date",
      ],
    },
    sp_sys_user_has_permissions: {
      schema: "public",
      rest: true,
      auth: true,
      logger: true,
      call: false,
      permissions: ["BASIC"],
      parameters: ["p_user_idx", "p_permission_attribute_list"],
    },
    sp_sys_user_has_permission: {
      schema: "public",
      rest: true,
      auth: true,
      logger: true,
      call: true,
      permissions: ["BASIC"],
      parameters: ["p_user_id", "p_permissions", "p_result"],
    },
  },
};