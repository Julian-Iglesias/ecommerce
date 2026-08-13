import fs from "node:fs/promises";
import crypto from "node:crypto";

export default class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async getCartById(cid) {
        const carts = await this.getCarts();

        return carts.find(
            cart => cart.id === cid
        );
    }

    async createCart() {
        const carts = await this.getCarts();

        const newCart = {
            id: crypto.randomUUID(),
            products: []
        };

        carts.push(newCart);

        await fs.writeFile(
            this.path,
            JSON.stringify(carts, null, 2)
        );

        return newCart;
    }

    async addProductToCart(cid, pid) {
        const carts = await this.getCarts();

        const cart = carts.find(
            cart => cart.id === cid
        );

        if (!cart) {
            return null;
        }

        const productInCart = cart.products.find(
            item => item.product === pid
        );

        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.products.push({
                product: pid,
                quantity: 1
            });
        }

        await fs.writeFile(
            this.path,
            JSON.stringify(carts, null, 2)
        );

        return cart;
    }

    async emptyCart(cid) {
        const carts = await this.getCarts();

        const cart = carts.find(
            cart => cart.id === cid
        );

        if (!cart) {
            return null;
        }

        cart.products = [];

        await fs.writeFile(
            this.path,
            JSON.stringify(carts, null, 2)
        );

        return cart;
    }
}