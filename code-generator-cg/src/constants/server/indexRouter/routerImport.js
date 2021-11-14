const routerImport = `
router.use("/@@BASE_URL@@", require("./@@IMPORT_FILE_NAME@@").router);`;

module.exports = { routerImport };
