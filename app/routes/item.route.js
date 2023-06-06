const items = require("../controllers/item.controller");

const router = require("express").Router();

router.route("/")
    .post(items.addAnItem)
    .get(items.getAllItems);

router.route("/getdatahome")
    .get(items.getDataHome);

router.route("/getdata")
    .get(items.getData);

router.route("/getdatasuggest/:caterogy/:id")
    .get(items.getDataSuggest);

router.route("/:id")
    .get(items.getAnItem)
    .put(items.updateItem)
    .delete(items.deleteAnItem);

module.exports = router;