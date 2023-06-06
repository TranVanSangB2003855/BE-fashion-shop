const cart = require("../controllers/cart.controller");

const router = require("express").Router();

router.route("/:id")
    .post(cart.updateCart);

module.exports = router;