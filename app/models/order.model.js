const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "USER"},
    products: [
        {
            item_id: { type: mongoose.Schema.Types.ObjectId, ref: "ITEM"},
            quantity: { type: Number, require: true },
            price: { type: Number, require: true },
            color: { type: String, require: true },
            size: { type: String, require: true }
        }
    ],
    address: { type: String, require: true },
    note: { type: String },
    totalPrice: { type: Number, default: 0, require: true },
    time: { type: Date, require: true },
    status: { type: String, require: true },
    freeShip: {type: Boolean, require: true}
})

let ORDER = mongoose.model("ORDER", orderSchema);

module.exports = ORDER ;