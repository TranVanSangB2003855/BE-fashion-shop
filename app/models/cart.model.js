const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    products: [
        {
            item_id: { type: mongoose.Schema.Types.ObjectId, ref: "ITEM"},
            quantity: { type: Number, require: true },
            price: { type: Number, require: true },
            color: { type: String, require: true },
            size: { type: String, require: true }
        }
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "USER"},
    totalPrice: { type: Number, default: 0 }
})

let CART = mongoose.model("CART", cartSchema);

module.exports = CART ;