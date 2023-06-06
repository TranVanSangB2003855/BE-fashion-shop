const USER = require("../models/user.model");
const CART = require("../models/cart.model");
const ORDER = require("../models/order.model");
const ITEM = require("../models/item.model");

exports.getInfoUser = async (req, res) => {
    let user = await USER.findById(req.userId);

    // for (let i = 0; i < user.roles.length; i++) {
    //     authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
    // }
    let orderPupolate = [];

    let orderT = user.orders;
    const lengthOrder = orderT.length;

    for (let i = 0; i < lengthOrder; i++) {
        let order = await ORDER.findById(orderT[i]);
        let orderProducts = [];
        const lengthProducts = order.products.length;
        for (let i = 0; i < lengthProducts; i++) {
            // console.log(order._id)
            let tempt = await ITEM.findById(order.products[i].item_id, {
                title: 1
            })

            orderProducts.push({
                item_id: order.products[i].item_id,
                quantity: order.products[i].quantity,
                price: order.products[i].price,
                color: order.products[i].color,
                size: order.products[i].size,
                title: tempt.title
              })
        }

        orderPupolate.push({
            _id: order._id,
            status: order.status,
            time: order.time,
            address: order.address,
            totalPrice: order.totalPrice,
            products: orderProducts,
            note: order.note,
            freeShip: order.freeShip
        })
    }

    let cartPupolate = await CART.findById(user.cart);
    // console.log(user.cart)
    let cartProducts = [];
    const lengthCart = cartPupolate.products.length;
    for (let i = 0; i < lengthCart; i++) {
      let tempt = await ITEM.findById(cartPupolate.products[i].item_id, {
        // image: 1,
        title: 1
      })
      cartProducts.push({
        item_id: cartPupolate.products[i].item_id,
        quantity: cartPupolate.products[i].quantity,
        price: cartPupolate.products[i].price,
        color: cartPupolate.products[i].color,
        title: tempt.title,
        size: cartPupolate.products[i].size
      })
    }

    res.status(200).send({
        id: user._id,
        phone: user.phone,
        full_name: user.full_name,
        address: user.address,
        orders: orderPupolate,
        cart: {
            "_id": cartPupolate._id,
            user: cartPupolate.user,
            products: cartProducts,
            totalPrice: cartPupolate.totalPrice
          },
        // roles: authorities,
        // accessToken: req.session.token
    });
};

exports.updateInfoUser = async (req, res, next) => {
    try {
        let user = await USER.findById(req.params.id);
        // console.log(req.params.id, req.body)
        await user.updateOne({ full_name: req.body.full_name });
        await user.updateOne({ address: req.body.address });
        return res.send({ message: "Cập nhật thông tin thành công !" });
    } catch (error) {
        console.log(error)
    }
};

var bcrypt = require("bcryptjs");

exports.changePassword = async (req, res, next) => {
    try {
        let user = await USER.findById(req.params.id);
        // console.log(user)
        var passwordIsValid = bcrypt.compareSync(
            req.body.passwordOld,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({ message: "Mật khẩu không đúng !" });
        }
        else {
            await user.updateOne({ password: bcrypt.hashSync(req.body.passwordNew, 8) });
            return res.send({ message: "Đổi mật khẩu thành công !" });
        }
    } catch (error) {
        console.log(error)
    }
}