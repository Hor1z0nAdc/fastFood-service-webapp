const cartAction = require("../src/functions/cartActions.js")

const getCart = (req,res) => {
  let cart = req.session.cart
  res.render("sites/cart")
}

const updateCart = (req,res) => {
  //Cart létrehozása
  if(!req.session.cart) {
    req.session.cart = cartAction.createCart()
  }
  let cart = req.session.cart

  //Termék hozzáadás
  cartAction.addToCart(cart, req)
  return res.json({totalQuantity: req.session.cart.totalQuantity})
}

const updateProduct = (req,res) => {
  let cart = req.session.cart
  let itemId = req.params.product
  let action = req.query.action

  cartAction.updateCart(cart, itemId, action, req)
  res.redirect("/cart")
}

module.exports = {
  getCart,
  updateCart,
  updateProduct
}