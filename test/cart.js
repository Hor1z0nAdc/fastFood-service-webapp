const expect = require("chai").expect
const cartAction = require("../src/functions/cartActions.js")

//createCart
describe('Kosár létrehozása - createCart() függvény tesztelése', () => {
    it('vissza kellene adnia egy üres kosarat a megfelelő kulcsokkal', () => {
        let cart = cartAction.createCart()

        expect(cart).to.be.a("object")
        expect(cart).to.have.keys(["items", "totalPrice", "totalQuantity"])
    });
});

//addToCart
describe('hozzáadás a kosárhoz - addToCart() függvény tesztelése', () => {
    describe("kosárban nem jelen lévő termék hozzáadása", () => {
        let  cart = {
            items: {},
            totalQuantity: 2,
            totalPrice: 9
        }
        let req = { body: { _id: 2, ár: 5}}

        cartAction.addToCart(cart, req)

        it('hozzá kell adni a kosárhoz a termék id-ját ', () => {
            expect(cart.items).to.have.key(2)
        });

        it('kosárban lévő temékhez hozzá kell adnia a mennyiséget és tulajdonságokat', () => {
            expect(cart.items[2].quantity).to.equal(1)
            expect(cart.items[2].item).to.eql({_id: 2, ár: 5})
        });

        it('meg kell növelnie a kosárban lévő termék mennyiséget és az árat', () => {
            expect(cart.totalQuantity).to.be.equal(3)
            expect(cart.totalPrice).to.be.equal(14)
        });
    })

    describe('már jelen lévő termék hozzáadása', () => {
        it('növelnie kell a teljes mennyiséget, mennyiséget és az árat', () => {
            let  cart = {
                items: { 2: { _id: 2, ár: 5, quantity: 1}},
                totalQuantity: 2,
                totalPrice: 9
            }
            let req = { body: { _id: 2, ár: 5}}

            cartAction.addToCart(cart, req)

            expect(cart.totalQuantity).to.be.equal(3)
            expect(cart.items[req.body._id].quantity).to.be.equal(2)
            expect(cart.totalPrice).to.be.equal(14)
            
        });
    });
});

//udpateCart
describe('kosár frissítése - updateCart()-ot megvalósító függvények tesztelése', () => {
    let itemId = 2
    let cart

    beforeEach(() => {
        cart = {
            items: { 2: { item: { _id: 2, ár: 5 }, quantity: 1},
                     3: { item: { _id: 3, ár: 4 }, quantity: 1}},
            totalQuantity: 2,
            totalPrice: 9
        }
    });

    it('meg kell növelnie egyel a konkrét termék mennyiségét - add()', () => {
        cartAction.add(cart, itemId)

        expect(cart.items[itemId].quantity).to.be.equal(2)
        expect(cart.totalQuantity).to.be.equal(3)
        expect(cart.totalPrice).to.be.equal(14)
    });

    it('termék mennyiség csökkentése több, mint 1 mennyiség esetén - remove()', () => {
        cart.items[itemId].quantity = 2

        cartAction.remove(cart, itemId)

        expect(cart.items[itemId].quantity).to.be.equal(1)
        expect(cart.totalQuantity).to.be.equal(1)
        expect(cart.totalPrice).to.be.equal(4)
    });

    it('termék mennyiség csökkentése több, pontosan 1 mennyiség esetén - remove()', () => {
        cartAction.remove(cart, itemId)

        expect(cart.items[itemId]).to.be.undefined
        
    });

    it('termék törlése a kosárból - clear()', () => {
        cartAction.clear(cart, itemId)

        expect(cart.items[itemId]).to.be.undefined
        
    });
});