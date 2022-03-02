function createCart() {
    cart = {
      items: {},
      totalQuantity: 0,
      totalPrice: 0
    }
  
    return cart
}

function add(cart, itemId) {
    cart.items[itemId].quantity++
    cart.totalQuantity++
    cart.totalPrice += cart.items[itemId].item.ár
}

function remove(cart, itemId) {
    cart.items[itemId].quantity--
    cart.totalQuantity--
    cart.totalPrice -=  cart.items[itemId].item.ár
    if(cart.items[itemId].quantity === 0) {delete cart.items[itemId]}
}
  
function clear(cart, itemId) {
    cart.totalQuantity -=  cart.items[itemId].quantity
    cart.totalPrice -= cart.items[itemId].quantity * cart.items[itemId].item.ár
    delete cart.items[itemId]
}

function addToCart(cart, req) {
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
}

function updateCart(cart, itemId, action, req) {
    switch(action) {
        case "add":
            add(cart, itemId)
            break;
        case "remove":
            remove(cart, itemId)
            break;
        case "clear":
            clear(cart, itemId)
            if(cart.items.length === 0) {delete req.session.cart}
            break;
        case "clearAll":
            delete req.session.cart
            break;  
        default:
            break;
    }
}

module.exports = { 
    createCart, 
    addToCart,
    updateCart,
    add,
    remove,
    clear
}