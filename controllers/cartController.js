const getCart = (req,res) => {
  let cart = req.session.cart
  res.render("sites/cart")
}

const updateCart = (req,res) => {
  //Cart létrehozása
  if(!req.session.cart) {
    req.session.cart = {
      items: {},
      totalQuantity: 0,
      totalPrice: 0
    }
  }
  let cart = req.session.cart

  console.log(req.body)
  //Termék hozzáadás
  if(!cart.items[req.body._id]) {
    cart.items[req.body._id] = {
      item: req.body,
      quantity: 1
    }
    cart.totalQuantity++;
    cart.totalPrice += req.body.ár;
  }
  //Cartban létező termék mennyiség növelés
  else {
    cart.items[req.body._id].quantity++;
    cart.totalQuantity++;
    cart.totalPrice += req.body.ár
  }
  
  return res.json({totalQuantity: req.session.cart.totalQuantity})
}

const updateProduct = (req,res) => {
  let cart = req.session.cart
  let itemId = req.params.product
  let action = req.query.action

  switch(action) {
    case "add":
      cart.items[itemId].quantity++
      cart.totalQuantity++
      cart.totalPrice +=  cart.items[itemId].item.ár
      break;
    case "remove":
      cart.items[itemId].quantity--
      cart.totalQuantity--
      cart.totalPrice -=  cart.items[itemId].item.ár
      if(cart.items[itemId].quantity === 0) {delete cart.items[itemId]}
      break;
    case "clear":
      cart.totalQuantity -=  cart.items[itemId].quantity
      cart.totalPrice -= cart.items[itemId].quantity * cart.items[itemId].item.ár
      delete cart.items[itemId]
      if(cart.items.length === 0) {delete req.session.cart}
      break;
    case "clearAll":
      delete req.session.cart
      break;  
    default:
      console.log("hiba történt frissíés közben")
      break;
  }
  res.redirect("/cart")
}

module.exports = {
  getCart,
  updateCart,
  updateProduct
}