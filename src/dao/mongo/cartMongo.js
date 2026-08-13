import cartModel from "../../models/cart.model.js";

export default class CartMongo {

    async createCart() {
        return await cartModel.create({
            products: []
        });
    }

    async getCartById(cid) {
        return await cartModel.findById(cid);
    }

    async getCartByIdPopulate(cid) {
        return await cartModel
            .findById(cid)
            .populate("products.product");
    }

    async getCarts() {
        return await cartModel
            .find()
            .populate("products.product");
    }

    async updateCart(cid, products) {
        return await cartModel.findByIdAndUpdate(
            cid,
            { products },
            {
                returnDocument: "after",
                runValidators: true
            }
        );
    }

    async saveCart(cart) {
        return await cart.save();
    }
}