const order = require("../controllers/order.controller");

const router = require("express").Router();

router.route("/")
    .post(order.addOrder);

router.route("/confirmorder/:id")
    .put(order.confirmOrder);

module.exports = router;