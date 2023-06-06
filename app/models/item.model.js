const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    title: { type: String, require: true },
    price: { type: Number, require: true },
    category: { type: [String], require: true },
    image: { type: [String], require: true },
    // color: { type: [String], require: true },
    size: { type: [String], require: true },
    createAt: { type: Date, require: true },
    // supplier: { type: String, require: true },
    // heart: { type: Boolean},
    sold: { type: Number, require: true },
    // author: { type: mongoose.Schema.Types.ObjectId, ref: "AUTHOR"},
    desc: { type: String, require: true },
    feature: { type: Boolean, require: true }
})

itemSchema.index({ title: 'text' });

let ITEM = mongoose.model("ITEM", itemSchema);
ITEM.createIndexes();

module.exports = ITEM;