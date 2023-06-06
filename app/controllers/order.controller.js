const ORDER = require("../models/order.model");
const USER = require("../models/user.model");
const CART = require("../models/cart.model");
const ApiError = require("../api-error");
const functions = require("../functions/functions")

const orderController = {
    addOrder: async (req, res, next) => {
        try {
            const newOrder = new ORDER({...req.body, time: functions.getTime()});
            // console.log("addOrder", req.body)
            const savedOrder = await newOrder.save();
            if (req.body.user) {
                const user = await USER.findById(req.body.user);
                await user.updateOne({
                    $push: { orders: savedOrder._id }
                });
                const cart = await CART.findById(user.cart)
                await cart.updateOne({$set: {products: [], totalPrice: 0}})
            }
            return res.send({message: "Đặt hàng thành công !"});
        } catch (error) {
            return next(
                new ApiError(500, `An error: ${error} occurred while add a book`)
            );
        }
    },
    confirmOrder: async (req, res, next) =>{
        try{
            let order = await ORDER.findById(req.params.id);
            await order.updateOne({ $set: req.body  });
            return res.send({ message: " Order was updated successfully" });
        }catch(error){
            return next(
                new ApiError(500, `An error: ${error} occurred while update Order`)
            );
        }
    }
}

module.exports = orderController;