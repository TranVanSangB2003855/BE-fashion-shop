const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    phone: { type: String, require: true },
    full_name: { type: String, require: true },
    password: { type: String, require: true },
    address: { type: String },
    createAt: {type: Date, require: true},
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "ORDER"}],
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "CART"},
    // roles: [ { type: mongoose.Schema.Types.ObjectId, ref: "ROLE" } ]
})

let USER = mongoose.model("USER", userSchema);

module.exports = USER;