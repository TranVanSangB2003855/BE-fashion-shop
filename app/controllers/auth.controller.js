const config = require("../config/index");
const USER = require("../models/user.model");
const CART = require("../models/cart.model");
const ORDER = require("../models/order.model");
const ITEM = require("../models/item.model");
const functions = require("../functions/functions")

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  // let roles;
  // if (req.body.roles) {
  //   const roless = await ROLE.find(
  //     {
  //       name: { $in: req.body.roles },
  //     });
  //   roles = roless.map((role) => role._id);
    
  // } else {
  //   const role = await ROLE.findOne({ name: "user" })
  //   roles = [];
  //   roles.push(role._id);
  // }

  const user = new USER({
    full_name: req.body.full_name,
    phone: req.body.phone,
    address: "",
    password: bcrypt.hashSync(req.body.password, 8),
    createAt: functions.getTime()
  });
  let userSaved = await user.save();

  const cartNew = new CART({
    products: [],
    user: userSaved._id,
    totalPrice: 0
  })

  const cartSaved = await cartNew.save();

  await userSaved.updateOne({cart: cartSaved._id});
  console.log(`[SignUp] Phone: ${req.body.phone}, Name: ${req.body.full_name}`)
  res.send({ message: "Đăng ký tài khoản mới thành công !!!" });

};

exports.signin = async (req, res) => {
  try {
    let user = await USER.findOne({ phone: req.body.phone })//.populate("roles", "-__v");

    if (!user) {
      return res.status(404).send({ message: "Số điện thoại không tồn tại." });
    }
    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Mật khẩu sai!" });
    }

    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    // var authorities = [];

    // for (let i = 0; i < user.roles.length; i++) {
    //   authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
    // }

    req.session.token = token;

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

    console.log(`[SignIn] Phone: ${req.body.phone}`)

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
      accessToken: token,
    });
  } catch (error) {
    console.log(error)
  }
}

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};